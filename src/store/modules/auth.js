const io = require('sails.io.js')( require('socket.io-client') );
io.sails.url = 'localhost:1337';
io.sails.useCORSRouteToGetCookie = false;


export default {
	state: {
		authenticated: false,
		userName: null,
	},
	mutations: {
		loginSuccess(state) {
			state.authenticated = true;
		}
	},
	actions: {
		requestLogin(context, data) {
			console.log('store action requestLogin');
			io.socket.post('/user/login', {
				email: data.email,
				password: data.password
			}, function handleResponse(resData, jwres) {
				console.log(resData); // response body
				console.log(jwres); // Json wrapped data
			});
		}
	}
}