import 'dotenv/config';
import { connect } from 'mongoose';
import Question from './Question.js';
import 'dotenv/config';

export async function connectToDB() {
  let mongoDBUri = process.env.QUESTION_MONGO_CLOUD_URI;

  await connect(mongoDBUri);
}
