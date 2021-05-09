import { setupGameAsP0, setupGameAsP1, assertGameState, Card, assertSnackbarError } from '../../support/helpers';

describe('Playing SEVENS', () => {
	beforeEach(() => {
		setupGameAsP0();
	});

	it('Plays points from a seven', () => {

		cy.loadGameFixture({
			p0Hand: [Card.SEVEN_OF_CLUBS],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
			topCard: Card.FOUR_OF_CLUBS,
			secondCard: Card.SIX_OF_DIAMONDS,
		});
		cy.get('[data-player-hand-card]').should('have.length', 1);
		cy.log('Loaded fixture');
        
		// Play seven of clubs
		cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent does not counter (resolves stack)
		cy.resolveOpponent();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('not.be.visible');
        
		cy.get('[data-top-card=4-0]')
			.should('exist')
			.and('be.visible');
		cy.get('[data-second-card=6-1]')
			.should('exist')
			.and('be.visible')
			.click();
        
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
        
		assertGameState(0, {
			p0Hand: [],
			p0Points: [Card.SIX_OF_DIAMONDS],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
			scrap: [Card.SEVEN_OF_CLUBS],
		});
	});

	it('Plays jack from a seven', () => {

		cy.loadGameFixture({
			p0Hand: [Card.SEVEN_OF_CLUBS],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [],
			topCard: Card.JACK_OF_CLUBS,
			secondCard: Card.SIX_OF_DIAMONDS,
		});
		cy.get('[data-player-hand-card]').should('have.length', 1);
		cy.log('Loaded fixture');
        
		// Play seven of clubs
		cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent does not counter (resolves stack)
		cy.resolveOpponent();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('not.be.visible');
        
		cy.get('[data-second-card=6-1]')
			.should('exist')
			.and('be.visible')
		cy.get('[data-top-card=11-0]')
			.should('exist')
			.and('be.visible')
			.click();
        
		cy.get('[data-opponent-point-card=10-2]')
			.click();
        
		assertGameState(0, {
			p0Hand: [],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
			scrap: [Card.SEVEN_OF_CLUBS],
		});
	});
	describe('Plays face cards from a seven', () => {
		it('Plays king from a seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				topCard: Card.SIX_OF_CLUBS,
				secondCard: Card.KING_OF_CLUBS,
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');
			
			// Play seven of clubs
			cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');
			
			cy.get('[data-top-card=6-0]')
				.should('exist')
				.and('be.visible')
			cy.get('[data-second-card=13-0]')
				.should('exist')
				.and('be.visible')
				.click();
			
			cy.get('#player-field')
				.should('have.class', 'valid-move')
				.click();
	
			assertGameState(0, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [Card.KING_OF_CLUBS],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				scrap: [Card.SEVEN_OF_CLUBS],
			});
		}); // End seven king test
	
		it('Plays queen from a seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				topCard: Card.SIX_OF_CLUBS,
				secondCard: Card.QUEEN_OF_CLUBS,
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');
			
			// Play seven of clubs
			cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');
			
			cy.get('[data-top-card=6-0]')
				.should('exist')
				.and('be.visible')
			cy.get('[data-second-card=12-0]')
				.should('exist')
				.and('be.visible')
				.click();
			
			cy.get('#player-field')
				.should('have.class', 'valid-move')
				.click();
	
			assertGameState(0, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [Card.QUEEN_OF_CLUBS],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				scrap: [Card.SEVEN_OF_CLUBS],
			});
		}); // End seven queen test
	
		it('Plays 8 as face card from a seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.TWO_OF_CLUBS],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				topCard: Card.SIX_OF_CLUBS,
				secondCard: Card.EIGHT_OF_CLUBS,
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');
			
			// Play seven of clubs
			cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');
			cy.get('[data-top-card=6-0]')
				.should('exist')
				.and('be.visible')
			cy.get('[data-second-card=8-0]')
				.should('exist')
				.and('be.visible')
				.click();
			cy.get('#player-field')
				.should('have.class', 'valid-move')
				.click();
			
			// Choose to play for face card
			cy.get('#eight-overlay')
				.should('be.visible')
				.get('[data-cy=eight-as-glasses]')
				.click();
			
			assertGameState(0, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [Card.EIGHT_OF_CLUBS],
				p1Hand: [Card.TWO_OF_CLUBS],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				scrap: [Card.SEVEN_OF_CLUBS],
			});
		}); // End seven glasses test
	}); // End seven face card describe
	
	it('Scuttles from a seven', () => {
		cy.loadGameFixture({
			p0Hand: [Card.SEVEN_OF_CLUBS],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [Card.NINE_OF_CLUBS],
			p1FaceCards: [],
			topCard: Card.TEN_OF_CLUBS,
			secondCard: Card.SIX_OF_DIAMONDS,
		});

		cy.get('[data-player-hand-card]').should('have.length', 1);
		cy.log('Loaded fixture');
		
		// Play seven of clubs
		cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
		cy.get('#scrap')
			.should('have.class', 'valid-move')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent does not counter (resolves stack)
		cy.resolveOpponent();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('not.be.visible');
		cy.get('[data-second-card=6-1]')
			.should('exist')
			.and('be.visible');
		cy.get('[data-top-card=10-0]')
			.click();
		// scuttles with 10 of clubs
		cy.get('[data-opponent-point-card=9-0]')
			.click();
		
		assertGameState(0, {
			p0Hand: [],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
			scrap: [Card.SEVEN_OF_CLUBS, Card.TEN_OF_CLUBS, Card.NINE_OF_CLUBS],
		});
	}); // End scuttle from seven

	describe('Playing untargeted one-offs from a seven', () => {
		it('Plays an ACE from a seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.SEVEN_OF_SPADES, Card.TEN_OF_SPADES],
				p1FaceCards: [],
				topCard: Card.JACK_OF_CLUBS,
				secondCard: Card.ACE_OF_DIAMONDS,
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');
	
			// Play seven of clubs
			cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');
	
			// Play Ace of diamonds
			cy.get('[data-top-card=11-0]')
				.should('exist')
				.and('be.visible')
			cy.get('[data-second-card=1-1]')
				.should('exist')
				.and('be.visible')
				.click();
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');
			
			assertGameState(0, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.SEVEN_OF_CLUBS, Card.SEVEN_OF_SPADES, Card.TEN_OF_SPADES, Card.ACE_OF_DIAMONDS]
			});
		});

		it('Cannot play 4 from seven when opponent has no cards in hand', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.SEVEN_OF_SPADES, Card.TEN_OF_SPADES],
				p1FaceCards: [],
				topCard: Card.FOUR_OF_HEARTS,
				secondCard: Card.ACE_OF_DIAMONDS,
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');
	
			// Play seven of clubs
			cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');

			// Play Four of hearts
			cy.get('[data-top-card=4-2]')
				.should('exist')
				.and('be.visible')
				.click();
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
			
			// Should not allow playing 4 as one-off
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');
			cy.get('#waiting-for-opponent-discard-scrim')
				.should('not.be.visible');
			assertSnackbarError('You cannot play a 4 as a one-off while your opponent has no cards in hand');
		});
	}); // End player seven one-off describe

	describe('Playing targeted one-offs from a seven', () => {
		it('Plays TWO from a seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS, Card.QUEEN_OF_CLUBS],
				topCard: Card.JACK_OF_CLUBS,
				secondCard: Card.TWO_OF_SPADES,
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');
			
			// Play seven of clubs
			cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');
	
			// Play two of spades
			cy.get('[data-second-card=2-3]')
				.should('exist')
				.and('be.visible')
				.click();
			// target queen of clubs
			cy.get('[data-opponent-face-card=12-0]')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');
			
			assertGameState(0, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.QUEEN_OF_CLUBS, Card.TWO_OF_SPADES, Card.SEVEN_OF_CLUBS],
			});
		}); // End playing TWO from seven

		it('Plays a NINE from a seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS, Card.QUEEN_OF_CLUBS],
				topCard: Card.NINE_OF_DIAMONDS,
				secondCard: Card.TWO_OF_SPADES,
			});
			cy.get('[data-player-hand-card]').should('have.length', 1);
			cy.log('Loaded fixture');
			// Play seven of clubs
			cy.get('[data-player-hand-card=7-0]').click(); // seven of clubs
			cy.get('#scrap')
				.should('have.class', 'valid-move')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');
			
			// Play Nine of diamonds
			cy.get('[data-top-card=9-1]')
				.should('exist')
				.and('be.visible')
				.click();
			// target queen of clubs
			cy.get('[data-opponent-face-card=12-0]')
				.find('.valid-move')
				.click();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('be.visible');
			// Opponent does not counter (resolves stack)
			cy.resolveOpponent();
			cy.get('#waiting-for-opponent-counter-scrim')
				.should('not.be.visible');

			assertGameState(0, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.QUEEN_OF_CLUBS],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.NINE_OF_DIAMONDS, Card.SEVEN_OF_CLUBS],
			});
		}); // End playing NINE from seven
	}); // End player seven tarted one-off describe
}); // End playing sevens describe()
describe('Opponent playing SEVENS', () => {
	beforeEach(() => {
		setupGameAsP1();
	});
	it('Opponent plays points from seven', () => {
		cy.loadGameFixture({
			p0Hand: [Card.SEVEN_OF_CLUBS],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
			topCard: Card.FOUR_OF_CLUBS,
			secondCard: Card.SIX_OF_DIAMONDS,
		});
		cy.get('[data-player-hand-card]').should('have.length', 0);
		cy.log('Loaded fixture');
	
		// Opponent plays 7 of clubs
		cy.playOneOffOpponent(Card.SEVEN_OF_CLUBS);
		// Player resolves
		cy.get('[data-cy=cannot-counter-resolve]')
			.should('be.visible')
			.click();
		cy.log('Player resolves (could not counter');

		// Waiting for opponent
		cy.get('#waiting-for-opponent-play-from-deck-scrim')
			.should('be.visible');
		// Deck cards appear but are not selectable
		cy.get('[data-top-card=4-0]')
			.should('exist')
			.and('be.visible')
			.click({ force: true })
			.should('not.have.class', 'selected');
		cy.get('[data-second-card=6-1]')
			.should('exist')
			.and('be.visible')
			.click({ force: true })
			.should('not.have.class', 'selected');
		cy.get('#scrap')
			.should('be.visible')
			.and('not.have.class', 'valid-move')
			.click({ force: true }); // can't play to scrap
		cy.get('#player-field')
			.should('not.have.class', 'valid-move')
			.click({ force: true }); // can't play to field

		// Opponent plays four of clubs for points
		cy.playPointsFromSevenOpponent(Card.FOUR_OF_CLUBS);

		// No longer waiting for opponent
		cy.get('#waiting-for-opponent-play-from-deck-scrim')
			.should('not.be.visible');
		cy.log('Done waiting for opponent');

		assertGameState(1, {
			p0Hand: [],
			p0Points: [Card.FOUR_OF_CLUBS],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
			secondCard: Card.SIX_OF_DIAMONDS,
			scrap: [Card.SEVEN_OF_CLUBS],
		});
	});

	it('Opponent plays jack from seven', () => {
		cy.loadGameFixture({
			p0Hand: [Card.SEVEN_OF_CLUBS],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [],
			topCard: Card.JACK_OF_CLUBS,
			secondCard: Card.SIX_OF_DIAMONDS,
		});
		cy.get('[data-player-hand-card]').should('have.length', 0);
		cy.log('Loaded fixture');
	
		// Opponent plays 7 of clubs
		cy.playOneOffOpponent(Card.SEVEN_OF_CLUBS);
		// Player resolves
		cy.get('[data-cy=cannot-counter-resolve]')
			.should('be.visible')
			.click();
		cy.log('Player resolves (could not counter');

		// Waiting for opponent
		cy.get('#waiting-for-opponent-play-from-deck-scrim')
			.should('be.visible');
		// Deck cards appear but are not selectable
		cy.get('[data-top-card=11-0]')
			.should('exist')
			.and('be.visible')
			.click({ force: true })
			.should('not.have.class', 'selected');
		cy.get('[data-second-card=6-1]')
			.should('exist')
			.and('be.visible')
			.click({ force: true })
			.should('not.have.class', 'selected');
		cy.get('#scrap')
			.should('be.visible')
			.and('not.have.class', 'valid-move')
			.click({ force: true }); // can't play to scrap
		cy.get('#player-field')
			.should('not.have.class', 'valid-move')
			.click({ force: true }); // can't play to field

		cy.playJackFromSevenOpponent(Card.JACK_OF_CLUBS, Card.TEN_OF_HEARTS);

		// No longer waiting for opponent
		cy.get('#waiting-for-opponent-play-from-deck-scrim')
			.should('not.be.visible');
		cy.log('Done waiting for opponent');

		assertGameState(1, {
			p0Hand: [],
			p0Points: [Card.TEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
			scrap: [Card.SEVEN_OF_CLUBS],
		});
	});
	describe('Opponent plays Face Cards from seven', () => {
		it('Opponent plays king from seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				topCard: Card.KING_OF_CLUBS,
				secondCard: Card.SIX_OF_DIAMONDS,
			});
			cy.get('[data-player-hand-card]').should('have.length', 0);
			cy.log('Loaded fixture');
		
			// Opponent plays 7 of clubs
			cy.playOneOffOpponent(Card.SEVEN_OF_CLUBS);
			// Player resolves
			cy.get('[data-cy=cannot-counter-resolve]')
				.should('be.visible')
				.click();
			cy.log('Player resolves (could not counter');
	
			// Waiting for opponent
			cy.get('#waiting-for-opponent-play-from-deck-scrim')
				.should('be.visible');
			
			cy.get('[data-top-card=13-0]')
				.should('exist')
				.and('be.visible')
				.click({ force: true })
				.should('not.have.class', 'selected');
			cy.get('#player-field')
				.should('not.have.class', 'valid-move')
				.click({ force: true }); // can't play to field
			cy.get('[data-second-card=6-1]')
				.should('exist')
				.and('be.visible')
				.click({ force: true })
				.should('not.have.class', 'selected');
			cy.get('#scrap')
				.should('be.visible')
				.and('not.have.class', 'valid-move')
				.click({ force: true }); // can't play to scrap
			cy.get('#player-field')
				.should('not.have.class', 'valid-move')
				.click({ force: true }); // can't play to field
			
			cy.playFaceCardFromSevenOpponent(Card.KING_OF_CLUBS);
			assertGameState(1, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [Card.KING_OF_CLUBS],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				scrap: [Card.SEVEN_OF_CLUBS],
			});
		}); // end opponent plays king from seven
		it('Opponent plays queen from seven', () => {

			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				topCard: Card.QUEEN_OF_CLUBS,
				secondCard: Card.SIX_OF_DIAMONDS,
			});
	
			cy.get('[data-player-hand-card]').should('have.length', 0);
			cy.log('Loaded fixture');
		
			// Opponent plays 7 of clubs
			cy.playOneOffOpponent(Card.SEVEN_OF_CLUBS);
			// Player resolves
			cy.get('[data-cy=cannot-counter-resolve]')
				.should('be.visible')
				.click();
			cy.log('Player resolves (could not counter');
	
			// Waiting for opponent
			cy.get('#waiting-for-opponent-play-from-deck-scrim')
				.should('be.visible');
			// Deck cards appear but are not selectable
			cy.get('[data-top-card=12-0]')
				.should('exist')
				.and('be.visible')
				.click({ force: true })
				.should('not.have.class', 'selected');
			cy.get('[data-second-card=6-1]')
				.should('exist')
				.and('be.visible')
				.click({ force: true })
				.should('not.have.class', 'selected');
			cy.get('#scrap')
				.should('be.visible')
				.and('not.have.class', 'valid-move')
				.click({ force: true }); // can't play to scrap
			cy.get('#player-field')
				.should('not.have.class', 'valid-move')
				.click({ force: true }); // can't play to field
	
			
			cy.playFaceCardFromSevenOpponent(Card.QUEEN_OF_CLUBS);
	
			// No longer waiting for opponent
			cy.get('#waiting-for-opponent-play-from-deck-scrim')
				.should('not.be.visible');
			cy.log('Done waiting for opponent');
	
			assertGameState(1, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [Card.QUEEN_OF_CLUBS],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				scrap: [Card.SEVEN_OF_CLUBS],
			});
		}); // end opponent plays queen from seven
	
		it('Opponent plays eight as glasses from seven', () => {
	
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				topCard: Card.EIGHT_OF_CLUBS,
				secondCard: Card.SIX_OF_DIAMONDS,
			});
	
			cy.get('[data-player-hand-card]').should('have.length', 0);
			cy.log('Loaded fixture');
		
			// Opponent plays 7 of clubs
			cy.playOneOffOpponent(Card.SEVEN_OF_CLUBS);
			// Player resolves
			cy.get('[data-cy=cannot-counter-resolve]')
				.should('be.visible')
				.click();
			cy.log('Player resolves (could not counter');
	
			// Waiting for opponent
			cy.get('#waiting-for-opponent-play-from-deck-scrim')
				.should('be.visible');
			// Deck cards appear but are not selectable
			cy.get('[data-top-card=8-0]')
				.should('exist')
				.and('be.visible')
				.click({ force: true })
				.should('not.have.class', 'selected');
			cy.get('[data-second-card=6-1]')
				.should('exist')
				.and('be.visible')
				.click({ force: true })
				.should('not.have.class', 'selected');
			cy.get('#scrap')
				.should('be.visible')
				.and('not.have.class', 'valid-move')
				.click({ force: true }); // can't play to scrap
			cy.get('#player-field')
				.should('not.have.class', 'valid-move')
				.click({ force: true }); // can't play to field
	
			
			cy.playFaceCardFromSevenOpponent(Card.EIGHT_OF_CLUBS);
	
			// No longer waiting for opponent
			cy.get('#waiting-for-opponent-play-from-deck-scrim')
				.should('not.be.visible');
			cy.log('Done waiting for opponent');
	
			assertGameState(1, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [Card.EIGHT_OF_CLUBS],
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [],
				scrap: [Card.SEVEN_OF_CLUBS],
			});
		}); // end opponent plays eight as glasses from seven
	}); // end opponent seven face card describe

	it('Opponent scuttles from seven', () => {
		cy.loadGameFixture({
			p0Hand: [Card.SEVEN_OF_CLUBS],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [Card.NINE_OF_CLUBS],
			p1FaceCards: [],
			topCard: Card.TEN_OF_CLUBS,
			secondCard: Card.SIX_OF_DIAMONDS,
		});
		cy.get('[data-player-hand-card]').should('have.length', 0);
		cy.log('Loaded fixture');
	
		// Opponent plays 7 of clubs
		cy.playOneOffOpponent(Card.SEVEN_OF_CLUBS);
		// Player resolves
		cy.get('[data-cy=cannot-counter-resolve]')
			.should('be.visible')
			.click();
		cy.log('Player resolves (could not counter');

		// Waiting for opponent
		cy.get('#waiting-for-opponent-play-from-deck-scrim')
			.should('be.visible');
		// Deck cards appear but are not selectable
		cy.get('[data-top-card=10-0]')
			.should('exist')
			.and('be.visible')
			.click({ force: true })
			.should('not.have.class', 'selected');
		cy.get('[data-second-card=6-1]')
			.should('exist')
			.and('be.visible')
			.click({ force: true })
			.should('not.have.class', 'selected');
		cy.get('#scrap')
			.should('be.visible')
			.and('not.have.class', 'valid-move')
			.click({ force: true }); // can't play to scrap
		cy.get('#player-field')
			.should('not.have.class', 'valid-move')
			.click({ force: true }); // can't play to field

		cy.scuttleFromSevenOpponent(Card.TEN_OF_CLUBS, Card.NINE_OF_CLUBS);

		// No longer waiting for opponent
		cy.get('#waiting-for-opponent-play-from-deck-scrim')
			.should('not.be.visible');
		cy.log('Done waiting for opponent');

		assertGameState(1, {
			p0Hand: [],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
			scrap: [Card.SEVEN_OF_CLUBS, Card.TEN_OF_CLUBS, Card.NINE_OF_CLUBS],
		});
	}); // End opponent scuttles from seven
	describe('Opponent plays one-off from seven', () => {
		it('Opponent plays SIX from seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.QUEEN_OF_CLUBS, Card.KING_OF_HEARTS],
				topCard: Card.SIX_OF_DIAMONDS,
				secondCard: Card.JACK_OF_CLUBS,
			});
			cy.get('[data-player-hand-card]').should('have.length', 0);
			cy.log('Loaded fixture');

			// Opponent plays 7 of clubs
			cy.playOneOffOpponent(Card.SEVEN_OF_CLUBS);
			// Player resolves
			cy.get('[data-cy=cannot-counter-resolve]')
				.should('be.visible')
				.click();
			cy.log('Player resolves seven of clubs (could not counter');

			// Waiting for opponent
			cy.get('#waiting-for-opponent-play-from-deck-scrim')
				.should('be.visible');
			// Opponent plays 6 of diamonds
			cy.playOneOffFromSevenOpponent(Card.SIX_OF_DIAMONDS);
			cy.log('Player resolves six of diamonds (could not counter');
			cy.get('[data-cy=cannot-counter-resolve]')
				.should('be.visible')
				.click();

			assertGameState(1, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [],
				scrap: [Card.SIX_OF_DIAMONDS, Card.QUEEN_OF_CLUBS, Card.KING_OF_HEARTS, Card.SEVEN_OF_CLUBS],
			});
		});

		it('Opponent plays TWO from seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS, Card.QUEEN_OF_CLUBS],
				topCard: Card.JACK_OF_CLUBS,
				secondCard: Card.TWO_OF_SPADES,
			});
			cy.get('[data-player-hand-card]').should('have.length', 0);
			cy.log('Loaded fixture');

			// Opponent plays 7 of clubs
			cy.playOneOffOpponent(Card.SEVEN_OF_CLUBS);
			// Player resolves
			cy.get('[data-cy=cannot-counter-resolve]')
				.should('be.visible')
				.click();
			cy.log('Player resolves seven of clubs (could not counter');

			// Waiting for opponent
			cy.get('#waiting-for-opponent-play-from-deck-scrim')
				.should('be.visible');

			// Opponent plays two of spades
			cy.playTargetedOneOffFromSevenOpponent(Card.TWO_OF_SPADES, Card.QUEEN_OF_CLUBS, 'rune');
			cy.get('[data-cy=cannot-counter-resolve]')
				.should('be.visible')
				.click();

			assertGameState(1, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.QUEEN_OF_CLUBS, Card.TWO_OF_SPADES, Card.SEVEN_OF_CLUBS],
			});
		}); // End Opponent TWO from seven

		it('Opponent plays NINE from seven', () => {
			cy.loadGameFixture({
				p0Hand: [Card.SEVEN_OF_CLUBS],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS, Card.QUEEN_OF_CLUBS],
				topCard: Card.NINE_OF_DIAMONDS,
				secondCard: Card.TWO_OF_SPADES,
			});
			cy.get('[data-player-hand-card]').should('have.length', 0);
			cy.log('Loaded fixture');

			// Opponent plays 7 of clubs
			cy.playOneOffOpponent(Card.SEVEN_OF_CLUBS);
			// Player resolves
			cy.get('[data-cy=cannot-counter-resolve]')
				.should('be.visible')
				.click();
			cy.log('Player resolves seven of clubs (could not counter');

			// Waiting for opponent
			cy.get('#waiting-for-opponent-play-from-deck-scrim')
				.should('be.visible');

			cy.playTargetedOneOffFromSevenOpponent(Card.NINE_OF_DIAMONDS, Card.QUEEN_OF_CLUBS, 'rune');
			cy.get('[data-cy=cannot-counter-resolve]')
				.should('be.visible')
				.click();

			assertGameState(1, {
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [],
				p1Hand: [Card.QUEEN_OF_CLUBS],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.NINE_OF_DIAMONDS, Card.SEVEN_OF_CLUBS],
			});
		}) // End Opponent NINE from seven
	}); // End Opponent seven one-off describe
}); // End opponent plays seven describe
