/**
 * Created by Will on 2/12/2017.
 */
const Provider = require('../util/providers/SQLProvider');
const log = require('../util/log');

module.exports = async client => {
    log.info('client is ready: %s#%s', client.user.username, client.user.discriminator);
    const provider = client.provider = new Provider();
    await provider.initialize();
    await provider.initializeGuilds(client);
    log.verbose('initialized guilds');
};
