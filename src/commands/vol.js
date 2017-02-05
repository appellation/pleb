/**
 * Created by Will on 12/17/2016.
 */

const storage = require('../util/storage/playlists');
const command = require('../util/command');

exports.func = (res, msg, args) => {
    storage.get(msg.guild.id).volume = parseFloat(args[0]);
};

exports.triggers = [
    'vol',
    'volume'
];

exports.validator = val => val.ensurePlaylist();