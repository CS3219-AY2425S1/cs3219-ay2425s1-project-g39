export type AuthResponse = {
  token: string;
  userId: string;
  user: Profile;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  password: string;
  passwordConfirmation: string;
};

export type UpdateProfileInput = {
  username: string;
  password: string;
};

export type Profile = {
  email: string;
  username: string;
  isAdmin: boolean;
  lastLogin: string;
};

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
};
