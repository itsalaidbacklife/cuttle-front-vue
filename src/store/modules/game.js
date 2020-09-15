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
		} 
	}
}