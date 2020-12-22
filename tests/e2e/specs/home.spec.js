const playerEmail = 'myCustomEmail@gmail.com';
const playerPassword = 'passwordLongerThanEight';
const opponentEmail = 'yourMortalEnemy@cia.gov';
const opponentPassword = 'deviousTrickery';

function setup() {
	cy.wipeDatabase();
	cy.visit('/');
	cy.signupThroughStore(playerEmail, playerPassword);
	cy.vueRoute('/');
}
function assertSuccessfulJoin(gameState) {
	expect(gameState.id).to.not.eq(null);
	cy.url().should('include', '/lobby/');
	cy.contains('h1', `Lobby for ${gameState.name}`);
}

describe('Home - Page Content', () => {
	beforeEach(setup);

	it('Displays headers', () => {
		cy.contains('h1', 'Games');
		cy.contains('h2', 'Create Game');
	});
	it('[Missing Feature] Displays logo', () => {
		expect(true).to.eq(false);
	});
	it('Play AI button links to CuttleBot', () => {
		cy.contains('a', 'Play with AI').should(
			'have.attr',
			'href',
			'https://human-ai-interaction.github.io/cuttle-bot/'
		);
	});
	it('Logs user out', () => {
		cy.get('[data-cy=btn-logout]').click();
		cy.contains('h1', 'Log In');
	});
});

describe('Home - Game List', () => {
	beforeEach(setup);

	it('Displays a game for every open game on the server', () => {
		cy.createGameThroughStore('111');
		cy.createGameThroughStore('33');
		cy.get('[data-cy=game-list-item]')
			.should('have.length', 2);
	});
	it('Displays placeholder text when no games are available', () => {
		cy.get('[data-cy=text-if-no-game]').should(
			'have.text',
			' No Active Games '
		);
		cy.contains('p', 'No Active Games');
	});
	it('Adds a new game to the list when one comes in through the socket', () => {
		cy.createGameThroughStore('111');
		cy.createGameThroughStore('33');
		cy.get('[data-cy=game-list-item]')
			.should('have.length', 2);
		cy.signup(opponentEmail, opponentPassword);
		cy.createGame('Game made by other player');
		cy.get('[data-cy=game-list-item]')
			.should('have.length', 3)
			.contains('Game made by other player');
	});
	it('Joins an open game', () => {
		cy.window()
			.its('app.$store.state.game')
			.then((gameState) => {
				expect(gameState.id).to.eq(null);
			});
		cy.createGameThroughStore('Test Game');
		cy.get('[data-cy=game-list-item]')
			.contains('button.v-btn', 'JOIN')
			.click();
		cy.hash().should('contain', '#/lobby');
		cy.window()
			.its('app.$store.state.game')
			.then((gameState) => {
				assertSuccessfulJoin(gameState);
			});
	});
	it('Joins a game that already has one player', () => {
		/**
     * Set up:
     * Create game, sign up one other user and subscribe them to the game
     */
		cy.createGameThroughStore('Test Game').then((gameData) => {
			// Sign up new user and subscribe them to game
			cy.signup('secondUser@aol.com', 'myNewPassword');
			cy.subscribeOtherUser(gameData.gameId);
			// Our user then joins through UI
			cy.get('[data-cy=game-list-item]')
				.contains('button.v-btn', 'JOIN')
				.click();
			// Should have redirected to lobby page and updated store
			cy.hash().should('contain', '#/lobby');
			cy.window()
				.its('app.$store.state.game')
				.then((gameState) => {
					// expect(gameState.gameId).to.not.eq(null);
					assertSuccessfulJoin(gameState);
				});
		});
	});
	it('Disables join when a game becomes full', () => {
		/**
     * Set up:
     * Create game, sign up two other users, subscribe them to the game
     */
		cy.createGameThroughStore('Test Game').then((gameData) => {
			// Test that JOIN button starts enabled
			cy.contains('button.v-btn', 'JOIN').should('not.be.disabled');
			// Sign up 2 users and subscribe them to game
			cy.signup('secondUser@aol.com', 'myNewPassword');
			cy.subscribeOtherUser(gameData.gameId);
			cy.signup('thirdUser@facebook.com', 'anotherUserPw');
			cy.subscribeOtherUser(gameData.gameId);

			// Test that join button is now disabled
			cy.contains('button.v-btn', 'JOIN').should('be.disabled');
		});
	});

	it('Re-enable join when a user leaves a full lobby', () => {
		/**
     * Set up:
     * Create game, sign up two other users, subscribe them to the game, leave one user
     */
		cy.createGameThroughStore('Test Game').then((gameData) => {
			// Test that JOIN button starts enabled
			cy.contains('button.v-btn', 'JOIN').should('not.be.disabled');
			// Sign up 2 users and subscribe them to game
			cy.signup('secondUser@aol.com', 'myNewPassword');
			cy.subscribeOtherUser(gameData.gameId);
			cy.signup('thirdUser@facebook.com', 'anotherUserPw');
			cy.subscribeOtherUser(gameData.gameId);

			// Test that join button is now disabled
			cy.contains('button.v-btn', 'JOIN').should('be.disabled');

			cy.leaveLobbyOtherUser(gameData.gameId);
			cy.contains('button.v-btn', 'JOIN').should('not.be.disabled');
		});
	});
});

describe('Home - Create Game', () => {
	beforeEach(setup);
	it('Creates a new game by hitting enter in text field', () => {
		cy.get('[data-cy=create-game-input]').type('test game' + '{enter}');
		cy.get('[data-cy=game-list-item]')
			.should('have.length', 1)
			.should('include.text', 'test game')
			.should('include.text', '0 / 2 players');
		// Test store
		cy.window().its('app.$store.state.gameList.games').then((games) => {
			expect(games.length).to.eq(1, 'Incorrect number of games in store');
			expect(games[0].numPlayers).to.eq(0, 'Incorrect number of players in game in store');
			expect(games[0].status).to.eq(true, 'Game in store incorrectly has status = false');
		});
	});

	it('Creates a new game by hitting the submit button', () => {
		cy.get('[data-cy=create-game-input]').type('test game');
		cy.get('[data-cy=create-game-btn]').click();
		cy.get('[data-cy=game-list-item]')
			.should('have.length', 1)
			.should('include.text', 'test game')
			.should('include.text', '0 / 2 players');
		// Test store
		cy.window().its('app.$store.state.gameList.games').then((games) => {
			expect(games.length).to.eq(1, 'Expect exactly 1 game in store');
			expect(games[0].numPlayers).to.eq(0, 'Expect no players in gameLists game in store, but found some');
			expect(games[0].status).to.eq(true, 'Game in store incorrectly has status = false');
		});
	});
	it('Does not create game without game name', () => {
		cy.get('[data-cy=create-game-btn]').click();
		// Test DOM
		cy.get('[data-cy=game-list-item]')
			.should('have.length', 0); // No games appear
		// Test Store
		cy.window()
			.its('app.$store.state')
			.then((state) => {
				expect(state.game.gameId).to.eq(undefined, 'Store game should not have id');
				expect(state.gameList.games.length).to.eq(0, 'Game list should be empty in store, but is not');
			});
	});
});
