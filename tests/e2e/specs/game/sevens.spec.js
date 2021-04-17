import { setupGameAsP0, setupGameAsP1, assertGameState, assertSnackbarError, Card } from '../../support/helpers';

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
});