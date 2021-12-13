

import { setupGameAsP0, setupGameAsP1, assertGameState, assertSnackbarError, Card } from '../../support/helpers';

describe('Game View Layout', () => {
	beforeEach(() => {
		setupGameAsP0();
	});

	it('Many cards on field', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.EIGHT_OF_SPADES, Card.QUEEN_OF_DIAMONDS],
			p0Points: [Card.ACE_OF_SPADES, Card.ACE_OF_CLUBS, Card.ACE_OF_DIAMONDS, Card.ACE_OF_HEARTS],
			p0FaceCards: [Card.KING_OF_HEARTS, Card.KING_OF_DIAMONDS, Card.KING_OF_CLUBS, Card.EIGHT_OF_HEARTS],
			p1Hand: [Card.SIX_OF_HEARTS, Card.QUEEN_OF_HEARTS, Card.EIGHT_OF_CLUBS],
			p1Points: [],
			p1FaceCards: [],
		})
		cy.get('[data-player-hand-card]').should('have.length', 2);
	});

	it('Quadruple jacks with a few cards', () => {
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

		// Play jack of clubs on ten of hearts
		cy.get('[data-player-hand-card=11-0]').click();
		cy.get('[data-move-choice=jack]').click();
		cy.get('[data-opponent-point-card=10-2]').click();

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
		cy.get('#turn-indicator')
			.contains('OPPONENT\'S TURN');
		
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
		cy.get('[data-player-hand-card=11-2]').click();
		cy.get('[data-move-choice=jack]').click();
		cy.get('[data-opponent-point-card=10-2]').click();

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

		cy.get('#turn-indicator')
			.contains('OPPONENT\'S TURN');

		// Opponent plays 4th jack
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

	it.only('Triple jacks on a card with multiple other cards', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_SPADES, Card.JACK_OF_CLUBS, Card.KING_OF_SPADES, Card.JACK_OF_HEARTS],
			p0Points: [Card.ACE_OF_CLUBS, Card.TWO_OF_SPADES, Card.TWO_OF_CLUBS],
			p0FaceCards: [],
			p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS, Card.JACK_OF_SPADES],
			p1Points: [Card.TEN_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 4);
		cy.log('Loaded fixture');

		// Play jack of clubs on ten of hearts
		cy.get('[data-player-hand-card=11-0]').click();
		cy.get('[data-move-choice=jack]').click();
		cy.get('[data-opponent-point-card=10-2]').click();

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES, Card.JACK_OF_HEARTS],
				p0Points: [Card.ACE_OF_CLUBS, Card.TWO_OF_SPADES, Card.TEN_OF_HEARTS, Card.TWO_OF_CLUBS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_DIAMONDS, Card.JACK_OF_SPADES],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});

		cy.get('[data-player-hand-card]').should('have.length', 3);
		// Attempt to play king out of turn
		cy.get('#turn-indicator')
			.contains('OPPONENT\'S TURN');

		// Opponent plays 2nd jack
		cy.playJackOpponent(Card.JACK_OF_DIAMONDS, Card.TEN_OF_HEARTS)

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES, Card.JACK_OF_HEARTS],
				p0Points: [Card.ACE_OF_CLUBS, Card.TWO_OF_SPADES, Card.TWO_OF_CLUBS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_SPADES],
				p1Points: [Card.TEN_OF_HEARTS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});

		// Player plays 3rd jack 
		cy.get('[data-player-hand-card=11-2]').click();
		cy.get('[data-move-choice=jack]').click();
		cy.get('[data-opponent-point-card=10-2]').click();

		assertGameState(0,
			{
				p0Hand: [Card.ACE_OF_SPADES, Card.KING_OF_SPADES],
				p0Points: [Card.ACE_OF_CLUBS, Card.TWO_OF_SPADES, Card.TEN_OF_HEARTS, Card.TWO_OF_CLUBS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_HEARTS, Card.ACE_OF_DIAMONDS, Card.JACK_OF_SPADES],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: []
			});
	});

	it('Four cards, each with a jack', () => {
		// Set Up
		cy.loadGameFixture({
			p0Hand: [Card.JACK_OF_CLUBS, Card.JACK_OF_HEARTS, Card.JACK_OF_DIAMONDS, Card.JACK_OF_SPADES],
			p0Points: [],
			p0FaceCards: [],
			p1Hand: [Card.ACE_OF_SPADES, Card.ACE_OF_DIAMONDS, Card.ACE_OF_CLUBS],
			p1Points: [Card.ACE_OF_HEARTS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 4);
		cy.log('Loaded fixture');

		// Play jack 
		cy.get('[data-player-hand-card=11-0]').click(); // jack of clubs

		cy.get('[data-opponent-point-card=1-2]')
			.click(); // target ace of hearts

		cy.playPointsOpponent(Card.ACE_OF_SPADES)

		assertGameState(
			0,
			{
				p0Hand: [Card.JACK_OF_HEARTS, Card.JACK_OF_DIAMONDS, Card.JACK_OF_SPADES],
				p0Points: [Card.ACE_OF_HEARTS],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_DIAMONDS, Card.ACE_OF_CLUBS],
				p1Points: [Card.ACE_OF_SPADES],
				p1FaceCards: [Card.KING_OF_HEARTS],
			}
		);

		// Play jack 
		cy.get('[data-player-hand-card=11-1]').click(); // jack of diamonds

		cy.get('[data-opponent-point-card=1-3]')
			.click(); // target ace of spades

		cy.playPointsOpponent(Card.ACE_OF_DIAMONDS)

		assertGameState(
			0,
			{
				p0Hand: [Card.JACK_OF_HEARTS, Card.JACK_OF_SPADES],
				p0Points: [Card.ACE_OF_HEARTS, Card.ACE_OF_SPADES],
				p0FaceCards: [],
				p1Hand: [Card.ACE_OF_CLUBS],
				p1Points: [Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.KING_OF_HEARTS],
			}
		);

		// Play jack 
		cy.get('[data-player-hand-card=11-2]').click(); // jack of hearts

		cy.get('[data-opponent-point-card=1-1]')
			.click(); // target ace of diamonds

		cy.playPointsOpponent(Card.ACE_OF_CLUBS)

		assertGameState(
			0,
			{
				p0Hand: [Card.JACK_OF_SPADES],
				p0Points: [Card.ACE_OF_HEARTS, Card.ACE_OF_SPADES, Card.ACE_OF_DIAMONDS],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [Card.ACE_OF_CLUBS],
				p1FaceCards: [Card.KING_OF_HEARTS],
			}
		);

		// Play jack 
		cy.get('[data-player-hand-card=11-3]').click(); // jack of spades

		cy.get('[data-opponent-point-card=1-0]')
			.click(); // target ace of clubs

		assertGameState(
			0,
			{
				p0Hand: [],
				p0Points: [Card.ACE_OF_HEARTS, Card.ACE_OF_SPADES, Card.ACE_OF_DIAMONDS, Card.ACE_OF_CLUBS],
				p0FaceCards: [],
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
			}
		);
	})

	it('Three dialogs', ()=>{
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
});

describe('Four dialogs layout', () => {
	beforeEach(() => {
		setupGameAsP1();
	});

	it('Four dialogs', () => {
    
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
})