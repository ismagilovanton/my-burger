/// <reference types="cypress" />

describe('Конструктор бургера', () => {
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

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен отображать список ингредиентов', () => {
    cy.contains('Соберите бургер').should('be.visible');
    cy.contains('Булки').should('be.visible');
    cy.contains('Начинки').should('be.visible');
    cy.contains('Соусы').should('be.visible');

    // Проверяем наличие ингредиентов
    cy.contains('Краторная булка N-200i').should('be.visible');
    cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
    cy.contains('Соус Spicy-X').should('be.visible');
  });

  it('должен перетаскивать ингредиент в конструктор', () => {
    // Находим карточку ингредиента
    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .as('ingredientCard');

    // Находим зону конструктора
    cy.get('[class*="burger_constructor"]').as('constructorZone');

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
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
  });

  it('должен добавлять начинку в конструктор', () => {
    const dataTransfer = new DataTransfer();

    // Сначала добавляем булку
    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer });

    cy.get('[class*="burger_constructor"]')
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });

    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('dragend', { dataTransfer })
      .trigger('mouseup', { which: 1, button: 0 });

    // Добавляем начинку
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
  });

  it('должен открывать модальное окно при клике на ингредиент', () => {
    cy.contains('Краторная булка N-200i').closest('[class*="card"]').click();

    // Проверяем, что модальное окно открылось
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');

    // Проверяем отображение данных ингредиента
    cy.contains('Калории').should('be.visible');
    cy.contains('420').should('be.visible'); // calories
    cy.contains('Белки').should('be.visible');
    cy.contains('80').should('be.visible'); // proteins
    cy.contains('Жиры').should('be.visible');
    cy.contains('24').should('be.visible'); // fat
    cy.contains('Углеводы').should('be.visible');
    cy.contains('53').should('be.visible'); // carbohydrates

    // Закрываем модальное окно
    cy.get('[aria-label="Закрыть"]').click();
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('должен перенаправлять на страницу логина при попытке создать заказ без авторизации', () => {
    const dataTransfer = new DataTransfer();

    // Добавляем ингредиенты
    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer });

    cy.get('[class*="burger_constructor"]')
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });

    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('dragend', { dataTransfer })
      .trigger('mouseup', { which: 1, button: 0 });

    // Пытаемся создать заказ
    cy.contains('Оформить заказ').click();

    // Должны быть перенаправлены на страницу логина
    cy.url().should('include', '/login');
  });

  it('должен создавать заказ после авторизации', () => {
    // Мокируем API для логина
    cy.intercept('POST', 'https://norma.education-services.ru/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'Bearer test-token',
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

    // Авторизуемся
    cy.visit('/login');
    cy.get(
      'input[type="email"], input[placeholder*="E-mail"], input[placeholder*="email"]'
    )
      .first()
      .type('test@example.com');
    cy.get(
      'input[type="password"], input[placeholder*="Пароль"], input[placeholder*="password"]'
    )
      .first()
      .type('password123');
    cy.get('button[type="submit"], button:contains("Войти")').first().click();
    cy.wait('@login');

    // Возвращаемся на главную
    cy.visit('/');
    cy.wait('@getIngredients');

    const dataTransfer1 = new DataTransfer();
    const dataTransfer2 = new DataTransfer();

    // Добавляем булку
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

    // Добавляем начинку
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

    // Создаем заказ
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Проверяем, что модальное окно с номером заказа открылось
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('12345').should('be.visible');
    cy.contains('идентификатор заказа').should('be.visible');
  });

  it('должен закрывать модальное окно заказа', () => {
    // Мокируем API
    cy.intercept('POST', 'https://norma.education-services.ru/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'Bearer test-token',
        refreshToken: 'test-refresh-token',
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
      },
    }).as('login');

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

    // Авторизуемся
    cy.visit('/login');
    cy.get(
      'input[type="email"], input[placeholder*="E-mail"], input[placeholder*="email"]'
    )
      .first()
      .type('test@example.com');
    cy.get(
      'input[type="password"], input[placeholder*="Пароль"], input[placeholder*="password"]'
    )
      .first()
      .type('password123');
    cy.get('button[type="submit"], button:contains("Войти")').first().click();
    cy.wait('@login');

    cy.visit('/');
    cy.wait('@getIngredients');

    const dataTransfer = new DataTransfer();

    // Добавляем ингредиенты
    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer });

    cy.get('[class*="burger_constructor"]')
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });

    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('dragend', { dataTransfer })
      .trigger('mouseup', { which: 1, button: 0 });

    // Создаем заказ
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Закрываем модальное окно
    cy.get('[aria-label="Закрыть"]').click();
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('должен закрывать модальное окно по нажатию Escape', () => {
    // Мокируем API
    cy.intercept('POST', 'https://norma.education-services.ru/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'Bearer test-token',
        refreshToken: 'test-refresh-token',
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
      },
    }).as('login');

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

    // Авторизуемся
    cy.visit('/login');
    cy.get(
      'input[type="email"], input[placeholder*="E-mail"], input[placeholder*="email"]'
    )
      .first()
      .type('test@example.com');
    cy.get(
      'input[type="password"], input[placeholder*="Пароль"], input[placeholder*="password"]'
    )
      .first()
      .type('password123');
    cy.get('button[type="submit"], button:contains("Войти")').first().click();
    cy.wait('@login');

    cy.visit('/');
    cy.wait('@getIngredients');

    const dataTransfer = new DataTransfer();

    // Добавляем ингредиенты
    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('dragstart', { dataTransfer });

    cy.get('[class*="burger_constructor"]')
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });

    cy.contains('Краторная булка N-200i')
      .closest('[class*="card"]')
      .trigger('dragend', { dataTransfer })
      .trigger('mouseup', { which: 1, button: 0 });

    // Создаем заказ
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Закрываем модальное окно по Escape
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('должен показывать правильную цену заказа', () => {
    const dataTransfer1 = new DataTransfer();
    const dataTransfer2 = new DataTransfer();

    // Добавляем булку (цена 1255, умножается на 2 = 2510)
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

    // Добавляем начинку (цена 424)
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

    // Проверяем общую цену (2510 + 424 = 2934)
    cy.contains('2934').should('be.visible');
  });
});
