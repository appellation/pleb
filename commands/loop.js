/**
 * Created by Will on 12/22/2016.
 */

const storage = require('../storage/playlists');
const YT = require('./yt');
const Playlist = require('../operators/playlist');
const VC = require('../operators/voiceConnection');
const Play = require('./play');

function Loop(msg, args)    {
    const yt = new YT();
    return yt.add(args).then(() => {
        for(let i = 0; i < 20; i++) {
            console.log(yt.list);
            // yt.list.add(yt.list.list[0]);
        }

        return VC.checkCurrent(msg.client, msg).then(conn => {
            return Play.func(msg, args, { playlistIn: new Playlist(conn, yt.list) });
        });
    });
}

module.exports = {
    func: Loop,
    validator: msg => {
        return msg.channel.type !== 'dm'
    },
    triggers: 'loop',
    disabled: true
};