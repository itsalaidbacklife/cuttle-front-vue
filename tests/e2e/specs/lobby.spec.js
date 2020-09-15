const validEmail = "myCustomEmail@gmail.com";
const validPassword = "passwordLongerThanEight";

function setup() {
	cy.wipeDatabase();
	cy.visit('/');
	cy.signupThroughStore(validEmail, validPassword);
	cy.createGameThroughStore('Test Game')
		.then((gameSummary) => {
			cy.vueRoute(`/lobby/${gameSummary.gameId}`);
		});
}
describe('Lobby - Page Content', () => {
	beforeEach(() => {
		setup();
	});
	it('Displays headers', () => {
		expect(true).to.eq(false);
	});
	it('Displays buttons', () => {
		cy.contains('button.v-btn', 'EXIT');
		cy.contains('button.v-btn', 'READY');
	});
	it('Shows both players indicators', () => {
		expect(true).to.eq(false);
	});
	it('Defaults to not-ready', () => {
		expect(true).to.eq(false);
	});
    
});

describe('Lobby - Event Handling', () => {
	beforeEach(() => {
		setup();
	});
	it('Exits the Lobby', () => {
		expect(true).to.eq(false);
	});
	it('Ready button works', () => {
		expect(true).to.eq(false);
	});
	it('Unready button works', () => {
		expect(true).to.eq(false);
	});
	it('Shows when opponent joins', () => {
		expect(true).to.eq(false);
	});
	it('Shows when opponent leaves', () => {
		expect(true).to.eq(false);
	});
	it('Shows when oppenent Readies up', () => {
		expect(true).to.eq(false);
	});
	it('Game starts when both players are ready', () => {
		expect(true).to.eq(false);
	});
});