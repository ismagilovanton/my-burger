/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Команда для drag and drop с react-dnd
Cypress.Commands.add(
    'dragTo',
    { prevSubject: 'element' },
    (subject: JQuery<HTMLElement>, target: string | JQuery<HTMLElement>) => {
        const dataTransfer = new DataTransfer();
        const targetElement = typeof target === 'string' ? cy.get(target) : cy.wrap(target);

        cy.wrap(subject)
            .trigger('mousedown', { which: 1, button: 0 })
            .trigger('dragstart', { dataTransfer });

        targetElement.then(() => {
            cy.wrap(subject).trigger('drag', { dataTransfer, force: true });

            if (typeof target === 'string') {
                cy.get(target)
                    .trigger('dragenter', { dataTransfer, force: true })
                    .trigger('dragover', { dataTransfer, force: true })
                    .trigger('drop', { dataTransfer, force: true });
            } else {
                cy.wrap(target)
                    .trigger('dragenter', { dataTransfer, force: true })
                    .trigger('dragover', { dataTransfer, force: true })
                    .trigger('drop', { dataTransfer, force: true });
            }

            cy.wrap(subject)
                .trigger('dragend', { dataTransfer, force: true })
                .trigger('mouseup', { which: 1, button: 0 });
        });
    }
);

// Команда для логина пользователя
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.request({
        method: 'POST',
        url: 'https://norma.education-services.ru/api/auth/login',
        body: {
            email,
            password,
        },
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.eq(true);

        // Сохраняем токены
        const accessToken = response.body.accessToken.split('Bearer ')[1];
        const refreshToken = response.body.refreshToken;

        cy.setCookie('accessToken', accessToken);
        window.localStorage.setItem('refreshToken', refreshToken);
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            dragTo(target: string | JQuery<HTMLElement>): Chainable<void>;
            login(email: string, password: string): Chainable<void>;
        }
    }
}
