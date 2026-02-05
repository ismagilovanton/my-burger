const { afterEach, beforeEach, describe, expect, it } = require('@jest/globals');
const configureMockStore = require('redux-mock-store').default;
const { thunk } = require('redux-thunk');

const { createOrder } = require('./orderSlice');

// Мокируем модули
jest.mock('@/api/apiOrder', () => ({
  apiOrder: {
    createOrder: jest.fn(),
  },
}));

jest.mock('@/utils/cookie', () => ({
  getCookie: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('order async actions', () => {
  const mockIngredientIds = ['ingredient-1', 'ingredient-2', 'ingredient-3'];
  const mockOrderNumber = '12345';

  beforeEach(async () => {
    jest.clearAllMocks();
    const { getCookie } = await import('@/utils/cookie');
    getCookie.mockReturnValue('access-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createOrder', () => {
    it('должен создавать CREATE_ORDER_SUCCESS при успешном создании заказа', async () => {
      const apiOrderModule = require('@/api/apiOrder');
      const apiOrder = apiOrderModule.apiOrder;
      apiOrder.createOrder.mockResolvedValue(mockOrderNumber);

      const store = mockStore({
        order: { order: null, status: 'idle', error: null },
      });

      await store.dispatch(createOrder(mockIngredientIds));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(createOrder.pending.type);
      expect(actions[1].type).toBe(createOrder.fulfilled.type);
      expect(actions[1].payload).toBe(mockOrderNumber);
    });

    it('должен создавать CREATE_ORDER_REJECTED при ошибке создания заказа', async () => {
      const apiOrderModule = require('@/api/apiOrder');
      const apiOrder = apiOrderModule.apiOrder;
      const errorMessage = 'Failed to create order';
      apiOrder.createOrder.mockRejectedValue(new Error(errorMessage));

      const store = mockStore({
        order: { order: null, status: 'idle', error: null },
      });

      await store.dispatch(createOrder(mockIngredientIds));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(createOrder.pending.type);
      expect(actions[1].type).toBe(createOrder.rejected.type);
      expect(actions[1].error.message).toBe(errorMessage);
    });

    it('должен создавать CREATE_ORDER_REJECTED при отсутствии access token', async () => {
      const { getCookie } = require('@/utils/cookie');
      getCookie.mockReturnValue(null);

      const apiOrderModule = require('@/api/apiOrder');
      const apiOrder = apiOrderModule.apiOrder;
      const errorMessage = 'No access token';
      apiOrder.createOrder.mockRejectedValue(new Error(errorMessage));

      const store = mockStore({
        order: { order: null, status: 'idle', error: null },
      });

      await store.dispatch(createOrder(mockIngredientIds));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(createOrder.pending.type);
      expect(actions[1].type).toBe(createOrder.rejected.type);
    });
  });
});
