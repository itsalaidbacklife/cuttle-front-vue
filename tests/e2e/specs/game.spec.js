import { assertGameState, assertSnackbarError } from '../support/helpers';

const validEmail = 'myCustomEmail@gmail.com';
const validPassword = 'passwordLongerThanEight';
const opponentEmail = 'yourMortalEnemy@cia.gov';
const opponentPassword = 'deviousTrickery';


function setupAsP0() {
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
			// Asserting 5 cards in players hand confirms game has loaded
			cy.get('#player-hand-cards div')
				.should('have.length', 5);
		});
}

function setupAsP1() {
	cy.wipeDatabase();
	cy.visit('/');
	cy.signupPlayer(validEmail, validPassword);
	cy.createGamePlayer('Test Game')
		.then((gameSummary) => {
			cy.signupOpponent(opponentEmail, opponentPassword);
			cy.subscribeOpponent(gameSummary.gameId);
			cy.readyOpponent();
			cy.window().its('app.$store').invoke('dispatch', 'requestSubscribe', gameSummary.gameId);
			cy.vueRoute(`/lobby/${gameSummary.gameId}`);
			cy.wrap(gameSummary).as('gameSummary');
			cy.get('[data-cy=ready-button]').click();
			// Asserting 6 cards in players hand confirms game has loaded
			cy.get('#player-hand-cards div')
				.should('have.length', 6);
		});
}

describe('Game Basic Moves - P1 Perspective', () => {
	beforeEach(() => {
		setupAsP1();
	});

	it('Draws from deck', () => {
		// Opponent draws card
		cy.drawCardOpponent();
		// Opponent now has 6 cards in hand
		cy.get('#opponent-hand-cards div')
			.should('have.length', 6);
		// Player draws card
		cy.get('#deck').click();
		// Player now have 7 cards in hand
		cy.get('#player-hand-cards div')
			.should('have.length', 7);
		// Attempt to play out of turn
		cy.get('#deck').click();
		// Test that Error snackbar says its not your turn
		assertSnackbarError('It\'s not your turn');
		// Opponent draws 2nd time
		cy.drawCardOpponent();
		// Opponent now has 7 cards in hand
		cy.get('#opponent-hand-cards div')
			.should('have.length', 7);
		// Player draws 2nd time
		cy.get('#deck').click();
		// Player now has 8 cards in hand
		cy.get('#player-hand-cards div')
			.should('have.length', 8);
		// Opponent draws 3rd time (8 cards)
		cy.drawCardOpponent();
		// Opponent now has 8 cards in hand
		cy.get('#opponent-hand-cards div')
			.should('have.length', 8);
		// Player attempts to draw with full hand
		cy.get('#deck').click();
		// Test that Error snackbar for hand limit
		cy.get('[data-cy=game-snackbar] .v-snack__wrapper')
			.should('be.visible')
			.should('have.class', 'error')
			.should('contain', 'You are at the hand limit; you cannot draw.');
		// Player still has 8 cards in hand
		cy.get('#player-hand-cards div')
			.should('have.length', 8);
		// Opponent still has 8 cards in hand
		cy.get('#opponent-hand-cards div')
			.should('have.length', 8);
	});

});

