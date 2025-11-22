import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TIngredientsState = {
  items: TIngredient[];
};

const initialState: TIngredientsState = {
  items: [],
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.items = action.payload;
    },
    clearIngredients: (state) => {
      state.items = [];
    },
  },
});

export const { setIngredients, clearIngredients } = ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;
