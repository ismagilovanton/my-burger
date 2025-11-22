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
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        // Заменяем существующую булку, если есть
        state.items = state.items.filter((item) => item.type !== 'bun');
        state.items.push(ingredient);
      } else {
        state.items.push(ingredient);
      }
    },
    removeBurgerConstructorItem: (state, action: PayloadAction<string>) => {
      // Удаляем только один экземпляр по _id (первый найденный)
      const index = state.items.findIndex((item) => item._id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
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
