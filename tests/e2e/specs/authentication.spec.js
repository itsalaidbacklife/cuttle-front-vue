const validEmail = "myCustomEmail@gmail.com";
const validPassword = "passwordLongerThanEight";

describe('Logging In', () => {

});

describe('Signing Up', () => {
    beforeEach(() => {
        cy.wipeDatabase();
        cy.visit('#/login');
        cy.get('[data-cy=switch-mode]').click(); // Switch to signup
    });

    it('Successfully signs up and navigates to home page', () => {
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=password]').type(validPassword);
        cy.get('[data-cy=submit]').click();

        // Should have redirected to homepage
        cy.hash().should('eq', '#/');
    });

    it('Signs up by pressing enter on the email field', () => {

    });

    it('Signs up by pressing enter on the password field', () => {
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=password]').type(validPassword + '{enter}');
        cy.hash().should('eq', '#/');
    });

    it('Requires password to be at least eight characters', () => {

    });

    it('Requires valid email', () => {

    });

    it('Password is required', () => {

    });

    it('Email is required', () => {

    });
});