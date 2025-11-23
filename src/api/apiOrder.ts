import { API_URL } from '@/constants/api';
import { handleResponse } from '@/helpers/apiErrorHandler';

type TCreateOrderResponse = {
  success: boolean;
  name?: string;
  order?: {
    number: number;
  };
};

export const apiOrder = {
  createOrder: async (ingredientIds: string[]): Promise<string> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients: ingredientIds }),
    });
    const data = await handleResponse<TCreateOrderResponse>(
      response,
      'Failed to create order'
    );
    if (!data.order?.number) {
      throw new Error('Invalid order response');
    }
    return String(data.order.number);
  },
};