describe('Game Basic Moves - P0 Perspective', () => {
	beforeEach(() => {
		setupAsP0();
	});

	it('Plays Points', () => {
		cy.loadGameFixture({
			p0Hand: [{suit: 3, rank: 1}, {suit: 0, rank: 1}],
			p0Points: [{suit: 3, rank: 10}],
			p0FaceCards: [{suit: 3, rank: 13}],
			p1Hand: [{suit: 2, rank: 1}, {suit: 1, rank: 1}],
			p1Points: [{suit: 2, rank: 10}],
			p1FaceCards: [{suit: 2, rank: 13}],
		});
		// Play points (ace of spades)
		cy.get('[data-player-hand-card=1-3]').click(); // ace of spades
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click()
			.should('not.have.class', 'valid-move');
		// Attempt to play out of turn
		cy.get('[data-player-hand-card=1-0]').click(); // ace of clubs
		cy.get('#player-field')
			.click();
		// Test that Error snackbar says its not your turn
		assertSnackbarError('It\'s not your turn');

		assertGameState(
			0,
			{
				// ace of spades moved from p0Hand to p0Points
				p0Hand: [{suit: 0, rank: 1}],
				p0Points: [{suit: 3, rank: 10}, {suit: 3, rank: 1}],
				p0FaceCards: [{suit: 3, rank: 13}],
				p1Hand: [{suit: 2, rank: 1}, {suit: 1, rank: 1}],
				p1Points: [{suit: 2, rank: 10}],
				p1FaceCards: [{suit: 2, rank: 13}],
			}
		);

		// Opponent plays the ace of diamonds
		cy.playPointsOpponent({rank: 1, suit: 1});

		assertGameState(
			0,
			{
				// ace of diamonds moved from p1Hand to p1Points
				p0Hand: [{suit: 0, rank: 1}],
				p0Points: [{suit: 3, rank: 10}, {suit: 3, rank: 1}],
				p0FaceCards: [{suit: 3, rank: 13}],
				p1Hand: [{suit: 2, rank: 1}],
				p1Points: [{suit: 2, rank: 10}, {suit: 1, rank: 1}],
				p1FaceCards: [{suit: 2, rank: 13}],
			}
		);
	});

	it('Scuttles as P0', () => {
		cy.loadGameFixture({
			p0Hand: [{suit: 3, rank: 1}, {suit: 0, rank: 7}],
			p0Points: [{suit: 2, rank: 10}],
			p0FaceCards: [{suit: 3, rank: 13}],
			p1Hand: [{suit: 3, rank: 10}],
			p1Points: [{suit: 2, rank: 6}, {suit: 1, rank: 1}],
			p1FaceCards: [{suit: 2, rank: 12}],
		});
		// Player attempts illegal scuttle
		cy.get('[data-player-hand-card=1-3]').click(); // 7 of clubs
		cy.get('[data-opponent-point-card=6-2]').click(); // 6 of hearts
		assertSnackbarError('You can only scuttle an opponent\'s point card with a higher rank point card, or the same rank with a higher suit');;

		// Player scuttles 6 of diamonds with 7 of clubs
		cy.get('[data-player-hand-card=7-0]').click(); // 7 of clubs
		cy.get('[data-opponent-point-card=6-2]').click(); // 6 of hearts
		assertGameState(
			0,
			{
				p0Hand: [{suit: 3, rank: 1}],
				p0Points: [{suit: 2, rank: 10}],
				p0FaceCards: [{suit: 3, rank: 13}],
				p1Hand: [{suit: 3, rank: 10}],
				p1Points: [{suit: 1, rank: 1}],
				p1FaceCards: [{suit: 2, rank: 12}],
				scrap: [{suit: 0, rank: 7}, {suit: 2, rank: 6}],
			}
		);
		// Attempt to scuttle out of turn
		cy.get('[data-player-hand-card=1-3]').click(); // ace of spades
		cy.get('[data-opponent-point-card=1-1]').click(); // ace of diamonds
		// Test that Error snackbar says its not your turn
		assertSnackbarError('It\'s not your turn');
		// Opponent scuttles 10 of hearts with 10 of spades
		cy.scuttleOpponent({rank: 10, suit: 3}, {rank: 10, suit: 2});
		assertGameState(
			0,
			{
				p0Hand: [{suit: 3, rank: 1}],
				p0Points: [],
				p0FaceCards: [{suit: 3, rank: 13}],
				p1Hand: [],
				p1Points: [{suit: 1, rank: 1}],
				p1FaceCards: [{suit: 2, rank: 12}],
				scrap: [{suit: 0, rank: 7}, {suit: 2, rank: 6}, {suit: 2, rank: 10}, {suit: 3, rank: 10}],
			}
		);
	});

	it('Plays an Ace to destroy all point cards', () => {
		cy.loadGameFixture({
			p0Hand: [{suit: 0, rank: 1}, {suit: 3, rank: 4}],
			p0Points: [{suit: 3, rank: 10}, {suit: 3, rank: 1}],
			p0FaceCards: [{suit: 3, rank: 13}],
			p1Hand: [{suit: 2, rank: 1}],
			p1Points: [{suit: 2, rank: 10}, {suit: 1, rank: 1}],
			p1FaceCards: [{suit: 2, rank: 13}],
		});
		// Player plays ace
		cy.get('[data-player-hand-card=1-0]').click(); // ace of clubs
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		cy.get('#waiting-for-opponent-scrim')
			.should('be.visible');
		// Opponent does not counter (resolves stack)
		cy.resolveOpponent();
		cy.get('#waiting-for-opponent-scrim')
			.should('not.be.visible');
		assertGameState(
			0,
			{
				p0Hand: [{suit: 3, rank: 4}],
				p0Points: [],
				p0FaceCards: [{suit: 3, rank: 13}],
				p1Hand: [{suit: 2, rank: 1}],
				p1Points: [],
				p1FaceCards: [{suit: 2, rank: 13}],
				scrap: [{suit: 3, rank: 10}, {suit: 3, rank: 1}, {suit: 2, rank: 10}, {suit: 1, rank: 1}, {suit: 0, rank: 1}, ],
			}
		);
	});
})
