/**
 * Created by Will on 12/2/2016.
 */

const Play = require('./play');
const playlist = require('../operators/playlist');
const VC = require('../operators/voiceConnection');

/**
 * @param msg
 * @param args
 */
function Playlist(msg, args)    {
    let list;
    return VC.checkUser(msg).then(conn => {
        list = new playlist(conn);
        return list.yt.addPlaylistQuery(args.join(' '));
    }).then(() => {
        return Play.func(msg, args, {
            playlistIn: list,
        });
    });
}

module.exports = {
    func: Playlist,
    triggers: 'playlist',
    validator: (msg, args) => {
        return args.length > 0 && msg.channel.type === 'text';
    }
};