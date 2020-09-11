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
Cypress.Commands.add('signupThroughStore', (email, password) => {
    cy.window().its('app.$store').invoke('dispatch', 'requestSignup', {email, password});
});
Cypress.Commands.add('loginThroughStore', (email, password) => {
    cy.window().its('app.$store').invoke('dispatch', 'requestLogin', {email, password});
});
Cypress.Commands.add('vueRoute', (route) => {
    cy.window().its('app.$router').invoke('push', route);
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