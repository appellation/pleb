/**
 * Created by Will on 9/11/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = (res, msg, args) => {
    const next = args[0] === 'next';
    return storage.get(msg.guild.id).add(next ? args.slice(1) : args).then(operator => {
        const pl = operator.playlist;
        if(next) pl.list.splice(pl.pos, 0, pl.list.pop());
        return res.success(`added \`${next ? pl.getNext().name : pl.getLast().name}\``);
    });
};

exports.validator = (msg, args) => {
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return msg.guild && storage.has(msg.guild.id) && args.length > 0 && voiceChannel && voiceChannel.members.has(msg.author.id);
};