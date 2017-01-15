/**
 * Created by Will on 12/2/2016.
 */

const Playlist = require('../util/audio/PlaylistOperator');

exports.func = (msg, args) => {
    return Playlist.init(msg, args).then(operator => {
        return operator.playlist.yt.loadPlaylistQuery(args.join(' ')).then(() => operator.start());
    });
};

exports.validator = (msg, args) => {
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return args.length > 0 && msg.channel.type === 'text' && voiceChannel && voiceChannel.members.has(msg.member.id);
};