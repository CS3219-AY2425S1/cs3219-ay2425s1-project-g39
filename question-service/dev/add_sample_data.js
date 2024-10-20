import mongoose from 'mongoose';
import fs from 'fs';
import 'dotenv/config';
import Question from "../model/Question.js";

const mongoDB = process.env.MONGO_URI;
console.log(mongoDB);
const Admin = mongoose.mongo.Admin;

mongoose.connect(mongoDB);

main().catch(err => console.log(err));

async function main() {
  fs.readFile('./data/sample_questions.json', async (err, data) => {
    if (err) throw err;
    const sample_questions = JSON.parse(data);
    console.log(sample_questions[0]);
    await mongoose.connect(mongoDB);
    for (let i = 0; i < 20; i++) {
      const sample_question = sample_questions[i];
      console.log("sample question: ", sample_question);
      const question = new Question(sample_question);
      await question.save();
      console.log("success for: ", sample_question.title);
    }
  });
}
