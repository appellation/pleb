/**
 * Created by Will on 10/3/2016.
 */

const rp = require('request-promise-native');
const numeral = require('numeral');
const moment = require('moment');
const Validation = require('../util/command/ValidationProcessor');

const countryMap = {
    brazil: 'BR',
    singapore: 'MY',
    sydney: 'AU',
};

exports.func = (response, msg, args, command) => {
    if(args.length === 0) return;
    const cc = countryMap[msg.guild ? msg.guild.region : null] || 'US';

    const valid = new Validation(command);

    return rp.get({
        uri: 'https://api.cognitive.microsoft.com/bing/v5.0/search',
        qs: {
            q: args.join(' '),
            mkt: 'en-' + cc,
            count: 1,
            safeSearch: valid.ensureNSFW() ? 'Moderate' : 'Strict'
        },
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.bing,
            'X-MSEdge-ClientID': msg.author.id
        },
        json: true
    }).then(res => {
        if(Object.keys(res.rankingResponse).length === 0) return response.error('No results found.');

        // format response
        const first = res.rankingResponse.mainline.items[0];
        let item;
        let result = {
            'News': () => {
                item = res.news.value[0];
                return shortenURL(item.url).then(url => {
                    return `**${item.name}**\n${item.description}\n\n${url}`;
                });
            },
            'Computation': () => {
                return Promise.resolve(`\`${res.computation.expression}\` = \`${res.computation.value}\``);
            },
            'Images': () => {
                item = res.images.value[0];
                msg.channel.sendFile(item.contentUrl, null, `**${item.name}**\n${item.hostPageDisplayUrl}`);
                return Promise.resolve();
            },
            'TimeZone': () => {
                item = res.timeZone.primaryCityTime;
                return Promise.resolve(`**${moment(item.time.substring(0, item.time.length - 1), moment.ISO_8601).format('MMM D, YYYY HH:mm:ss A')}** - \`${item.location}\``);
            },
            'Default': () => {
                item = res.webPages.value[0];
                return shortenURL(item.url).then(url => {
                    return `I found **${numeral(res.webPages.totalEstimatedMatches).format('0,0')}** pages. Here's the first:\n\n**${item.name}** - \`${item.displayUrl}\`\n${url}`;
                });
            }
        };

        return ((result[first.answerType] || result.Default)()).then(result => {
            return result ? response.send(result) : null;
        });
    });
};

function shortenURL(url) {
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
