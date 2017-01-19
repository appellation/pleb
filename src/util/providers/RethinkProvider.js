/**
 * Created by Will on 1/18/2017.
 */

const thonk = require('rethinkdbdash');
const storage = require('../storage/settings');
const Settings = require('./GuildSettings');

class RethinkProvider   {
    constructor(client)   {
        this.r = thonk({
            servers: [{
                host: process.env.rethink
            }],
            db: process.env.rethink_db
        });
        this.client = client;
    }

    initializeGuilds()  {
        const out = [];
        for(const g of this.client.guilds) out.push(this.initializeGuild(g));
        return Promise.all(out);
    }

    initializeGuild(guild)  {
        const setting = new Settings(this, guild);
        return setting.init().then(() => {
            storage.set(guild.id, setting);
        }).catch(() => null);
    }
}

module.exports = RethinkProvider;