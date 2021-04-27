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
			topCard: Card.SIX_OF_DIAMONDS,
		});
	});
});

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

		// No longer wiating for opponent
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

	it.only('Opponent plays jack from seven', () => {
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

		// Opponent plays four of clubs for points
		cy.playJackFromSevenOpponent(Card.JACK_OF_CLUBS, Card.TEN_OF_HEARTS);

		// No longer wiating for opponent
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
			secondCard: Card.SIX_OF_DIAMONDS,
			scrap: [Card.SEVEN_OF_CLUBS],
		});
	});
});
