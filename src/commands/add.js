/**
 * Created by Will on 9/11/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = async (res, msg, args) => {
    const next = args[0] === 'next';
    if(!storage.has(msg.guild.id)) return res.error('no playlist to add to');

    return storage.get(msg.guild.id).playlist.add(res, next ? args.slice(1) : args);
};

exports.validator = val => {
    return val.ensureArgs();
};
