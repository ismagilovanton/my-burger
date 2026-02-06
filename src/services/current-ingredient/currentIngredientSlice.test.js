import { describe, expect, it } from '@jest/globals';

import { MOCK_BUN } from '../../test-fixtures/mock-data';
import {
  clearCurrentIngredient,
  currentIngredientReducer,
  initialState,
  setCurrentIngredient,
} from './currentIngredientSlice';

describe('currentIngredientReducer', () => {
  it('должен возвращать начальное состояние', () => {
    const state = currentIngredientReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('setCurrentIngredient', () => {
    it('должен устанавливать текущий ингредиент', () => {
      const action = setCurrentIngredient(MOCK_BUN);
      const state = currentIngredientReducer(undefined, action);
      expect(state.current).toEqual(MOCK_BUN);
    });

    it('должен заменять существующий ингредиент', () => {
      const stateWithIngredient = {
        ...initialState,
        current: MOCK_BUN,
      };
      const newIngredient = {
        ...MOCK_BUN,
        _id: 'ingredient-2',
        name: 'Новый ингредиент',
      };
      const action = setCurrentIngredient(newIngredient);
      const state = currentIngredientReducer(stateWithIngredient, action);
      expect(state.current).toEqual(newIngredient);
      expect(state.current._id).toBe('ingredient-2');
    });
  });

  describe('clearCurrentIngredient', () => {
    it('должен очищать текущий ингредиент', () => {
      const stateWithIngredient = {
        ...initialState,
        current: MOCK_BUN,
      };
      const action = clearCurrentIngredient();
      const state = currentIngredientReducer(stateWithIngredient, action);
      expect(state.current).toBeNull();
    });

    it('должен работать когда ингредиент уже null', () => {
      const action = clearCurrentIngredient();
      const state = currentIngredientReducer(initialState, action);
      expect(state.current).toBeNull();
    });
  });
});
