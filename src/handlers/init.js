const Provider = require('../util/providers/SQLProvider');

module.exports = async client => {
    client.log.info('client is ready: %s#%s', client.user.username, client.user.discriminator);
    const provider = client.provider = new Provider();
    await provider.initialize();
    await provider.initializeGuilds(client);

    client.log.hook({
        title: 'Initialized',
        color: 0x00ff93
    });

    client.log.verbose('initialized guilds');
};
