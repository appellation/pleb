/**
 * Created by Will on 9/7/2016.
 */

const Play = require('../commands/play');

function Shuffle(client, msg, args) {

    if(args.length > 0) {
        Play(client, msg, args, true);
    }   else    {
        const playlist = msg.guild.playlist;

        if(playlist && playlist.list.length > 1)    {
            playlist.ee.on('shuffled', function()   {
                playlist.start(msg);
            });

            msg.guild.playlist.shuffle();
        }   else    {
            msg.reply('takes two to tango.');
        }
    }
}

module.exports = Shuffle;