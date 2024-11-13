import { AddQuestionInput, Question, UpdateQuestionInput } from '../types/QuestionType';
import { api } from './ApiClient';

// Create
export const createNewQuestion = async (
  question: AddQuestionInput,
): Promise<Question> => {
    return api.post('/questions/', question);
}

// Read
export const getQuestionById = async (
  questionId: String,
): Promise<Question[]> => {
  return api.get(`/questions/id/${questionId}`);
};

export const getAllQuestions = async (
): Promise<Question[]> => {
  return api.get(`/questions/all`);
};

// Update
export const updateQuestionById = async (
  questionId: String,
  question: UpdateQuestionInput,
): Promise<Question> => {
    return api.put(`/questions/${questionId}`, question);
}

// Delete
export const deleteQuestionById = async (
  questionId: String,
): Promise<Question> => {
  return api.delete(`/questions/${questionId}`);
};