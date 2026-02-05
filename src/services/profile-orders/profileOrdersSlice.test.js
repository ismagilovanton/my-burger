import { describe, expect, it } from '@jest/globals';

import { PROFILE_WS_ACTIONS } from '@/constants/ws';
import { profileOrdersReducer } from './profileOrdersSlice';

describe('profileOrdersReducer', () => {
  it('должен возвращать начальное состояние', () => {
    const state = profileOrdersReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      status: 'idle',
      error: null,
    });
  });

  describe('PROFILE_WS_ACTIONS.INIT', () => {
    it('должен устанавливать status в connecting и очищать error', () => {
      const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'idle',
        error: 'Previous error',
      };
      const action = {
        type: PROFILE_WS_ACTIONS.INIT,
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.status).toBe('connecting');
      expect(state.error).toBeNull();
    });
  });

  describe('PROFILE_WS_ACTIONS.OPEN', () => {
    it('должен устанавливать status в online и очищать error', () => {
      const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'connecting',
        error: 'Some error',
      };
      const action = {
        type: PROFILE_WS_ACTIONS.OPEN,
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.status).toBe('online');
      expect(state.error).toBeNull();
    });
  });

  describe('PROFILE_WS_ACTIONS.ERROR', () => {
    it('должен устанавливать status в error с переданным сообщением', () => {
      const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'online',
        error: null,
      };
      const errorMessage = 'Connection failed';
      const action = {
        type: PROFILE_WS_ACTIONS.ERROR,
        payload: errorMessage,
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.status).toBe('error');
      expect(state.error).toBe(errorMessage);
    });

    it('должен использовать дефолтное сообщение при отсутствии payload', () => {
      const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'online',
        error: null,
      };
      const action = {
        type: PROFILE_WS_ACTIONS.ERROR,
        payload: undefined,
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.status).toBe('error');
      expect(state.error).toBe('WebSocket connection error');
    });
  });

  describe('PROFILE_WS_ACTIONS.CLOSED', () => {
    it('должен устанавливать status в offline', () => {
      const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'online',
        error: null,
      };
      const action = {
        type: PROFILE_WS_ACTIONS.CLOSED,
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.status).toBe('offline');
    });
  });

  describe('PROFILE_WS_ACTIONS.MESSAGE', () => {
    it('должен обрабатывать успешное сообщение и обновлять данные', () => {
      const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'online',
        error: null,
      };
      const mockOrders = [
        {
          _id: 'order-1',
          ingredients: ['ingredient-1', 'ingredient-2'],
          status: 'done',
          number: 12345,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          name: 'Order 1',
        },
        {
          _id: 'order-2',
          ingredients: ['ingredient-3'],
          status: 'pending',
          number: 12346,
          createdAt: '2024-01-01T01:00:00.000Z',
          updatedAt: '2024-01-01T01:00:00.000Z',
          name: 'Order 2',
        },
      ];
      const messageData = {
        success: true,
        orders: mockOrders,
        total: 200,
        totalToday: 100,
      };
      const action = {
        type: PROFILE_WS_ACTIONS.MESSAGE,
        payload: JSON.stringify(messageData),
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(200);
      expect(state.totalToday).toBe(100);
      expect(state.status).toBe('online');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать сообщение с success: false', () => {
      const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'online',
        error: null,
      };
      const messageData = {
        success: false,
        orders: [],
        total: 0,
        totalToday: 0,
      };
      const action = {
        type: PROFILE_WS_ACTIONS.MESSAGE,
        payload: JSON.stringify(messageData),
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.status).toBe('error');
      expect(state.error).toBe('WebSocket response error');
    });

    it('должен обрабатывать ошибку парсинга JSON', () => {
      const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'online',
        error: null,
      };
      const action = {
        type: PROFILE_WS_ACTIONS.MESSAGE,
        payload: 'invalid json',
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.status).toBe('error');
      expect(state.error).toBeDefined();
    });

    it('должен обрабатывать ошибку парсинга с сообщением об ошибке', () => {
      const initialState = {
        orders: [],
        total: 0,
        totalToday: 0,
        status: 'online',
        error: null,
      };
      const action = {
        type: PROFILE_WS_ACTIONS.MESSAGE,
        payload: 'invalid json',
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.status).toBe('error');
      expect(typeof state.error).toBe('string');
      expect(state.error).not.toBeNull();
    });
  });
});


