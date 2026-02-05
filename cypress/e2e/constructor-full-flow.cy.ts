/// <reference types="cypress" />

describe('Полный путь пользователя: от сбора бургера до получения информации о заказе', () => {
  beforeEach(() => {
    // Мокируем API для получения ингредиентов
    cy.intercept('GET', 'https://norma.education-services.ru/api/ingredients', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
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
          },
          {
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
          },
          {
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
          },
        ],
      },
    }).as('getIngredients');

    // Мокируем API для логина
    cy.intercept('POST', 'https://norma.education-services.ru/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'Bearer test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
      },
    }).as('login');

    // Мокируем API для создания заказа
    cy.intercept('POST', 'https://norma.education-services.ru/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Краторный space бургер',
        order: {
          number: 12345,
        },
      },
    }).as('createOrder');
  });

  it('должен пройти полный путь: авторизация → сбор бургера → создание заказа → просмотр информации о заказе', () => {
    // Шаг 1: Переходим на главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');

    // Проверяем, что страница загрузилась
    cy.contains('Соберите бургер').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');

    // Шаг 2: Просматриваем детали ингредиента (модальное окно)
    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .click();

    // Проверяем модальное окно
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');
    cy.contains('Калории, ккал').should('be.visible');
    cy.contains('420').should('be.visible');

    // Закрываем модальное окно
    cy.get('[aria-label="Закрыть"]').click();
    cy.get('[role="dialog"]').should('not.exist');

    // Шаг 3: Перетаскиваем булку в конструктор
    const dataTransfer1 = new DataTransfer();
    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer1 });

    cy.get('[class*="burger_constructor"]')
      .trigger('dragenter', { dataTransfer: dataTransfer1 })
      .trigger('dragover', { dataTransfer: dataTransfer1 })
      .trigger('drop', { dataTransfer: dataTransfer1 });

    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('dragend', { dataTransfer: dataTransfer1 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Проверяем, что булка появилась в конструкторе
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');

    // Шаг 4: Перетаскиваем начинку в конструктор
    const dataTransfer2 = new DataTransfer();
    cy.contains('Биокотлета из марсианской Магнолии')
      .closest('[class*="card"]')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer2 });

    cy.get('[class*="burger_constructor"]')
      .trigger('dragenter', { dataTransfer: dataTransfer2 })
      .trigger('dragover', { dataTransfer: dataTransfer2 })
      .trigger('drop', { dataTransfer: dataTransfer2 });

    cy.contains('Биокотлета из марсианской Магнолии')
      .closest('[class*="card"]')
      .trigger('dragend', { dataTransfer: dataTransfer2 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Проверяем наличие начинки в конструкторе
    cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');

    // Шаг 5: Перетаскиваем соус в конструктор
    const dataTransfer3 = new DataTransfer();
    cy.contains('Соус Spicy-X')
      .closest('[class*="card"]')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer3 });

    cy.get('[class*="burger_constructor"]')
      .trigger('dragenter', { dataTransfer: dataTransfer3 })
      .trigger('dragover', { dataTransfer: dataTransfer3 })
      .trigger('drop', { dataTransfer: dataTransfer3 });

    cy.contains('Соус Spicy-X')
      .closest('[class*="card"]')
      .trigger('dragend', { dataTransfer: dataTransfer3 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Проверяем наличие соуса в конструкторе
    cy.contains('Соус Spicy-X').should('be.visible');

    // Шаг 6: Проверяем общую цену (2510 + 424 + 90 = 3024)
    cy.contains('3024').should('be.visible');

    // Шаг 7: Пытаемся создать заказ (должны быть перенаправлены на логин)
    cy.contains('Оформить заказ').click();
    cy.url().should('include', '/login');

    // Шаг 8: Авторизуемся
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');

    // Шаг 9: Возвращаемся на главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');

    // Шаг 10: Снова собираем бургер
    const dataTransfer4 = new DataTransfer();
    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer4 });

    cy.get('[class*="burger_constructor"]')
      .trigger('dragenter', { dataTransfer: dataTransfer4 })
      .trigger('dragover', { dataTransfer: dataTransfer4 })
      .trigger('drop', { dataTransfer: dataTransfer4 });

    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('dragend', { dataTransfer: dataTransfer4 })
      .trigger('mouseup', { which: 1, button: 0 });

    const dataTransfer5 = new DataTransfer();
    cy.contains('Биокотлета из марсианской Магнолии')
      .closest('[class*="card"]')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer: dataTransfer5 });

    cy.get('[class*="burger_constructor"]')
      .trigger('dragenter', { dataTransfer: dataTransfer5 })
      .trigger('dragover', { dataTransfer: dataTransfer5 })
      .trigger('drop', { dataTransfer: dataTransfer5 });

    cy.contains('Биокотлета из марсианской Магнолии')
      .closest('[class*="card"]')
      .trigger('dragend', { dataTransfer: dataTransfer5 })
      .trigger('mouseup', { which: 1, button: 0 });

    // Шаг 11: Создаем заказ
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Шаг 12: Проверяем модальное окно с информацией о заказе
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('12345').should('be.visible');
    cy.contains('идентификатор заказа').should('be.visible');
    cy.contains('Ваш заказ начали готовить').should('be.visible');
    cy.contains('Дождитесь готовности на орбитальной станции').should('be.visible');

    // Шаг 13: Закрываем модальное окно
    cy.get('[aria-label="Закрыть"]').click();
    cy.get('[role="dialog"]').should('not.exist');

    // Шаг 14: Проверяем, что конструктор очистился
    cy.contains('Краторная булка N-200i (верх)').should('not.exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
  });
});


