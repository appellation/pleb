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
    /**
     return new Promise(function(resolve, reject)   {
        if (client.reddit && client.reddit.expires_in > Date.now()) {
            resolve(client.reddit);
        } else {
            rp.post({
                url: 'https://www.reddit.com/api/v1/access_token',
                body: 'grant_type=client_credentials',
                auth: {
                    username: process.env.reddit,
                    password: process.env.reddit_secret
                }
            }).then(function (res) {
                client.reddit = res;
                resolve(JSON.parse(res));
            }).catch(function (err) {
                console.error(err);
                reject(err);
            });
        }
    }).then(function(auth)  {
        return rp.get({
            headers: {
                Authorization: 'bearer ' + auth.access_token,
                'User-Agent': 'node.js:appellation/pleb:v2.0 (by /u/appellation_)'
            },
            url: 'https://oauth.reddit.com/r/memes/top'
        });
    }).then(JSON.parse).then(function(res)   {
        const list = res.data.children;
        var item = list[Math.floor(Math.random()*list.length)];
        return "https://www.reddit.com" + item.data.permalink;
    });
     **/
    var moment = require('moment');
    moment().format();
    var randVar = Math.floor(Math.random()*(1758 - 1) + 1);
    if(randVar ==404)
    {randVar = Math.floor(Math.random()*(1758 - 1) + 1);}

        if(Math.random() >= 0.5)
        {
            min = Math.ceil(0);
            max = Math.floor(4462);

            msg.reply('http://explosm.net/comics/' + (Math.floor(Math.random()* max) + 1));
        }
        else {
            var xkcd = require('xkcd');



            xkcd(randVar, function (data)
            {
                msg.channel.sendMessage(data.title + '\n' + moment().month(data.month-1).format("MMMM") + " " + data.day + ", " + data.year + "\n" +  data.img);

            });
        }


}


module.exports = Memes;