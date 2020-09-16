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
		},
		updateGameStatus(state, data) {
			const updatedGame = state.games.find((game) => game.id === data.id);
			updatedGame.status = data.newStatus;
		}
	},
	actions: {
		requestGameList(context) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/getList', function handleResponse(resData, jwres) {
					if (jwres.statusCode === 200) {
						const games = _.cloneDeep(resData.games);
						context.commit('refreshGames', games);
						return resolve(resData.games);
					}
					return reject(new Error('Could not retrieve list of games'))
				});
			});
		},
		requestCreateGame(context, newGameName) {
			return new Promise((resolve, reject) => {
				io.socket.get('/game/create', {
					gameName: newGameName
				}, function handleResponse(resData, jwres) {
					if (jwres.statusCode === 200) {
						return resolve(resData);
					}
					return reject(new Error('Error creating game'));
				});
			});
		},
	}
}