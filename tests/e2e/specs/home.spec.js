const validEmail = "myCustomEmail@gmail.com";
const validPassword = "passwordLongerThanEight";
function setup() {
	cy.wipeDatabase();
	cy.visit("/");
	cy.signupThroughStore(validEmail, validPassword);
	cy.vueRoute("/");
}
function assertSuccessfulJoin(gameState) {
	expect(gameState.id).to.not.eq(null);
	cy.contains("h1", `Lobby for ${gameState.id}`);
}

describe("Home - Page Content", () => {
	beforeEach(setup);

	it("Displays headers", () => {
		cy.contains("h1", "CUTTLE");
		cy.contains("h2", "Games");
		cy.contains("h2", "Create Game");
	});
	it("Displays logo", () => {
		expect(true).to.eq(false);
	});
	it("Play AI button links to CuttleBot", () => {
		cy.contains("a", "Play with AI").should(
			"have.attr",
			"href",
			"https://human-ai-interaction.github.io/cuttle-bot/"
		);
	});
	it("Logs user out", () => {
		cy.get("[data-cy=btn-logout]").click();
		cy.contains("h1", "Log In");
	});
});

describe("Home - Game List", () => {
	beforeEach(setup);

	it("Displays a game for every open game on the server", () => {
		cy.createGameThroughStore("111");
		cy.createGameThroughStore("33");
		cy.request({
			method: "POST",
			url: "localhost:1337/game/getList",
			body: {},
		})
			.its("body")
			.then((body) => {
				cy.get("[data-cy=game-list-item]").should(
					"have.length",
					body.games.length
				);
				console.log("body", body.games.length);
			});
	});
	it("Displays placeholder text when no games are available", () => {
		cy.get("[data-cy=text-if-no-game]").should(
			"have.text",
			" No Active Games "
		);
		cy.contains("p", "No Active Games");
	});
	it("Adds a new game to the list when one comes in through the socket", () => {
		cy.createGameThroughStore("111");
		cy.createGameThroughStore("33");
		cy.request({
			method: "POST",
			url: "localhost:1337/game/getList",
			body: {},
		})
			.its("body")
			.then((body) => {
				cy.get("[data-cy=game-list-item]").should(
					"have.length",
					body.games.length
				);
				console.log("body", body.games.length);
			});
	});
	it("Joins an open game", () => {
		cy.window()
			.its("app.$store.state.game")
			.then((gameState) => {
				expect(gameState.id).to.eq(null);
			});
		cy.createGameThroughStore("Test Game");
		cy.get("[data-cy=game-list-item]")
			.contains("button.v-btn", "JOIN")
			.click();
		cy.hash().should("contain", "#/lobby");
		cy.window()
			.its("app.$store.state.game")
			.then((gameState) => {
				assertSuccessfulJoin(gameState);
			});
	});
	it("Joins a game that already has one player", () => {
		/**
     * Set up:
     * Create game, sign up one other user and subscribe them to the game
     */
		cy.createGameThroughStore("Test Game").then((gameData) => {
			// Sign up new user and subscribe them to game
			cy.signup("secondUser@aol.com", "myNewPassword");
			cy.subscribeOtherUser(gameData.gameId);
			// Our user then joins through UI
			cy.get("[data-cy=game-list-item]")
				.contains("button.v-btn", "JOIN")
				.click();
			// Should have redirected to lobby page and updated store
			cy.hash().should("contain", "#/lobby");
			cy.window()
				.its("app.$store.state.game")
				.then((gameState) => {
					// expect(gameState.gameId).to.not.eq(null);
					assertSuccessfulJoin(gameState);
				});
		});
	});
	it("Disables join when a game becomes full", () => {
		/**
     * Set up:
     * Create game, sign up two other users, subscribe them to the game
     */
		cy.createGameThroughStore("Test Game").then((gameData) => {
			// Test that JOIN button starts enabled
			cy.contains("button.v-btn", "JOIN").should("not.be.disabled");
			// Sign up 2 users and subscribe them to game
			cy.signup("secondUser@aol.com", "myNewPassword");
			cy.subscribeOtherUser(gameData.gameId);
			cy.signup("thirdUser@facebook.com", "anotherUserPw");
			cy.subscribeOtherUser(gameData.gameId);

			// Test that join button is now disabled
			cy.contains("button.v-btn", "JOIN").should("be.disabled");
		});
	});
});

describe("Home - Create Game", () => {
	beforeEach(setup);
	it("Creates a new game by hitting enter in text field", () => {
		cy.get("[data-cy=create-game-input]").type("test game" + "{enter}");
		cy.request({
			method: "POST",
			url: "localhost:1337/game/getList",
			body: {},
		})
			.its("body")
			.then((body) => {
				cy.get("[data-cy=game-list-item-name]").should(
					"have.text",
					" test game "
				);
			});
	});

	it("Creates a new game by hitting the submit button", () => {
		cy.get("[data-cy=create-game-input]").type("test game");
		cy.get("[data-cy=create-game-btn]").click();
		cy.request({
			method: "POST",
			url: "localhost:1337/game/getList",
			body: {},
		})
			.its("body")
			.then((body) => {
				cy.get("[data-cy=game-list-item-name]").should(
					"have.text",
					" test game "
				);
			});
	});
	it("Does not create game without game name", () => {
		cy.get("[data-cy=create-game-btn]").click();
		cy.window()
			.its("app.$store.state.game")
			.then((gameState) => {
				expect(gameState.gameId).to.eq(null);
			});
	});
});
