import { setupGameAsP0, validEmail, validPassword, assertGameState, Card } from '../../support/helpers';
describe('Reconnecting to a game', () => {
	it('Reconnects after refreshing the page', () => {
		setupGameAsP0();

		cy.loadGameFixture({
			p0Hand: [Card.ACE_OF_CLUBS],
			p0Points: [Card.SEVEN_OF_DIAMONDS, Card.SEVEN_OF_HEARTS],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
		});
		cy.get('[data-player-hand-card]')
			.should('have.length', 1);
		cy.log('Fixture loaded');

		// Reload page, relogin
		cy.reload();
		cy.get('#reauthenticate-dialog')
			.should('be.visible');
		cy.get('[data-cy=username]').type(validEmail);
		cy.get('[data-cy=password]').type(validPassword);
		cy.get('[data-cy=login]').click();
		cy.get('#reauthenticate-dialog')
			.should('not.be.visible');
		cy.log('Reauthenticated');

		// // Play Ace of Clubs for points
		cy.get('[data-player-hand-card=1-0]').click();
		cy.get('#player-field')
			.should('have.class', 'valid-move')
			.click()
			.should('not.have.class', 'valid-move');
        
		assertGameState(0, {
			p0Hand: [],
			p0Points: [Card.SEVEN_OF_DIAMONDS, Card.SEVEN_OF_HEARTS, Card.ACE_OF_CLUBS],
			p0FaceCards: [],
			p1Hand: [],
			p1Points: [],
			p1FaceCards: [],
		});
	});
});