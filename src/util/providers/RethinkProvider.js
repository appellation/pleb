/**
 * Created by Will on 1/18/2017.
 */

const thonk = require('rethinkdbdash');
const Base = require('./BaseProvider');

class RethinkProvider extends Base {
    constructor() {
        super();
        this.r = thonk({
            servers: [{
                host: process.env.rethink
            }],
            db: process.env.rethink_db
        });
    }

    async getGuild(guildID) {
        return this.r.table('guilds').get(guildID).run();
    }
}

module.exports = RethinkProvider;
