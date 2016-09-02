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
    const YT = require('../operators/playlist/yt');
    const Playlist = require('../structures/playlist');

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

        yt = new YT(conn, new Playlist());
        msg.server.ytPlaylist = yt;

        return yt.add(args);
    }).then(function()  {
        yt.start();

        yt.ee.on('start', function(playlist)   {
            if(playlist.list.length === 1)  {
                msg.reply('now playing ' + playlist.getCurrent().url);
            }

            if(playlist.list.length > 1)  {
                msg.channel.sendMessage('now playing ' + (playlist.pos + 1) + ' of ' + playlist.list.length + ': ' + playlist.getCurrent().name);
            }

        });

        yt.ee.on('init', function() {
            client.stopTyping(msg.channel);
        });

        yt.ee.on('end', function() {
            yt.destroy();
        });

    }).catch(function(err)  {
        console.error(err);
        msg.reply(err);
        client.stopTyping(msg.channel);
    });
}

module.exports = Play;