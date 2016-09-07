/**
 * Created by Will on 8/25/2016.
 */

"use strict";

const Playlist = require('../operators/playlist');
const VC = require('../operators/voiceConnection');

const YTPlaylist = require('../interfaces/yt');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @constructor
 */
function Play (client, msg, args) {

    client.startTyping(msg.channel);

    let playlist;
    VC.check(client, msg).then(function(conn)  {

        if(msg.server.playlist) {
            msg.server.playlist.stop();
        }

        playlist = new Playlist(conn);
        const yt = new YTPlaylist(playlist.list);

        msg.server.playlist = playlist;

        return yt.add(args);
    }).then(function()  {
        playlist.start(msg);
        playlist.ee.once('init', function(playlist)   {
            client.stopTyping(msg.channel);
            if(playlist.list.length === 1)  {
                msg.reply('now playing ' + playlist.getCurrent().url);
            }
        })
    }).catch(function(err)  {
        console.error(err);
        msg.reply(err);
        client.stopTyping(msg.channel);
    });
}

module.exports = Play;