import * as tokens from '../../fixtures/tokens.json';

function addIngredient(selector: string) {
  cy.get(`${selector} > button`).first().click();
}

describe('тестирование страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', (req) => {
      req.reply({
        fixture: 'ingredients.json'
      });
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
  });

  it('проверка добавления ингредиентов', () => {
    addIngredient('[data-cy=bun]');
    addIngredient('[data-cy=main]');
    addIngredient('[data-cy=sauce]');

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
      cy.get('[data-cy=bun]').first().click();
      cy.get('[data-cy=modal]').should('exist');
      cy.get('[data-cy=modal] .text').should(
        'contain.text',
        'Краторная булка N-200i'
      );
    });

    it('проверка закрытия модального окна по клику на крестик', () => {
      cy.get('[data-cy=bun]').first().click();
      cy.get('[data-cy=modal] button').click();
      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('проверка закрытия модального окна по клику на оверлей', () => {
      cy.get('[data-cy=bun]').first().click();
      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.get('[data-cy=modal]').should('not.exist');
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
      addIngredient('[data-cy=bun]');
      addIngredient('[data-cy=main]');
      addIngredient('[data-cy=sauce]');
      cy.get('button').contains('Оформить заказ').click();
      cy.wait('@postOrder').its('response.statusCode').should('eq', 200);
      cy.get('[data-cy=modal] h2').should('contain.text', '72259');
      cy.get('[data-cy=modal] button').click();
      cy.get('[data-cy=modal]').should('not.exist');
      cy.get('[data-cy=no-bun-top]').should('exist');
      cy.get('[data-cy=no-ingredients]').should('exist');
      cy.get('[data-cy=no-bun-bottom]').should('exist');
    });
  });
});
