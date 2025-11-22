import { burgerConstructorReducer } from '@/features/burger-constructor/burgerConstructorSlice';
import { currentIngredientReducer } from '@/features/current-ingredient/currentIngredientSlice';
import { ingredientsReducer } from '@/features/ingredients/ingredientsSlice';
import { orderReducer } from '@/features/order/orderSlice';
import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  currentIngredient: currentIngredientReducer,
  order: orderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
