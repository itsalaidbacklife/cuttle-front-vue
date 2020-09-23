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
	case 'updated':
		switch(evData.data.change) {
		case 'ready':
			store.commit('updateReady', evData.data.pNum);
			break;
		}
		break;
	default:
		break;
	}
});

io.socket.on('join', function(evData) {
	store.commit('joinGame', {
		gameId: evData.gameId,
		newPlayer: evData.newPlayer,
		newStatus: evData.newStatus,
	});
	// If we are in game: update our game with new player
	if (evData.gameId === store.state.game.id) {
		store.commit('opponentJoined', evData.newPlayer);
	}
});