import "dotenv/config";
import http from "http";
import index from './index.js';
import { connectToDB } from "./model/repository.js";

const port = process.env.QUESTION_PORT || 8000;

const server = http.createServer(index);

await connectToDB().then(() => {
  console.log("MongoDB Connected!");

  server.listen(port);
  console.log("Question service server listening on http://localhost:" + port);
}).catch((err) => {
  console.error("Failed to connect to DB");
  console.error(err);
});