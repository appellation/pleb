/**
 * Created by Will on 9/11/2016.
 */

const Play = require('./play');

function Next(client, msg, args)    {
    const playlist = msg.guild.playlist;
    const num = Number.parseInt(args[0]) || 1;

    if(playlist && !isNaN(num) && num > 0)    {
        playlist.stop();

        for(let i = 0; i < num; i++)    {
            playlist.next();
        }

        return Play(client, msg, [], playlist);
    }   else {
        return Promise.resolve();
    }
}

module.exports = Next;