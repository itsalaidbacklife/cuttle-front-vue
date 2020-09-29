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
		});
}
describe('Lobby - Page Content', () => {
	beforeEach(() => {
		setup();
	});
	it('Displays headers', () => {
		expect(true).to.eq(false);
	});
	it('Displays buttons', () => {
		cy.contains('button.v-btn', 'EXIT');
		cy.contains('button.v-btn', 'READY');
	});
	it('Shows both players indicators', () => {
		expect(true).to.eq(false);
	});
	it('Defaults to not-ready', () => {
		cy.get('[data-cy=my-indicator]').should('not.have.class', 'ready');
	});
    
});

describe('Lobby - Event Handling', () => {
	beforeEach(() => {
		setup();
	});
	it('Exits the Lobby', () => {
		expect(true).to.eq(false);
	});
	it('Ready button works', () => {
		cy.get('[data-cy=ready-button]').click();
		cy.get('[data-cy=my-indicator]').should('have.class', 'ready');
	});
	it('Unready button works', () => {
		expect(true).to.eq(false);
	});
	it.only('Shows when opponent joins', () => {
		cy.contains('[data-cy=opponent-indicator]', 'Invite');
		cy.window().its('app.$store.state.game').then(gameData => {
			cy.contains('[data-cy=opponent-indicator]', 'Invite');
			
			// Sign up new user and subscribe them to game
			cy.signup(opponentEmail, opponentPassword);
			cy.subscribeOtherUser(gameData.id);
			cy.contains('[data-cy=opponent-indicator]', opponentEmail);

		});
	});
	it('Shows when opponent leaves', () => {
		expect(true).to.eq(false);
	});
	it('Shows when oppenent Readies up', () => {
		expect(true).to.eq(false);
	});
	it('Game starts when both players are ready', () => {
		expect(true).to.eq(false);
	});
});