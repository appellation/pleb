/**
 * Created by Will on 1/16/2017.
 */

const storage = require('../util/storage/playlists');

exports.func = msg => {
    const cur = storage.get(msg.guild.id).playlist.current;
    return msg.channel.sendMessage(cur.url);
};

exports.validator = msg => msg.channel.type === 'text' && storage.has(msg.guild.id);

exports.triggers = [
    'current',
    'currentsong'
];