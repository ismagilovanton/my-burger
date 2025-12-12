import { API_URL } from '@/constants/api';
import { handleResponse } from '@/helpers/apiErrorHandler';
import { getCookie } from '@/utils/cookie';

type TCreateOrderResponse = {
  success: boolean;
  name?: string;
  order?: {
    number: number;
  };
};

export const apiOrder = {
  createOrder: async (ingredientIds: string[]): Promise<string> => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      throw new Error('No access token');
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
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
