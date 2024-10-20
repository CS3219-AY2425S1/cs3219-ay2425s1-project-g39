import { AuthResponse, LoginInput } from '../types/Api';
import { api } from './ApiClient';

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

// const signUp = () => {};
