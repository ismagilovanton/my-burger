import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TBurgerConstructorState = {
  items: TIngredient[];
};

const initialState: TBurgerConstructorState = {
  items: [],
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBurgerConstructorItems: (state, action: PayloadAction<TIngredient[]>) => {
      state.items = action.payload;
    },
    addBurgerConstructorItem: (state, action: PayloadAction<TIngredient>) => {
      state.items.push(action.payload);
    },
    removeBurgerConstructorItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearBurgerConstructor: (state) => {
      state.items = [];
    },
  },
});

export const {
  setBurgerConstructorItems,
  addBurgerConstructorItem,
  removeBurgerConstructorItem,
  clearBurgerConstructor,
} = burgerConstructorSlice.actions;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
