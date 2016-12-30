/**
 * Created by Will on 8/25/2016.
 */

const Playlist = require('./playlist');
const VC = require('./voiceConnection');
const storage = require('./playlists');

exports.func = (msg, args, handler, {playlistIn = null, shuffle = false} = {}) => {
    let playlist;
    return VC.checkCurrent(msg.client, msg).then(conn =>  {

        playlist = playlistIn || new Playlist(conn);

        if(storage.has(msg.guild.id)) storage.get(msg.guild.id).stop();
        storage.set(msg.guild.id, playlist);

        return playlist.add(args);
    }).then(() =>  {
        if(shuffle) playlist.shuffle();
        playlist.start(msg, args);
    });
};

exports.validator = (msg, args) => msg.channel.type === 'text' && args.length > 0;
