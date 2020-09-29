import { io } from '../../plugins/sails.js';
var _ = require('lodash');

export default {
	state: {
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
	},
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
			return state.myPNum === 0 ? state.p1Ready : state.p1Ready;
		}
	},
	mutations: {
		setGameId(state, val) {
			state.id = val;
		},
		updateGame(state, newGame) {
			state.id = newGame.id;
			state.chat = _.cloneDeep(newGame.chat);
			state.deck = _.cloneDeep(newGame.deck);
			state.log = _.cloneDeep(newGame.log);
			state.name = newGame.name;
			state.p0Ready = newGame.p0Ready;
			state.p1Ready = newGame.p1Ready;
			state.passes = newGame.passes;
			state.players = _.cloneDeep(newGame.players);
			state.scrap = _.cloneDeep(newGame.scrap);
			state.twos = _.cloneDeep(newGame.twos);
		},
		setMyPNum(state, val) {
			state.myPNum = val;
		},
		opponentJoined(state, newPlayer) {
			state.players.push(_.cloneDeep(newPlayer));
		},
		successfullyJoined(state, player) {
			state.players.push(_.cloneDeep(player));
		},
		updateReady(state, pNum) {
			if (pNum === 0) {
				state.p0Ready = !state.p0Ready;
			}
			else {
				state.p1Ready = !state.p1Ready;
			}
		}

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
		async requestReady() {
			return new Promise((resolve, reject) => {
				io.socket.post('/game/ready', function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						return Promise.resolve(res);
					}
					return reject(new Error('Error readying for game'));
				});
			});
		},
		async requestLobbyData(context) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/getLobbyData', function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						context.commit('updateGame', res.game);
						return Promise.resolve(res);
					}
				});
			});
		}
	}
}