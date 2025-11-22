import { constructorReducer } from '@/features/constructor/constructorSlice';
import { currentIngredientReducer } from '@/features/current-ingredient/currentIngredientSlice';
import { ingredientsReducer } from '@/features/ingredients/ingredientsSlice';
import { orderReducer } from '@/features/order/orderSlice';
import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: constructorReducer,
  currentIngredient: currentIngredientReducer,
  order: orderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
