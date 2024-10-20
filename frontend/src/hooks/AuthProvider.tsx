import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../apis/AuthApi';
import { AuthResponse, LoginInput } from '../types/Api';

type AuthContextProps = {
  token: string | null;
  userId: string | null;
  loginAction: (
    loginInput: LoginInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => Promise<void>;
  logOutAction: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  token: null,
  userId: null,
  loginAction: () => Promise.resolve(),
  logOutAction: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') || null,
  );
  const [userId, setUserId] = useState<string | null>(null);
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
        navigate('../select');
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

  return (
    <AuthContext.Provider value={{ token, userId, loginAction, logOutAction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
