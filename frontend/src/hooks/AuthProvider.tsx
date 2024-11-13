import { notifications } from '@mantine/notifications';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  forgotPassword,
  getUserProfile,
  login,
  resetPassword,
  updateUserProfile,
} from '../apis/AuthApi';
import {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  Profile,
  ResetPasswordInput,
  UpdateProfileInput,
} from '../types/AuthType';

type AuthContextProps = {
  token: string | null;
  userId: string | null;
  userProfile: Profile | null;
  loginAction: (
    loginInput: LoginInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => Promise<void>;
  logOutAction: () => void;
  getProfileAction: (
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => Promise<void>;
  updateProfileAction: (
    profileData: UpdateProfileInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => Promise<void>;
  forgotPasswordAction: (
    email: ForgotPasswordInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => Promise<void>;
  resetPasswordAction: (
    token: string,
    password: ResetPasswordInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextProps>({
  token: null,
  userId: null,
  userProfile: null,
  loginAction: () => Promise.resolve(),
  logOutAction: () => {},
  getProfileAction: () => Promise.resolve(),
  updateProfileAction: () => Promise.resolve(),
  forgotPasswordAction: () => Promise.resolve(),
  resetPasswordAction: () => Promise.resolve(),
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') || null,
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem('userId') || null,
  );
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  const navigate = useNavigate();

  const loginAction = async (
    loginInput: LoginInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    login(loginInput).then(
      (response: AuthResponse) => {
        setError(null);
        setToken(response.token);
        localStorage.setItem('token', response.token);
        setUserId(response.userId);
        localStorage.setItem('userId', response.userId);
        setUserProfile(response.user);
        navigate('/dashboard');
      },
      (error: any) => {
        setError(error);
      },
    );
  };

  const logOutAction = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUserId(null);
    navigate('/');
  };

  const getProfileAction = async (
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    getUserProfile()
      .then((response) => {
        setError(null);
        setUserProfile(response);
        console.log('Fetched user profile successfully:', response);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const updateProfileAction = async (
    profileData: UpdateProfileInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    updateUserProfile(profileData)
      .then((response) => {
        setError(null);
        console.log('Profile updated successfully:', response);
        notifications.show({
          title: 'Profile Updated!',
          message: 'Profile updated successfully!',
          color: 'green',
          autoClose: 3000,
        });
      })
      .catch((error: any) => {
        setError(error);
      });
  };

  const forgotPasswordAction = async (
    email: ForgotPasswordInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    try {
      await forgotPassword(email);
      setError(null);
      notifications.show({
        title: 'Success',
        message: 'Reset Password Email sent successfully!',
        color: 'blue',
      });
    } catch (error: any) {
      setError(error);
      notifications.show({
        title: 'Error',
        message: 'Failed to send email!',
        color: 'red',
        autoClose: 3000,
      });
      throw error;
    }
  };

  const resetPasswordAction = async (
    token: string,
    password: ResetPasswordInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    resetPassword(token, password)
      .then((response) => {
        setError(null);
        console.log('Password reset successfully:', response);
        navigate('/');
      })
      .catch((error) => {
        setError(error);
        notifications.show({
          title: 'Error',
          message: 'Failed to reset password! Try again!',
          color: 'red',
          autoClose: 3000,
        });
      });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        userProfile,
        loginAction,
        logOutAction,
        getProfileAction,
        updateProfileAction,
        forgotPasswordAction,
        resetPasswordAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
