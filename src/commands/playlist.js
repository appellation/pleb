/**
 * Created by Will on 12/2/2016.
 */

const Playlist = require('../util/playlist');

exports.func = (msg, args) => {
    return Playlist.init(msg, args).then(operator => {
        operator.initializeMessage(msg.channel);
        return operator.yt.addPlaylistQuery(args.join(' ')).then(() => operator.playQueue());
    });
};

exports.validator = (msg, args) => {
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return args.length > 0 && msg.channel.type === 'text' && voiceChannel && voiceChannel.members.has(msg.member.id);
};