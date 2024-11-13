import 'dotenv/config';
import fs from 'fs';
import mongoose from 'mongoose';

import Question from '../model/Question.js';

const mongoDB = process.env.QUESTION_MONGO_CLOUD_URI;
console.log(mongoDB);

main();

async function main() {
  console.log('hello');
  try {
    await mongoose.connect(mongoDB);

    // delete all
    await Question.deleteMany({});

    // add sample questions
    fs.readFile('./data/sample_questions.json', async (err, data) => {
      if (err) throw err;
      const sample_questions = JSON.parse(data);
      for (let i = 0; i < sample_questions.length; i++) { // Loop through the entire array
        const sample_question = sample_questions[i];
        console.log('success for: ', sample_question.title);
        const question = new Question(sample_question);
        await question.save();
      }
    })
  } catch (error) {
    console.log("error: ", error)
  }
}
