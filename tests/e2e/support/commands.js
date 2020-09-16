/**
 * Require & configure socket connection to server
 */
const io = require("sails.io.js")(require("socket.io-client"));
io.sails.url = "localhost:1337";
io.sails.useCORSRouteToGetCookie = false;

Cypress.Commands.add("wipeDatabase", () => {
	cy.request("localhost:1337/test/wipeDatabase");
});
Cypress.Commands.add("signup", (email, password) => {
	io.socket.get("localhost:1337/user/signup", {
		email,
		password,
	});
});
Cypress.Commands.add("signupThroughStore", (email, password) => {
	cy.window()
		.its("app.$store")
		.invoke("dispatch", "requestSignup", { email, password });
});
Cypress.Commands.add("loginThroughStore", (email, password) => {
	cy.window()
		.its("app.$store")
		.invoke("dispatch", "requestLogin", { email, password });
});
Cypress.Commands.add("vueRoute", (route) => {
	cy.window()
		.its("app.$router")
		.invoke("push", route);
});
Cypress.Commands.add("createGame", (name) => {
	io.socket.get(
		"localhost:1337/game/create",
		{
			gameName: name,
		},
		// function handleResponse(resData, jwres) {
		//   if (jwres.statusCode === 200) {
		//     console.log(resData);
		//     return resolve();
		//   }
		//   return reject(new Error("Error creating game"));
		// }
		(res) => {
			console.log(res);
		}
	);
});
Cypress.Commands.add("createGameThroughStore", (name) => {
	cy.window()
		.its("app.$store")
		.invoke("dispatch", "requestCreateGame", name);
});

/**
 * Did not work -- reequest.body was undefined on server
 */
// Cypress.Commands.add('signup', (email, password) => {
//     cy.request({
//         url: 'localhost:1337/user/signup',
//         body: {email, password}
//     });
// });
