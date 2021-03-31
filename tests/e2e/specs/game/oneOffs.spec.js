import { setupGameAsP0, assertGameState, assertSnackbarError, Card } from '../../support/helpers';

describe('Untargeted One-Offs', () => {
	
	beforeEach(() => {
		setupGameAsP0();
	});
    
	it('Plays an Ace to destroy all point cards', () => {
		// Setup
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_CLUBS, Card.FOUR_OF_SPADES, Card.ACE_OF_DIAMONDS],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			p1Hand: [Card.ACE_OF_HEARTS],
			p1Points: [Card.TEN_OF_HEARTS, Card.TWO_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 3);
		cy.log('Loaded fixture');

		// Player plays ace
		cy.get('[data-player-hand-card=1-0]').click(); // ace of clubs
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent does not counter (resolves stack)
		cy.resolveOpponent();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('not.be.visible');
		assertGameState(
			0,
			{
				p0Hand: [Card.FOUR_OF_SPADES, Card.ACE_OF_DIAMONDS],
				p0Points: [],
				p0FaceCards: [Card.KING_OF_SPADES],
				p1Hand: [Card.ACE_OF_HEARTS],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES, Card.TEN_OF_HEARTS, Card.TWO_OF_DIAMONDS, Card.ACE_OF_CLUBS],
			}
		);
		// Attempt to plays ace out of turn
		cy.get('[data-player-hand-card=1-1]').click(); // ace of diamonds
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');
	}); // End ace one-off

	it('Plays a five to draw two cards', () => {
		// Setup
		cy.loadGameFixture({
			// Player is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.FIVE_OF_SPADES, Card.FIVE_OF_HEARTS],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			// Opponent is P1
			p1Hand: [Card.ACE_OF_HEARTS],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS],
			// Deck
			topCard: Card.THREE_OF_CLUBS,
			secondCard: Card.EIGHT_OF_HEARTS,
		});
		cy.get('[data-player-hand-card]').should('have.length', 3);
		cy.log('Loaded fixture');
		// Player plays five
		cy.get('[data-player-hand-card=5-3]').click(); // five of spades
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent does not counter (resolves stack)
		cy.resolveOpponent();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('not.be.visible');

		// Assert game state
		assertGameState(
			0,
			{
				// Player is P0
				p0Hand: [Card.ACE_OF_CLUBS, Card.FIVE_OF_HEARTS, Card.THREE_OF_CLUBS, Card.EIGHT_OF_HEARTS],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [Card.KING_OF_SPADES],
				// Opponent is P1
				p1Hand: [Card.ACE_OF_HEARTS],
				p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.FIVE_OF_SPADES],
			}
		);
		// Attempt to plays five out of turn
		cy.get('[data-player-hand-card=5-2]').click(); // five of hearts
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');
	}); // End five one-off

	it('Plays a six to destroy all face cards', () => {
		// Setup
		cy.loadGameFixture({
			//Player is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.SIX_OF_SPADES, Card.SIX_OF_DIAMONDS],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES, Card.KING_OF_CLUBS, Card.KING_OF_DIAMONDS],
			// Opponent is P1
			p1Hand: [Card.ACE_OF_HEARTS],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS, Card.QUEEN_OF_DIAMONDS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 3);
		cy.log('Loaded fixture');

		// Player plays six
		cy.get('[data-player-hand-card=6-3]').click(); // six of spades
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent does not counter (resolves stack)
		cy.resolveOpponent();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('not.be.visible');
		assertGameState(
			0,
			{
				p0Hand: [Card.ACE_OF_CLUBS, Card.SIX_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [],
				// Opponent is P1
				p1Hand: [Card.ACE_OF_HEARTS],
				p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1FaceCards: [],
				scrap:[
					Card.SIX_OF_SPADES,
					Card.KING_OF_CLUBS,
					Card.KING_OF_DIAMONDS,
					Card.KING_OF_HEARTS,
					Card.KING_OF_SPADES,
					Card.QUEEN_OF_DIAMONDS,
				]
			}
		);
		// Attempt to plays six out of turn
		cy.get('[data-player-hand-card=6-1]').click(); // six of diamonds
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');
	}); // End 6 one-off

}); // End untargeted one-off describe

describe('Playing FOURS', () => {
	beforeEach(() => {
		setupGameAsP0();
	});

	it('Plays a 4 to make opponent discard two cards of their choice', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.FOUR_OF_SPADES, Card.FOUR_OF_CLUBS],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.TEN_OF_HEARTS],
			p1Points: [],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');
        
		// Play the four of spades
		cy.get('[data-player-hand-card=4-3]').click(); // four of spades
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent does not counter (resolves stack)
		cy.resolveOpponent();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('not.be.visible');
		cy.get('#waiting-for-opponent-discard-scrim')
			.should('be.visible');
		// Opponent chooses two cards to discard
		cy.discardOpponent(Card.ACE_OF_HEARTS, Card.TEN_OF_HEARTS);
		cy.get('#waiting-for-opponent-discard-scrim')
			.should('not.be.visible');
        
		assertGameState(0,
			{
				p0Hand: [Card.FOUR_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [], 
				scrap: [Card.FOUR_OF_SPADES, Card.ACE_OF_HEARTS, Card.TEN_OF_HEARTS],
			}
		);
	});

	it('Plays a 4 to make opponent discard their only two cards', () => {

	});

	it('Plays a 4 to make opponent discard the last card in their hand', () => {

	});

	it('Prevents playing a 4 when opponent has no cards in hand', () => {

	});
});

