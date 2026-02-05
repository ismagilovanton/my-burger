import { apiIngredient } from '@/api/apiIngredient';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/types/ingredient';
import type { PayloadAction } from '@reduxjs/toolkit';

type TIngredientsState = {
  items: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const initialState: TIngredientsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchAll',
  async () => {
    const data = await apiIngredient.getIngredients();
    return data;
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load ingredients';
      });
  },
});

export const { setIngredients, clearIngredients } = ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;
