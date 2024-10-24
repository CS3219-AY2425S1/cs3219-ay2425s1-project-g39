const amqp = require('amqplib');
const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 4000;

const redisClient = redis.createClient({
  socket: {
    host: 'matching-service-redis',
    port: 6379,
    reconnectStrategy: function (retries) {
      if (retries > 20) {
        console.log(
          'Too many attempts to reconnect. Redis connection was terminated',
        );
        return new Error('Too many retries.');
      } else {
        return retries * 500;
      }
    },
  },
});

app.use(express.json());

let connection;
let channel;

async function initRabbitMQ() {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  // Declare queues
  await channel.assertQueue('search_queue');
  await channel.assertQueue('match_found_queue');
  await channel.assertQueue('disconnect_queue');

  // Start listening for search requests
  channel.consume('search_queue', (msg) => {
    if (msg) {
      const searchRequest = JSON.parse(msg.content.toString());
      console.log(`Received search request:`, searchRequest);
      matchUsers(searchRequest);
      channel.ack(msg);
    }
  });

  // Listen for disconnection messages
  channel.consume('disconnect_queue', (msg) => {
    if (msg) {
      const disconnectRequest = JSON.parse(msg.content.toString());
      handleDisconnection(disconnectRequest.userId);
      channel.ack(msg);
    }
  });
}

async function initRedis() {
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
}

async function showUserQueue(status) {
  const keys = await redisClient.keys('*');

  const filteredKeys = keys.filter(
    (key) => !key.startsWith('difficulty:') && !key.startsWith('topics:'),
  );

  const values = await Promise.all(
    filteredKeys.map(async (key) => {
      const value = await redisClient.get(key);
      return { key, value };
    }),
  );

  console.log(status + ": " + JSON.stringify(values, null, 2)); 
}

function generateRandomString(length = 20) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}


async function matchUsers(searchRequest) {
  const { userId, difficulty, topics } = searchRequest;

  await showUserQueue("Before queue");

  if (userId == null) return; 

  const userExists = (await redisClient.get(userId)) !== null;
  if (userExists) {
    console.log("Duplicate user:", userId);
    return; 
  }

  const matchedByTopics = await findMatchByTopics(topics);
  const matchedByDifficulty = await findMatchByDifficulty(difficulty);

  const matchedByDifficultyIds = new Set(
    matchedByDifficulty.map((item) => item.id),
  );
  const combinedMatches = matchedByTopics.filter((item) =>
    matchedByDifficultyIds.has(item.id),
  );

  const combinedMatchesWValues = await Promise.all(
    combinedMatches.map(async (key) => {
      const value = await redisClient.get(key);
      return { key, value };
    }),
  );

  combinedMatchesWValues.sort((a, b) => {
    if (a.value < b.value) return -1; // a comes before b
    if (a.value > b.value) return 1; // a comes after b
    return 0; // a and b are equal
  });
  const matchedUser = combinedMatchesWValues[0]?.key;

  if (matchedUser) {
    const matchMessage = {
      userId,
      matchUserId: matchedUser,
      roomId: generateRandomString(),
    };

    channel.sendToQueue(
      'match_found_queue',
      Buffer.from(JSON.stringify(matchMessage)),
    );
    console.log(
      `Match found: User ID ${userId} matched with ${matchMessage.matchUserId}`,
    );
    redisClient.del(matchMessage.matchUserId);
    const keys = await redisClient.keys('*');
    const filteredKeys = keys.filter(
      (key) => key.startsWith('difficulty:') || key.startsWith('topics:'),
    );
    filteredKeys.forEach((key) => {
      redisClient.SREM(key, userId);
    });
  } else {
    console.log(`No match found for User ID: ${userId}`);
    redisClient.set(userId, Date.now());
    difficulty.forEach((tag) => {
      redisClient.SADD(`difficulty:${tag}`, userId);
    });
    topics.forEach((tag) => {
      redisClient.SADD(`topics:${tag}`, userId);
    });
  }

  await showUserQueue("After queue");
}

async function findMatchByTopics(topics) {
  const multi = redisClient.multi();

  topics.forEach((tag) => multi.sMembers(`topics:${tag}`));

  const replies = await
    multi.exec((err, replies) => {
      if (err) return reject(err);
      console.log('Replies from Redis:', replies); // Log replies
      resolve(replies);
    });

  const keys = [...new Set(replies.flat())];
  return keys;
}

async function findMatchByDifficulty(difficulty) {
  const multi = redisClient.multi();

  difficulty.forEach((tag) => multi.sMembers(`difficulty:${tag}`));

  const replies = await
    multi.exec((err, replies) => {
      if (err) return reject(err);
      console.log('Replies from Redis:', replies); // Log replies
      resolve(replies);
    });

  const keys = [...new Set(replies.flat())];
  return keys;
}

async function handleDisconnection(userId) {
  redisClient.del(userId);
  const keys = await redisClient.keys('*');
  const filteredKeys = keys.filter(
    (key) => key.startsWith('difficulty:') || key.startsWith('topics:'),
  );
  filteredKeys.forEach((key) => {
    redisClient.SREM(key, userId);
  });
  console.log(`User ID: ${userId} has been removed from active searches.`);
}

initRabbitMQ();
initRedis();

app.listen(PORT, () => {
  console.log(`Matching service is running and listening on port ${PORT}`);
});