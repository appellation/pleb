/**
 * Created by Will on 12/17/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = (res, msg, args) => {
    storage.get(msg.guild.id).volume = parseFloat(args[0]);
};

exports.triggers = [
    'vol',
    'volume'
];

exports.validator = val => val.ensurePlaylist() && val.ensureArgs() && val.ensureIsNumber(0);