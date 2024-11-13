import {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  Profile,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from '../types/AuthType';
import { api } from './ApiClient';

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  return api.post('/user/register', data);
};

export const getUserProfile = async (): Promise<Profile> => {
  return api.get('/user/profile');
};

export const updateUserProfile = async (
  data: UpdateProfileInput,
): Promise<AuthResponse> => {
  return api.put('/user/profile', data);
};

export const forgotPassword = async (
  data: ForgotPasswordInput,
): Promise<AuthResponse> => {
  return api.post('/auth/forgot-password', data);
};

export const resetPassword = async (
  token: string,
  data: ResetPasswordInput,
): Promise<AuthResponse> => {
  const password = data.password;
  return api.post(`/auth/reset-password/${token}`, { password });
};
