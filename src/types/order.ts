export type TFeedOrderStatus = 'done' | 'pending' | 'created';

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: TFeedOrderStatus;
  number: number;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export type TOrdersResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};
