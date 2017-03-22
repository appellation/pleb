/**
 * Created by Will on 2/12/2017.
 */
const Thonk = require('../util/providers/RethinkProvider');
const log = require('../util/log');

module.exports = async client => {
    log.info('client is ready: %s#%s', client.user.username, client.user.discriminator);
    if(process.env.rethink) {
        client.provider = new Thonk(client);
        await client.provider.initializeGuilds();
        log.verbose('initialized guilds in RethinkDB');
    }
};