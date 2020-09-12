const validEmail = "myCustomEmail@gmail.com";
const validPassword = "passwordLongerThanEight";
function setup() {
    cy.wipeDatabase();
    cy.visit('/');
    cy.signupThroughStore(validEmail, validPassword);
    cy.vueRoute('/');
}

describe('Home - Page Content', () => {
    beforeEach(setup);

    it('Displays headers', () => {
        cy.contains('h1', 'CUTTLE');
        cy.contains('h2', 'Games');
        cy.contains('h2', 'Create Game');
    });
    it('Displays logo', () => {
        expect(true).to.eq(false);
    });
    it('Play AI button links to CuttleBot', () => {
        cy.contains('a', 'Play with AI')
        .should('have.attr', 'href', 'https://human-ai-interaction.github.io/cuttle-bot/');
    });
    it('Logs user out', () => {
        expect(true).to.eq(false);
    });
});

describe('Home - Game List', () => {
    beforeEach(setup);

    it('Displays a game for every open game on the server', () => {
        expect(true).to.eq(false);
    });
    it('Displays placeholder text when no games are available', () => {
        expect(true).to.eq(false);
    });
    it('Adds a new game to the list when one comes in through the socket', () => {
        expect(true).to.eq(false);
    });
    it('Joins an open game', () => {
        cy.window().its('app.$store.state.game')
        .then((gameState) => {
            expect(gameState.gameId).to.eq(null);
        });
        cy.createGame();
        cy.get('[data-cy=game-list-item]')
        .contains('button.v-btn', 'JOIN')
        .click();
        cy.hash().should('contain', '#/lobby');
        cy.window().its('app.$store.state.game')
        .then((gameState) => {
            expect(gameState.gameId).to.not.eq(null);
        });
    });
    it('Disables join when a game becomes full', () => {
        expect(true).to.eq(false);
    });
});

describe('Home - Create Game', () => {
    beforeEach(setup);
    it('Creates a new game by hitting enter in text field', () => {
        expect(true).to.eq(false);
    });
    it('Creates a new game by hitting the submit button', () => {
        expect(true).to.eq(false);
    });
    it('Does not create game without game name', () => {
        expect(true).to.eq(false);
    });
});