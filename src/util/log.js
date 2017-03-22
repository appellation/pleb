const winston = require('winston');

module.exports = new class extends winston.Logger {
    constructor() {
        super({
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: 'pleb.log' })
            ],
            level: 'debug'
        });
    }
};