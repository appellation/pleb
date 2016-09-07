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
    const PlaylistStructure = require('../structures/playlist');

    client.startTyping(msg.channel);

    const vc = new Promise(function(resolve, reject)    {

        const clientVC = client.voiceConnections.get('server', msg.server);

        if(!clientVC) {
            if(msg.author.voiceChannel) {
                client.joinVoiceChannel(msg.author.voiceChannel, function(err, conn)    {
                    if(err) {
                        reject(err);
                    }   else    {
                        resolve(conn);
                    }
                });
            }   else    {
                reject('No voice channel to join.');
            }
        }   else    {
            resolve(clientVC);
        }
    });

    var yt;
    vc.then(function(conn)  {

        if(msg.server.playlist) {
            msg.server.playlist.stop();
        }

        yt = new YT(conn, new PlaylistStructure());
        msg.server.playlist = yt;

        return yt.add(args);
    }).then(function()  {
        yt.start(msg);
        yt.ee.once('init', function()   {
            client.stopTyping(msg.channel);
        })
    }).catch(function(err)  {
        console.error(err);
        msg.reply(err);
        client.stopTyping(msg.channel);
    });
}

module.exports = Play;