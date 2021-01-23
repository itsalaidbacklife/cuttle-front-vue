const validEmail = 'myCustomEmail@gmail.com';
const validPassword = 'passwordLongerThanEight';
const opponentEmail = 'yourMortalEnemy@cia.gov';
const opponentPassword = 'deviousTrickery';


function setup() {
	cy.wipeDatabase();
	cy.visit('/');
	cy.signupPlayer(validEmail, validPassword);
	cy.createGamePlayer('Test Game')
		.then((gameSummary) => {
			cy.window().its('app.$store').invoke('dispatch', 'requestSubscribe', gameSummary.gameId);
			cy.vueRoute(`/lobby/${gameSummary.gameId}`);
			cy.wrap(gameSummary).as('gameSummary');
			cy.get('[data-cy=ready-button]').click();
			cy.signupOpponent(opponentEmail, opponentPassword);
			cy.subscribeOpponent(gameSummary.gameId);
			cy.readyOpponent();
		});
    
}

describe('Game - Page Content', () => {
	beforeEach(() => {
		setup();
	})

	it.skip('Displays headers', () => {
		expect(true).to.eq(false, 'Empty Test');
	})
})
