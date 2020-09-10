describe('Logging In', () => {

});

describe('Signing Up', () => {
    beforeEach(() => {
        cy.wipeDatabase();
        cy.visit('#/login');
    });

    it('Successfully signs up and navigates to home page', () => {
        cy.get('[data-cy=switch-mode]').click();
        cy.get('[data-cy=username]').type('myCustomUsername@gmail.com');
        cy.get('[data-cy=password]').type('passwordLongerThanEight');
        cy.get('[data-cy=submit]').click();

        // Should have redirected to homepage
        cy.hash().should('eq', '#/');
    });
});