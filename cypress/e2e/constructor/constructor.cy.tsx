import * as tokens from '../../fixtures/tokens.json';
import '../../support/commands';

const bunSelector = '[data-cy=bun]';
const mainIngredientSelector = '[data-cy=main]';
const sauceSelector = '[data-cy=sauce]';
const modalSelector = '[data-cy=modal]';
const closeModalSelector = `${modalSelector} [data-cy=close-button]`;

describe('тестирование страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', (req) => {
      req.reply({
        fixture: 'ingredients.json'
      });
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
    cy.get(bunSelector).as('bun');
  });

  it('проверка добавления ингредиентов', () => {
    cy.addIngredient(bunSelector);
    cy.addIngredient(mainIngredientSelector);
    cy.addIngredient(sauceSelector);

    const addedIngredients = [
      'Краторная булка N-200i (верх)',
      'Биокотлета из марсианской Магнолии',
      'Соус Spicy-X',
      'Краторная булка N-200i (низ)'
    ];
    addedIngredients.forEach((ingredient, i) =>
      cy
        .get('.constructor-element__text')
        .eq(i)
        .should('contain.text', ingredient)
    );
  });

  describe('тестирование модального окна ингредиента', () => {
    it('проверка открытия модального окна', () => {
      cy.get('@bun').first().click();
      cy.get(modalSelector).should('exist');
      cy.get(`${modalSelector} [data-cy='ingredient-title']`).should(
        'contain.text',
        'Краторная булка N-200i'
      );
    });

    it('проверка закрытия модального окна по клику на крестик', () => {
      cy.get('@bun').first().click();
      cy.get(closeModalSelector).click();
      cy.get(modalSelector).should('not.exist');
    });

    it('проверка закрытия модального окна по клику на оверлей', () => {
      cy.get('@bun').first().click();
      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.get(modalSelector).should('not.exist');
    });
  });

  describe('тестирование оформления заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/auth/user', (req) => {
        req.reply({
          fixture: 'user.json'
        });
      }).as('getUser');
      cy.intercept('POST', '/api/orders', (req) => {
        req.reply({
          fixture: 'order.json'
        });
      }).as('postOrder');
      cy.wait('@getUser').its('response.statusCode').should('eq', 200);
      cy.setCookie('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('проверка создания заказа', () => {
      cy.addIngredient(bunSelector);
      cy.addIngredient(mainIngredientSelector);
      cy.addIngredient(sauceSelector);
      cy.get('button').contains('Оформить заказ').click();
      cy.wait('@postOrder').its('response.statusCode').should('eq', 200);
      cy.get(`${modalSelector} [data-cy=order-number]`).should(
        'contain.text',
        '72259'
      );
      cy.get(closeModalSelector).click();
      cy.get(modalSelector).should('not.exist');
      cy.get('[data-cy=no-bun-top]').should('exist');
      cy.get('[data-cy=no-ingredients]').should('exist');
      cy.get('[data-cy=no-bun-bottom]').should('exist');
    });
  });
});
