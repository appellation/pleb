/**
 * Created by Will on 9/11/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = async (res, msg, args) => {
    const next = args[0] === 'next';
    if(!storage.has(msg.guild.id)) return res.error('no playlist to add to');

    const added = await storage.get(msg.guild.id).playlist.add(next ? args.slice(1) : args);
    return res.success(`added ${added.length} song${added.length === 1 ? '' : 's'}`);
};

exports.validator = val => {
    return val.ensureArgs();
};
