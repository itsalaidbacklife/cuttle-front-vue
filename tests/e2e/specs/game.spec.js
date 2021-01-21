const validEmail = 'myCustomEmail@gmail.com';
const validPassword = 'passwordLongerThanEight';
const opponentEmail = 'yourMortalEnemy@cia.gov';
const opponentPassword = 'deviousTrickery';


function setup() {
	cy.wipeDatabase();
	cy.visit('/');
	cy.signupThroughStore(validEmail, validPassword);
	cy.createGameThroughStore('Test Game')
		.then((gameSummary) => {
			cy.window().its('app.$store').invoke('dispatch', 'requestSubscribe', gameSummary.gameId);
			cy.vueRoute(`/lobby/${gameSummary.gameId}`);
			cy.wrap(gameSummary).as('gameSummary');
			cy.get('[data-cy=ready-button]').click();
			cy.signup(opponentEmail, opponentPassword);
			cy.subscribeOtherUser(gameSummary.gameId);
			cy.readyOtherUser();
		});
    
}

describe('Game - Page Content', () => {
	beforeEach(() => {
		setup();
	})

	it.only('Displays headers', () => {
		expect(true).to.eq(false, 'Empty Test');
	})
})
