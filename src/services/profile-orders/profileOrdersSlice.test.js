import { describe, expect, it } from '@jest/globals';

import { PROFILE_WS_ACTIONS } from '@/constants/ws';
import { MOCK_WS_ORDERS, ERROR_MESSAGES } from '../../test-fixtures/mock-data';
import { profileOrdersReducer, initialState } from './profileOrdersSlice';

describe('profileOrdersReducer', () => {
  it('должен возвращать начальное состояние', () => {
    const state = profileOrdersReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('PROFILE_WS_ACTIONS.INIT', () => {
    it('должен устанавливать status в connecting и очищать error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error',
      };
      const action = {
        type: PROFILE_WS_ACTIONS.INIT,
      };
      const state = profileOrdersReducer(stateWithError, action);
      expect(state.status).toBe('connecting');
      expect(state.error).toBeNull();
    });
  });

  describe('PROFILE_WS_ACTIONS.OPEN', () => {
    it('должен устанавливать status в online и очищать error', () => {
      const connectingState = {
        ...initialState,
        status: 'connecting',
        error: 'Some error',
      };
      const action = {
        type: PROFILE_WS_ACTIONS.OPEN,
      };
      const state = profileOrdersReducer(connectingState, action);
      expect(state.status).toBe('online');
      expect(state.error).toBeNull();
    });
  });

  describe('PROFILE_WS_ACTIONS.ERROR', () => {
    it('должен устанавливать status в error с переданным сообщением', () => {
      const onlineState = {
        ...initialState,
        status: 'online',
      };
      const errorMessage = 'Connection failed';
      const action = {
        type: PROFILE_WS_ACTIONS.ERROR,
        payload: errorMessage,
      };
      const state = profileOrdersReducer(onlineState, action);
      expect(state.status).toBe('error');
      expect(state.error).toBe(errorMessage);
    });

    it('должен использовать дефолтное сообщение при отсутствии payload', () => {
      const onlineState = {
        ...initialState,
        status: 'online',
      };
      const action = {
        type: PROFILE_WS_ACTIONS.ERROR,
        payload: undefined,
      };
      const state = profileOrdersReducer(onlineState, action);
      expect(state.status).toBe('error');
      expect(state.error).toBe(ERROR_MESSAGES.WS_CONNECTION_ERROR);
    });
  });

  describe('PROFILE_WS_ACTIONS.CLOSED', () => {
    it('должен устанавливать status в offline', () => {
      const onlineState = {
        ...initialState,
        status: 'online',
      };
      const action = {
        type: PROFILE_WS_ACTIONS.CLOSED,
      };
      const state = profileOrdersReducer(onlineState, action);
      expect(state.status).toBe('offline');
    });
  });

  describe('PROFILE_WS_ACTIONS.MESSAGE', () => {
    it('должен обрабатывать успешное сообщение и обновлять данные', () => {
      const onlineState = {
        ...initialState,
        status: 'online',
      };
      const messageData = {
        success: true,
        orders: MOCK_WS_ORDERS,
        total: 200,
        totalToday: 100,
      };
      const action = {
        type: PROFILE_WS_ACTIONS.MESSAGE,
        payload: JSON.stringify(messageData),
      };
      const state = profileOrdersReducer(onlineState, action);
      expect(state.orders).toEqual(MOCK_WS_ORDERS);
      expect(state.total).toBe(200);
      expect(state.totalToday).toBe(100);
      expect(state.status).toBe('online');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать сообщение с success: false', () => {
      const onlineState = {
        ...initialState,
        status: 'online',
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
      const state = profileOrdersReducer(onlineState, action);
      expect(state.status).toBe('error');
      expect(state.error).toBe(ERROR_MESSAGES.WS_RESPONSE_ERROR);
    });

    it('должен обрабатывать ошибку парсинга JSON', () => {
      const onlineState = {
        ...initialState,
        status: 'online',
      };
      const action = {
        type: PROFILE_WS_ACTIONS.MESSAGE,
        payload: 'invalid json',
      };
      const state = profileOrdersReducer(onlineState, action);
      expect(state.status).toBe('error');
      expect(state.error).toBeDefined();
    });

    it('должен обрабатывать ошибку парсинга с сообщением об ошибке', () => {
      const onlineState = {
        ...initialState,
        status: 'online',
      };
      const action = {
        type: PROFILE_WS_ACTIONS.MESSAGE,
        payload: 'invalid json',
      };
      const state = profileOrdersReducer(onlineState, action);
      expect(state.status).toBe('error');
      expect(typeof state.error).toBe('string');
      expect(state.error).not.toBeNull();
    });
  });
});
