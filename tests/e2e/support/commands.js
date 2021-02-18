import { getCardIds, hasValidSuitAndRank, cardsMatch } from './helpers';
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
Cypress.Commands.add('drawCardOpponent', () => {
	return new Promise((resolve, reject) => {
		io.socket.get('/game/draw', function handleResponse(res, jwres) {
			if (jwres.statusCode === 200) {
				return resolve();
			}
			return reject(new Error('error requesting opponent draw card'));
		});
	});
});
/**
 * @param card {suit: number, rank: number}
 */
Cypress.Commands.add('playPointsOpponent', (card) => {
	if (!hasValidSuitAndRank(card)) {
		throw new Error('Cannot play opponent points: Invalid card input');
	}
	return cy.window().its('app.$store.getters.opponent')
		.then((opponent) => {
			const foundCard = opponent.hand.find((handCard) => cardsMatch(card, handCard));
			if (!foundCard) {
				throw new Error(`Error playing opponents points: could not find ${card.rank} of ${card.suit} in opponent hand`)
			}
			const cardId = foundCard.id;
			io.socket.get('/game/points', {
				cardId
			},
			function handleResponse(res, jwres) {
				if (jwres.statusCode !== 200) {
					throw new Error(jwres.body.message);
				}
				return jwres;
			});
		});
});
/**
 * @param card {suit: number, rank: number}
 * @param target {suit: number, rank: number}
 */
Cypress.Commands.add('scuttleOpponent', (card, target) => {
	if (!hasValidSuitAndRank(card)) {
		throw new Error('Cannot scuttle as opponent: Invalid card input');
	}
	return cy
		.window()
		.its('app.$store.state.game')
		.then((game) => {
			const player = game.players[game.myPNum];
			const opponent = game.players[(game.myPNum + 1) % 2];
			const foundCard = opponent.hand.find((handCard) => cardsMatch(card, handCard));
			const foundTarget = player.points.find((pointCard) => cardsMatch(target, pointCard));
			if (!foundCard) {
				throw new Error(`Error scuttling as opponent: could not find ${card.rank} of ${card.suit} in opponent hand`);
			}
			if (!foundTarget) {
				throw new Error(`Error scuttling as opponent: could not find ${target.rank} of ${target.suit} in player's points`);
			}
			io.socket.get('/game/scuttle', {
				opId: player.id,
				cardId: foundCard.id,
				targetId: foundTarget.id,
			}, function handleResponse(res, jwres) {
				if (!jwres.statusCode === 200) {
					throw new Error(jwres.body.message);
				}
				return jwres;
			});
		});
});
Cypress.Commands.add('vueRoute', (route) => {
	cy.window()
		.its('app.$router')
		.invoke('push', route);
});


/**
 * @param fixture
 * {
 * 	 p0Hand: {suit: number, rank: number}[],
 *   p0Points: {suit: number, rank: number}[],
 *   p0FaceCards: {suit: number, rank: number}[],
 *   p1Hand: {suit: number, rank: number}[],
 *   p1Points: {suit: number, rank: number}[],
 *   p1FaceCards: {suit: number, rank: number}[],
 * }
 */
Cypress.Commands.add('loadGameFixture', (fixture) => {
	return cy
		.window()
		.its('app.$store.state.game')
		.then((game) => {
			const p0HandCardIds = getCardIds(game, fixture.p0Hand);
			const p0PointCardIds = getCardIds(game, fixture.p0Points);
			const p0FaceCardIds = getCardIds(game, fixture.p0FaceCards);
			const p1HandCardIds = getCardIds(game, fixture.p1Hand);
			const p1PointCardIds = getCardIds(game, fixture.p1Points);
			const p1FaceCardIds = getCardIds(game, fixture.p1FaceCards);
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



/**
 * Did not work -- reequest.body was undefined on server
 */
// Cypress.Commands.add('signup', (email, password) => {
//		 cy.request({
//				 url: 'localhost:1337/user/signup',
//				 body: {email, password}
//		 });
// });
