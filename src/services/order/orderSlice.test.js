import { describe, expect, it } from '@jest/globals';

import {
  MOCK_ORDER,
  MOCK_ORDER_NUMBER,
  ERROR_MESSAGES,
} from '../../test-fixtures/mock-data';
import {
  clearOrder,
  createOrder,
  initialState,
  orderReducer,
  setOrder,
} from './orderSlice';

describe('orderReducer', () => {
  it('должен возвращать начальное состояние', () => {
    const state = orderReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('setOrder', () => {
    it('должен устанавливать заказ', () => {
      const action = setOrder(MOCK_ORDER);
      const state = orderReducer(undefined, action);
      expect(state.order).toEqual(MOCK_ORDER);
      expect(state.order.orderNumber).toBe(MOCK_ORDER_NUMBER);
    });

    it('должен заменять существующий заказ', () => {
      const stateWithOrder = {
        ...initialState,
        order: MOCK_ORDER,
        status: 'succeeded',
      };
      const newOrder = {
        orderNumber: '67890',
      };
      const action = setOrder(newOrder);
      const state = orderReducer(stateWithOrder, action);
      expect(state.order).toEqual(newOrder);
      expect(state.order.orderNumber).toBe('67890');
    });
  });

  describe('clearOrder', () => {
    it('должен очищать заказ', () => {
      const stateWithOrder = {
        ...initialState,
        order: MOCK_ORDER,
        status: 'succeeded',
      };
      const action = clearOrder();
      const state = orderReducer(stateWithOrder, action);
      expect(state.order).toBeNull();
    });

    it('должен работать когда заказ уже null', () => {
      const action = clearOrder();
      const state = orderReducer(initialState, action);
      expect(state.order).toBeNull();
    });
  });

  describe('createOrder', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(undefined, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: MOCK_ORDER_NUMBER,
      };
      const state = orderReducer(undefined, action);
      expect(state.order).toEqual({ orderNumber: MOCK_ORDER_NUMBER });
      expect(state.status).toBe('succeeded');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать rejected состояние с error.message', () => {
      const action = {
        type: createOrder.rejected.type,
        error: { message: ERROR_MESSAGES.CREATE_ORDER_FAILED },
      };
      const state = orderReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(ERROR_MESSAGES.CREATE_ORDER_FAILED);
    });

    it('должен обрабатывать rejected состояние без сообщения', () => {
      const action = {
        type: createOrder.rejected.type,
        error: {},
      };
      const state = orderReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Failed to create order');
    });
  });
});
