import { Router } from 'express';

import { createNewQuestion } from '../controller/create.js';
import { deleteQuestion } from '../controller/delete.js';
import { getAllQuestions, getAllTopics, getNextAvailId, getOneQuestionByFilter, getQuestionByDifficulty, getQuestionByFilter, getQuestionById, getQuestionByTopic } from '../controller/read.js';
import { updateQuestion } from '../controller/update.js';
import { authMiddleware, authMiddlewareAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * CREATE
 */

router.post('/', authMiddleware, authMiddlewareAdmin, createNewQuestion);

/**
 * READ
 */

router.get('/all', authMiddleware, getAllQuestions);

router.get('/id/:id', authMiddleware, getQuestionById);

router.get('/difficulty/:difficulty', authMiddleware, getQuestionByDifficulty);

router.get('/topic/:topic', authMiddleware, getQuestionByTopic);

router.post('/filter', authMiddleware, getQuestionByFilter);

router.post('/filter-one', authMiddleware, getOneQuestionByFilter);

router.get('/nextid', authMiddleware, getNextAvailId);

router.get('/topics', authMiddleware, getAllTopics);

/**
 * UPDATE
 */

router.put('/:id', authMiddleware, authMiddlewareAdmin, updateQuestion);

/**
 * DELETE
 */

router.delete('/:id', authMiddleware, authMiddlewareAdmin, deleteQuestion);


export default router;