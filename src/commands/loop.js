/**
 * Created by Will on 12/22/2016.
 */

// const storage = require('../storage/playlists');
const Playlist = require('../operators/playlist');
const VC = require('../operators/voiceConnection');
const Play = require('./play');

exports.func = (msg, args, handler) => {
    let playlist;
    return VC.checkCurrent(msg.client, msg).then(conn => {
        playlist = new Playlist(conn);
        return playlist.add(args.join(' '));
    }).then(list => {
        for(let i = 0; i < 19; i++) list.add(list.list[0]);
        return Play.func(msg, [], handler, {playlistIn: playlist});
    }).catch(console.error);
};

exports.validator = msg => msg.channel.type !== 'dm';