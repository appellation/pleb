/**
 * Created by Will on 12/2/2016.
 */

const Play = require('./play');
const playlist = require('../util/operators/playlist');
const VC = require('../util/operators/voiceConnection');

exports.func = (msg, args, handler) => {
    let list;
    return VC.checkUser(msg).then(conn => {
        list = new playlist(conn);
        return list.yt.addPlaylistQuery(args.join(' '));
    }).then(() => {
        return Play.func(msg, args, handler, {
            playlistIn: list,
        });
    });
};

exports.validator = (msg, args) => {
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return args.length > 0 && msg.channel.type === 'text' && voiceChannel && voiceChannel.members.has(msg.member.id);
};