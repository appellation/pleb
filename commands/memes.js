/**
 * Created by Will on 9/23/2016.
 */

const moment = require('moment');

exports.func = (msg, args) => {
    /**Randomly chooses between XKCD and C&H**/
    if(Math.random() >= 0.5)    {
        const max = 4462;
        msg.reply('http://explosm.net/comics/' + (Math.floor(Math.random()* max) + 1));
    }   else    {
        var randVar = Math.floor(Math.random()*(1758 - 1) + 1);

        /** XKCD doesn't have a comic #404. Top kek XKCD. **/
        if(randVar ==404) randVar = Math.floor(Math.random()*(1758 - 1) + 1);

        var xkcd = require('xkcd');
        xkcd(randVar, function (data)   { msg.channel.sendMessage(`${data.title}\n${moment().month(data.month-1).format("MMMM")} ${data.day}, ${data.year}\n${data.img}); });
    }
};
