/**
 * Created by Will on 9/7/2016.
 */

const Play = require('./play');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 */
function Shuffle(client, msg, args) {

    if(args.length > 0) {
        return Play(client, msg, args, {
            shuffle: true
        });
    }   else    {
        const playlist = msg.guild.playlist;

        if(playlist && playlist.list.list.length > 0)    {
            return Play(client, msg, args, {
                playlistIn: playlist,
                shuffle: true
            });
        }   else    {
            return msg.reply('takes two (or more :thinking:) to tango.');
        }
    }
}

module.exports = Shuffle;