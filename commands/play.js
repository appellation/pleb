/**
 * Created by Will on 8/25/2016.
 */

"use strict";

const Playlist = require('../operators/playlist');
const VC = require('../operators/voiceConnection');

const YTPlaylist = require('../interfaces/yt');
const SCPlaylist = require('../interfaces/sc');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @param {boolean} [shuffle] - Whether to shuffle on play.
 * @constructor
 */
function Play (client, msg, args, shuffle) {

    msg.channel.startTyping();

    let playlist;
    VC.check(client, msg).then(function(conn)  {

        if(msg.guild.playlist) {
            msg.guild.playlist.stop();
        }

        playlist = new Playlist(conn);
        msg.guild.playlist = playlist;

        return playlist.add(args);
    }).then(function()  {
        if(shuffle) {
            playlist.shuffle();
        }

        playlist.ee.once('init', function(playlist)   {
            msg.channel.stopTyping();
            if(playlist.list.length === 1)  {
                if(!SCPlaylist.isSoundCloudURL(args[0]) && !YTPlaylist.isYouTubeURL(args[0]))    {
                    msg.reply('now playing ' + playlist.getCurrent().url);
                }   else    {
                    msg.reply('now playing');
                }
            }
        });

        playlist.start(msg);
    }).catch(function(err)  {
        console.error(err);
        msg.reply('`' + err + '`');
        msg.channel.stopTyping();
    });
}

module.exports = Play;