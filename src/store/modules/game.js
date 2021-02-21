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
		waitingForOpponent: false,
		myTurnToCounter: false,
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
			if (Object.hasOwnProperty.call(newGame, 'chat')) state.chat = _.cloneDeep(newGame.chat);
			if (Object.hasOwnProperty.call(newGame, 'deck')) state.deck = _.cloneDeep(newGame.deck);
			if (Object.hasOwnProperty.call(newGame, 'scrap')) state.scrap = _.cloneDeep(newGame.scrap);
			if (Object.hasOwnProperty.call(newGame, 'log')) state.log = _.cloneDeep(newGame.log);
			if (Object.hasOwnProperty.call(newGame, 'name')) state.name = newGame.name;
			if (Object.hasOwnProperty.call(newGame, 'p0Ready')) state.p0Ready = newGame.p0Ready;
			if (Object.hasOwnProperty.call(newGame, 'p1Ready')) state.p1Ready = newGame.p1Ready;
			if (Object.hasOwnProperty.call(newGame, 'passes')) state.passes = newGame.passes;
			if (Object.hasOwnProperty.call(newGame, 'players')) state.players = _.cloneDeep(newGame.players);
			if (Object.hasOwnProperty.call(newGame, 'srap')) state.scrap = _.cloneDeep(newGame.scrap);
			if (Object.hasOwnProperty.call(newGame, 'twos')) state.twos = _.cloneDeep(newGame.twos);
			if (Object.hasOwnProperty.call(newGame, 'topCard')) state.topCard = _.cloneDeep(newGame.topCard);
			if (Object.hasOwnProperty.call(newGame, 'secondCard')) state.secondCard = _.cloneDeep(newGame.secondCard);
			if (Object.hasOwnProperty.call(newGame, 'oneOff')) state.topCard = _.cloneDeep(newGame.oneOff);
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
		setWaitingForOpponent(state, val) {
			state.waitingForOpponent = val;
		},
		setMyTurnToCounter(state, val) {
			state.myTurnToCounter = val;
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
			console.log('requesting lobby data');
			return new Promise((resolve, reject) => {
				io.socket.get('/game/lobbyData', function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						context.commit('updateGame', res);
						return Promise.resolve(res);
					}
					console.log(jwres);
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
					context.commit('setWaitingForOpponent', true);
					return resolve();
				});
			});
		}
	}
}