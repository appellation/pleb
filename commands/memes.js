/**
 * Created by Will on 9/23/2016.
 */

const rp = require('request-promise-native');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|undefined}
 */
function Memes(client, msg, args) {

    var moment = require('moment');
    moment().format();
    var randVar = Math.floor(Math.random()*(1758 - 1) + 1);

    if(randVar ==404) /** XKCD doesn't have a comic #404. Top kek XKCD. **/
    {randVar = Math.floor(Math.random()*(1758 - 1) + 1);}

        if(Math.random() >= 0.5) /**Randomly chooses between XKCD and C&H**/
        {
            min = Math.ceil(0);
            max = Math.floor(4462);

            msg.reply('http://explosm.net/comics/' + (Math.floor(Math.random()* max) + 1));
        }
        else
        {
            var xkcd = require('xkcd');

            xkcd(randVar, function (data)
            {
                msg.channel.sendMessage(data.title + '\n' + moment().month(data.month-1).format("MMMM") + " " + data.day + ", " + data.year + "\n" +  data.img);

            });
        }


}


module.exports = Memes;