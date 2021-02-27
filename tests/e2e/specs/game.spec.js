import { assertGameState, assertSnackbarError, Card } from '../support/helpers';

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
	it('Displays the cannot counter modal and resolves stack when opponent plays a one-off', () => {
		cy.loadGameFixture({
			// Opponent is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.FOUR_OF_SPADES],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			// Player is P1
			p1Hand: [Card.ACE_OF_HEARTS],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		// Confirm fixture has loaded
		cy.get('#player-hand-cards div')
			.should('have.length', 1);
		// Opponent plays ace of clubs
		cy.playOneOffOpponent(Card.ACE_OF_CLUBS);
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.get('[data-cy=resolve]')
			.click();

		assertGameState(
			1,
			{
				p0Hand: [Card.FOUR_OF_SPADES],
				p0Points: [],
				p0FaceCards: [Card.KING_OF_SPADES],
				p1Hand: [Card.ACE_OF_HEARTS],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES, Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.ACE_OF_CLUBS],
			}
		);
	});

	it('Gives option to counter if player has a two; declining resolves stack', () => {
		cy.loadGameFixture({
			// Opponent is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.FOUR_OF_SPADES],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			// Player is P1
			p1Hand: [Card.ACE_OF_HEARTS, Card.TWO_OF_SPADES],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		// Confirm fixture has loaded
		cy.get('#player-hand-cards div')
			.should('have.length', 2);
		cy.playOneOffOpponent({rank: 1, suit: 0});
		cy.get('#cannot-counter-dialog')
			.should('not.be.visible');
		cy.get('#counter-dialog')
			.should('be.visible')
			.get('[data-cy=resolve]')
			.click();
		
		assertGameState(
			1,
			{
				p0Hand: [Card.FOUR_OF_SPADES],
				p0Points: [],
				p0FaceCards: [Card.KING_OF_SPADES],
				p1Hand: [Card.ACE_OF_HEARTS, Card.TWO_OF_SPADES],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES, Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.ACE_OF_CLUBS],
			}
		);
	});

	it('Counters one-off with a two', () => {
		cy.loadGameFixture({
			// Opponent is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.FOUR_OF_SPADES],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			// Player is P1
			p1Hand: [Card.ACE_OF_HEARTS, Card.TWO_OF_SPADES],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		// Confirm fixture has loaded
		cy.get('#player-hand-cards div')
			.should('have.length', 2);
		// Opponent plays ace of clubs as one-off
		cy.playOneOffOpponent(Card.ACE_OF_CLUBS);
		cy.get('#cannot-counter-dialog')
			.should('not.be.visible');
		// Player counters
		cy.get('#counter-dialog')
			.should('be.visible')
			.get('[data-cy=counter]')
			.click();
		cy.get('#choose-two-dialog')
			.should('be.visible')
			.get('[data-counter-dialog-card=2-3]')
			.click();
		cy.get('#waiting-for-opponent-scrim')
			.should('be.visible');
		// Opponent resolves
		cy.resolveOpponent();
		assertGameState(
			1,
			{
				// Opponent is P0
				p0Hand: [Card.FOUR_OF_SPADES],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [Card.KING_OF_SPADES],
				// Player is P1
				p1Hand: [Card.ACE_OF_HEARTS],
				p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.TWO_OF_SPADES, Card.ACE_OF_CLUBS],
			}
		);
	});
});

describe('Game Basic Moves - P0 Perspective', () => {
	beforeEach(() => {
		setupAsP0();
	});

	it('Plays Points', () => {
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.ACE_OF_CLUBS],
			p0Points: [Card.TEN_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
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
				p0Hand: [Card.ACE_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [Card.KING_OF_SPADES],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [Card.KING_OF_HEARTS],
			}
		);

		// Opponent plays the ace of diamonds
		cy.playPointsOpponent(Card.ACE_OF_DIAMONDS);

		assertGameState(
			0,
			{
				// ace of diamonds moved from p1Hand to p1Points
				p0Hand: [Card.ACE_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [Card.KING_OF_SPADES],
				p1Hand: [Card.ACE_OF_HEARTS],
				p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.KING_OF_HEARTS],
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

	it('Plays Kings', () => {
		cy.loadGameFixture({
			p0Hand: [{suit: 3, rank: 13}, {suit: 0, rank: 13}],
			p0Points: [{suit: 2, rank: 10}],
			p0FaceCards: [],
			p1Hand: [{suit: 2, rank: 6}],
			p1Points: [{suit: 1, rank: 1}],
			p1FaceCards: [],
		});
		// Player plays king
		cy.get('[data-player-hand-card=13-0]', { timeout: 10000 }).click(); // king of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();

		assertGameState(
			0,
			{
				p0Hand: [{suit: 3, rank: 13}],
				p0Points: [{suit: 2, rank: 10}],
				p0FaceCards: [{suit: 0, rank: 13}],
				p1Hand: [{suit: 2, rank: 6}],
				p1Points: [{suit: 1, rank: 1}],
				p1FaceCards: [],
				scrap: [],
			}
		);

		//opponent plays 6 of hearts
		cy.playPointsOpponent({rank: 6, suit: 2})

		assertGameState(
			0,
			{
				p0Hand: [{suit: 3, rank: 13}],
				p0Points: [{suit: 2, rank: 10}],
				p0FaceCards: [{suit: 0, rank: 13}],
				p1Hand: [],
				p1Points: [{suit: 1, rank: 1}, {suit: 2, rank: 6}],
				p1FaceCards: [],
				scrap: [],
			}
		);

		// Player plays another king
		cy.get('[data-player-hand-card=13-3]', { timeout: 10000 }).click(); // king of spades
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		
		// player has two kings on the field. target score should change to 10
		cy.get('[data-cy=player-points-to-win]').should('contain', ' 10 ');

		assertGameState(
			0,
			{
				p0Hand: [],
				p0Points: [{suit: 2, rank: 10}],
				p0FaceCards: [{suit: 0, rank: 13}, {suit: 3, rank: 13}],
				p1Hand: [],
				p1Points: [{suit: 1, rank: 1}, {suit: 2, rank: 6} ],
				p1FaceCards: [],
				scrap: [],
			}
		);
	});
	
	it('Plays Queens', () => {
		cy.loadGameFixture({
			p0Hand: [{suit: 3, rank: 12}, {suit: 0, rank: 13}],
			p0Points: [{suit: 2, rank: 10}],
			p0FaceCards: [],
			p1Hand: [{suit: 2, rank: 6}],
			p1Points: [{suit: 1, rank: 1}],
			p1FaceCards: [],
		});
		// Player plays queen
		cy.get('[data-player-hand-card=12-3]').click(); // queen of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();

		assertGameState(
			0,
			{
				p0Hand: [{suit: 0, rank: 13}],
				p0Points: [{suit: 2, rank: 10}],
				p0FaceCards: [{suit: 3, rank: 12}],
				p1Hand: [{suit: 2, rank: 6}],
				p1Points: [{suit: 1, rank: 1}],
				p1FaceCards: [],
				scrap: [],
			}
		);
	});

	it('Plays Queens Opponent', () => {
		cy.loadGameFixture({
			p0Hand: [{suit: 0, rank: 13}],
			p0Points: [{suit: 2, rank: 10}],
			p0FaceCards: [],
			p1Hand: [{suit: 3, rank: 12}, {suit: 2, rank: 6}],
			p1Points: [{suit: 1, rank: 1}],
			p1FaceCards: [],
		});

		assertGameState(
			0,
			{
				p0Hand: [{suit: 0, rank: 13}],
				p0Points: [{suit: 2, rank: 10}],
				p0FaceCards: [],
				p1Hand: [{suit: 3, rank: 12}, {suit: 2, rank: 6}],
				p1Points: [{suit: 1, rank: 1}],
				p1FaceCards: [],
			}
		);

		// Player plays another king
		cy.get('[data-player-hand-card=13-0]').click(); // king of spades
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();

		//opponent plays queen
		cy.playFaceCardOpponent({rank: 12, suit: 3})

		assertGameState(
			0,
			{
				p0Hand: [],
				p0Points: [{suit: 2, rank: 10}],
				p0FaceCards: [{suit: 0, rank: 13}],
				p1Hand: [{suit: 2, rank: 6}],
				p1Points: [{suit: 1, rank: 1}],
				p1FaceCards: [{suit: 3, rank: 12}],
				scrap: [],
			}
		);
	});
});
