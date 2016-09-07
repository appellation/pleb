/**
 * Created by Will on 8/25/2016.
 */

"use strict";

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @constructor
 */
function Play (client, msg, args) {
    const YT = require('../interfaces/yt');
    const VC = require('../operators/voiceConnection');
    const PlaylistStructure = require('../structures/playlist');

    client.startTyping(msg.channel);

    const vc = VC.check(client, msg);

    let yt;
    vc.then(function(conn)  {

        if(msg.server.playlist) {
            msg.server.playlist.stop();
        }

        yt = new YT(conn, new PlaylistStructure());
        msg.server.playlist = yt;

        return yt.add(args);
    }).then(function()  {
        yt.start(msg);
        yt.ee.once('init', function(playlist)   {
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