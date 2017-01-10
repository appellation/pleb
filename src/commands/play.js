/**
 * Created by Will on 8/25/2016.
 */

const Playlist = require('../util/operators/playlist');
const VC = require('../util/operators/voiceConnection');
const storage = require('../util/storage/playlists');

exports.func = (msg, args, handler, {playlistIn = null, shuffle = false} = {}) => {
    let playlist;
    return VC.checkCurrent(msg.client, msg).then(conn =>  {

        playlist = playlistIn || new Playlist(conn);

        if(storage.has(msg.guild.id)) storage.get(msg.guild.id).stop();
        storage.set(msg.guild.id, playlist);

        return playlist.add(args).catch(err => msg.channel.sendCode('xl', err));
    }).then(() =>  {
        if(shuffle) playlist.shuffle();
        playlist.start(msg, args);
    });
};

exports.validator = (msg, args) => {
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return msg.channel.type === 'text' && args.length > 0 && voiceChannel && voiceChannel.members.has(msg.author.id);
};
