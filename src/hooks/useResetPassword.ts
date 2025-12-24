import { apiAuth } from '@/api/apiAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TUseResetPassword = {
  isLoading: boolean;
  error: string | null;
  resetPassword: ({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) => Promise<void>;
};

export const useResetPassword = (): TUseResetPassword => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const resetPassword = async ({
    password,
    token,
  }: {
    password: string;
    token: string;
  }): Promise<void> => {
    if (!password || !token) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiAuth.resetPassword({ password, token });

      console.log(data.message);
      sessionStorage.removeItem('resetPasswordAllowed');
      await navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);

      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    resetPassword,
  };
};
