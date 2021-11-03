import { setupGameAsP0, setupGameAsP1, assertGameState, assertSnackbarError, Card } from '../../support/helpers';

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
		cy.playOneOffAndResolveAsPlayer(Card.ACE_OF_CLUBS);

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
			.should('not.have.class', 'valid-move')
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
		cy.playOneOffAndResolveAsPlayer(Card.FIVE_OF_SPADES);

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
			.should('not.have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');
	}); // End five one-off

	it('Plays a six to destroy all face cards', () => {
		// Setup
		cy.loadGameFixture({
			//Player is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.SIX_OF_SPADES, Card.SIX_OF_DIAMONDS],
			p0Points: [Card.THREE_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES, Card.KING_OF_CLUBS, Card.KING_OF_DIAMONDS],
			// Opponent is P1
			p1Hand: [Card.ACE_OF_HEARTS],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS, Card.QUEEN_OF_DIAMONDS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 3);
		cy.log('Loaded fixture');

		cy.playOneOffAndResolveAsPlayer(Card.SIX_OF_SPADES);

		assertGameState(
			0,
			{
				p0Hand: [Card.ACE_OF_CLUBS, Card.SIX_OF_DIAMONDS],
				p0Points: [Card.THREE_OF_SPADES, Card.ACE_OF_SPADES],
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
			.should('not.have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');
	}); // End 6 one-off

}); // End untargeted one-off describe

describe('FOURS', () => {
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
			
			cy.playOneOffAndResolveAsPlayer(Card.FOUR_OF_SPADES);
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
			// Set Up
			cy.loadGameFixture({
				p0Hand: [Card.FOUR_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [],
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');

			cy.playOneOffAndResolveAsPlayer(Card.FOUR_OF_CLUBS);

			cy.get('#waiting-for-opponent-discard-scrim')
				.should('be.visible');
			// Opponent chooses two cards to discard
			cy.log('Opponent discards both their remaining cards');
			cy.discardOpponent(Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS);
			cy.get('#waiting-for-opponent-discard-scrim')
				.should('not.be.visible');
		
			assertGameState(0, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.FOUR_OF_CLUBS, Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			});
		});
	
		it('Plays a 4 to make opponent discard the last card in their hand', () => {
			// Set Up
			cy.loadGameFixture({
				p0Hand: [Card.FOUR_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS],
				p1Points: [],
				p1FaceCards: [],
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');
	
			// Play the four of clubs
			cy.playOneOffAndResolveAsPlayer(Card.FOUR_OF_CLUBS);
			cy.get('#waiting-for-opponent-discard-scrim')
				.should('be.visible');
			// Opponent chooses two cards to discard
			cy.log('Opponent discards both their remaining cards');
			cy.discardOpponent(Card.ACE_OF_HEARTS);
			cy.get('#waiting-for-opponent-discard-scrim')
				.should('not.be.visible');
		
			assertGameState(0, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.FOUR_OF_CLUBS, Card.ACE_OF_HEARTS],
			});
		});
	
		it('Prevents playing a 4 when opponent has no cards in hand', () => {
			// Set Up
			cy.loadGameFixture({
				p0Hand: [Card.FOUR_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [],
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');
	
			// Play the four of spades
			cy.log('Attempting to playing Four of clubs as one off');
			cy.get('[data-player-hand-card=4-0]').click(); // four of clubs
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
	
			assertSnackbarError('You cannot play a 4 as a one-off while your opponent has no cards in hand');
		
			assertGameState(0, {
				p0Hand: [Card.FOUR_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [],
			});
		});
	});
	
	describe('Opponent playing FOURS', () => {
		beforeEach(() => {
			setupGameAsP1();
		});
		it('Discards two cards when opponent plays a four', () => {
			cy.loadGameFixture({
				p0Hand: [Card.FOUR_OF_CLUBS, Card.ACE_OF_HEARTS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.FOUR_OF_SPADES, Card.ACE_OF_DIAMONDS, Card.TEN_OF_HEARTS],
				p1Points: [],
				p1FaceCards: [],
			});
			cy.get('[data-player-hand-card]').should('have.length', 3);
			cy.log('Loaded fixture');
	
			// Opponent plays four
			cy.playOneOffOpponent(Card.FOUR_OF_CLUBS);
			// Player cannot counter
			cy.get('#cannot-counter-dialog')
				.should('be.visible')
				.get('[data-cy=cannot-counter-resolve]')
				.click();
	
			// Four Dialog appears (you must discard)
			cy.get('#four-discard-dialog')
				.should('be.visible');
			// Choosing cards to discard
			cy.log('Choosing two cards to discard');
			cy.get('[data-cy=submit-four-dialog]').should('be.disabled'); // can't prematurely submit
			cy.get('[data-discard-card=1-1]').click(); // ace of diamonds
			cy.get('[data-cy=submit-four-dialog]').should('be.disabled'); // can't prematurely submit
			cy.get('[data-discard-card=4-3]').click(); // four of spades
			cy.get('[data-cy=submit-four-dialog]').click(); // submit choice to discard
	
			assertGameState(1,
				{
					p0Hand: [Card.ACE_OF_HEARTS],
					p0Points: [],
					p0FaceCards: [],
					p1Hand: [Card.TEN_OF_HEARTS],
					p1Points: [],
					p1FaceCards: [],
					scrap: [Card.FOUR_OF_CLUBS, Card.FOUR_OF_SPADES, Card.ACE_OF_DIAMONDS],
				}
			)
		});
	
		it('Discards last card when FOURd with one card in hand', () => {
			cy.loadGameFixture({
				p0Hand: [Card.FOUR_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [],
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');	
	
			// Opponent plays four
			cy.playOneOffOpponent(Card.FOUR_OF_CLUBS);
			// Player cannot counter
			cy.get('#cannot-counter-dialog')
				.should('be.visible')
				.get('[data-cy=cannot-counter-resolve]')
				.click();
	
			// Four Dialog appears (you must discard)
			cy.get('#four-discard-dialog')
				.should('be.visible');
			// Choosing cards to discard
			cy.log('Choosing (only) card to discard');
			cy.get('[data-cy=submit-four-dialog]').should('be.disabled'); // can't prematurely submit
			cy.get('[data-discard-card=1-1]').click(); // ace of diamonds
			cy.get('[data-cy=submit-four-dialog]').click();
			
			assertGameState(1,
				{
					p0Hand: [],
					p0Points: [],
					p0FaceCards: [],
					p1Hand: [],
					p1Points: [],
					p1FaceCards: [],
					scrap: [Card.FOUR_OF_CLUBS, Card.ACE_OF_DIAMONDS],
				}
			);
		});
	});
});

describe('Play TWOS', () => {
	describe('Player Playing TWOS', () => {
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

		it('Plays TWO to Destroy Jacks', () => {
			cy.loadGameFixture({
				p0Hand: [Card.ACE_OF_SPADES, Card.TWO_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.JACK_OF_CLUBS],
				p1Points: [],
				p1FaceCards: [],
			});
			cy.get('[data-player-hand-card]').should('have.length', 2);
			cy.log('Loaded fixture');

			// player plays Ace of Spades
			cy.get('[data-player-hand-card=1-3]').click();
			cy.get('#player-field')
				.should('have.class', 'valid-move')
				.click()

			assertGameState(0, {
				p0Hand: [Card.TWO_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.JACK_OF_CLUBS],
				p1Points: [],
				p1FaceCards: []
			});

			cy.get('[data-player-hand-card]').should('have.length', 1);

			// opponent plays jack
			cy.playJackOpponent(Card.JACK_OF_CLUBS, Card.ACE_OF_SPADES)


			cy.get('[data-player-hand-card]').should('have.length', 1);

			assertGameState(0, {
				p0Hand: [Card.TWO_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.ACE_OF_SPADES],
				p1FaceCards: []
			});

			// player plays TWO to destroy jack
			cy.get('[data-player-hand-card=2-0]').click()
			cy.get('[data-opponent-face-card=11-0]').click()


			// Wait for opponent to resolve
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			cy.resolveOpponent()

			assertGameState(0, {
				p0Hand: [],
				p0Points: [Card.ACE_OF_SPADES, Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.TWO_OF_CLUBS, Card.JACK_OF_CLUBS]
			});
		}); // End playing TWO to destroy jack

		
	}); // End describe player playing twos

	describe('Opponent Playing TWOS', () => {
		beforeEach(() => {
			setupGameAsP1();
		});

		it('Opponent Plays TWO to Destroy Jacks', () => {
			cy.loadGameFixture({
				p0Hand: [Card.ACE_OF_SPADES, Card.TWO_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.JACK_OF_CLUBS],
				p1Points: [],
				p1FaceCards: [],
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');

			cy.playPointsOpponent(Card.ACE_OF_SPADES);

			cy.get('[data-player-hand-card=11-0]').click()
			cy.get('[data-opponent-point-card=1-3]').click()

			assertGameState(1, {
				p0Hand: [Card.TWO_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.ACE_OF_SPADES],
				p1FaceCards: [],
			});
			cy.log('Opponent playing TWO on jack')
			cy.playTargetedOneOffOpponent(Card.TWO_OF_CLUBS, Card.JACK_OF_CLUBS, 'jack')

			// player resolves
			cy.get('#cannot-counter-dialog')
				.should('be.visible')
				.get('[data-cy=cannot-counter-resolve]')
				.click()

			assertGameState(1, {
				p0Hand: [],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.TWO_OF_CLUBS, Card.JACK_OF_CLUBS]
			});
		});
		
	});
});

describe('Playing NINES', ()=>{
	describe('Player Playing NINES', () => {
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
	
	
		it('Plays a 9 on a jack to steal back point card', () => {
			cy.loadGameFixture({
				p0Hand: [Card.ACE_OF_SPADES, Card.NINE_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.JACK_OF_CLUBS],
				p1Points: [],
				p1FaceCards: [],
			});
			cy.get('[data-player-hand-card]').should('have.length', 2);
			cy.log('Loaded fixture');
	
			// player plays Ace of Spades
			cy.get('[data-player-hand-card=1-3]').click();
			cy.get('#player-field')
				.should('have.class', 'valid-move')
				.click()
	
			assertGameState(0, {
				p0Hand: [Card.NINE_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.JACK_OF_CLUBS],
				p1Points: [],
				p1FaceCards: []
			});
	
			cy.get('[data-player-hand-card]').should('have.length', 1);
	
			// opponent plays jack
			cy.playJackOpponent(Card.JACK_OF_CLUBS, Card.ACE_OF_SPADES)
	
	
			cy.get('[data-player-hand-card]').should('have.length', 1);
	
			assertGameState(0, {
				p0Hand: [Card.NINE_OF_CLUBS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.ACE_OF_SPADES],
				p1FaceCards: []
			});
	
			// player plays TWO to destroy jack
			cy.get('[data-player-hand-card=9-0]').click()
			cy.get('[data-opponent-face-card=11-0]').click()
	
	
			// Wait for opponent to resolve
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			cy.resolveOpponent()
	
			assertGameState(0, {
				p0Hand: [],
				p0Points: [Card.ACE_OF_SPADES, Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.JACK_OF_CLUBS],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_CLUBS]
			});
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
	}); // End Player playing 9s describe

	describe('Opponent Playing NINES', () => {
		beforeEach(() => {
			setupGameAsP1();
		});

		it('Opponent plays a NINE on a jack to steal back point card', () => {
			cy.loadGameFixture({
				p0Hand: [Card.ACE_OF_SPADES, Card.NINE_OF_CLUBS, Card.ACE_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.JACK_OF_CLUBS, Card.TEN_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [],
				topCard: Card.TEN_OF_CLUBS
			});
			cy.get('[data-player-hand-card]').should('have.length', 2);
			cy.log('Loaded fixture');

			// opponent plays Ace of Spades
			cy.playPointsOpponent(Card.ACE_OF_SPADES)

			// player plays jack
			cy.get('[data-player-hand-card=11-0]').click();
			cy.get('[data-opponent-point-card=1-3]').click();

			assertGameState(1, {
				p0Hand: [Card.NINE_OF_CLUBS, Card.ACE_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.TEN_OF_DIAMONDS],
				p1Points: [Card.ACE_OF_SPADES],
				p1FaceCards: []
			});

			cy.playTargetedOneOffOpponent(Card.NINE_OF_CLUBS, Card.JACK_OF_CLUBS, 'jack')

			// player resolves
			cy.get('#cannot-counter-dialog')
				.should('be.visible')
				.get('[data-cy=cannot-counter-resolve]')
				.click();

			assertGameState(1, {
				p0Hand: [Card.ACE_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.JACK_OF_CLUBS, Card.TEN_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_CLUBS]
			});

			// player plays the returned jack immediately
			cy.get('[data-player-hand-card=11-0]').click();
			cy.get('[data-opponent-point-card=1-3]').click();

			assertSnackbarError('That card is frozen! You must wait a turn to play it')


			cy.get('[data-player-hand-card=10-1]').click()
			cy.get('#player-field').click()

		
			assertGameState(1, {
				p0Hand: [Card.ACE_OF_DIAMONDS],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.JACK_OF_CLUBS],
				p1Points: [Card.TEN_OF_DIAMONDS],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_CLUBS]
			});	

			cy.playPointsOpponent(Card.ACE_OF_DIAMONDS)
			cy.get('[data-player-hand-card]').should('have.length', 1);


			// player plays jack after one turn
			cy.get('[data-player-hand-card=11-0]').click()
			cy.get('[data-opponent-point-card=1-1]').click()

			assertGameState(1, {
				p0Hand: [],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.ACE_OF_DIAMONDS, Card.TEN_OF_DIAMONDS],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_CLUBS]
			});
		}); // End 9 on jack
	}) // End Opponent playing NINES describe
})


describe('Playing THREEs', () => {
	beforeEach(() => {
		setupGameAsP0();
	});

	it('Plays 3s with no cards in scrap', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.THREE_OF_CLUBS],
			p0Points: [Card.TEN_OF_SPADES],
			p0FaceCards: [],
			p1Hand: [Card.ACE_OF_HEARTS, Card.TEN_OF_DIAMONDS],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);

		// Player plays three
		cy.get('[data-player-hand-card=3-0]').click(); // three of clubs
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click(); // scrap
		assertSnackbarError('You can only play a 3 as a one-off, if there are cards in the scrap pile');
	});

	it('Plays 3s successfully', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.THREE_OF_CLUBS],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [Card.TEN_OF_DIAMONDS],
			p1Points: [Card.ACE_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
			scrap: [Card.ACE_OF_SPADES, Card.TEN_OF_HEARTS, Card.TEN_OF_SPADES]
		});
		cy.get('[data-player-hand-card]').should('have.length', 1);

		// Player plays three
		cy.get('[data-player-hand-card=3-0]').click(); // three of clubs
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click(); // scrap

		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		
		cy.resolveOpponent();

		cy.get('#waiting-for-opponent-counter-scrim')
			.should('not.be.visible');

		cy.get('#three-dialog').should('be.visible');
		// resolve button should be disabled
		cy.get('[data-cy=three-resolve').should('be.disabled');
		
		// Player selects a card from scrap
		cy.get('[data-scrap-dialog-card=10-2]').click();
		cy.get('[data-cy=three-resolve').should('not.be.disabled').click();

		assertGameState(
			0,
			{
				p0Hand: [Card.TEN_OF_HEARTS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.TEN_OF_DIAMONDS],
				p1Points: [Card.ACE_OF_HEARTS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.ACE_OF_SPADES, Card.THREE_OF_CLUBS, Card.TEN_OF_SPADES],
			}
		);

		// Player attempts to play out of turn
		cy.get('[data-player-hand-card=10-2]').click(); // ten of hearts

		cy.get('#player-field')
			.should('not.have.class', 'valid-move')
			.click();
		assertSnackbarError('It\'s not your turn');

		cy.playPointsOpponent(Card.TEN_OF_DIAMONDS);

		assertGameState(
			0,
			{
				p0Hand: [Card.TEN_OF_HEARTS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.ACE_OF_HEARTS, Card.TEN_OF_DIAMONDS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.ACE_OF_SPADES, Card.THREE_OF_CLUBS, Card.TEN_OF_SPADES],
			}
		);
	})

	it('Opponent plays 3s successfully', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES],
			p0Points: [Card.TEN_OF_SPADES],
			p0FaceCards: [],
			p1Hand: [Card.ACE_OF_HEARTS, Card.TEN_OF_DIAMONDS, Card.THREE_OF_CLUBS],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 1);

		// put some cards into scrap
		cy.get('[data-player-hand-card=1-3]').click() // ace of space
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click(); // one-off

		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');

		cy.resolveOpponent();

		assertGameState(
			0,
			{
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.TEN_OF_DIAMONDS, Card.THREE_OF_CLUBS],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.ACE_OF_SPADES, Card.TEN_OF_HEARTS, Card.TEN_OF_SPADES],
			}
		);

		// opponent plays 3
		cy.playOneOffOpponent(Card.THREE_OF_CLUBS);

		// player resolves
		cy.get('[data-cy=cannot-counter-resolve]')
			.should('be.visible')
			.click();

		cy.get('#waiting-for-opponent-resolve-three-scrim')
			.should('be.visible');
		// waiting for opponent to choose from scrap scrim
		cy.resolveThreeOpponent(Card.ACE_OF_SPADES);

		cy.get('#waiting-for-opponent-resolve-three-scrim')
			.should('not.be.visible');

		assertGameState(
			0,
			{
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.TEN_OF_DIAMONDS, Card.ACE_OF_SPADES],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.TEN_OF_HEARTS, Card.TEN_OF_SPADES, Card.THREE_OF_CLUBS],
			}
		);
	})
}); // End 3s description

