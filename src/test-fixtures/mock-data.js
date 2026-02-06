// Тестовые данные для ингредиентов

export const MOCK_BUN = {
  _id: 'bun-1',
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
};

export const MOCK_MAIN = {
  _id: 'main-1',
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
};

export const MOCK_SAUCE = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://example.com/sauce.png',
  image_mobile: 'https://example.com/sauce-mobile.png',
  image_large: 'https://example.com/sauce-large.png',
  __v: 0,
};

export const MOCK_INGREDIENTS = [MOCK_BUN, MOCK_MAIN, MOCK_SAUCE];

// Тестовые данные для пользователя

export const MOCK_USER = {
  email: 'test@example.com',
  name: 'Test User',
};

export const MOCK_USER_UPDATED = {
  email: 'updated@example.com',
  name: 'Updated User',
};

// Тестовые данные для заказа

export const MOCK_ORDER_NUMBER = '12345';

export const MOCK_ORDER = {
  orderNumber: MOCK_ORDER_NUMBER,
};

// Тестовые данные для WebSocket заказов

export const MOCK_WS_ORDER = {
  _id: 'order-1',
  ingredients: ['ingredient-1', 'ingredient-2'],
  status: 'done',
  number: 12345,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  name: 'Order 1',
};

export const MOCK_WS_ORDER_2 = {
  _id: 'order-2',
  ingredients: ['ingredient-3'],
  status: 'pending',
  number: 12346,
  createdAt: '2024-01-01T01:00:00.000Z',
  updatedAt: '2024-01-01T01:00:00.000Z',
  name: 'Order 2',
};

export const MOCK_WS_ORDERS = [MOCK_WS_ORDER, MOCK_WS_ORDER_2];

// Тестовые сообщения об ошибках

export const ERROR_MESSAGES = {
  REGISTRATION_FAILED: 'Registration failed',
  LOGIN_FAILED: 'Login failed',
  LOGOUT_FAILED: 'Logout failed',
  FETCH_USER_FAILED: 'Failed to fetch user',
  UPDATE_USER_FAILED: 'Failed to update user',
  NETWORK_ERROR: 'Network error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  FETCH_INGREDIENTS_FAILED: 'Failed to fetch ingredients',
  CREATE_ORDER_FAILED: 'Failed to create order',
  WS_CONNECTION_ERROR: 'WebSocket connection error',
  WS_RESPONSE_ERROR: 'WebSocket response error',
};

