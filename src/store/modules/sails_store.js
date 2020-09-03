let io = require("sails.io.js")(require("socket.io-client"));
io.sails.url = "localhost:1337";
io.sails.useCORSRouteToGetCookie = false;

export default {
  state: {
    io: io
  },
  mutations: {},
  actions: {}
};
