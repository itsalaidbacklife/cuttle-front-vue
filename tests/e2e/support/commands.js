/**
 * Require & configure socket connection to server
 */
const io = require("sails.io.js")(require("socket.io-client"));
io.sails.url = "localhost:1337";
io.sails.useCORSRouteToGetCookie = false;

Cypress.Commands.add('wipeDatabase', () => {cy.request('localhost:1337/test/wipeDatabase')});
Cypress.Commands.add('signup', (email, password) => {
    io.socket.get('localhost:1337/user/signup',
    {
        email,
        password
    });
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