/**
 * Created by Will on 9/7/2016.
 */

const Play = require('./play');

function Shuffle(client, msg, args) {

    if(args.length > 0) {
        Play(client, msg, args, null, true);
    }   else    {
        const playlist = msg.guild.playlist;

        if(playlist && playlist.list.list.length > 0)    {
            Play(client, msg, args, playlist, true);
        }   else    {
            msg.reply('takes two (or more :thinking:) to tango.');
        }
    }
}

module.exports = Shuffle;