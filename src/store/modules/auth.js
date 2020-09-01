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
			io.socket.post('/user/login', {
				email: data.email,
				password: data.password
			}, function handleResponse(resData, jwres) {
				console.log(resData); // response body
				console.log(jwres); // Json wrapped data
			});
		},

		requestSignup(context, data) {
			io.socket.put('/user/signup', {
				email: data.email,
				password: data.password
			}, function handleResponse(resData, jwres) {
				console.log(resData);
				console.log(jwres);
				if (jwres.statusCode === 200) {
					return Promise.resolve();
				}
				else {
					return Promise.reject(new Error('Error Signing Up :('));
				}
			});
		},
	}
}