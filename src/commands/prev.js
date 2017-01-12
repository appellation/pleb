/**
 * Created by Will on 11/11/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = (msg, args) => {
    const operator = storage.get(msg.guild.id);
    const num = parseInt(args[0]) || 1;
    for(let i = 0; i < num && operator.list.hasPrev(); i++) operator.list.prev();
    operator.playQueue();
};

exports.validator = (msg, args) => {
    const parsed = parseInt(args[0] || 1);
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return msg.guild && storage.has(msg.guild.id) && !isNaN(parsed) && parsed > 0 && voiceChannel && voiceChannel.members.has(msg.author.id);
};