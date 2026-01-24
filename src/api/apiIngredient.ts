import { API_URL } from '@/constants/api';
import { handleResponse } from '@/helpers/apiErrorHandler';

import type { TIngredient } from '@/types/ingredient';

export const apiIngredient = {
  getIngredients: async (): Promise<TIngredient[]> => {
    const response = await fetch(`${API_URL}/ingredients`);
    return handleResponse<TIngredient[]>(response, 'Failed to fetch ingredients');
  },
};
