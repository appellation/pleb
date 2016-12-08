/**
 * Created by Will on 9/11/2016.
 */

const Play = require('../commands/play');
const storage = require('../storage/playlists');

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
                playlistIn: storage.get(msg.guild.id),
                shuffle: true
            });
        }   else if(storage.get(msg.guild.id))   {
            storage.get(msg.guild.id).add(args);
            return 'added';
        }   else {
            return 'no playlist.';
        }

    }   else    {
        return 'gimme something to work with here.';
    }
}

module.exports = Add;