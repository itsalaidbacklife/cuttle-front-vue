import store from '../store/store.js';
import router from '../router/index.js';
let _ = require('lodash');

export const io = require('sails.io.js')(require('socket.io-client'));

if (process.env.NODE_ENV != 'production') {
	io.sails.url = process.env.VUE_APP_API_URL;
}
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
		switch (evData.data.change) {
		case 'ready':
			store.commit('updateReady', evData.data.pNum);
			break;
		case 'Initialize':
			store.commit('updateGame', evData.data.game);
			router.push(`/game/${store.state.game.id}`);
			break;
		case 'draw':
		case 'points':
		case 'runes':
		case 'scuttle':
		case 'loadFixture':
		case 'jack':
			store.commit('updateGame', evData.data.game);
			break;
		case 'resolveThree':
			store.commit('updateGame', evData.data.game);
			store.commit('setPickingFromScrap', false)
			store.commit('setWaitingForOpponentToPickFromScrap', false);
			break;
		case 'resolveFour':
			store.commit('updateGame', evData.data.game);
			store.commit('setWaitingForOpponentToDiscard', false);
			store.commit('setDiscarding', false);
			break;
		case 'resolve':
			store.commit('updateGame', evData.data.game);
			store.commit('setWaitingForOpponentToCounter', false);
			if (evData.data.happened) {
				switch (evData.data.oneOff.rank) {
				case 3:
					if (evData.data.playedBy !== store.state.game.myPNum) {
						store.commit('setWaitingForOpponentToPickFromScrap', true);
					} else {
						store.commit('setPickingFromScrap', true);
					}
					break;
				case 4:
					if (evData.data.playedBy === store.state.game.myPNum) {
						store.commit('setWaitingForOpponentToDiscard', true);
					} else {
						store.commit('setDiscarding', true);
					}
					break;
				case 7:
					if (evData.data.playedBy === store.state.game.myPNum) {
						store.commit('setPlayingFromDeck', true);
					} else {
						store.commit('setWaitingForOpponentToPlayFromDeck', true);
					}
					break;
				default:
					break;
				}
			}
			break;
		case 'oneOff':
		case 'counter':
			store.commit('updateGame', evData.data.game);
			if (evData.data.pNum !== store.state.game.myPNum) {
				store.commit('setWaitingForOpponentToCounter', false);
				store.commit('setMyTurnToCounter', true);
			}
			break;
		// Sevens
		case 'sevenPoints':
		case 'sevenJack':
		case 'sevenOneOff':
			store.commit('updateGame', evData.data.game);
			store.commit('setPlayingFromDeck', false);
			store.commit('setWaitingForOpponentToPlayFromDeck', false);
			break;
		}
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

io.socket.on('leftGame', function(evData) {
	if (evData.id === store.state.game.id) {
		store.commit('opponentLeft');
	} else {
		store.commit('otherLeftGame', evData.id);
	}
});