describe('Play TWOS', () => {
	beforeEach(() => {
		setupGameAsP0();
	});

	it('Plays Two to Destroy Face Card', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.TWO_OF_CLUBS],
			p0Points: [Card.TEN_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Play two as one off (two of clubs)
		cy.get('[data-player-hand-card=2-0]').click(); // two of clubs
			
		cy.get('[data-opponent-face-card=13-2]')
			.click(); // target king of hearts

		// opponent resolve
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent does not counter (resolves stack)
		cy.resolveOpponent();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('not.be.visible');

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [Card.KING_OF_SPADES],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				scrap: [Card.TWO_OF_CLUBS, Card.KING_OF_HEARTS]
			});
	});
});

describe('Playing NINES', () => {
	beforeEach(() => {
		setupGameAsP0();
	});

	it('Plays a nine to SCUTTLE a lower point card', () => {
		cy.loadGameFixture({
			p0Hand: [Card.NINE_OF_SPADES, Card.NINE_OF_HEARTS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Player plays nine
		cy.get('[data-player-hand-card=9-3]').click(); // nine of spades	
		cy.get('[data-opponent-point-card=1-1]').click(); // ace of diamonds

		cy.get('#nine-overlay')
			.should('be.visible')
			.get('[data-cy=nine-scuttle]')
			.click();
		
		assertGameState(
			0,
			{
				p0Hand: [Card.NINE_OF_HEARTS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_SPADES, Card.ACE_OF_DIAMONDS],
			}
		);
	}); // End 9 scuttle

	it('Plays a nine as ONE-OFF on lower point card to return it to owners hand', () => {
		cy.loadGameFixture({
			p0Hand: [Card.NINE_OF_SPADES, Card.NINE_OF_HEARTS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Player plays nine
		cy.get('[data-player-hand-card=9-3]').click(); // nine of spades	
		cy.get('[data-opponent-point-card=1-1]').click(); // ace of diamonds
		
		// Chooses to play as one-off
		cy.get('#nine-overlay')
			.should('be.visible')
			.get('[data-cy=nine-one-off]')
			.click();

		// Wait for opponent to resolve
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		cy.resolveOpponent();

		assertGameState(
			0,
			{
				p0Hand: [Card.NINE_OF_HEARTS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_SPADES],
			}
		);		
	}); // End 9 one-off low point card

	it('Plays a nine as ONE-OFF on a higher point card to return it to owners hand', () => {
		cy.loadGameFixture({
			p0Hand: [Card.NINE_OF_CLUBS, Card.NINE_OF_HEARTS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [Card.NINE_OF_SPADES],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Player plays nine
		cy.get('[data-player-hand-card=9-2]').click(); // nine of hearts	
		cy.get('[data-opponent-point-card=9-3]').click(); // nine of spades

		// Attempt illegal scuttle
		cy.log('Attempting illegal scuttle');
		cy.get('#nine-cannot-scuttle').should('be.visible');
		cy.get('#nine-overlay')
			.should('be.visible')
			.get('[data-cy=nine-scuttle]')
			.click();

		cy.log('Choosing to play nine as one-off');
		// Chooses to play as one-off
		cy.get('#nine-overlay')
			.should('be.visible')
			.get('[data-cy=nine-one-off]')
			.click();

		// Wait for opponent to resolve
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		cy.resolveOpponent();
		
		assertGameState(
			0,
			{
				p0Hand: [Card.NINE_OF_CLUBS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.NINE_OF_SPADES, Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_HEARTS],
			}
		);
	}); // End 9 one-off high-point card

	it('Plays a nine as a ONE-OFF to return a face card to its owners hand', () => {
		cy.loadGameFixture({
			p0Hand: [Card.NINE_OF_SPADES, Card.NINE_OF_HEARTS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [],
			p1FaceCards: [Card.KING_OF_DIAMONDS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Player plays nine
		cy.get('[data-player-hand-card=9-3]').click(); // nine of spades	
		cy.get('[data-opponent-face-card=13-1]').click(); // ace of diamonds


		// Wait for opponent to resolve
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		cy.resolveOpponent();

		assertGameState(
			0,
			{
				p0Hand: [Card.NINE_OF_HEARTS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS, Card.KING_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_SPADES],
			}
		);			
	}); // End 9 on face card


	it.skip('Plays a 9 on a jack to steal back point card', () => {

	}); // End 9 on jack

	it('Cancels playing a nine', () => {
		cy.loadGameFixture({
			p0Hand: [Card.NINE_OF_SPADES, Card.NINE_OF_HEARTS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Player plays nine
		cy.get('[data-player-hand-card=9-3]').click(); // nine of spades	
		cy.get('[data-opponent-point-card=1-1]').click(); // ace of diamonds

		cy.get('#nine-overlay')
			.should('be.visible')
			.get('[data-cy=cancel-nine]')
			.click();
		
		cy.get('#nine-overlay')
			.should('not.be.visible');

		assertGameState(
			0,
			{
				p0Hand: [Card.NINE_OF_HEARTS, Card.NINE_OF_SPADES],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [],
				scrap: [],
			}
		);
	});
}); // End 9s describe