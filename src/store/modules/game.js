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
			console.log('updating game');
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
			console.log(state)
		},
		setMyPNum(state, val) {
			state.myPNum = val;
		}
	},
	actions: {
		async requestSubscribe(context, id) {
			console.log(`Requesting to subscribe ${id}`);
			return new Promise((resolve, reject) => {
				io.socket.get('/game/subscribe', {
					id,
				}, function handleResponse(res, jwres) {
					console.log(jwres);
					if (jwres.statusCode === 200) {
						context.commit('updateGame', res.game);
						context.commit('setMyPNum', res.pNum);
						return resolve();
					}
					return reject(new Error('error subscribing'));
				});
			});
		}
	}
}