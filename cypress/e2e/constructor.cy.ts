/// <reference types="cypress" />

import {
  API_ROUTES,
  TEST_BUN,
  TEST_MAIN,
  TEST_SAUCE,
  INGREDIENTS_RESPONSE,
  LOGIN_RESPONSE,
  ORDER_RESPONSE,
  USER_RESPONSE,
  TOKEN_RESPONSE,
  TEST_USER,
  TEST_ORDER_INFO,
  PRICES,
  SELECTORS,
  TEXT,
} from '../fixtures/test-data';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Мокируем все API endpoints
    cy.intercept('GET', API_ROUTES.ingredients, INGREDIENTS_RESPONSE).as(
      'getIngredients'
    );
    cy.intercept('GET', API_ROUTES.user, USER_RESPONSE).as('getUser');
    cy.intercept('POST', API_ROUTES.token, TOKEN_RESPONSE).as('refreshToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен отображать список ингредиентов', () => {
    cy.contains(TEXT.pageTitle).should('be.visible');
    cy.contains(TEXT.categories.buns).should('be.visible');
    cy.contains(TEXT.categories.mains).should('be.visible');
    cy.contains(TEXT.categories.sauces).should('be.visible');

    // Проверяем наличие ингредиентов (используем exist, т.к. они могут быть в скролле)
    cy.contains(TEST_BUN.name).should('exist');
    cy.contains(TEST_MAIN.name).should('exist');
    cy.contains(TEST_SAUCE.name).should('exist');
  });

  it('должен перетаскивать ингредиент в конструктор', () => {
    // Находим карточку ингредиента
    cy.contains(TEST_BUN.name).closest(SELECTORS.ingredientCard).as('ingredientCard');

    // Находим зону конструктора
    cy.get(SELECTORS.constructorZone).as('constructorZone');

    // Выполняем drag and drop
    cy.get('@ingredientCard')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: new DataTransfer() });

    cy.get('@constructorZone')
      .trigger('dragenter', { dataTransfer: new DataTransfer() })
      .trigger('dragover', { dataTransfer: new DataTransfer() })
      .trigger('drop', { dataTransfer: new DataTransfer() });

    cy.get('@ingredientCard')
      .trigger('dragend', { dataTransfer: new DataTransfer() })
      .trigger('mouseup', { which: 1, button: 0 });

    // Проверяем, что булка появилась в конструкторе
    cy.contains(TEXT.bunTop(TEST_BUN.name)).should('be.visible');
    cy.contains(TEXT.bunBottom(TEST_BUN.name)).should('be.visible');
  });

  it('должен добавлять начинку в конструктор', () => {
    const dataTransfer = new DataTransfer();

    // Сначала добавляем булку
    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });

    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer })
      .trigger('mouseup', { which: 1, button: 0 });

    // Добавляем начинку
    const dataTransfer2 = new DataTransfer();
    cy.contains(TEST_MAIN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer2 });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer: dataTransfer2 })
      .trigger('dragover', { dataTransfer: dataTransfer2 })
      .trigger('drop', { dataTransfer: dataTransfer2 });

    cy.contains(TEST_MAIN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer: dataTransfer2 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Проверяем наличие начинки в конструкторе
    cy.contains(TEST_MAIN.name).should('be.visible');
  });

  it('должен открывать модальное окно при клике на ингредиент', () => {
    cy.contains(TEST_BUN.name).closest(SELECTORS.ingredientCard).click();

    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.modal).should('be.visible');
    cy.contains(TEXT.ingredientDetails).should('be.visible');
    cy.contains(TEST_BUN.name).should('be.visible');

    // Проверяем отображение данных ингредиента
    cy.contains(TEXT.nutritionLabels.calories).should('be.visible');
    cy.contains(TEST_BUN.calories.toString()).should('be.visible');
    cy.contains(TEXT.nutritionLabels.proteins).should('be.visible');
    cy.contains(TEST_BUN.proteins.toString()).should('be.visible');
    cy.contains(TEXT.nutritionLabels.fat).should('be.visible');
    cy.contains(TEST_BUN.fat.toString()).should('be.visible');
    cy.contains(TEXT.nutritionLabels.carbohydrates).should('be.visible');
    cy.contains(TEST_BUN.carbohydrates.toString()).should('be.visible');

    // Закрываем модальное окно
    cy.get(SELECTORS.closeButton).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('должен перенаправлять на страницу логина при попытке создать заказ без авторизации', () => {
    const dataTransfer = new DataTransfer();

    // Добавляем ингредиенты
    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });

    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer })
      .trigger('mouseup', { which: 1, button: 0 });

    // Пытаемся создать заказ
    cy.contains(TEXT.submitOrder).click();

    // Должны быть перенаправлены на страницу логина
    cy.url().should('include', '/login');
  });

  it('должен создавать заказ после авторизации', () => {
    // Мокируем API для логина
    cy.intercept('POST', API_ROUTES.login, LOGIN_RESPONSE).as('login');

    // Мокируем API для создания заказа
    cy.intercept('POST', API_ROUTES.orders, ORDER_RESPONSE).as('createOrder');

    // Авторизуемся
    cy.visit('/login');
    cy.get(SELECTORS.emailInput).type(TEST_USER.email);
    cy.get(SELECTORS.passwordInput).type(TEST_USER.password);
    cy.get(SELECTORS.submitButton).click();
    cy.wait('@login');

    // После успешного логина приложение само редиректит на главную или откуда пришли
    // Ждём редирект и загрузку ингредиентов
    cy.url().should('eq', 'http://localhost:5173/');
    cy.wait('@getIngredients');

    const dataTransfer1 = new DataTransfer();
    const dataTransfer2 = new DataTransfer();

    // Добавляем булку
    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer1 });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer: dataTransfer1 })
      .trigger('dragover', { dataTransfer: dataTransfer1 })
      .trigger('drop', { dataTransfer: dataTransfer1 });

    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer: dataTransfer1 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Добавляем начинку
    cy.contains(TEST_MAIN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer2 });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer: dataTransfer2 })
      .trigger('dragover', { dataTransfer: dataTransfer2 })
      .trigger('drop', { dataTransfer: dataTransfer2 });

    cy.contains(TEST_MAIN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer: dataTransfer2 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Создаем заказ
    cy.contains(TEXT.submitOrder).click();
    cy.wait('@createOrder');

    // Проверяем, что модальное окно с номером заказа открылось
    cy.get(SELECTORS.modal).should('be.visible');
    cy.contains(TEST_ORDER_INFO.number.toString()).should('be.visible');
    cy.contains(TEXT.orderIdentifier).should('be.visible');
  });

  it('должен закрывать модальное окно заказа', () => {
    // Мокируем API
    cy.intercept('POST', API_ROUTES.login, LOGIN_RESPONSE).as('login');
    cy.intercept('POST', API_ROUTES.orders, ORDER_RESPONSE).as('createOrder');

    // Авторизуемся
    cy.visit('/login');
    cy.get(SELECTORS.emailInput).type(TEST_USER.email);
    cy.get(SELECTORS.passwordInput).type(TEST_USER.password);
    cy.get(SELECTORS.submitButton).click();
    cy.wait('@login');

    // После успешного логина ждём редирект
    cy.url().should('eq', 'http://localhost:5173/');
    cy.wait('@getIngredients');

    const dataTransfer = new DataTransfer();

    // Добавляем ингредиенты
    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });

    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer })
      .trigger('mouseup', { which: 1, button: 0 });

    // Создаем заказ
    cy.contains(TEXT.submitOrder).click();
    cy.wait('@createOrder');

    // Закрываем модальное окно
    cy.get(SELECTORS.closeButton).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('должен закрывать модальное окно по нажатию Escape', () => {
    // Мокируем API
    cy.intercept('POST', API_ROUTES.login, LOGIN_RESPONSE).as('login');
    cy.intercept('POST', API_ROUTES.orders, ORDER_RESPONSE).as('createOrder');

    // Авторизуемся
    cy.visit('/login');
    cy.get(SELECTORS.emailInput).type(TEST_USER.email);
    cy.get(SELECTORS.passwordInput).type(TEST_USER.password);
    cy.get(SELECTORS.submitButton).click();
    cy.wait('@login');

    // После успешного логина ждём редирект
    cy.url().should('eq', 'http://localhost:5173/');
    cy.wait('@getIngredients');

    const dataTransfer = new DataTransfer();

    // Добавляем ингредиенты
    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });

    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer })
      .trigger('mouseup', { which: 1, button: 0 });

    // Создаем заказ
    cy.contains(TEXT.submitOrder).click();
    cy.wait('@createOrder');

    // Закрываем модальное окно по Escape
    cy.get('body').type('{esc}');
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('должен показывать правильную цену заказа', () => {
    const dataTransfer1 = new DataTransfer();
    const dataTransfer2 = new DataTransfer();

    // Добавляем булку (цена 1255, умножается на 2 = 2510)
    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer1 });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer: dataTransfer1 })
      .trigger('dragover', { dataTransfer: dataTransfer1 })
      .trigger('drop', { dataTransfer: dataTransfer1 });

    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer: dataTransfer1 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Добавляем начинку (цена 424)
    cy.contains(TEST_MAIN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer2 });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer: dataTransfer2 })
      .trigger('dragover', { dataTransfer: dataTransfer2 })
      .trigger('drop', { dataTransfer: dataTransfer2 });

    cy.contains(TEST_MAIN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer: dataTransfer2 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Проверяем общую цену (2510 + 424 = 2934)
    cy.contains(PRICES.bunPlusMain.toString()).should('be.visible');
  });
});
