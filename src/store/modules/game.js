import { io } from '../../plugins/sails.js';

var _ = require('lodash');
function resetState() {
	return {
		id: null,
		chat: [],
		deck: [],
		log: [],
		name: null,
		p0Ready: false,
		p1Ready: false,
		passes: 0,
		players: [],
		scrap: [],
		turn: 0,
		twos: [],
		myPNum: null,
		topCard: null,
		secondCard: null,
		oneOff: null,
		waitingForOpponentToCounter: false,
		myTurnToCounter: false,
		// Threes
		waitingForOpponentToPickFromScrap: false,
		pickingFromScrap: false,
		// Fours
		discarding: false,
		waitingForOpponentToDiscard: false,
		// Sevens
		playingFromDeck: false,
		waitingForOpponentToPlayFromDeck: false,
		// GameOver
		gameIsOver: false,
		winnerPNum: null,
		conceded: false,
	};
}
const initialState = resetState();
export default {
	state: initialState,
	getters: {
		opponent(state) {
			if (state.players.length < 2) {
				return null;
			}
			return state.players[(state.myPNum + 1) % 2];
		},
		opponentName(state, getters) {
			if (!getters.opponent) {
				return null;
			}
			return getters.opponent.email.split('@')[0];
		},
		opponentIsReady(state, getters) {
			if (!getters.opponent) {
				return null;
			}
			return state.myPNum === 0 ? state.p1Ready : state.p0Ready;
		}
	},
	mutations: {
		setGameId(state, val) {
			state.id = val;
		},
		updateGame(state, newGame) {
			if (Object.hasOwnProperty.call(newGame, 'id')) state.id = newGame.id;
			if (Object.hasOwnProperty.call(newGame, 'turn')) state.turn = newGame.turn;
			if (Object.hasOwnProperty.call(newGame, 'chat')) state.chat = _.cloneDeep(newGame.chat);
			if (Object.hasOwnProperty.call(newGame, 'deck')) state.deck = _.cloneDeep(newGame.deck);
			if (Object.hasOwnProperty.call(newGame, 'scrap')) state.scrap = _.cloneDeep(newGame.scrap);
			if (Object.hasOwnProperty.call(newGame, 'log')) state.log = _.cloneDeep(newGame.log);
			if (Object.hasOwnProperty.call(newGame, 'name')) state.name = newGame.name;
			if (Object.hasOwnProperty.call(newGame, 'p0Ready')) state.p0Ready = newGame.p0Ready;
			if (Object.hasOwnProperty.call(newGame, 'p1Ready')) state.p1Ready = newGame.p1Ready;
			if (Object.hasOwnProperty.call(newGame, 'passes')) state.passes = newGame.passes;
			if (Object.hasOwnProperty.call(newGame, 'players')) state.players = _.cloneDeep(newGame.players);
			if (Object.hasOwnProperty.call(newGame, 'twos')) state.twos = _.cloneDeep(newGame.twos);
			if (Object.hasOwnProperty.call(newGame, 'topCard')) state.topCard = _.cloneDeep(newGame.topCard);
			if (Object.hasOwnProperty.call(newGame, 'secondCard')) state.secondCard = _.cloneDeep(newGame.secondCard);
			if (Object.hasOwnProperty.call(newGame, 'oneOff')) state.oneOff = _.cloneDeep(newGame.oneOff);
			else state.oneOff = null
		},
		setMyPNum(state, val) {
			state.myPNum = val;
		},
		opponentJoined(state, newPlayer) {
			state.players.push(_.cloneDeep(newPlayer));
			state.players.sort((player, opponent) => player.pNum - opponent.pNum);
		},
		successfullyJoined(state, player) {
			state.players.push(_.cloneDeep(player));
		},
		successfullyLeft(state) {
			// Must use Object.assign to preserve reactivity
			Object.assign(state, resetState());
		},
		updateReady(state, pNum) {
			if (pNum === 0) {
				state.p0Ready = !state.p0Ready;
			}
			else {
				state.p1Ready = !state.p1Ready;
			}
		},
		opponentLeft(state) {
			state.players = state.players.filter(player => player.pNum === state.myPNum);
		},
		setMyTurnToCounter(state, val) {
			state.myTurnToCounter = val;
		},
		// Countering
		setWaitingForOpponentToCounter(state, val) {
			state.waitingForOpponentToCounter = val;
		},
		// Threes
		setPickingFromScrap(state, val) {
			state.pickingFromScrap = val;
		},
		setWaitingForOpponentToPickFromScrap(state, val) {
			state.waitingForOpponentToPickFromScrap = val;
		},
		// Fours
		setDiscarding(state, val) {
			state.discarding = val;
		},
		setWaitingForOpponentToDiscard(state, val) {
			state.waitingForOpponentToDiscard = val;
		},
		// Sevens
		setPlayingFromDeck(state, val) {
			state.playingFromDeck = val;
		},
		setWaitingForOpponentToPlayFromDeck(state, val) {
			state.waitingForOpponentToPlayFromDeck = val;
		},
		// Game Over
		setGameOver(state, {gameOver, conceded, winner}) {
			state.gameIsOver = gameOver;
			state.conceded = conceded;
			state.winnerPNum = winner;
		},
	},
	actions: {
		async requestSubscribe(context, id) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/subscribe', {
					id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						context.commit('updateGame', res.game);
						context.commit('setMyPNum', res.pNum);
						context.commit('successfullyJoined', {email: res.playerEmail, pNum: res.pNum});
						return resolve();
					}
					return reject(new Error('error subscribing'));
				});
			});
		},
		async requestLeaveLobby(context) {
			return new Promise((resolve, reject) => {
				io.socket.post('/game/leaveLobby', function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						context.commit('successfullyLeft');
						return resolve();
					}
					return reject(new Error('Error leaving lobby'));
				});
			});
		},
		async requestReady() {
			return new Promise((resolve, reject) => {
				io.socket.post('/game/ready', function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						return resolve(res);
					}
					return reject(new Error('Error readying for game'));
				});
			});
		},
		async requestLobbyData(context) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/lobbyData', function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						context.commit('updateGame', res);
						return Promise.resolve(res);
					}
					return reject(new Error('Error loading lobby data'));
				});
			});
		},
		async requestDrawCard(context) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/draw', function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						// Success (nothing to do)
						return resolve();
					}
					
					// Failure
					return reject(jwres.body.message);
					
				});
			});
		},
		async requestPlayPoints(context, cardId) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/points', {
					cardId,
				},
				function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});
		},
		async requestPlayFaceCard(context, cardId) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/runes', {
					cardId,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});
		},
		/**
		 * 
		 * @param cardData @example {cardId: number, targetId: number}
		 */
		async requestScuttle(context, cardData) {
			const { cardId, targetId } = cardData;
			return new Promise((resolve, reject) => {
				io.socket.get('/game/scuttle', {
					cardId,
					targetId,
					opId: context.getters.opponent.id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});
		},
		async requestPlayOneOff(context, cardId) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/untargetedOneOff', {
					cardId,
					opId: context.getters.opponent.id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					context.commit('setWaitingForOpponentToCounter', true);
					return resolve();
				});
			});
		},
		async requestPlayTargetedOneOff(context, {cardId, targetId, targetType}) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/targetedOneOff', {
					cardId,
					targetId,
					targetType,
					opId: context.getters.opponent.id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					context.commit('setWaitingForOpponentToCounter', true);
					return resolve();
				});
			});
		},
		async requestPlayJack(context, {cardId, targetId}) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/jack', {
					cardId,
					targetId,
					opId: context.getters.opponent.id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});
		},
		/**
		 * 
		 * @param {required} cardId1
		 * @param {optional} cardId2
		 */
		async requestDiscard(context, { cardId1, cardId2 }) {
			let reqData = {
				cardId1,
			};
			if (cardId2) {
				reqData = {
					cardId1,
					cardId2,
				};
			}
			return new Promise((resolve, reject) => {
				io.socket.get('/game/resolveFour',
					reqData,
					function(res, jwres) {
						if (jwres.statusCode != 200) {
							return reject(jwres.body.message);
						}
						return resolve();
					});
			});
		},
		async requestResolve(context) {
			context.commit('setMyTurnToCounter', false);
			
			return new Promise((resolve, reject) => {
				io.socket.get('/game/resolve', {
					opId: context.getters.opponent.id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});
		},
		async requestResolveThree(context, cardId ) {
			context.commit('setMyTurnToCounter', false);
			return new Promise((resolve, reject) => {
				io.socket.get('/game/resolveThree', {
					cardId,
					opId: context.getters.opponent.id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					context.commit('setWaitingForOpponentToCounter', false);
					return resolve();
				});
			});
		},
		async requestCounter(context, twoId) {
			context.commit('setMyTurnToCounter', false);
			
			return new Promise((resolve, reject) => {
				io.socket.get('/game/counter', {
					cardId: twoId,
					opId: context.getters.opponent.id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					context.commit('setWaitingForOpponentToCounter', true);
					return resolve();
				});
			});
		},
		////////////
		// Sevens //
		////////////
		async requestPlayPointsSeven(context, { cardId, index }) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/seven/points', {
					cardId,
					index, // 0 if topCard, 1 if secondCard
				},
				function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});	
		},
		async requestScuttleSeven(context, { cardId, index, targetId }) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/seven/scuttle', {
					cardId,
					index,
					targetId,
					opId: context.getters.opponent.id
				},
				function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});	
		},
		async requestPlayJackSeven(context, {cardId, index, targetId}) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/seven/jack', {
					cardId,
					index, // 0 if topCard, 1 if secondCard
					targetId,
					opId: context.getters.opponent.id,
				},
				function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});
		},
		async requestPlayFaceCardSeven(context, {index, cardId}) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/seven/runes', {
					cardId,
					index
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});
		},
		async requestPlayOneOffSeven(context, { cardId, index }) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/seven/untargetedOneOff', {
					cardId,
					index, // 0 if topCard, 1 if secondCard
					opId: context.getters.opponent.id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					context.commit('setWaitingForOpponentToCounter', true);
					return resolve();
				});
			});
		},
		async requestPlayTargetedOneOffSeven(context, { cardId, index, targetId, targetType }) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/seven/targetedOneOff', {
					cardId,
					targetId,
					targetType,
					index, // 0 if topCard, 1 if secondCard
					opId: context.getters.opponent.id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					context.commit('setWaitingForOpponentToCounter', true);
					return resolve();
				});
			});
		},
		async requestUnsubscribeFromGame(context) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/over', function handleResponse(res, jwres) {
					if (jwres.statusCode !== 200) {
						return reject(jwres.body.message);
					}
					return resolve();
				});
			});
		},
	} // End actions
} // End game module