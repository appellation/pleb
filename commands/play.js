/**
 * Created by Will on 8/25/2016.
 */

"use strict";

const Playlist = require('../operators/playlist');
const VC = require('../operators/voiceConnection');
const storage = require('../storage/playlists');

/**
 * @param {Message} msg
 * @param {[]} args
 * @param {Playlist|null} [playlistIn] - A pre-existing playlist to play.
 * @param {boolean} [shuffle] - Whether to shuffle on play.
 */
function Play (msg, args, {playlistIn = null, shuffle = false} = {}) {

    let playlist;
    return VC.checkCurrent(msg.client, msg).then(conn =>  {

        playlist = playlistIn ? playlistIn : new Playlist(conn);

        // NOTE: if playlistIn is passed from msg.guild.playlist, they will be the exact same object at this point.
        if(storage.get(msg.guild.id)) storage.get(msg.guild.id).stop();
        storage.set(msg.guild.id, playlist);

        return playlist.add(args);
    }).then(() =>  {
        playlist.stop();

        if(shuffle) playlist.shuffle();

        // see issue #37, but a delay seems to be needed to properly end the stream dispatcher
        setTimeout(() => {
            playlist.start(msg, args);
        }, 300);
    });
}

module.exports = {
    func: Play,
    triggers: 'play'
};
