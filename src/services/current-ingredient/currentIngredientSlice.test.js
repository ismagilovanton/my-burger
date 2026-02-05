import { describe, expect, it } from '@jest/globals';

import {
  clearCurrentIngredient,
  currentIngredientReducer,
  setCurrentIngredient,
} from './currentIngredientSlice';

describe('currentIngredientReducer', () => {
  const mockIngredient = {
    _id: 'ingredient-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://example.com/bun.png',
    image_mobile: 'https://example.com/bun-mobile.png',
    image_large: 'https://example.com/bun-large.png',
    __v: 0,
  };

  it('должен возвращать начальное состояние', () => {
    const state = currentIngredientReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      current: null,
    });
  });

  describe('setCurrentIngredient', () => {
    it('должен устанавливать текущий ингредиент', () => {
      const action = setCurrentIngredient(mockIngredient);
      const state = currentIngredientReducer(undefined, action);
      expect(state.current).toEqual(mockIngredient);
    });

    it('должен заменять существующий ингредиент', () => {
      const initialState = {
        current: mockIngredient,
      };
      const newIngredient = {
        ...mockIngredient,
        _id: 'ingredient-2',
        name: 'Новый ингредиент',
      };
      const action = setCurrentIngredient(newIngredient);
      const state = currentIngredientReducer(initialState, action);
      expect(state.current).toEqual(newIngredient);
      expect(state.current._id).toBe('ingredient-2');
    });
  });

  describe('clearCurrentIngredient', () => {
    it('должен очищать текущий ингредиент', () => {
      const initialState = {
        current: mockIngredient,
      };
      const action = clearCurrentIngredient();
      const state = currentIngredientReducer(initialState, action);
      expect(state.current).toBeNull();
    });

    it('должен работать когда ингредиент уже null', () => {
      const initialState = {
        current: null,
      };
      const action = clearCurrentIngredient();
      const state = currentIngredientReducer(initialState, action);
      expect(state.current).toBeNull();
    });
  });
});

