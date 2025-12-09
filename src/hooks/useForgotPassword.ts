import { apiAuth } from '@/api/apiAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TUseForgotPassword = {
  isLoading: boolean;
  error: string | null;
  forgotPassword: (email: string) => Promise<void>;
};

export const useForgotPassword = (): TUseForgotPassword => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const forgotPassword = async (email: string): Promise<void> => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiAuth.forgotPassword({ email });

      console.log(data.message);
      await navigate('/reset-password');
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
    forgotPassword,
  };
};
