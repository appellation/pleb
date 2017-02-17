/**
 * Created by Will on 2/12/2017.
 */
const Thonk = require('../util/providers/RethinkProvider');
const storage = require('../util/storage/settings');
module.exports = client => {
    if(process.env.rethink) {
        client.provider = new Thonk(client);
        client.provider.initializeGuilds();
    }   else {
        for(const [, g] of client.guilds) storage.set(g.id, { data: {} });
    }
};