import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

type TOrder = {
  orderNumber: string;
};

type TOrderState = {
  order: TOrder | null;
};

const initialState: TOrderState = {
  order: null,
};

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
});

export const { setOrder, clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
