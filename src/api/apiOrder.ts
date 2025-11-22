import { API_URL } from '@/constants/api';

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
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create order');
    }
    const data = (await response.json()) as TCreateOrderResponse;
    if (!data.success || !data.order?.number) {
      throw new Error('Invalid order response');
    }
    return String(data.order.number);
  },
};
