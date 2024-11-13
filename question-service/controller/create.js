import Question from '../model/Question.js';
import { getNextAvailIdHelper } from './read.js';

export const createNewQuestion = async (req, res) => {
    try {
      const { title, description, topics, difficulty, images } = req.body;
      const id = await getNextAvailIdHelper();
      const question = new Question({
        id: id,
        title: title,
        description: description,
        topics: topics,
        difficulty: difficulty,
        images: images
      });
      await question.save();
      return res.status(200).json(question);
    } catch (err) {
      return res.status(500).json({ 
        message: "Error when creating new question!",
        error: err
       });
    }
};