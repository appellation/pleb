/**
 * Created by Will on 8/30/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = (res, msg) => storage.get(msg.guild.id).resume();
exports.validator = val => val.ensurePlaylist();