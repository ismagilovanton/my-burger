const { afterEach, beforeEach, describe, expect, it } = require('@jest/globals');
const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk');

const {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} = require('./authSlice');

// Мокируем модули
jest.mock('@/api/apiAuth', () => ({
  apiAuth: {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    getUser: jest.fn(),
    updateUser: jest.fn(),
  },
}));

jest.mock('@/utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('auth async actions', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockAuthResponse = {
    success: true,
    user: mockUser,
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('registerUser', () => {
    it('должен создавать REGISTER_USER_SUCCESS при успешной регистрации', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      apiAuthModule.apiAuth.register.mockResolvedValue(mockAuthResponse);

      const store = mockStore({ auth: { user: null } });

      await store.dispatch(registerUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(registerUser.pending.type);
      expect(actions[1].type).toBe(registerUser.fulfilled.type);
      expect(actions[1].payload).toEqual(mockUser);
    });

    it('должен создавать REGISTER_USER_REJECTED при ошибке регистрации', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      const apiAuth = apiAuthModule.apiAuth;
      const errorMessage = 'Registration failed';
      apiAuth.register.mockRejectedValue(new Error(errorMessage));

      const store = mockStore({ auth: { user: null } });

      await store.dispatch(registerUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(registerUser.pending.type);
      expect(actions[1].type).toBe(registerUser.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('loginUser', () => {
    it('должен создавать LOGIN_USER_SUCCESS при успешном входе', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      const apiAuth = apiAuthModule.apiAuth;
      apiAuth.login.mockResolvedValue(mockAuthResponse);

      const store = mockStore({ auth: { user: null } });

      await store.dispatch(loginUser({
        email: 'test@example.com',
        password: 'password123',
      }));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(loginUser.pending.type);
      expect(actions[1].type).toBe(loginUser.fulfilled.type);
      expect(actions[1].payload).toEqual(mockUser);
    });

    it('должен создавать LOGIN_USER_REJECTED при ошибке входа', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      const apiAuth = apiAuthModule.apiAuth;
      const errorMessage = 'Login failed';
      apiAuth.login.mockRejectedValue(new Error(errorMessage));

      const store = mockStore({ auth: { user: null } });

      await store.dispatch(loginUser({
        email: 'test@example.com',
        password: 'password123',
      }));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(loginUser.pending.type);
      expect(actions[1].type).toBe(loginUser.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('logoutUser', () => {
    it('должен создавать LOGOUT_USER_SUCCESS при успешном выходе', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      const apiAuth = apiAuthModule.apiAuth;
      apiAuth.logout.mockResolvedValue({ success: true, message: 'Logged out' });

      localStorage.setItem('refreshToken', 'refresh-token');

      const store = mockStore({ auth: { user: mockUser } });

      await store.dispatch(logoutUser());

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(logoutUser.pending.type);
      expect(actions[1].type).toBe(logoutUser.fulfilled.type);
    });

    it('должен создавать LOGOUT_USER_SUCCESS даже без refreshToken', async () => {
      const store = mockStore({ auth: { user: mockUser } });

      await store.dispatch(logoutUser());

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(logoutUser.pending.type);
      expect(actions[1].type).toBe(logoutUser.fulfilled.type);
    });

    it('должен создавать LOGOUT_USER_REJECTED при ошибке выхода', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      const apiAuth = apiAuthModule.apiAuth;
      const errorMessage = 'Logout failed';
      apiAuth.logout.mockRejectedValue(new Error(errorMessage));

      localStorage.setItem('refreshToken', 'refresh-token');

      const store = mockStore({ auth: { user: mockUser } });

      await store.dispatch(logoutUser());

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(logoutUser.pending.type);
      expect(actions[1].type).toBe(logoutUser.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('fetchUser', () => {
    it('должен создавать FETCH_USER_SUCCESS при успешном получении пользователя', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      const apiAuth = apiAuthModule.apiAuth;
      apiAuth.getUser.mockResolvedValue({ success: true, user: mockUser });

      const store = mockStore({ auth: { user: null } });

      await store.dispatch(fetchUser());

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(fetchUser.pending.type);
      expect(actions[1].type).toBe(fetchUser.fulfilled.type);
      expect(actions[1].payload).toEqual(mockUser);
    });

    it('должен создавать FETCH_USER_REJECTED при ошибке получения пользователя', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      const apiAuth = apiAuthModule.apiAuth;
      const errorMessage = 'Failed to fetch user';
      apiAuth.getUser.mockRejectedValue(new Error(errorMessage));

      const store = mockStore({ auth: { user: null } });

      await store.dispatch(fetchUser());

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(fetchUser.pending.type);
      expect(actions[1].type).toBe(fetchUser.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('updateUser', () => {
    it('должен создавать UPDATE_USER_SUCCESS при успешном обновлении пользователя', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      const apiAuth = apiAuthModule.apiAuth;
      const updatedUser = {
        email: 'updated@example.com',
        name: 'Updated User',
      };
      apiAuth.updateUser.mockResolvedValue({
        success: true,
        user: updatedUser,
      });

      const store = mockStore({ auth: { user: mockUser } });

      await store.dispatch(updateUser({
        email: 'updated@example.com',
        name: 'Updated User',
      }));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(updateUser.pending.type);
      expect(actions[1].type).toBe(updateUser.fulfilled.type);
      expect(actions[1].payload).toEqual(updatedUser);
    });

    it('должен создавать UPDATE_USER_REJECTED при ошибке обновления пользователя', async () => {
      const apiAuthModule = require('@/api/apiAuth');
      const apiAuth = apiAuthModule.apiAuth;
      const errorMessage = 'Failed to update user';
      apiAuth.updateUser.mockRejectedValue(new Error(errorMessage));

      const store = mockStore({ auth: { user: mockUser } });

      await store.dispatch(updateUser({
        email: 'updated@example.com',
        name: 'Updated User',
      }));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toBe(updateUser.pending.type);
      expect(actions[1].type).toBe(updateUser.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });
  });
});
