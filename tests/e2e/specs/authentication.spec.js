const validEmail = 'myCustomEmail@gmail.com';
const validPassword = 'passwordLongerThanEight';

function assertSuccessfulAuth(email) {
	// Confirm we have navigated to home
	cy.hash().should('eq', '#/');
	// Check store auth data
	cy.window().its('app.$store.state.auth').as('authState')
		.then((authState) => {
			expect(authState.authenticated).to.eq(true);
			expect(authState.email).to.eq(email);
		});
}

function assertFailedAuth() {
	// Confirm we have not navigated away from login/signup
	cy.hash().should('eq', '#/login');
	// Check store auth data
	cy.window().its('app.$store.state.auth').as('authState')
		.then((authState) => {
			expect(authState.authenticated).to.eq(false);
			expect(authState.email).to.eq(null);
		});
}

describe('Auth - Page Content', () => {
	beforeEach(() => {
		cy.wipeDatabase();
		cy.visit('#/login');
		cy.signupOpponent(validEmail, validPassword);
	});

	it('Displays logo', () => {
		cy.get('#logo')
	});
})

describe('Logging In', () => {
	beforeEach(() => {
		cy.wipeDatabase();
		cy.visit('#/login');
		cy.signupOpponent(validEmail, validPassword);
	});

	/**
     * Successful Logins
     */
	it('Can log into existing account with submit button', () => {
		cy.get('[data-cy=username]').type(validEmail);
		cy.get('[data-cy=password]').type(validPassword);
		cy.get('[data-cy=submit]').click();
		assertSuccessfulAuth(validEmail);
	});
	it('Can login via enter key in email', () => {
		cy.get('[data-cy=password]').type(validPassword);
		cy.get('[data-cy=username]').type(validEmail + '{enter}');
		assertSuccessfulAuth(validEmail);
	});
	it('Can login via enter key in password', () => {
		cy.get('[data-cy=username]').type(validEmail);
		cy.get('[data-cy=password]').type(validPassword + '{enter}');
		assertSuccessfulAuth(validEmail);
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
		assertSuccessfulAuth(validEmail);
	});
	it('Signs up by pressing enter on the email field', () => {
		cy.get('[data-cy=password]').type(validPassword);
		cy.get('[data-cy=username]').type(validEmail + '{enter}');
		assertSuccessfulAuth(validEmail);
	});
	it('Signs up by pressing enter on the password field', () => {
		cy.get('[data-cy=username]').type(validEmail);
		cy.get('[data-cy=password]').type(validPassword + '{enter}');
		assertSuccessfulAuth(validEmail);
	});

	/**
     * Rejected Signups
     */
	it('Requires password to be at least eight characters', () => {
		cy.get('[data-cy=username]').type(validEmail);
		cy.get('[data-cy=password]').type('sh0rt');
		cy.get('[data-cy=submit]').click();
		assertFailedAuth();
	});
	it('Requires valid email', () => {
		cy.get('[data-cy=username]').type('incompleteEmail');
		cy.get('[data-cy=password]').type(validPassword);
		assertFailedAuth();
	});
	it('Password is required', () => {
		cy.get('[data-cy=username]').type(validEmail);
		cy.get('[data-cy=submit]').click();
		assertFailedAuth();
	});
	it('Email is required', () => {
		cy.get('[data-cy=password]').type(validPassword);
		cy.get('[data-cy=submit]').click();
		assertFailedAuth();
	});
	it('Rejects signup if username already exists', () => {
		cy.signupOpponent(validEmail, validPassword);
		cy.get('[data-cy=username]').type(validEmail);
		cy.get('[data-cy=password]').type(validPassword);
		cy.get('[data-cy=submit]').click();
		assertFailedAuth();
	});
});