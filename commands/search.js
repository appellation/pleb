/**
 * Created by Will on 10/3/2016.
 */

const rp = require('request-promise-native');
const numeral = require('numeral');
const moment = require('moment');
const nsfw = require('../functions/message').nsfwAllowed;

const countryMap = {
    brazil: 'BR',
    singapore: 'MY',
    sydney: 'AU',
};

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|undefined}
 * @constructor
 */
function Search(msg, args)  {
    if(args.length === 0) return;
    const cc = countryMap[msg.guild ? msg.guild.region : null] || 'US';

    return rp.get({
        uri: 'https://api.cognitive.microsoft.com/bing/v5.0/search',
        qs: {
            q: args.join(' '),
            mkt: 'en-' + cc,
            count: 1,
            safeSearch: nsfw(msg) ? 'Moderate' : 'Strict'
        },
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.bing,
            'X-MSEdge-ClientID': msg.author.id
        },
        json: true
    }).then(res =>  {
        if(!res.rankingResponse) return 'no results found';

        // format response
        const first = res.rankingResponse.mainline.items[0];
        let item = res[first.answerType.toLowerCase()].value[0];
        let result = {
            'News': () => {
                return shortenURL(item.url).then(url => {
                    return `**${item.name}**\n${item.description}\n\n${url}`;
                });
            },
            'Computation': () => {
                return Promise.resolve(`\`${res.computation.expression}\` = \`${res.computation.value}\``);
            },
            'Images': () => {
                return msg.channel.sendFile(item.contentUrl, null, `**${item.name}**\n${item.hostPageDisplayUrl}`);
            },
            'TimeZone': () => {
                item = res.timeZone.primaryCityTime;
                return Promise.resolve(`**${moment(item.time.substring(0, item.time.length - 1), moment.ISO_8601).format('MMM D, YYYY HH:mm:ss A')}** - \`${item.location}\``);
            },
            'Default': () => {
                item = res.webPages.value[0];
                return shortenURL(item.url).then(url => {
                    return `I found *${numeral(res.webPages.totalEstimatedMatches).format('0,0')}** pages. Here's the first:\n\n**${item.name}** - \`${item.displayUrl}\`\n${url}`;
                });
            }
        };

        return (result[first.answerType] || result.Default)();
    });
}

function shortenURL(url)    {
    return rp.post({
        uri: 'https://www.googleapis.com/urlshortener/v1/url',
        qs: {
            key: process.env.youtube
        },
        json: true,
        body: {
            longUrl: url
        }
    }).then(res => {
        return res.id;
    });
}

module.exports = {
    func: Search,
    triggers: 'search'
};
