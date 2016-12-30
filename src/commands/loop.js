/**
 * Created by Will on 12/22/2016.
 */

// const storage = require('../storage/playlists');
const Playlist = require('../operators/playlist');
const VC = require('../operators/voiceConnection');
const YT = require('../operators/interfaces/yt');
const Play = require('./play');

exports.func = (msg, args) => {
    const yt = new YT();
    return yt.add(args).then(() => {
        for(let i = 0; i < 20; i++) {
            // console.log(yt.list);
            // yt.list.add(yt.list.list[0]);
        }

        return VC.checkCurrent(msg.client, msg).then(conn => {
            return Play.func(msg, args, { playlistIn: new Playlist(conn, yt.list) });
        });
    });
};

exports.validator = msg => msg.channel.type !== 'dm';

exports.disabled = true;