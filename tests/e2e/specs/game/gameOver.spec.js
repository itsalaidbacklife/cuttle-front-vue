import { setupGameAsP0, setupGameAsP1, assertGameState, Card, assertSnackbarError } from '../../support/helpers';

describe('Ending the game', () =>  {
	beforeEach(() => {
		setupGameAsP0();
	});

	it('Shows when player wins game with 21 points', () => {
		cy.loadGameFixture({
			p0Hand: [Card.SEVEN_OF_CLUBS],
			p0Points: [Card.SEVEN_OF_DIAMONDS, Card.SEVEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]')
			.should('have.length', 1);
		cy.log('Fixture loaded');

		// Play Seven of Clubs
		cy.get('[data-player-hand-card=7-0]')
			.click();
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertGameState(0, {
			p0Hand: [],
			p0Points: [Card.SEVEN_OF_CLUBS, Card.SEVEN_OF_DIAMONDS, Card.SEVEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
		});

		cy.get('#game-over-dialog')
			.should('be.visible')
			.get('[data-cy=victory-heading]')
			.should('be.visible');
        
		cy.get('[data-cy=gameover-go-home]')
			.click();
		cy.url()
			.should('not.include', '/game');
		// Re-join game and confirm it loads normally
		setupGameAsP0(true);
		cy.get('#game-over-dialog')
			.should('not.be.visible');
		cy.get('[data-player-hand-card]')
			.should('have.length', 5);
    });
    
    it('Shows when player wins game with 14 points and one king', () => {
		cy.loadGameFixture({
			p0Hand: [Card.SEVEN_OF_CLUBS],
			p0Points: [Card.SEVEN_OF_DIAMONDS],
			p0FaceCards: [Card.KING_OF_SPADES],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]')
			.should('have.length', 1);
        cy.log('Fixture loaded');
        
		// Play Seven of Clubs
		cy.get('[data-player-hand-card=7-0]')
			.click();
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click();
		assertGameState(0, {
			p0Hand: [],
			p0Points: [Card.SEVEN_OF_CLUBS, Card.SEVEN_OF_DIAMONDS],
			p0FaceCards: [Card.KING_OF_SPADES],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
		});

		cy.get('#game-over-dialog')
			.should('be.visible')
			.get('[data-cy=victory-heading]')
			.should('be.visible');
        
		cy.get('[data-cy=gameover-go-home]')
			.click();
		cy.url()
			.should('not.include', '/game');
		// Re-join game and confirm it loads normally
		setupGameAsP0(true);
		cy.get('#game-over-dialog')
			.should('not.be.visible');
		cy.get('[data-player-hand-card]')
			.should('have.length', 5);
    });
});