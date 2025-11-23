import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TBurgerConstructorItem = TIngredient & {
  uniqueId: string;
};

type TBurgerConstructorState = {
  items: TBurgerConstructorItem[];
};

const initialState: TBurgerConstructorState = {
  items: [],
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBurgerConstructorItems: (
      state,
      action: PayloadAction<TBurgerConstructorItem[]>
    ) => {
      state.items = action.payload;
    },
    addBurgerConstructorItem: (state, action: PayloadAction<TBurgerConstructorItem>) => {
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
      const index = state.items.findIndex((item) => item.uniqueId === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    moveBurgerConstructorItem: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.items.length ||
        toIndex >= state.items.length
      ) {
        return;
      }
      const [movedItem] = state.items.splice(fromIndex, 1);
      state.items.splice(toIndex, 0, movedItem);
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
  moveBurgerConstructorItem,
  clearBurgerConstructor,
} = burgerConstructorSlice.actions;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
