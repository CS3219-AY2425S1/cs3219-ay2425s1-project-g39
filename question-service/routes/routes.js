import { Router } from 'express';
import { getAllQuestions, getQuestionById, getQuestionByDifficulty, getQuestionByTopic, getNextAvailId, getQuestionByFilter, getAllTopics } from '../controller/read.js';
import { createNewQuestion } from '../controller/create.js';
import { updateQuestion } from '../controller/update.js';
import { deleteQuestion } from '../controller/delete.js';
import { getImage, uploadImage } from "../controller/imageController.js";

const router = Router();

/**
 * CREATE
 */

router.post('/', createNewQuestion);

/**
 * READ
 */

router.get('/all', getAllQuestions);

router.get('/id/:id', getQuestionById);

router.get('/difficulty/:difficulty', getQuestionByDifficulty);

router.get('/topic/:topic', getQuestionByTopic);

router.post('/filter', getQuestionByFilter);

router.get('/nextid', getNextAvailId);

router.get('/topics', getAllTopics);


/**
 * UPDATE
 */

router.put('/:id', updateQuestion);

/**
 * DELETE
 */

router.delete('/:id', deleteQuestion);

/**
 * IMAGE HANDLING
 */

router.get('/img/:filename', getImage);

router.post('/img', uploadImage);

export default router;