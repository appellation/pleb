/**
 * Created by Will on 8/25/2016.
 */

const Playlist = require('../util/playlist');

exports.func = (msg, args) => {
    return Playlist.init(msg, args).then(operator => {
        operator.initializeMessage(msg.channel);
        operator.playQueue();
    });
};

exports.validator = (msg, args) => {
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return msg.channel.type === 'text' && args.length > 0 && voiceChannel && voiceChannel.members.has(msg.author.id);
};
