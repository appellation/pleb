/**
 * Created by Will on 8/30/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = msg => storage.get(msg.guild.id).pause();
exports.validator = msg => msg.guild && storage.has(msg.guild.id);