import { setupGameAsP0, setupGameAsP1, assertGameState, assertSnackbarError, Card } from '../../support/helpers';

describe('Game Basic Moves - P0 Perspective', () => {
	beforeEach(() => {
		setupGameAsP0();
	});

	it('Plays Points', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.ACE_OF_CLUBS],
			p0Points: [Card.TEN_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

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
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.SEVEN_OF_CLUBS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [Card.KING_OF_SPADES],
			p1Hand: [Card.TEN_OF_SPADES],
			p1Points: [Card.SIX_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.QUEEN_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Fixture loaded');

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
				p0Hand: [Card.ACE_OF_SPADES],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [Card.KING_OF_SPADES],
				p1Hand: [Card.TEN_OF_SPADES],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.QUEEN_OF_HEARTS],
				scrap: [Card.SEVEN_OF_CLUBS, Card.SIX_OF_HEARTS],
			}
		);
		// Attempt to scuttle out of turn
		cy.get('[data-player-hand-card=1-3]').click(); // ace of spades
		cy.get('[data-opponent-point-card=1-1]').click(); // ace of diamonds
		// Test that Error snackbar says its not your turn
		assertSnackbarError('It\'s not your turn');
		// Opponent scuttles 10 of hearts with 10 of spades
		cy.scuttleOpponent(Card.TEN_OF_SPADES, Card.TEN_OF_HEARTS);
		assertGameState(
			0,
			{
				p0Hand: [Card.ACE_OF_SPADES],
				p0Points: [],
				p0FaceCards: [Card.KING_OF_SPADES],
				p1Hand: [],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.QUEEN_OF_HEARTS],
				scrap: [Card.SEVEN_OF_CLUBS, Card.SIX_OF_HEARTS, Card.TEN_OF_HEARTS, Card.TEN_OF_SPADES],
			}
		);
	});

	it('Plays Kings', () => {
		// Setup
		cy.loadGameFixture({
			p0Hand: [Card.KING_OF_SPADES, Card.KING_OF_CLUBS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.KING_OF_DIAMONDS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		// Check that fixture has loaded
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Player plays king
		cy.get('[data-player-hand-card=13-0]').click(); // king of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();

		assertGameState(
			0,
			{
				p0Hand: [Card.KING_OF_SPADES],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [Card.KING_OF_CLUBS],
				p1Hand: [Card.SIX_OF_HEARTS, Card.KING_OF_DIAMONDS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [],
				scrap: [],
			}
		);

		// Attempt to play king out of turn
		cy.get('[data-player-hand-card=13-3]').click(); // king of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');

		// Opponent plays king of diamonds
		cy.playFaceCardOpponent(Card.KING_OF_DIAMONDS);

		assertGameState(
			0,
			{
				p0Hand: [Card.KING_OF_SPADES],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [Card.KING_OF_CLUBS],
				p1Hand: [Card.SIX_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.KING_OF_DIAMONDS],
				scrap: [],
			}
		);

		// Player plays another king
		cy.get('[data-player-hand-card=13-3]').click(); // king of spades
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();

		assertGameState(
			0,
			{
				p0Hand: [],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [Card.KING_OF_CLUBS, Card.KING_OF_SPADES],
				p1Hand: [Card.SIX_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.KING_OF_DIAMONDS],
				scrap: [],
			}
		);
	});
	
	it('Plays Queens', () => {
		// Setup
		cy.loadGameFixture({
			p0Hand: [Card.QUEEN_OF_SPADES, Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 3);
		cy.log('Loaded fixture');

		// Player plays queen
		cy.get('[data-player-hand-card=12-3]').click(); // queen of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertGameState(
			0,
			{
				p0Hand: [Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [Card.QUEEN_OF_SPADES],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [],
				scrap: [],
			}
		);

		// Attempt to play queen out of turn
		cy.get('[data-player-hand-card=12-1]').click(); // queen of diamonds
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');

		// Opponent plays queen of hearts
		cy.playFaceCardOpponent(Card.QUEEN_OF_HEARTS);
		assertGameState(
			0,
			{
				p0Hand: [Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [Card.QUEEN_OF_SPADES],
				p1Hand: [Card.SIX_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.QUEEN_OF_HEARTS],
				scrap: [],
			}
		);
	});
});

describe('Game Basic Moves - P1 Perspective', () => {
	beforeEach(() => {
		setupGameAsP1();
	});

	it.only('Draws from deck', () => {
		// Opponent draws card
		cy.drawCardOpponent();
		// Opponent now has 6 cards in hand
		cy.get('.opponent-card-back')
			.should('have.length', 6);
		// Player draws card
		cy.get('#deck').click();
		// Player now have 7 cards in hand
		cy.get('[data-player-hand-card]')
			.should('have.length', 7);
		// Attempt to play out of turn
		cy.get('#deck').click();
		// Test that Error snackbar says its not your turn
		assertSnackbarError('It\'s not your turn');
		// Opponent draws 2nd time
		cy.drawCardOpponent();
		// Opponent now has 7 cards in hand
		cy.get('.opponent-card-back')
			.should('have.length', 7);
		// Player draws 2nd time
		cy.get('#deck').click();
		// Player now has 8 cards in hand
		cy.get('[data-player-hand-card]')
			.should('have.length', 8);
		// Opponent draws 3rd time (8 cards)
		cy.drawCardOpponent();
		// Opponent now has 8 cards in hand
		cy.get('.opponent-card-back')
			.should('have.length', 8);
		// Player attempts to draw with full hand
		cy.get('#deck').click();
		// Test that Error snackbar for hand limit
		cy.get('[data-cy=game-snackbar] .v-snack__wrapper')
			.should('be.visible')
			.should('have.class', 'error')
			.should('contain', 'You are at the hand limit; you cannot draw.');
		// Player still has 8 cards in hand
		cy.get('[data-player-hand-card]')
			.should('have.length', 8);
		// Opponent still has 8 cards in hand
		cy.get('.opponent-card-back')
			.should('have.length', 8);
	});
});

describe('Playing 8s', () => {

	beforeEach(() => {
		setupGameAsP0();
	});

	it('Plays eights for points', () => {
		// Setup
		cy.loadGameFixture({
			p0Hand: [Card.EIGHT_OF_SPADES, Card.EIGHT_OF_HEARTS, Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 4);
		cy.log('Loaded fixture');

		// Player plays eight
		cy.get('[data-player-hand-card=8-3]').click(); // eight of spades
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		// Choose to play for points
		cy.get('#eight-overlay')
			.should('be.visible')
			.get('[data-cy=eight-for-points]')
			.click();
		
		assertGameState(
			0,
			{
				p0Hand: [Card.EIGHT_OF_HEARTS, Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_HEARTS, Card.EIGHT_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [],
			}
		);
		
		// Attempt to play eight out of turn
		// Player plays eight
		cy.get('[data-player-hand-card=8-2]').click(); // eight of hearts
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');
	}); // End play 8 for points

	it('Plays eights for glasses', () => {
		// Setup
		cy.loadGameFixture({
			p0Hand: [Card.EIGHT_OF_SPADES, Card.EIGHT_OF_HEARTS, Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS, Card.EIGHT_OF_CLUBS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 4);
		cy.log('Loaded fixture');

		// Player plays eight
		cy.get('[data-player-hand-card=8-3]').click(); // eight of spades
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		// Choose to play as glasses
		cy.get('#eight-overlay')
			.should('be.visible')
			.get('[data-cy=eight-as-glasses]')
			.click();
		
		assertGameState(
			0,
			{
				p0Hand: [Card.EIGHT_OF_HEARTS, Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [Card.EIGHT_OF_SPADES],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS, Card.EIGHT_OF_CLUBS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [],
			}
		);
		
		// Attempt to play eight out of turn
		// Player plays eight
		cy.get('[data-player-hand-card=8-2]').click(); // eight of hearts
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');

		// Opponent plays glasses eight
		cy.playFaceCardOpponent(Card.EIGHT_OF_CLUBS);
		assertGameState(
			0,
			{
				p0Hand: [Card.EIGHT_OF_HEARTS, Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [Card.EIGHT_OF_SPADES],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.EIGHT_OF_CLUBS],
			}
		);
	}); // End play glasses 8

	it('Cancels playing an 8 with close icon', () => {
		// Setup
		cy.loadGameFixture({
			p0Hand: [Card.EIGHT_OF_SPADES, Card.EIGHT_OF_HEARTS, Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 4);
		cy.log('Loaded fixture');

		// Player plays eight
		cy.get('[data-player-hand-card=8-3]').click(); // eight of spades
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		// Cancel decision to play eight
		cy.get('#eight-overlay')
			.should('be.visible')
			.get('[data-cy=cancel-eight]')
			.click();

		// Overlay clears
		cy.get('#eight-overlay')
			.should('not.be.visible');
		// State is unchanged
		assertGameState(0, {
			p0Hand: [Card.EIGHT_OF_SPADES, Card.EIGHT_OF_HEARTS, Card.KING_OF_CLUBS, Card.QUEEN_OF_DIAMONDS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
	}); // End cancel playing an 8
}); // End eights describe

describe('Play Jacks', () => {
	beforeEach(() => {
		setupGameAsP0();
	});

	it('Player and Opponent plays Jacks on different cards', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.JACK_OF_CLUBS, Card.KING_OF_SPADES],
			p0Points: [Card.TEN_OF_SPADES],
			p0FaceCards: [],
			p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 3);
		cy.log('Loaded fixture');

		// Play jack 
		cy.get('[data-player-hand-card=11-0]').click(); // jack of clubs

		cy.get('[data-opponent-point-card=10-2]')
			.click(); // target ten of hearts

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES],
				p0Points: [Card.TEN_OF_SPADES, Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});
		
		cy.get('[data-player-hand-card]').should('have.length', 2);
		// Attempt to play king out of turn
		cy.get('[data-player-hand-card=13-3]').click(); // king of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');

		
		// opponent plays Jack
		cy.playJackOpponent(Card.JACK_OF_DIAMONDS, Card.TEN_OF_SPADES)

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [Card.TEN_OF_SPADES],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});
	});

	it('Double Jacks - Player and Opponent plays Jacks on the same card', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.JACK_OF_CLUBS, Card.KING_OF_SPADES],
			p0Points: [Card.TEN_OF_SPADES],
			p0FaceCards: [],
			p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 3);
		cy.log('Loaded fixture');

		// Play jack 
		cy.get('[data-player-hand-card=11-0]').click(); // jack of clubs

		cy.get('[data-opponent-point-card=10-2]')
			.click(); // target ten of hearts

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES],
				p0Points: [Card.TEN_OF_SPADES, Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});
		
		cy.get('[data-player-hand-card]').should('have.length', 2);
		// Attempt to play king out of turn
		cy.get('[data-player-hand-card=13-3]').click(); // king of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');

		
		// opponent plays Jack
		cy.playJackOpponent(Card.JACK_OF_DIAMONDS, Card.TEN_OF_HEARTS)

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});
	});


	it('Triple jacks successfully', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.JACK_OF_CLUBS, Card.KING_OF_SPADES, Card.JACK_OF_HEARTS],
			p0Points: [Card.TEN_OF_SPADES],
			p0FaceCards: [],
			p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 4);
		cy.log('Loaded fixture');

		// Play jack 
		cy.get('[data-player-hand-card=11-0]').click(); // jack of clubs

		cy.get('[data-opponent-point-card=10-2]')
			.click(); // target ten of hearts

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES, Card.JACK_OF_HEARTS],
				p0Points: [Card.TEN_OF_SPADES, Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});
		
		cy.get('[data-player-hand-card]').should('have.length', 3);
		// Attempt to play king out of turn
		cy.get('[data-player-hand-card=13-3]').click(); // king of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');

		
		// opponent plays 2nd Jack
		cy.playJackOpponent(Card.JACK_OF_DIAMONDS, Card.TEN_OF_HEARTS)

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES, Card.JACK_OF_HEARTS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});

		// Player plays 3rd jack 
		cy.get('[data-player-hand-card=11-2]').click(); // jack of clubs

		cy.get('[data-opponent-point-card=10-2]')
			.click(); // target ten of hearts
		
		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES],
				p0Points: [Card.TEN_OF_SPADES, Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});
			
	});

	it('Quadruple jacks successfully', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.JACK_OF_CLUBS, Card.KING_OF_SPADES, Card.JACK_OF_HEARTS],
			p0Points: [Card.TEN_OF_SPADES],
			p0FaceCards: [],
			p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS, Card.JACK_OF_SPADES],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 4);
		cy.log('Loaded fixture');

		// Play jack 
		cy.get('[data-player-hand-card=11-0]').click(); // jack of clubs

		cy.get('[data-opponent-point-card=10-2]')
			.click(); // target ten of hearts

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES, Card.JACK_OF_HEARTS],
				p0Points: [Card.TEN_OF_SPADES, Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS, Card.JACK_OF_SPADES],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});
		
		cy.get('[data-player-hand-card]').should('have.length', 3);
		// Attempt to play king out of turn
		cy.get('[data-player-hand-card=13-3]').click(); // king of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');

		
		// opponent plays 2nd Jack
		cy.playJackOpponent(Card.JACK_OF_DIAMONDS, Card.TEN_OF_HEARTS)

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES, Card.JACK_OF_HEARTS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_SPADES],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});

		// Player plays 3rd jack 
		cy.get('[data-player-hand-card=11-2]').click(); // jack of clubs

		cy.get('[data-opponent-point-card=10-2]')
			.click(); // target ten of hearts
		
		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES],
				p0Points: [Card.TEN_OF_SPADES, Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_SPADES],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});

		// Attempt to play king out of turn
		cy.get('[data-player-hand-card=13-3]').click(); // king of clubs
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');

		
		// opponent plays 4th Jack
		cy.playJackOpponent(Card.JACK_OF_SPADES, Card.TEN_OF_HEARTS)

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});
	});
});
