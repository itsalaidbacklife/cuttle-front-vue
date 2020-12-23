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
		});
}
function assertGameStarted() {
	cy.url().should('include', '/game');
	cy.window().its('app.$store.state.game').then((game) => {
		expect(game.players.length).to.eq(2);
		expect(game.players[0].hand.length).to.eq(5);
		expect(game.players[1].hand.length).to.eq(6);
		expect(game.deck.length).to.eq(39);
		expect(game.topCard.rank).to.be.greaterThan(0);
		expect(game.secondCard.rank).to.be.greaterThan(0);
		expect(game.scrap.length).to.eq(0);
		expect(game.twos.length).to.eq(0);
	});
}
describe('Lobby - Page Content', () => {
	beforeEach(() => {
		setup();
	});
	it('Displays headers', () => {
		cy.contains('h1', 'Lobby for Test Game');
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
	it('Ready & UnReady buttons work', () => {
		cy.get('[data-cy=ready-button]')
		// Test: Button text defaults to 'Ready'
			.contains('READY')
			.should('not.contain', 'UNREADY')
			.click()
			.contains('UNREADY');
		// Test: player indicator classes
		cy.get('[data-cy=my-indicator]').should('have.class', 'ready');
		cy.get('[data-cy=opponent-indicator]').should('not.have.class', 'ready');
		cy.window().its('app.$store')
			.then((store) => {
				// Test: store state
				expect(store.state.game.p0Ready).to.eq(true); // Player is ready
				expect(store.getters.opponentIsReady).to.eq(null); // Opponent is missing (not ready)
				// Click Unready button
				cy.get('[data-cy=ready-button]').click();
				cy.get('[data-cy=my-indicator]').should('not.have.class', 'ready');
				//Return updated store state
				return cy.wrap(store.state.game);
			})
			.then((updatedGameState) => {
				//Test updated store state
				expect(updatedGameState.p0Ready).to.eq(false); // Player not ready
			});
	});
	it('Shows when opponent joins, leaves, and re-joins', () => {
		cy.contains('[data-cy=opponent-indicator]', 'Invite');
		cy.window().its('app.$store.state.game').then(gameData => {
			cy.contains('[data-cy=opponent-indicator]', 'Invite');
			// Sign up new user and subscribe them to game
			cy.signup(opponentEmail, opponentPassword);
			cy.subscribeOtherUser(gameData.id);
			// Test that opponent's truncated email appears in indicator
			cy.contains('[data-cy=opponent-indicator]', opponentEmail.split('@')[0]);
			// Opponent leaves
			cy.leaveLobbyOtherUser();
			cy.contains('[data-cy=opponent-indicator]', 'Invite');
			// Opponent joins again
			cy.subscribeOtherUser(gameData.id);
			cy.contains('[data-cy=opponent-indicator]', opponentEmail.split('@')[0]);
		});
	});
	it('Shows when oppenent Readies/Unreadies', function () {
		// Opponent subscribes & readies up
		cy.signup(opponentEmail, opponentPassword);
		cy.subscribeOtherUser(this.gameSummary.gameId);
		cy.readyOtherUser();
		cy.get('[data-cy=opponent-indicator]').should('have.class', 'ready');
		cy.get('[data-cy=my-indicator]').should('not.have.class', 'ready');
		//Opponent un-readies
		cy.readyOtherUser();
		cy.get('[data-cy=opponent-indicator]').should('not.have.class', 'ready');
		cy.get('[data-cy=my-indicator]').should('not.have.class', 'ready');
	});
	it('Game starts when both players are ready - opponent first', function () {
		cy.signup(opponentEmail, opponentPassword);
		cy.subscribeOtherUser(this.gameSummary.gameId);
		cy.readyOtherUser().then(() => {
			cy.get('[data-cy=opponent-indicator]').should('have.class', 'ready');
			cy.get('[data-cy=ready-button]').click();
			assertGameStarted();
		});
	});
	it('Game starts when both players are ready - player first', function () {
		cy.get('[data-cy=ready-button]').click();
		cy.signup(opponentEmail, opponentPassword);
		cy.subscribeOtherUser(this.gameSummary.gameId);
		cy.readyOtherUser().then(() => {
			assertGameStarted();
		});
	});
	it.only('Loads lobby after page refresh', () => {
		cy.reload();
	});
});

describe('Lobby - P1 Perspective', () => {
	beforeEach(() => {
		cy.wipeDatabase();
		cy.visit('/');
		cy.signupThroughStore(validEmail, validPassword);
		cy.createGameThroughStore('Test Game')
			.then((gameSummary) => {
				cy.wrap(gameSummary).as('gameSummary');
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
	it('Shows when oppenent Readies/Unreadies', () => {
		cy.readyOtherUser();
		cy.get('[data-cy=opponent-indicator]').should('have.class', 'ready');
		cy.get('[data-cy=my-indicator]').should('not.have.class', 'ready');
		//Opponent un-readies
		cy.readyOtherUser();
		cy.get('[data-cy=opponent-indicator]').should('not.have.class', 'ready');
		cy.get('[data-cy=my-indicator]').should('not.have.class', 'ready');
	});
	it('Shows when opponent leaves', () => {
		cy.contains('[data-cy=opponent-indicator]', opponentEmail.split('@')[0]);
		cy.leaveLobbyOtherUser(); // Opponent leaves
		cy.contains('[data-cy=opponent-indicator]', 'Invite');
	});
	it('Ready & UnReady buttons work', () => {
		cy.get('[data-cy=ready-button]')
		// Test: Button text defaults to 'Ready'
			.contains('READY')
			.should('not.contain', 'UNREADY')
			.click()
			.contains('UNREADY');
		// Test: player indicator classes
		cy.get('[data-cy=my-indicator]').should('have.class', 'ready');
		cy.get('[data-cy=opponent-indicator]').should('not.have.class', 'ready');
		cy.window().its('app.$store')
			.then((store) => {
				// Test: store state
				expect(store.state.game.p1Ready).to.eq(true); // Player is ready
				expect(store.getters.opponentIsReady).to.eq(false); // Opponent is not ready
				// Click Unready button
				cy.get('[data-cy=ready-button]')
					.should('contain', 'UNREADY')
					.click()
					.should('not.contain', 'UNREADY')
					.should('contain', 'READY');
				cy.get('[data-cy=my-indicator]').should('not.have.class', 'ready');
				//Return updated store state
				return cy.wrap(store.state.game);
			})
			.then((updatedGameState) => {
				//Test updated store state
				expect(updatedGameState.p1Ready).to.eq(false); // Player not ready
			});
	});
	it('Game starts when both players are ready - opponent ready before joining', function () {
		cy.get('[data-cy=exit-button]').click(); // leave game so opponent can ready before player joins
		cy.readyOtherUser();
		// Join game again
		cy.window().its('app.$store').invoke('dispatch', 'requestSubscribe', this.gameSummary.gameId);
		cy.vueRoute(`/lobby/${this.gameSummary.gameId}`);
		cy.get('[data-cy=ready-button]').click();
		// Test that game started
		assertGameStarted();
	});
	it('Game starts when both players are ready - opponent readies first after player joins', () => {
		cy.readyOtherUser();
		cy.get('[data-cy=ready-button]').click();
		assertGameStarted();
	});
	it('Game starts when both players are ready - player readies first', () => {
		cy.get('[data-cy=ready-button]').click();
		cy.readyOtherUser();
		assertGameStarted();
	});
	it('Loads lobby after page refresh', () => {
		expect(true).to.eq(false);
	});
})