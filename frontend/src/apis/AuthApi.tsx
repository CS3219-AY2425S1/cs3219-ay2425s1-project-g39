import { AuthResponse, LoginInput, RegisterInput } from '../types/Api';
import { api } from './ApiClient';

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  return api.post('/user/register', data);
};
