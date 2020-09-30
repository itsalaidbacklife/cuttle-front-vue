import { io } from "../../plugins/sails.js";

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
		},
	},
	actions: {
		requestLogin(context, data) {
			return new Promise((resolve, reject) => {
				io.socket.post(
					"/user/login",
					{
						email: data.email,
						password: data.password,
					},
					function handleResponse(resData, jwres) {
						console.log(resData); // response body
						console.log(jwres); // Json wrapped data
						if (jwres.statusCode === 200) {
							context.commit("authSuccess", data.email);
							return resolve();
						}
						context.commit("authFailure");
						return reject(new Error("Error logging in"));
					}
				);
			});
		},

		requestSignup(context, data) {
			return new Promise((resolve, reject) => {
				io.socket.put(
					"/user/signup",
					{
						email: data.email,
						password: data.password,
					},
					function handleResponse(resData, jwres) {
						console.log(resData);
						console.log(jwres);
						if (jwres.statusCode === 200) {
							console.log("auth success");
							context.commit("authSuccess", data.email);
							return resolve();
						}
						context.commit("authFailure");
						return reject(new Error("Error Signing Up :("));
					}
				);
			});
		},

		requestLogout(context) {
			return new Promise((resolve, reject) => {
				io.socket.get("/user/logout", {}, function handleResponse(
					resData,
					jwres
				) {
					console.log(jwres);
					if (jwres.statusCode === 200) {
						console.log("logout success");
						return resolve();
					}
					return reject(new Error("Error logging out :("));
				});
			});
		},
	},
};