describe('ONE-OFF Target should be removed after one-off resolves', () => {
	beforeEach(() => {
		setupGameAsP1();
	});

	it('ONE-OFF Target should be removed after one-off resolves - target is POINTS', () => {
		cy.loadGameFixture({
			// Opponent is p0
			p0Hand: [Card.NINE_OF_SPADES, Card.NINE_OF_HEARTS, Card.FIVE_OF_CLUBS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			//player is p1
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Opponent plays NINE
		cy.playTargetedOneOffOpponent(Card.NINE_OF_SPADES, Card.ACE_OF_DIAMONDS, 'point');
		
		// Player resolves
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.get('[data-cy=cannot-counter-resolve]')
			.click();

		assertGameState(
			1,
			{
				p0Hand: [Card.NINE_OF_HEARTS, Card.FIVE_OF_CLUBS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_SPADES],
			}
		);

		// Player plays another point
		cy.get('[data-player-hand-card=6-2]').click();
		cy.get('#player-field').should('have.class', 'valid-move').click();

		// Opponent plays UN-TARGETED ONE-OFF
		cy.playOneOffOpponent(Card.FIVE_OF_CLUBS);

		// Cannot counter dialog should not have a target
		
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.should('not.contain', 'targetting')
			.get('[data-cy=cannot-counter-resolve]')
			.click();
	})


	it('ONE-OFF Target should be removed after one-off resolves - target is FACE CARD', () => {
		cy.loadGameFixture({
			// Opponent is p0
			p0Hand: [Card.NINE_OF_SPADES, Card.NINE_OF_HEARTS, Card.FIVE_OF_CLUBS],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			//player is p1
			p1Hand: [Card.SIX_OF_HEARTS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.QUEEN_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 1);
		cy.log('Loaded fixture');

		// Opponent plays NINE
		cy.playTargetedOneOffOpponent(Card.NINE_OF_SPADES, Card.QUEEN_OF_HEARTS, 'rune');
		
		// Player resolves
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.should('contain', 'targetting')
			.get('[data-cy=cannot-counter-resolve]')
			.click();

		assertGameState(
			1,
			{
				p0Hand: [Card.NINE_OF_HEARTS, Card.FIVE_OF_CLUBS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [],
				scrap: [Card.NINE_OF_SPADES],
			}
		);

		// Player plays another point
		cy.get('[data-player-hand-card=6-2]').click();
		cy.get('#player-field').should('have.class', 'valid-move').click();

		// Opponent plays UN-TARGETED ONE-OFF
		cy.playOneOffOpponent(Card.FIVE_OF_CLUBS);

		// Cannot counter dialog should not have a target
		
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.should('not.contain', 'targetting')
			.get('[data-cy=cannot-counter-resolve]')
			.click();
	});


	it('ONE-OFF Target should be removed after one-off resolves - target is JACK', () => {
		cy.loadGameFixture({
			// Opponent is p0
			p0Hand: [Card.TWO_OF_SPADES, Card.FIVE_OF_CLUBS, Card.TEN_OF_HEARTS],
			p0Points: [],
			p0FaceCards: [],
			//player is p1
			p1Hand: [Card.SIX_OF_HEARTS, Card.JACK_OF_CLUBS],
			p1Points: [Card.ACE_OF_DIAMONDS],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Opponent plays POINT
		cy.playPointsOpponent(Card.TEN_OF_HEARTS);

		// Play plays JACK
		cy.get('[data-player-hand-card=11-0]').click();
		cy.get('[data-opponent-point-card=10-2]').click();

		assertGameState(
			1,
			{
				p0Hand: [Card.TWO_OF_SPADES, Card.FIVE_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.SIX_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS, Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				scrap: [],
			}
		);	

		// Opponent plays TWO
		cy.playTargetedOneOffOpponent(Card.TWO_OF_SPADES, Card.JACK_OF_CLUBS, 'jack');
		
		// Player resolves
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.should('contain', 'targetting')
			.get('[data-cy=cannot-counter-resolve]')
			.click();

		assertGameState(
			1,
			{
				p0Hand: [Card.FIVE_OF_CLUBS],
				p0Points: [Card.TEN_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.SIX_OF_HEARTS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [],
				scrap: [Card.TWO_OF_SPADES, Card.JACK_OF_CLUBS],
			}
		);

		// Player plays another point
		cy.get('[data-player-hand-card=6-2]').click();
		cy.get('#player-field').should('have.class', 'valid-move').click();

		// Opponent plays UN-TARGETED ONE-OFF
		cy.playOneOffOpponent(Card.FIVE_OF_CLUBS);

		// Cannot counter dialog should not have a target
		
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.should('not.contain', 'targetting')
			.get('[data-cy=cannot-counter-resolve]')
			.click();
	});
});
