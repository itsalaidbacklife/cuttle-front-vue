import { setupGameAsP1, assertGameState, Card } from '../../support/helpers';

describe('Countering One-Offs', () => {
	beforeEach(() => {
		setupGameAsP1();
	});

	it('Displays the cannot counter modal and resolves stack when opponent plays a one-off if player has no twos', () => {
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
		cy.get('[data-player-hand-card]').should('have.length', 1);
		cy.log('Fixture loaded');

		// Opponent plays ace of clubs
		cy.playOneOffOpponent(Card.ACE_OF_CLUBS);
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.get('[data-cy=cannot-counter-resolve]')
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
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Fixture loaded');

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
		cy.get('#waiting-for-opponent-counter-scrim')
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

	it('Declining option to counter resolves stack', () => {
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
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Fixture loaded');

		cy.playOneOffOpponent(Card.ACE_OF_CLUBS);
		cy.get('#cannot-counter-dialog')
			.should('not.be.visible');
		cy.get('#counter-dialog')
			.should('be.visible')
			.get('[data-cy=decline-counter-resolve]')
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

	it('Cancels decision to counter with Cancel button after choosing to counter', ()=> {
		// Setup
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
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Fixture loaded');

		// Opponent plays ace of clubs as one-off
		cy.playOneOffOpponent(Card.ACE_OF_CLUBS);
		cy.get('#cannot-counter-dialog')
			.should('not.be.visible');

		// Player initially chooses to counter
		cy.get('#counter-dialog')
			.should('be.visible')
			.get('[data-cy=counter]')
			.click();
		// Player then cancels decision to counter
		cy.get('#choose-two-dialog')
			.should('be.visible')
			.get('[data-cy=cancel-counter]')
			.click();

		assertGameState(
			1,
			{
				// Opponent is P0
				p0Hand: [Card.FOUR_OF_SPADES],
				p0Points: [],
				p0FaceCards: [Card.KING_OF_SPADES],
				// Player is P1
				p1Hand: [Card.ACE_OF_HEARTS, Card.TWO_OF_SPADES],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [Card.ACE_OF_CLUBS, Card.TEN_OF_SPADES, Card.ACE_OF_SPADES, Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			}
		);
	});

	it('Double counters successfully', ()=> {
		// Setup
		cy.loadGameFixture({
			// Opponent is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.TWO_OF_CLUBS],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			// Player is P1
			p1Hand: [Card.TWO_OF_HEARTS],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 1);
		cy.log('Loaded fixture');

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
			.get('[data-counter-dialog-card=2-2]')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent counters back
		cy.counterOpponent(Card.TWO_OF_CLUBS);
		
		// Player cannot counter back
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.get('[data-cy=cannot-counter-resolve]')
			.click();
		
		assertGameState(
			1,
			{
				// Opponent is P0
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [Card.KING_OF_SPADES],
				// Player is P1
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [
					Card.ACE_OF_CLUBS,
					Card.TWO_OF_HEARTS,
					Card.TWO_OF_CLUBS,
					Card.TEN_OF_SPADES,
					Card.ACE_OF_SPADES,
					Card.TEN_OF_HEARTS,
					Card.ACE_OF_DIAMONDS
				],
			}
		);
	});

	it('Triple counters successfully', ()=> {
		cy.loadGameFixture({
			// Opponent is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.TWO_OF_CLUBS],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			// Player is P1
			p1Hand: [Card.TWO_OF_HEARTS, Card.TWO_OF_SPADES],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');

		// Opponent plays ace of clubs as one-off
		cy.playOneOffOpponent(Card.ACE_OF_CLUBS);
		cy.get('#cannot-counter-dialog')
			.should('not.be.visible');

		// Player counters (1st counter)
		cy.get('#counter-dialog')
			.should('be.visible')
			.get('[data-cy=counter]')
			.click();
		cy.get('#choose-two-dialog')
			.should('be.visible')
			.get('[data-counter-dialog-card=2-2]')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent counters back (2nd counter)
		cy.counterOpponent(Card.TWO_OF_CLUBS);
		// Player counters again (3rd counter)
		cy.get('#counter-dialog')
			.should('be.visible')
			.get('[data-cy=counter]')
			.click();
		cy.get('#choose-two-dialog')
			.should('be.visible')
			.get('[data-counter-dialog-card=2-3]')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent resolves
		cy.resolveOpponent();

		assertGameState(
			1,
			{
				// Opponent is P0
				p0Hand: [],
				p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
				p0FaceCards: [Card.KING_OF_SPADES],
				// Player is P1
				p1Hand: [],
				p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [
					Card.ACE_OF_CLUBS,
					Card.TWO_OF_HEARTS,
					Card.TWO_OF_CLUBS,
					Card.TWO_OF_SPADES,
				]
			}
		);
	});

	it('Quadruple counters successfully', ()=> {
		cy.loadGameFixture({
			// Opponent is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.TWO_OF_CLUBS, Card.TWO_OF_DIAMONDS],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.KING_OF_SPADES],
			// Player is P1
			p1Hand: [Card.TWO_OF_HEARTS, Card.TWO_OF_SPADES],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});
		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');
		// Opponent plays ace of clubs as one-off
		cy.playOneOffOpponent(Card.ACE_OF_CLUBS);
		cy.get('#cannot-counter-dialog')
			.should('not.be.visible');

		// Player counters (1st counter)
		cy.get('#counter-dialog')
			.should('be.visible')
			.get('[data-cy=counter]')
			.click();
		cy.get('#choose-two-dialog')
			.should('be.visible')
			.get('[data-counter-dialog-card=2-2]')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent counters back (2nd counter)
		cy.counterOpponent(Card.TWO_OF_CLUBS);
		// Player counters again (3rd counter)
		cy.get('#counter-dialog')
			.should('be.visible')
			.get('[data-cy=counter]')
			.click();
		cy.get('#choose-two-dialog')
			.should('be.visible')
			.get('[data-counter-dialog-card=2-3]')
			.click();
		cy.get('#waiting-for-opponent-counter-scrim')
			.should('be.visible');
		// Opponent plays 4th and final counter
		cy.counterOpponent(Card.TWO_OF_DIAMONDS);
		// Player cannot counter back
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.get('[data-cy=cannot-counter-resolve]')
			.click();
		assertGameState(
			1,
			{
				// Opponent is P0
				p0Hand: [],
				p0Points: [],
				p0FaceCards: [Card.KING_OF_SPADES],
				// Player is P1
				p1Hand: [],
				p1Points: [],
				p1FaceCards: [Card.KING_OF_HEARTS],
				scrap: [
					Card.ACE_OF_CLUBS,
					Card.TWO_OF_HEARTS,
					Card.TWO_OF_CLUBS,
					Card.TWO_OF_SPADES,
					Card.TWO_OF_DIAMONDS,
					Card.TEN_OF_SPADES,
					Card.ACE_OF_SPADES,
					Card.TEN_OF_HEARTS,
					Card.ACE_OF_DIAMONDS
				],
			}
		);
	});

	it('Cannot Counter When Opponent Has Queen', () => {
		cy.loadGameFixture({
			// Opponent is P0
			p0Hand: [Card.ACE_OF_CLUBS, Card.TWO_OF_CLUBS, Card.TWO_OF_DIAMONDS],
			p0Points: [Card.TEN_OF_SPADES, Card.ACE_OF_SPADES],
			p0FaceCards: [Card.QUEEN_OF_CLUBS],
			// Player is P1
			p1Hand: [Card.TWO_OF_HEARTS, Card.TWO_OF_SPADES],
			p1Points: [Card.TEN_OF_HEARTS, Card.ACE_OF_DIAMONDS],
			p1FaceCards: [Card.KING_OF_HEARTS],
		});

		cy.get('[data-player-hand-card]').should('have.length', 2);
		cy.log('Loaded fixture');
		// Opponent plays ace of clubs as one-off
		cy.playOneOffOpponent(Card.ACE_OF_CLUBS);
		cy.get('#cannot-counter-dialog')
			.should('be.visible')
			.get('[data-cy=cannot-counter-resolve]')
			.click();

	});
});