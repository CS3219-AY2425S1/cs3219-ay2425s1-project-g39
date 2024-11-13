import Question from '../model/Question.js';

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    return res.status(200).json(questions);;
  } catch (err) {
    return res.status(500).json({
      message: "Error when finding all questions!",
      error: err
    });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const id = req.params.id;
    const question = await Question.find({
      id: id
    });
    return res.status(200).json(question);
  } catch (err) {
    return res.status(500).json({
      message: `Error when finding question with id ${id}!`,
      error: err
    });
  }
};

export const getQuestionByDifficulty = async (req, res) => {
  try {
    const difficulty = req.params.difficulty;
    const questions = await Question.find({
      difficulty: difficulty
    });
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({
      message: `Error when finding question with difficulty "${difficulty}"!`,
      error: err
    });
  }
};

export const getQuestionByTopic = async (req, res) => {
  try {
    const topic = req.params.topic;
    const questions = await Question.find({
      topics: topic
    });
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({
      message: `Error when finding question with topic "${topic}"!`,
      error: err
    });
  }
};

/**
 * Multiple Criteria
 */
export const getQuestionByFilter = async (req, res) => {
  try {
    const possibleTopics = req.body.topics;
    const possibleDifficulties = req.body.difficulties;
    const filter = {};
    if (possibleTopics != undefined) {
      filter.topics = { $in: possibleTopics };
    }
    if (possibleDifficulties != undefined) {
      filter.difficulty = { $in: possibleDifficulties }
    }
    const questions = await Question.find(filter);
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({
      message: `Error when finding questions with filter!`,
      error: err
    });
  }
};

export const getOneQuestionByFilter = async (req, res) => {
  try {
    const possibleTopics = req.body.topics;
    const possibleDifficulties = req.body.difficulties;
    const filter = {};
    if (possibleTopics != undefined) {
      filter.topics = { $in: possibleTopics };
    }
    if (possibleDifficulties != undefined) {
      filter.difficulty = { $in: possibleDifficulties }
    }
    const questions = await Question.find(filter);
    // pick one question by random
    const question = questions[Math.floor(Math.random()*questions.length)];
    return res.status(200).json(question);;
  } catch (err) {
    return res.status(500).json({
      message: `Error when finding one random question with filter!`,
      error: err
    });
  }
};

export const getNextAvailIdHelper = async () => {
  const questionWithMaxId = await Question
    .findOne()
    .sort({ "id": -1 });
  const maxId = questionWithMaxId.id;
  const nextAvailId = maxId + 1;
  return nextAvailId;
}

export const getNextAvailId = async (req, res) => {
  try {
    const result = await getNextAvailIdHelper();
    return res.status(200).json({
      result: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Error when finding next available question ID!`,
      error: err
    });
  }
};

export const getAllTopics = async (req, res) => {
  try {
    const result = await Question.distinct('topics');
    return res.status(200).json({
      result: result,
    });
  } catch (err) {
    return res.status(500).json({
      smessage: `Error when finding all topics!`,
      error: err
    });
  }
};
