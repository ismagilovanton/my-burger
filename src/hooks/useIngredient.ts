import { apiIngredient } from '@/api/apiIngredient';
import { useState, useEffect } from 'react';

import type { TIngredient } from '@/utils/types';

type TUseIngredient = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const useIngredient = (): TUseIngredient => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const data = await apiIngredient.getIngredients();
        setIngredients(data);
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : String(error);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchIngredients();
  }, []);

  return { ingredients, isLoading, error };
};
