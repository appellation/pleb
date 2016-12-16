/**
 * Created by Will on 9/12/2016.
 */

let rp = require('request-promise-native').defaults({
    baseUrl: 'https://api.imgur.com/3',
    headers:    {
        Authorization: 'Client-Id ' + process.env.imgur
    },
    json: true
});
const shuffle = require('knuth-shuffle').knuthShuffle;
const numeral = require('numeral');

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|string}
 */
function Imgur(msg, args)   {
    if(msg.attachments.size !== 0) {
        const ul = [];
        for(const attachment of msg.attachments) {
            const q = {
                uri: '/image',
                body: {
                    image: attachment[1].url
                }
            };

            if(msg.attachments.size === 1 && args.length > 0)    {
                q.body.title = args.join(' ');
            }

            ul.push(rp.post(q));
        }

        if(ul.length > 1)  {
            return Promise.all(ul).then(imgs =>  {
                const string = imgs.map(elem =>  {
                    return elem.id;
                }).join(',');

                const q = {
                    uri: '/album',
                    body: {
                        ids: string
                    }
                };

                if(msg.attachments.size > 0 && args.length > 0) {
                    q.body.title = args.join(' ');
                }

                return rp.post(q);
            }).then(album => {
                msg.channel.stopTyping();
                return msg.reply('https://imgur.com/a/' + album.data.id);
            }).then(() =>   {
                return msg.delete();
            });
        }   else    {

            return ul[0].then(img =>    {
                msg.channel.stopTyping();
                return msg.reply('https://imgur.com/' + img.data.id);
            }).then(() =>   {
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

module.exports = {
    triggers: 'imgur',
    func: Imgur
};