import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TCurrentIngredientState = {
  current: TIngredient | null;
};

const initialState: TCurrentIngredientState = {
  current: null,
};

const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.current = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.current = null;
    },
  },
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  currentIngredientSlice.actions;
export const currentIngredientReducer = currentIngredientSlice.reducer;
