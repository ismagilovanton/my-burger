import { apiOrder } from '@/api/apiOrder';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

type TOrder = {
  orderNumber: string;
};

type TOrderState = {
  order: TOrder | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const initialState: TOrderState = {
  order: null,
  status: 'idle',
  error: null,
};

export const createOrder = createAsyncThunk<string, string[]>(
  'order/create',
  async (ingredientIds: string[]) => {
    const number = await apiOrder.createOrder(ingredientIds);
    return number;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<TOrder>) => {
      state.order = action.payload;
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = { orderNumber: action.payload };
        state.status = 'succeeded';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to create order';
      });
  },
});

export const { setOrder, clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
