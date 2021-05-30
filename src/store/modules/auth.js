import { io } from '../../plugins/sails.js';

export default {
	state: {
		authenticated: false,
		email: null,
		socketHasDisconnected: false,
		mustReauthenticate: false,
	},
	getters: {
		myUserName(state) {
			return state.email ? state.email.split('@')[0] : null;
		},
	},
	mutations: {
		authSuccess(state, email) {
			state.authenticated = true;
			state.email = email;
		},
		authFailure(state) {
			state.authenticated = false;
			state.email = null;
		},
		setMustReauthenticate(state, val) {
			state.mustReauthenticate = val;
		},
	},
	actions: {
		requestLogin(context, data) {
			return new Promise((resolve, reject) => {
				io.socket.post(
					'/user/login',
					{
						email: data.email,
						password: data.password,
					},
					function handleResponse(resData, jwres) {
						if (jwres.statusCode === 200) {
							context.commit('authSuccess', data.email);
							return resolve();
						}
						context.commit('authFailure');
						return reject(jwres.body.message);
					}
				);
			});
		},

		requestSignup(context, data) {
			return new Promise((resolve, reject) => {
				io.socket.put(
					'/user/signup',
					{
						email: data.email,
						password: data.password,
					},
					function handleResponse(resData, jwres) {
						if (jwres.statusCode === 200) {
							context.commit('authSuccess', data.email);
							return resolve();
						}
						let message;
						if (Object.prototype.hasOwnProperty.call(resData, 'message')) {
							message = resData.message;
						} else if (typeof resData === 'string') {
							message = resData;
						} else {
							message = new Error('Unknown error signing up');
						}
						context.commit('authFailure');
						return reject(message);
					}
				);
			});
		},

		requestLogout(context) {
			return new Promise((resolve, reject) => {
				io.socket.get('/user/logout', {}, function handleResponse(
					resData,
					jwres
				) {
					if (jwres.statusCode === 200) {
						return resolve();
					}
					return reject(new Error('Error logging out :('));
				});
			});
		},
		requestReauthenticate(context, {email, password}) {
			return new Promise((resolve, reject) => {
				io.socket.get('/user/reLogin', {
					email,
					password
				}, function handleResponse(res, jwres) {
					if (jwres.statusCode === 200) {
						return resolve();
					}
					return reject(new Error('Error reauthenticating'));
				});
			});
		},
	},
};
