const { afterEach, beforeEach, describe, expect, it } = require('@jest/globals');
const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk');

const { fetchIngredients } = require('./ingredientsSlice');

// Мокируем модуль API
jest.mock('@/api/apiIngredient', () => ({
  apiIngredient: {
    getIngredients: jest.fn(),
  },
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ingredients async actions', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchIngredients', () => {
    it('должен создавать FETCH_INGREDIENTS_SUCCESS при успешной загрузке ингредиентов', async () => {
      const apiIngredientModule = require('@/api/apiIngredient');
      const apiIngredient = apiIngredientModule.apiIngredient;
      apiIngredient.getIngredients.mockResolvedValue(mockIngredients);

      const store = mockStore({ ingredients: { items: [], status: 'idle', error: null } });

      await store.dispatch(fetchIngredients());

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(fetchIngredients.pending.type);
      expect(actions[1].type).toBe(fetchIngredients.fulfilled.type);
      expect(actions[1].payload).toEqual(mockIngredients);
    });

    it('должен создавать FETCH_INGREDIENTS_REJECTED при ошибке загрузки ингредиентов', async () => {
      const apiIngredientModule = require('@/api/apiIngredient');
      const apiIngredient = apiIngredientModule.apiIngredient;
      const errorMessage = 'Failed to fetch ingredients';
      apiIngredient.getIngredients.mockRejectedValue(new Error(errorMessage));

      const store = mockStore({ ingredients: { items: [], status: 'idle', error: null } });

      await store.dispatch(fetchIngredients());

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(fetchIngredients.pending.type);
      expect(actions[1].type).toBe(fetchIngredients.rejected.type);
      expect(actions[1].error.message).toBe(errorMessage);
    });
  });
});
