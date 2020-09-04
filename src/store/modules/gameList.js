import { io } from '../../plugins/sails.js';
let _ = require('lodash');

export default {
	state: {
		games: [],
	},
	mutations: {
		refreshGames(state, newList) {
			state.games = newList;
		},
		addGameToList(state, newGame) {
			state.games.push(newGame);
		}
	},
	actions: {
		requestGameList(context) {
			console.log('Requesting game list');
			return new Promise((resolve, reject) => {
				io.socket.get('/game/getList', function handleResponse(resData, jwres) {
					console.log(resData);
					console.log(jwres);
					if (jwres.statusCode === 200) {
						const games = _.cloneDeep(resData.games);
						context.commit('refreshGames', games);
						return resolve(resData.games);
					}
					return reject(new Error('Could not retrieve list of games'))
				});
			});
		}
	}
}