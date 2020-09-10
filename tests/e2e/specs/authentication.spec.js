const validEmail = "myCustomEmail@gmail.com";
const validPassword = "passwordLongerThanEight";

function assertSuccessfulAuth(email, password) {
    cy.hash().should('eq', '#/');
    // Check store.auth.authenticated and .email
}

function assertFailedAuth() {
    cy.hash().should('eq', '#/login');
    // Check store.auth.authenticated and .email
}

describe('Logging In', () => {
    beforeEach(() => {
        cy.wipeDatabase();
        cy.visit('#/login');
        cy.signup(validEmail, validPassword);
    });

    /**
     * Successful Logins
     */
    it('Can log into existing account with submit button', () => {
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=password]').type(validPassword);
        cy.get('[data-cy=submit]').click();
        // Should have redirected to homepage
        // cy.hash().should('eq', '#/');
        assertSuccessfulAuth();
    });
    it('Can login via enter key in email', () => {
        cy.get('[data-cy=password]').type(validPassword);
        cy.get('[data-cy=username]').type(validEmail + '{enter}');
        cy.hash().should('eq', '#/');
    });
    it('Can login via enter key in password', () => {
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=password]').type(validPassword + '{enter}');
        cy.hash().should('eq', '#/');
    });

    /**
     * Rejected logins
     */
    it('Rejects login before signup', () => {
        cy.get('[data-cy=username]').type('unRegisteredEmail@aol.gov');
        cy.get('[data-cy=password]').type(validPassword);
        cy.get('[data-cy=submit]').click();
        assertFailedAuth();
    });

    it('Rejects incorrect password', () => {
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=password]').type('incorrectPw');
        cy.get('[data-cy=submit]').click();
        assertFailedAuth();
    });
});

describe('Signing Up', () => {
    beforeEach(() => {
        cy.wipeDatabase();
        cy.visit('#/login');
        cy.get('[data-cy=switch-mode]').click(); // Switch to signup
    });

    /**
     * Successful Signups
     */
    it('Successfully signs up and navigates to home page', () => {
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=password]').type(validPassword);
        cy.get('[data-cy=submit]').click();
        // Should have redirected to homepage
        cy.hash().should('eq', '#/');
    });

    it('Signs up by pressing enter on the email field', () => {
        cy.get('[data-cy=password]').type(validPassword);
        cy.get('[data-cy=username]').type(validEmail + '{enter}');
        cy.hash().should('eq', '#/');
    });

    it('Signs up by pressing enter on the password field', () => {
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=password]').type(validPassword + '{enter}');
        cy.hash().should('eq', '#/');
    });

    /**
     * Rejected Signups
     */
    it('Requires password to be at least eight characters', () => {
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=password]').type('sh0rt');
        cy.get('[data-cy=submit]').click();
        // Should have failed - stayed on this page
        cy.hash().should('eq', '#/login');
    });

    it('Requires valid email', () => {
        cy.get('[data-cy=username]').type('incompleteEmail');
        cy.get('[data-cy=password]').type(validPassword);
        // Should have failed - stayed on this page
        cy.hash().should('eq', '#/login');
    });

    it('Password is required', () => {
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=submit]').click();
        cy.hash().should('eq', '#/login');
    });

    it('Email is required', () => {
        cy.get('[data-cy=password]').type(validPassword);
        cy.get('[data-cy=submit]').click();
        cy.hash().should('eq', '#/login');
    });

    it('Rejects signup if username already exists', () => {
        cy.signup(validEmail, validPassword);
        cy.get('[data-cy=username]').type(validEmail);
        cy.get('[data-cy=password]').type(validPassword);
        cy.get('[data-cy=submit]').click();
        cy.hash().should('eq', '#/login');
    });
});