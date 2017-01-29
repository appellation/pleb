/**
 * Created by Will on 12/22/2016.
 */

// const storage = require('../storage/playlists');
const Playlist = require('./playlist');
const VC = require('../util/audio/voiceConnection');
const Play = require('./play');

exports.func = (res, msg, args, handler) => {
    let playlist;
    return VC.checkCurrent(msg.client, msg).then(conn => {
        playlist = new Playlist(conn);
        return playlist.add(args.join(' '));
    }).then(list => {
        for(let i = 0; i < 19; i++) list.add(list.list[0]);
        return Play.func(res, msg, [], handler, {playlistIn: playlist});
    });
};

exports.validator = msg => msg.channel.type !== 'dm';