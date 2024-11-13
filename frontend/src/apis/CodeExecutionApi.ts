import { CodeExecutionInput, CodeOutput } from '../types/CodeExecutionType';
import { api } from './ApiClient';

export const executeCode = async (
  data: CodeExecutionInput,
): Promise<CodeOutput> => {
  return api.post('/codex', data);
};
