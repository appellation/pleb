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
 * @param {Playlist|null} [playlistIn] - A pre-existing playlist to play.
 * @param {boolean} [shuffle] - Whether to shuffle on play.
 * @constructor
 */
function Play (client, msg, args, playlistIn, shuffle) {

    let playlist;
    return VC.checkCurrent(client, msg).then(function(conn)  {

        playlist = playlistIn ? playlistIn : new Playlist(conn);

        // NOTE: if playlistIn is passed from msg.guild.playlist, they will be the exact same object at this point.
        if(msg.guild.playlist) {
            msg.guild.playlist.stop();
        }

        msg.guild.playlist = playlist;

        return playlist.add(args);
    }).then(function()  {
        playlist.stop();

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

        setTimeout(function() {
            playlist.start(msg);
        }, 3000);
    });
}

module.exports = Play;
