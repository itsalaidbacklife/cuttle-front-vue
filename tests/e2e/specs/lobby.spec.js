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
		cy.get('[data-cy=my-indicator]')
			.contains(validEmail.split('@')[0])
			.should('not.contain', '@');
		cy.get('[data-cy=opponent-indicator]')
			.contains('Invite');
	});
	it('Defaults to not-ready', () => {
		cy.get('[data-cy=my-indicator]').should('not.have.class', 'ready');
		cy.get('[data-cy=opponent-indicator]').should('not.have.class', 'ready');
	});
    
});

describe('Lobby - P0 Perspective', () => {
	beforeEach(() => {
		setup();
	});
	it('Exits the Lobby', () => {
		cy.get('[data-cy=exit-button]').click();
		// Confirm navigation back to home
		cy.hash().should('eq', '#/');
		// Test store state
		cy.window().its('app.$store.state')
			.then((state) => {
				expect(state.game.players.length).to.eq(0);
				expect(state.game.id).to.eq(null);
				expect(state.game.name).to.eq(null);
				expect(state.game.myPNum).to.eq(null);
			});
	});
	it('Ready button works', () => {
		cy.get('[data-cy=ready-button]').click();
		cy.get('[data-cy=my-indicator]').should('have.class', 'ready');
	});
	it('Unready button works', () => {
		expect(true).to.eq(false);
	});
	it('Shows when opponent joins', () => {
		cy.contains('[data-cy=opponent-indicator]', 'Invite');
		cy.window().its('app.$store.state.game').then(gameData => {
			cy.contains('[data-cy=opponent-indicator]', 'Invite');
			// Sign up new user and subscribe them to game
			cy.signup(opponentEmail, opponentPassword);
			cy.subscribeOtherUser(gameData.id);
			// Test that opponent's truncated email appears in indicator
			cy.contains('[data-cy=opponent-indicator]', opponentEmail.split('@')[0]);
		});
	});
	it('Shows when opponent leaves', () => {
		expect(true).to.eq(false);
	});
	it('Shows when oppenent Readies up', () => {
		expect(true).to.eq(false);
	});
	it('Shows when opponent un-readies', () => {
		expect(true).to.eq(false);
	});
	it('Game starts when both players are ready', () => {
		expect(true).to.eq(false);
	});
});

describe('Lobby - P1 Perspective', () => {
	beforeEach(() => {
		cy.wipeDatabase();
		cy.visit('/');
		cy.signupThroughStore(validEmail, validPassword);
		cy.createGameThroughStore('Test Game')
			.then((gameSummary) => {
				// Sign up new (other) user and subscribe them to game
				cy.signup(opponentEmail, opponentPassword);
				cy.subscribeOtherUser(gameSummary.gameId);
				// Join game as this user and navigate to lobby
				cy.window().its('app.$store').invoke('dispatch', 'requestSubscribe', gameSummary.gameId);
				cy.vueRoute(`/lobby/${gameSummary.gameId}`);
			});
	});
	it('Shows opponent already in lobby for player joining second', () => {
		cy.contains('[data-cy=opponent-indicator]', opponentEmail.split('@')[0]);
	});
})