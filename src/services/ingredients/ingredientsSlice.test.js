import { describe, expect, it } from '@jest/globals';

import {
  MOCK_BUN,
  MOCK_MAIN,
  ERROR_MESSAGES,
} from '../../test-fixtures/mock-data';
import {
  clearIngredients,
  fetchIngredients,
  ingredientsReducer,
  initialState,
  setIngredients,
} from './ingredientsSlice';

describe('ingredientsReducer', () => {
  const mockIngredients = [MOCK_BUN, MOCK_MAIN];

  it('должен возвращать начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('setIngredients', () => {
    it('должен устанавливать список ингредиентов', () => {
      const action = setIngredients(mockIngredients);
      const state = ingredientsReducer(undefined, action);
      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(2);
    });

    it('должен заменять существующие ингредиенты', () => {
      const stateWithItems = {
        ...initialState,
        items: mockIngredients,
        status: 'succeeded',
      };
      const newIngredients = [
        {
          ...MOCK_BUN,
          _id: 'ingredient-3',
          name: 'Новый ингредиент',
        },
      ];
      const action = setIngredients(newIngredients);
      const state = ingredientsReducer(stateWithItems, action);
      expect(state.items).toEqual(newIngredients);
      expect(state.items).toHaveLength(1);
    });
  });

  describe('clearIngredients', () => {
    it('должен очищать список ингредиентов', () => {
      const stateWithItems = {
        ...initialState,
        items: mockIngredients,
        status: 'succeeded',
      };
      const action = clearIngredients();
      const state = ingredientsReducer(stateWithItems, action);
      expect(state.items).toEqual([]);
    });

    it('должен работать с пустым массивом', () => {
      const action = clearIngredients();
      const state = ingredientsReducer(initialState, action);
      expect(state.items).toEqual([]);
    });
  });

  describe('fetchIngredients', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(undefined, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients,
      };
      const state = ingredientsReducer(undefined, action);
      expect(state.items).toEqual(mockIngredients);
      expect(state.status).toBe('succeeded');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать rejected состояние с error.message', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: ERROR_MESSAGES.FETCH_INGREDIENTS_FAILED },
      };
      const state = ingredientsReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(ERROR_MESSAGES.FETCH_INGREDIENTS_FAILED);
    });

    it('должен обрабатывать rejected состояние без сообщения', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {},
      };
      const state = ingredientsReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Failed to load ingredients');
    });
  });
});
