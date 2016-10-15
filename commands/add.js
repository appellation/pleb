/**
 * Created by Will on 9/11/2016.
 */

const Play = require('../commands/play');

function Add(client, msg, args) {
    if(args[0])     {

        if(args[0] === 'shuffle') {
            return Play(client, msg, args.slice(1), msg.guild.playlist, true);
        }   else    {
            msg.guild.playlist.add(args);
            return Promise.resolve('added');
        }

    }   else    {
        return Promise.resolve('gimme something to work with here.');
    }
}

module.exports = Add;