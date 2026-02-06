// API пути (с wildcard для перехвата любого базового URL)
export const API_ROUTES = {
  ingredients: '**/api/ingredients',
  login: '**/api/auth/login',
  orders: '**/api/orders',
  user: '**/api/auth/user',
  token: '**/api/auth/token',
};

// Тестовые ингредиенты
export const TEST_BUN = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
};

export const TEST_MAIN = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  __v: 0,
};

export const TEST_SAUCE = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  __v: 0,
};

export const TEST_INGREDIENTS = [TEST_BUN, TEST_MAIN, TEST_SAUCE];

// Мок-ответ для получения ингредиентов
export const INGREDIENTS_RESPONSE = {
  statusCode: 200,
  body: {
    success: true,
    data: TEST_INGREDIENTS,
  },
};

// Тестовый пользователь (данные для ответа API)
export const TEST_USER_INFO = {
  email: 'oldvertu@gmail.com',
  name: 'Test User',
};

// Тестовый пользователь (с паролем для авторизации)
export const TEST_USER = {
  ...TEST_USER_INFO,
  password: '10091998A',
};

// Токены для авторизации
export const AUTH_TOKENS = {
  accessToken: 'Bearer test-access-token',
  refreshToken: 'test-refresh-token',
};

// Мок-ответ для логина
export const LOGIN_RESPONSE = {
  statusCode: 200,
  body: {
    success: true,
    ...AUTH_TOKENS,
    user: { ...TEST_USER_INFO },
  },
};

// Мок-ответ для получения пользователя
export const USER_RESPONSE = {
  statusCode: 200,
  body: {
    success: true,
    user: { ...TEST_USER_INFO },
  },
};

// Мок-ответ для обновления токена
export const TOKEN_RESPONSE = {
  statusCode: 200,
  body: {
    success: true,
    ...AUTH_TOKENS,
  },
};

// Тестовый заказ (номер)
export const TEST_ORDER_INFO = {
  number: 12345,
};

// Тестовый заказ (полные данные ответа)
export const TEST_ORDER = {
  name: 'Краторный space бургер',
  order: { ...TEST_ORDER_INFO },
};

// Мок-ответ для создания заказа
export const ORDER_RESPONSE = {
  statusCode: 200,
  body: {
    success: true,
    ...TEST_ORDER,
  },
};

// Вычисляемые цены
export const PRICES = {
  bunTotal: TEST_BUN.price * 2, // 2510 (булка сверху и снизу)
  bunPlusMain: TEST_BUN.price * 2 + TEST_MAIN.price, // 2934
  bunPlusMainPlusSauce: TEST_BUN.price * 2 + TEST_MAIN.price + TEST_SAUCE.price, // 3024
};

// Селекторы
export const SELECTORS = {
  constructorZone: '[class*="burger_constructor"]',
  ingredientCard: '[class*="card"]',
  modal: '[role="dialog"]',
  closeButton: '[aria-label="Закрыть"]',
  submitButton: 'button[type="submit"]',
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
};

// Текстовые константы для UI
export const TEXT = {
  pageTitle: 'Соберите бургер',
  submitOrder: 'Оформить заказ',
  ingredientDetails: 'Детали ингредиента',
  orderIdentifier: 'идентификатор заказа',
  orderStarted: 'Ваш заказ начали готовить',
  waitOnStation: 'Дождитесь готовности на орбитальной станции',
  categories: {
    buns: 'Булки',
    mains: 'Начинки',
    sauces: 'Соусы',
  },
  nutritionLabels: {
    calories: 'Калории',
    caloriesWithUnit: 'Калории, ккал',
    proteins: 'Белки',
    fat: 'Жиры',
    carbohydrates: 'Углеводы',
  },
  bunTop: (name: string): string => `${name} (верх)`,
  bunBottom: (name: string): string => `${name} (низ)`,
};
