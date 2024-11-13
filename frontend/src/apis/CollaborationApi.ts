import { SessionResponse } from '../types/CollaborationType';
import { api } from './ApiClient';

export const checkSession = async (): Promise<SessionResponse> => {
  return api.get('/collab/check-session');
};
