import Question from '../model/Question.js';

export const getAllQuestions = async (req, res) => {
    try {
      const questions = await Question.find();
      return res.status(200).json(questions);;
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Unknown error when finding all questions!" });
    }
};

export const getQuestionById = async (req, res) => {
  try {
    const id = req.params.id;
    const question = await Question.find({ 
      id: id
    });
    return res.status(200).json(question);;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Unknown error when finding question with id ${id}!` });
  }
};

export const getQuestionByDifficulty = async (req, res) => {
  try {
    const difficulty = req.params.difficulty;
    const questions = await Question.find({ 
      difficulty: difficulty
    });
    return res.status(200).json(questions);;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Unknown error when finding question with difficulty ${difficulty}!` });
  }
};

export const getQuestionByTopic = async (req, res) => {
  try {
    const topic = req.params.topic;
    const questions = await Question.find({ 
      topics: topic
    });
    return res.status(200).json(questions);;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Unknown error when finding question with topic ${topic}!` });
  }
};

export const getNextAvailIdHelper = async() => {
  const questionWithMaxId = await Question
    .findOne()
    .sort({"id": -1});
    const maxId = questionWithMaxId.id;
    const nextAvailId = maxId + 1;
    return nextAvailId;
}

export const getNextAvailId = async (req, res) => {
  try {
    const result = await getNextAvailIdHelper();
    return res.status(200).json({
      result: result
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Unknown error when finding next available question ID!` });
  }
}