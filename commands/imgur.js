/**
 * Created by Will on 9/12/2016.
 */

let rp = require('request-promise-native');

function Imgur(client, msg, args)   {

    const arr = msg.attachments.array();
    if(arr.length > 0) {
        const defaults = {
            baseUrl: 'https://api.imgur.com/',
            headers:    {
                Authorization: 'Client-Id ' + process.env.imgur
            },
            json: true
        };
        rp = rp.defaults(defaults);

        const ul = [];
        for(let i = 0; i < arr.length; i++) {
            const q = {
                uri: '/3/image',
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
                    uri: '/3/album',
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
    }   else    {
        return Promise.resolve('i\'m not a miracle worker :wink:');
    }
}

module.exports = Imgur;