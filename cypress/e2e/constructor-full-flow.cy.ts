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

describe('Полный путь пользователя: от сбора бургера до получения информации о заказе', () => {
  beforeEach(() => {
    // Мокируем все API endpoints
    cy.intercept('GET', API_ROUTES.ingredients, INGREDIENTS_RESPONSE).as(
      'getIngredients'
    );
    cy.intercept('POST', API_ROUTES.login, LOGIN_RESPONSE).as('login');
    cy.intercept('POST', API_ROUTES.orders, ORDER_RESPONSE).as('createOrder');
    cy.intercept('GET', API_ROUTES.user, USER_RESPONSE).as('getUser');
    cy.intercept('POST', API_ROUTES.token, TOKEN_RESPONSE).as('refreshToken');
  });

  it('должен пройти полный путь: авторизация → сбор бургера → создание заказа → просмотр информации о заказе', () => {
    // Шаг 1: Переходим на главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');

    // Проверяем, что страница загрузилась
    cy.contains(TEXT.pageTitle).should('be.visible');
    cy.contains(TEST_BUN.name).should('be.visible');

    // Шаг 2: Просматриваем детали ингредиента (модальное окно)
    cy.contains(TEST_BUN.name).closest(SELECTORS.ingredientCard).click();

    // Проверяем модальное окно
    cy.get(SELECTORS.modal).should('be.visible');
    cy.contains(TEXT.ingredientDetails).should('be.visible');
    cy.contains(TEST_BUN.name).should('be.visible');
    cy.contains(TEXT.nutritionLabels.caloriesWithUnit).should('be.visible');
    cy.contains(TEST_BUN.calories.toString()).should('be.visible');

    // Закрываем модальное окно
    cy.get(SELECTORS.closeButton).click();
    cy.get(SELECTORS.modal).should('not.exist');

    // Шаг 3: Перетаскиваем булку в конструктор
    const dataTransfer1 = new DataTransfer();
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

    // Проверяем, что булка появилась в конструкторе
    cy.contains(TEXT.bunTop(TEST_BUN.name)).should('be.visible');
    cy.contains(TEXT.bunBottom(TEST_BUN.name)).should('be.visible');

    // Шаг 4: Перетаскиваем начинку в конструктор
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

    // Шаг 5: Перетаскиваем соус в конструктор
    const dataTransfer3 = new DataTransfer();
    cy.contains(TEST_SAUCE.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer3 });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer: dataTransfer3 })
      .trigger('dragover', { dataTransfer: dataTransfer3 })
      .trigger('drop', { dataTransfer: dataTransfer3 });

    cy.contains(TEST_SAUCE.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer: dataTransfer3 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Проверяем наличие соуса в конструкторе
    cy.contains(TEST_SAUCE.name).should('be.visible');

    // Шаг 6: Проверяем общую цену (2510 + 424 + 90 = 3024)
    cy.contains(PRICES.bunPlusMainPlusSauce.toString()).should('be.visible');

    // Шаг 7: Пытаемся создать заказ (должны быть перенаправлены на логин)
    cy.contains(TEXT.submitOrder).click();
    cy.url().should('include', '/login');

    // Шаг 8: Авторизуемся
    cy.get(SELECTORS.emailInput).type(TEST_USER.email);
    cy.get(SELECTORS.passwordInput).type(TEST_USER.password);
    cy.get(SELECTORS.submitButton).click();
    cy.wait('@login');

    // Шаг 9: После успешного логина нас редиректит обратно на главную
    cy.url().should('eq', 'http://localhost:5173/');
    cy.wait('@getIngredients');

    // Шаг 10: Снова собираем бургер
    const dataTransfer4 = new DataTransfer();
    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer4 });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer: dataTransfer4 })
      .trigger('dragover', { dataTransfer: dataTransfer4 })
      .trigger('drop', { dataTransfer: dataTransfer4 });

    cy.contains(TEST_BUN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer: dataTransfer4 })
      .trigger('mouseup', { which: 1, button: 0 });

    const dataTransfer5 = new DataTransfer();
    cy.contains(TEST_MAIN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer5 });

    cy.get(SELECTORS.constructorZone)
      .trigger('dragenter', { dataTransfer: dataTransfer5 })
      .trigger('dragover', { dataTransfer: dataTransfer5 })
      .trigger('drop', { dataTransfer: dataTransfer5 });

    cy.contains(TEST_MAIN.name)
      .closest(SELECTORS.ingredientCard)
      .trigger('dragend', { dataTransfer: dataTransfer5 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Шаг 11: Создаем заказ
    cy.contains(TEXT.submitOrder).click();
    cy.wait('@createOrder');

    // Шаг 12: Проверяем модальное окно с информацией о заказе
    cy.get(SELECTORS.modal).should('be.visible');
    cy.contains(TEST_ORDER_INFO.number.toString()).should('be.visible');
    cy.contains(TEXT.orderIdentifier).should('be.visible');
    cy.contains(TEXT.orderStarted).should('be.visible');
    cy.contains(TEXT.waitOnStation).should('be.visible');

    // Шаг 13: Закрываем модальное окно
    cy.get(SELECTORS.closeButton).click();
    cy.get(SELECTORS.modal).should('not.exist');

    // Шаг 14: Проверяем, что конструктор очистился
    cy.contains(TEXT.bunTop(TEST_BUN.name)).should('not.exist');
    // Проверяем, что начинки нет в зоне конструктора (но она есть в списке ингредиентов)
    cy.get(SELECTORS.constructorZone).contains(TEST_MAIN.name).should('not.exist');
  });
});
