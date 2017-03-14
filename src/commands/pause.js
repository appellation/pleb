/**
 * Created by Will on 8/30/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = async (res, msg) => storage.get(msg.guild.id).pause();
exports.validator = val => val.ensurePlaylist();