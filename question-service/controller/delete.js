import Question from '../model/Question.js';

export const deleteQuestion = async (req, res) => {
    try {
      const id = req.params.id;
      const filter = {
        id: id
      }
      const question = await Question.findOneAndDelete(filter);
      return res.status(200).json(question);;
    } catch (err) {
      return res.status(500).json({ 
        message: `Error when deleting question with id ${id}!`,
        error: err
      });
    }
};