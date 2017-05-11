const playlists = require('../util/storage/playlists');

module.exports = (client, replayed) => {
    for(const [, p] of playlists) p.stop('continue');

    client.log.hook({
        title: 'Resumed',
        description: `Replayed **${replayed}** events.`,
        color: 0x9bffd5
    });
};
