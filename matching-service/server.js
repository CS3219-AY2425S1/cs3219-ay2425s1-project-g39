const amqp = require('amqplib');
const express = require('express');
const redis = require('redis');

const app = express();
const PORT = process.env.MATCHING_PORT || 4000;

const redisClient = redis.createClient({
  socket: {
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
const activeSearches = {};

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
      activeSearches[searchRequest.userId] = searchRequest;
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

async function matchUsers(searchRequest) {
  const { userId, difficulty, topics } = searchRequest;

  const matchedByTopics = await findMatchByTopics(topics);
  const matchedByDifficulty = await findMatchByDifficulty(difficulty);

  const matchedByDifficultyIds = new Set(
    matchedByDifficulty.map((item) => item.id),
  );
  const combinedMatches = matchedByTopics.filter((item) =>
    matchedByDifficultyIds.has(item.id),
  );
  const matchedUser = combinedMatches[0];

  if (matchedUser) {
    const matchMessage = {
      userId,
      matchUserId: matchedUser,
    };

    channel.sendToQueue(
      'match_found_queue',
      Buffer.from(JSON.stringify(matchMessage)),
    );
    console.log(
      `Match found: User ID ${userId} matched with ${matchMessage.matchUserId}`,
    );
    redisClient.del(matchMessage.matchUserId);
    delete activeSearches[userId];
    delete activeSearches[matchedUser.userId];
  } else {
    console.log(`No match found for User ID: ${userId}`);
    redisClient.set(userId, userId);
    difficulty.forEach((tag) => {
      redisClient.SADD(`difficulty:${tag}`, userId);
    });
    topics.forEach((tag) => {
      redisClient.SADD(`topics:${tag}`, userId);
    });
  }
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

function handleDisconnection(userId) {
  if (activeSearches[userId]) {
    delete activeSearches[userId];
    console.log(`User ID: ${userId} has been removed from active searches.`);
  }
}

initRabbitMQ();
initRedis();

app.listen(PORT, () => {
  console.log(`Matching service is running and listening on port ${PORT}`);
});
