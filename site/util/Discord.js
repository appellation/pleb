const rp = require('request-promise-native');

module.exports = class {
    constructor(token) {
        this.req = rp.defaults({
            baseUrl: 'https://discordapp.com/api',
            headers: {
                Authorization: `Bearer ${token}`
            },
            json: true
        });
    }

    async profile() {
        return this.req.get('/users/@me');
    }

    async guilds() {
        return this.req.get('/users/@me/guilds');
    }
};