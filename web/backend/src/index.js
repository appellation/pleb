process.on('unhandledRejection', console.error);

const Server = require('./core/Server');
module.exports = new Server();
