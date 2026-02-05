import { describe, expect, it } from '@jest/globals';

import {
  clearOrder,
  createOrder,
  orderReducer,
  setOrder,
} from './orderSlice';

describe('orderReducer', () => {
  const mockOrder = {
    orderNumber: '12345',
  };

  it('должен возвращать начальное состояние', () => {
    const state = orderReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      order: null,
      status: 'idle',
      error: null,
    });
  });

  describe('setOrder', () => {
    it('должен устанавливать заказ', () => {
      const action = setOrder(mockOrder);
      const state = orderReducer(undefined, action);
      expect(state.order).toEqual(mockOrder);
      expect(state.order.orderNumber).toBe('12345');
    });

    it('должен заменять существующий заказ', () => {
      const initialState = {
        order: mockOrder,
        status: 'succeeded',
        error: null,
      };
      const newOrder = {
        orderNumber: '67890',
      };
      const action = setOrder(newOrder);
      const state = orderReducer(initialState, action);
      expect(state.order).toEqual(newOrder);
      expect(state.order.orderNumber).toBe('67890');
    });
  });

  describe('clearOrder', () => {
    it('должен очищать заказ', () => {
      const initialState = {
        order: mockOrder,
        status: 'succeeded',
        error: null,
      };
      const action = clearOrder();
      const state = orderReducer(initialState, action);
      expect(state.order).toBeNull();
    });

    it('должен работать когда заказ уже null', () => {
      const initialState = {
        order: null,
        status: 'idle',
        error: null,
      };
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
      const orderNumber = '12345';
      const action = {
        type: createOrder.fulfilled.type,
        payload: orderNumber,
      };
      const state = orderReducer(undefined, action);
      expect(state.order).toEqual({ orderNumber });
      expect(state.status).toBe('succeeded');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать rejected состояние с error.message', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage },
      };
      const state = orderReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
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

