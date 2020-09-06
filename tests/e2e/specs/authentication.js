describe('Logging In', () => {
    
});

describe('Signing Up', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Successfully signs up and navigates to home page', () => {
        cy.get('[data-cy=switch-mode]').click();
        cy.get('[data-cy=username]').type('myCustomUsername@gmail.com');
        cy.get('[data-cy=password]').type('passwordLongerThanEight');
        cy.get('[data-cy=submit]').click();
    });
});