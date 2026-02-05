import { describe, expect, it } from '@jest/globals';

import {
  clearIngredients,
  fetchIngredients,
  ingredientsReducer,
  setIngredients,
} from './ingredientsSlice';

describe('ingredientsReducer', () => {
  const mockIngredients = [
    {
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
    },
    {
      _id: 'ingredient-2',
      name: 'Говяжий метеорит',
      type: 'main',
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://example.com/meat.png',
      image_mobile: 'https://example.com/meat-mobile.png',
      image_large: 'https://example.com/meat-large.png',
      __v: 0,
    },
  ];

  it('должен возвращать начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  describe('setIngredients', () => {
    it('должен устанавливать список ингредиентов', () => {
      const action = setIngredients(mockIngredients);
      const state = ingredientsReducer(undefined, action);
      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(2);
    });

    it('должен заменять существующие ингредиенты', () => {
      const initialState = {
        items: mockIngredients,
        status: 'succeeded',
        error: null,
      };
      const newIngredients = [
        {
          ...mockIngredients[0],
          _id: 'ingredient-3',
          name: 'Новый ингредиент',
        },
      ];
      const action = setIngredients(newIngredients);
      const state = ingredientsReducer(initialState, action);
      expect(state.items).toEqual(newIngredients);
      expect(state.items).toHaveLength(1);
    });
  });

  describe('clearIngredients', () => {
    it('должен очищать список ингредиентов', () => {
      const initialState = {
        items: mockIngredients,
        status: 'succeeded',
        error: null,
      };
      const action = clearIngredients();
      const state = ingredientsReducer(initialState, action);
      expect(state.items).toEqual([]);
    });

    it('должен работать с пустым массивом', () => {
      const initialState = {
        items: [],
        status: 'idle',
        error: null,
      };
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
      const errorMessage = 'Failed to fetch ingredients';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage },
      };
      const state = ingredientsReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
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

