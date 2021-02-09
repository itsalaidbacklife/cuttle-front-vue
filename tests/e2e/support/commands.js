/**
 * Require & configure socket connection to server
 */
const io = require('sails.io.js')(require('socket.io-client'));
io.sails.url = 'localhost:1337';
io.sails.useCORSRouteToGetCookie = false;

Cypress.Commands.add('wipeDatabase', () => {
	cy.request('localhost:1337/test/wipeDatabase');
});
Cypress.Commands.add('signupOpponent', (email, password) => {
	return new Promise((resolve, reject) => {
		io.socket.get(
			'localhost:1337/user/signup',
			{
				email,
				password,
			},
			function(res, jwres) {
				if (jwres.statusCode !== 200) {
					return reject(new Error('Failed to sign up via command'));
				}
				return resolve(res);
			}
		);
	});
});
Cypress.Commands.add('signupPlayer', (email, password) => {
	cy.window()
		.its('app.$store')
		.invoke('dispatch', 'requestSignup', { email, password });
});
Cypress.Commands.add('loginPlayer', (email, password) => {
	cy.window()
		.its('app.$store')
		.invoke('dispatch', 'requestLogin', { email, password });
});
Cypress.Commands.add('createGameOpponent', (name) => {
	return new Promise((resolve, reject) => {
		io.socket.post(
			'/game/create',
			{
				gameName: name,
			},
			function handleResponse(resData, jwres) {
				if (jwres.statusCode === 200) {
					return resolve(resData);
				}
				return reject(new Error('Error creating game'));
			}
		);
	});
});
Cypress.Commands.add('createGamePlayer', (name) => {
	return cy
		.window()
		.its('app.$store')
		.invoke('dispatch', 'requestCreateGame', name);
});
Cypress.Commands.add('subscribeOpponent', (id) => {
	return new Promise((resolve, reject) => {
		io.socket.get(
			'/game/subscribe',
			{
				id,
			},
			function handleResponse(res, jwres) {
				if (jwres.statusCode === 200) {
					return resolve();
				}
				return reject(new Error('error subscribing'));
			}
		);
	});
});
Cypress.Commands.add('readyOpponent', (id) => {
	return new Promise((resolve, reject) => {
		io.socket.get(
			'/game/ready',
			{
				id,
			},
			function handleResponse(res, jwres) {
				if (jwres.statusCode === 200) {
					return resolve();
				}
				return reject(new Error('error readying up opponent'));
			}
		);
	});
});
Cypress.Commands.add('leaveLobbyOpponent', (id) => {
	return new Promise((resolve, reject) => {
		io.socket.get('/game/leaveLobby', { id }, function handleResponse(
			_,
			jwres
		) {
			if (jwres.statusCode === 200) {
				return resolve();
			}
			return reject(new Error('error on opponent leaving lobby'));
		});
	});
});
Cypress.Commands.add('vueRoute', (route) => {
	cy.window()
		.its('app.$router')
		.invoke('push', route);
});


/**
 * @param gameSetup
 * {
 * 	 p0Hand: {suit: number, rank: number}[],
 *   p0Points: {suit: number, rank: number}[],
 *   p0FaceCards: {suit: number, rank: number}[],
 *   p1Hand: {suit: number, rank: number}[],
 *   p1Points: {suit: number, rank: number}[],
 *   p1FaceCards: {suit: number, rank: number}[],
 * }
 */
Cypress.Commands.add('loadGameFixture', (gameSetup) => {
	return cy
		.window()
		.its('app.$store.state.game')
		.then((game) => {
			const p0HandCardIds = getCardIds(game, gameSetup.p0Hand);
			const p0PointCardIds = getCardIds(game, gameSetup.p0Points);
			const p0FaceCardIds = getCardIds(game, gameSetup.p0FaceCards);
			const p1HandCardIds = getCardIds(game, gameSetup.p1Hand);
			const p1PointCardIds = getCardIds(game, gameSetup.p1Points);
			const p1FaceCardIds = getCardIds(game, gameSetup.p1FaceCards);
			io.socket.get('/game/loadFixture', {
				p0Id: game.players[0].id,
				p1Id: game.players[1].id,
				p0HandCardIds,
				p1HandCardIds,
				p0PointCardIds,
				p1PointCardIds,
				p0FaceCardIds,
				p1FaceCardIds,
			}, function handleResponse(res, jwres) {
				if (!jwres.statusCode === 200) {
					return Promise.reject(jwres.error);
				}
				return Promise.resolve(jwres);
			});
		});
});

function cardsMatch(card1, card2) {
	return card1.rank === card2.rank && card1.suit === card2.suit;
}
/**
 * @param game: game obj from $store
 * @param suitAndRankList: {suit: number, rank: number}[]
 * @returns lit of ids of specified cards
 */
function getCardIds(game, suitAndRankList) {
	return suitAndRankList.map((card) => {
		if (cardsMatch(card, game.topCard)) return game.topCard.id;
		if (cardsMatch(card, game.secondCard)) return game.secondCard.id;

		const foundInScrap = game.scrap.find((scrapCard) => cardsMatch(card, scrapCard));
		if (foundInScrap) return foundInScrap.id;
		
		const foundInP0Hand = game.players[0].hand.find((handCard) => cardsMatch(card, handCard));
		if (foundInP0Hand) return foundInP0Hand.id;

		const foundInP1Hand = game.players[1].hand.find((handCard) => cardsMatch(card, handCard));
		if (foundInP1Hand) return foundInP1Hand.id;

		const foundInDeck = game.deck.find((deckCard) => cardsMatch(card, deckCard));
		if (foundInDeck) return foundInDeck.id;
		
		throw new Error(`Could not find desired card ${card.rank} of ${card.suit} in deck, scrap, or either player's hand`);
	});
}
/**
 * Did not work -- reequest.body was undefined on server
 */
// Cypress.Commands.add('signup', (email, password) => {
//		 cy.request({
//				 url: 'localhost:1337/user/signup',
//				 body: {email, password}
//		 });
// });
