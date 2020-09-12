import { io } from '../../plugins/sails.js';

export default {
	state: {
		gameId: null,
	},
	mutations: {
		setGameId(state, val) {
			state.gameId = val;
		}
	},
	actions: {
		async requestSubscribe(context, id) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/subscribe', {
					id,
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						context.commit('setGameId', id);
						return resolve();
					}
					return reject(new Error('error subscribing'));
				});
			});
		}
	}
}