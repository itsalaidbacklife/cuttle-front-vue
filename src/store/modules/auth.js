const io = require('sails.io.js')( require('socket.io-client') );
io.sails.url = 'localhost:1337';
io.sails.useCORSRouteToGetCookie = false;


export default {
	state: {
		authenticated: false,
		email: null,
	},
	mutations: {
		authSuccess(state, email) {
			state.authenticated = true;
			state.email = email;
		},
		authFailure(state) {
			state.authenticated = false;
			state.email = null;
		}
	},
	actions: {
		requestLogin(context, data) {
			return new Promise((resolve, reject) => {
				io.socket.post('/user/login', {
					email: data.email,
					password: data.password
				}, function handleResponse(resData, jwres) {
					console.log(resData); // response body
					console.log(jwres); // Json wrapped data
					if (jwres.statusCode === 200) {
						context.commit('authSuccess', data.email);
						return resolve();
					}
					else {
						context.commit('authFailure');
						return reject(new Error('Error logging in'));
					}
				});
			});
		},

		requestSignup(context, data) {
			return new Promise((resolve, reject) => {
				io.socket.put('/user/signup', {
					email: data.email,
					password: data.password
				}, function handleResponse(resData, jwres) {
					console.log(resData);
					console.log(jwres);
					if (jwres.statusCode === 200) {
						console.log('auth success');
						context.commit('authSuccess', data.email);
						return resolve();
					}
					else {
						context.commit('authFailure');
						return reject(new Error('Error Signing Up :('));
					}
				});
			});
		},
	}
}