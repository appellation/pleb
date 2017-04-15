const storage = require('../util/storage/playlists');

module.exports = (guild) => {
    if(storage.has(guild.id)) storage.get(guild.id).destroy();
};
