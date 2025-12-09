import { authReducer } from '@/services/auth/authSlice';
import { burgerConstructorReducer } from '@/services/burger-constructor/burgerConstructorSlice';
import { currentIngredientReducer } from '@/services/current-ingredient/currentIngredientSlice';
import { ingredientsReducer } from '@/services/ingredients/ingredientsSlice';
import { orderReducer } from '@/services/order/orderSlice';
import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  currentIngredient: currentIngredientReducer,
  order: orderReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
