/**
 * Created by Will on 9/11/2016.
 */

const Play = require('../commands/play');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string}
 */
function Add(client, msg, args) {
    if(args[0])     {

        if(args[0] === 'shuffle') {
            return Play(client, msg, args.slice(1), {
                playlistIn: msg.guild.playlist,
                shuffle: true
            });
        }   else if(msg.guild.playlist)   {
            msg.guild.playlist.add(args);
            return 'added';
        }   else {
            return 'no playlist.';
        }

    }   else    {
        return 'gimme something to work with here.';
    }
}

module.exports = Add;