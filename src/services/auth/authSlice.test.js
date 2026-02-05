import { describe, expect, it } from '@jest/globals';

import {
  authReducer,
  clearUser,
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  setUser,
  updateUser,
} from './authSlice';

describe('authReducer', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
  };

  it('должен возвращать начальное состояние', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
      status: 'idle',
      error: null,
    });
  });

  describe('setUser', () => {
    it('должен устанавливать пользователя и isAuthChecked в true', () => {
      const state = authReducer(undefined, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен устанавливать null при очистке пользователя', () => {
      const initialState = {
        user: mockUser,
        isAuthChecked: true,
        status: 'succeeded',
        error: null,
      };
      const state = authReducer(initialState, setUser(null));
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('clearUser', () => {
    it('должен очищать пользователя и устанавливать isAuthChecked в true', () => {
      const initialState = {
        user: mockUser,
        isAuthChecked: true,
        status: 'succeeded',
        error: null,
      };
      const state = authReducer(initialState, clearUser());
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
        payload: mockUser,
      };
      const state = authReducer(undefined, action);
      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние с payload', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });

    it('должен обрабатывать rejected состояние с error.message', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Network error' },
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Network error');
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
        payload: mockUser,
      };
      const state = authReducer(undefined, action);
      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние с payload', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: loginUser.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });

    it('должен обрабатывать rejected состояние с error.message', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Invalid credentials' },
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Invalid credentials');
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
      const initialState = {
        user: mockUser,
        isAuthChecked: true,
        status: 'succeeded',
        error: null,
      };
      const action = { type: logoutUser.fulfilled.type };
      const state = authReducer(initialState, action);
      expect(state.user).toBeNull();
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Logout failed';
      const action = {
        type: logoutUser.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
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
        payload: mockUser,
      };
      const state = authReducer(undefined, action);
      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние и устанавливать isAuthChecked в true', () => {
      const errorMessage = 'Failed to fetch user';
      const action = {
        type: fetchUser.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
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
      const updatedUser = {
        email: 'updated@example.com',
        name: 'Updated User',
      };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser,
      };
      const state = authReducer(undefined, action);
      expect(state.user).toEqual(updatedUser);
      expect(state.status).toBe('succeeded');
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Failed to update user';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
});

