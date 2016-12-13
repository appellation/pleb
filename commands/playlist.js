/**
 * Created by Will on 12/2/2016.
 */

const Play = require('./play');
const playlist = require('../operators/playlist');
const YT = require('../interfaces/yt');
const VC = require('../operators/voiceConnection');

/**
 * @param client
 * @param msg
 * @param args
 */
function Playlist(client, msg, args)    {
    if(args.length === 0) return;

    const yt = new YT();
    return Promise.all([
        yt.addPlaylistQuery(args.join(' ')),
        VC.checkUser(msg)
    ]).then(([listStructure, conn]) => {
        const list = new playlist(conn, listStructure);
        return Play(client, msg, args, {
            playlistIn: list,
        });
    });
}

module.exports = {
    func: Playlist,
    triggers: 'playlist'
};