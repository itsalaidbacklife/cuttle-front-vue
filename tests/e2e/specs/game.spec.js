import { assertGameState } from '../support/helpers';

const validEmail = 'myCustomEmail@gmail.com';
const validPassword = 'passwordLongerThanEight';
const opponentEmail = 'yourMortalEnemy@cia.gov';
const opponentPassword = 'deviousTrickery';


function setup() {
	cy.wipeDatabase();
	cy.visit('/');
	cy.signupPlayer(validEmail, validPassword);
	cy.createGamePlayer('Test Game')
		.then((gameSummary) => {
			cy.window().its('app.$store').invoke('dispatch', 'requestSubscribe', gameSummary.gameId);
			cy.vueRoute(`/lobby/${gameSummary.gameId}`);
			cy.wrap(gameSummary).as('gameSummary');
			cy.get('[data-cy=ready-button]').click();
			cy.signupOpponent(opponentEmail, opponentPassword);
			cy.subscribeOpponent(gameSummary.gameId);
			cy.readyOpponent();
		});
    
}

describe('Game - Page Content', () => {
	beforeEach(() => {
		setup();
	});

	it('Plays Points', () => {
		
		cy.loadGameFixture(
			{
				p0Hand: [{suit: 3, rank: 1}, {suit: 0, rank: 1}],
				p0Points: [{suit: 3, rank: 10}],
				p0FaceCards: [{suit: 3, rank: 13}],
				p1Hand: [{suit: 2, rank: 1}, {suit: 1, rank: 1}],
				p1Points: [{suit: 2, rank: 10}],
				p1FaceCards: [{suit: 2, rank: 13}],
			}
		)
			.then(() => {
				/////////
				// DOM //
				/////////
				// Test initial score
				cy.get('#player-score')
					.should('contain', 'POINTS: 10')
					.should('contain', 'TARGET: 14');
				// Play points (ace of spades)
				cy.get('[data-cy=1-3]').click(); // ace of spades
				cy.get('#player-field')
					.should('have.class', 'valid-move')
					.click()
					.should('not.have.class', 'valid-move');
				// Test updated score
				cy.get('#player-score')
					.should('contain', 'POINTS: 11')
					.should('contain', 'TARGET: 14');

				// Test store state
				assertGameState(
					{
						// ace of spades moved from p0Hand to p0Points
						p0Hand: [{suit: 0, rank: 1}],
						p0Points: [{suit: 3, rank: 10}, {suit: 3, rank: 1}],
						p0FaceCards: [{suit: 3, rank: 13}],
						p1Hand: [{suit: 2, rank: 1}, {suit: 1, rank: 1}],
						p1Points: [{suit: 2, rank: 10}],
						p1FaceCards: [{suit: 2, rank: 13}],
					}
				);
			});
	})
})
