/**
 * Created by Will on 9/12/2016.
 */

let rp = require('request-promise-native');
const shuffle = require('knuth-shuffle').knuthShuffle;
const numeral = require('numeral');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|string}
 */
function Imgur(client, msg, args)   {
    const defaults = {
        baseUrl: 'https://api.imgur.com/3',
        headers:    {
            Authorization: 'Client-Id ' + process.env.imgur
        },
        json: true
    };

    rp = rp.defaults(defaults);

    if(msg.attachments.size !== 0) {

        const arr = msg.attachments.array();

        if(arr.length == 0) {
            return 'i\'m not a miracle worker :wink:';
        }

        const ul = [];
        for(let i = 0; i < arr.length; i++) {
            const q = {
                uri: '/image',
                body: {
                    image: arr[i].url
                }
            };

            if(arr.length === 1 && args.length > 0)    {
                q.body.title = args.join(' ');
            }

            ul.push(rp.post(q));
        }

        if(ul.length > 1)  {
            return Promise.all(ul).then(function(imgs)  {
                const string = imgs.map(function(elem)  {
                    return elem.id;
                }).join(',');

                const q = {
                    uri: '/album',
                    body: {
                        ids: string
                    }
                };

                if(arr.length > 0 && args.length > 0) {
                    q.body.title = args.join(' ');
                }

                return rp.post(q);
            }).then(function(album) {
                msg.channel.stopTyping();
                return msg.reply('https://imgur.com/a/' + album.data.id);
            }).then(function()   {
                return msg.delete();
            });
        }   else    {

            return ul[0].then(function(img)    {
                msg.channel.stopTyping();
                return msg.reply('https://imgur.com/' + img.data.id);
            }).then(function()   {
                return msg.delete();
            });
        }

    }   else {

        return rp.get('gallery/hot/viral/0.json').then(res => {
            return shuffle(res.data)[0];
        }).then(rand => {
            return '**' + rand.title + '** - ' + rand.account_url + '\n' +
                ':eye: ' + numeral(rand.views).format('0,0') + ' - :goal: ' + numeral(rand.score).format('0,0') + '\n' + rand.link;
        })
    }
}

module.exports = Imgur;