import store from '../store/store.js';
let _ = require('lodash');

export const io = require("sails.io.js")(require("socket.io-client"));
io.sails.url = "localhost:1337";
io.sails.useCORSRouteToGetCookie = false;

// Handles socket updates of game data
io.socket.on('game', function(evData) {
	switch (evData.verb) {
	// New game was created
	case 'created':
		const newGame = _.cloneDeep(evData.data);
		store.commit('addGameToList', newGame);
		break;
	default:
		break;
	}
});

io.socket.on('gameFull', function(evData) {
	store.commit('updateGameStatus', {
		id: evData.id,
		newStatus: false,
	});
});