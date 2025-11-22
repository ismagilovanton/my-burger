import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TConstructorState = {
  items: TIngredient[];
};

const initialState: TConstructorState = {
  items: [],
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setConstructorItems: (state, action: PayloadAction<TIngredient[]>) => {
      state.items = action.payload;
    },
    addConstructorItem: (state, action: PayloadAction<TIngredient>) => {
      state.items.push(action.payload);
    },
    removeConstructorItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearConstructor: (state) => {
      state.items = [];
    },
  },
});

export const {
  setConstructorItems,
  addConstructorItem,
  removeConstructorItem,
  clearConstructor,
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
