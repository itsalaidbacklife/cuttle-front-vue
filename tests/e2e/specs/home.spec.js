const validEmail = "myCustomEmail@gmail.com";
const validPassword = "passwordLongerThanEight";
function setup() {
    cy.wipeDatabase();
    cy.visit('/');
    cy.signupThroughStore(validEmail, validPassword);
    cy.vueRoute('/');
}

describe('Home - Static Content', () => {
    beforeEach(setup);

    it('Displays headers', () => {
        expect(true).to.eq(false);
    });
    it('Displays logo', () => {
        expect(true).to.eq(false);
    });
    it('Play AI button links to CuttleBot', () => {
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
        expect(true).to.eq(false);
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