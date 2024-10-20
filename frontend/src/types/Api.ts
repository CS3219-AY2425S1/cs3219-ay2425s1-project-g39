export type AuthResponse = {
  token: string;
  userId: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
