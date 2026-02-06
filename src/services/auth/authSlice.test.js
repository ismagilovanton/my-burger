import { describe, expect, it } from '@jest/globals';

import {
  MOCK_USER,
  MOCK_USER_UPDATED,
  ERROR_MESSAGES,
} from '../../test-fixtures/mock-data';
import {
  authReducer,
  clearUser,
  fetchUser,
  initialState,
  loginUser,
  logoutUser,
  registerUser,
  setUser,
  updateUser,
} from './authSlice';

describe('authReducer', () => {
  it('должен возвращать начальное состояние', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('setUser', () => {
    it('должен устанавливать пользователя и isAuthChecked в true', () => {
      const state = authReducer(undefined, setUser(MOCK_USER));
      expect(state.user).toEqual(MOCK_USER);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен устанавливать null при очистке пользователя', () => {
      const stateWithUser = {
        ...initialState,
        user: MOCK_USER,
        isAuthChecked: true,
        status: 'succeeded',
      };
      const state = authReducer(stateWithUser, setUser(null));
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('clearUser', () => {
    it('должен очищать пользователя и устанавливать isAuthChecked в true', () => {
      const stateWithUser = {
        ...initialState,
        user: MOCK_USER,
        isAuthChecked: true,
        status: 'succeeded',
      };
      const state = authReducer(stateWithUser, clearUser());
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('registerUser', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: registerUser.pending.type };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: MOCK_USER,
      };
      const state = authReducer(undefined, action);
      expect(state.user).toEqual(MOCK_USER);
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние с payload', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: ERROR_MESSAGES.REGISTRATION_FAILED,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(ERROR_MESSAGES.REGISTRATION_FAILED);
    });

    it('должен обрабатывать rejected состояние с error.message', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: ERROR_MESSAGES.NETWORK_ERROR },
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(ERROR_MESSAGES.NETWORK_ERROR);
    });

    it('должен обрабатывать rejected состояние без сообщения', () => {
      const action = {
        type: registerUser.rejected.type,
        error: {},
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Failed to register');
    });
  });

  describe('loginUser', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: MOCK_USER,
      };
      const state = authReducer(undefined, action);
      expect(state.user).toEqual(MOCK_USER);
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние с payload', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: ERROR_MESSAGES.LOGIN_FAILED,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(ERROR_MESSAGES.LOGIN_FAILED);
    });

    it('должен обрабатывать rejected состояние с error.message', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: ERROR_MESSAGES.INVALID_CREDENTIALS },
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    it('должен обрабатывать rejected состояние без сообщения', () => {
      const action = {
        type: loginUser.rejected.type,
        error: {},
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Failed to login');
    });
  });

  describe('logoutUser', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: logoutUser.pending.type };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const stateWithUser = {
        ...initialState,
        user: MOCK_USER,
        isAuthChecked: true,
        status: 'succeeded',
      };
      const action = { type: logoutUser.fulfilled.type };
      const state = authReducer(stateWithUser, action);
      expect(state.user).toBeNull();
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние', () => {
      const action = {
        type: logoutUser.rejected.type,
        payload: ERROR_MESSAGES.LOGOUT_FAILED,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(ERROR_MESSAGES.LOGOUT_FAILED);
    });
  });

  describe('fetchUser', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: fetchUser.pending.type };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: fetchUser.fulfilled.type,
        payload: MOCK_USER,
      };
      const state = authReducer(undefined, action);
      expect(state.user).toEqual(MOCK_USER);
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние и устанавливать isAuthChecked в true', () => {
      const action = {
        type: fetchUser.rejected.type,
        payload: ERROR_MESSAGES.FETCH_USER_FAILED,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(ERROR_MESSAGES.FETCH_USER_FAILED);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: updateUser.pending.type };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: MOCK_USER_UPDATED,
      };
      const state = authReducer(undefined, action);
      expect(state.user).toEqual(MOCK_USER_UPDATED);
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние', () => {
      const action = {
        type: updateUser.rejected.type,
        payload: ERROR_MESSAGES.UPDATE_USER_FAILED,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(ERROR_MESSAGES.UPDATE_USER_FAILED);
    });
  });
});
