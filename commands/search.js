/**
 * Created by Will on 10/3/2016.
 */

const rp = require('request-promise-native');
const numeral = require('numeral');
const moment = require('moment');

function Search(client, msg, args)  {
    let cc;

    switch (msg.guild.region) {
        case 'brazil':
            cc = 'BR';
            break;
        case 'singapore':
            cc = 'MY';
            break;
        case 'sydney':
            cc = 'AU';
            break;
        default:
            cc = 'US';
            break;
    }

    return rp.get({
        uri: 'https://api.cognitive.microsoft.com/bing/v5.0/search',
        qs: {
            q: args.join(' '),
            mkt: 'en-' + cc,
            count: 1
        },
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.bing,
            'X-MSEdge-ClientID': msg.author.id
        },
        json: true
    }).then(function(res)   {
        // test for short URL needed

        const first = res.rankingResponse.mainline.items[0];

        if(first.answerType !== 'Images' && first.answerType !== 'TimeZone')    {
            return rp.post({
                uri: 'https://www.googleapis.com/urlshortener/v1/url',
                qs: {
                    key: process.env.youtube
                },
                json: true,
                body: {
                    longUrl: res[first.answerType.substring(0, 1).toLowerCase() + first.answerType.substring(1)].value[0].url
                }
            }).then(function(shortUrl) {
                return {
                    res,
                    shortUrl
                }
            });
        }   else {
            return Promise.resolve({res, shortUrl: null});
        }
    }).then(function(data)  {
        // format response

        const first = data.res.rankingResponse.mainline.items[0];
        let reply;
        let item;

        switch (first.answerType)   {
            case 'News':
                item = data.res.news.value[0];
                reply = "**" + item.name + "**\n" + item.description + "\n\n" + (data.shortUrl ? data.shortUrl.id : item.url);
                break;
            case 'Images':
                item = data.res.images.value[0];
                reply = "**" + item.name + "**\n" + item.hostPageDisplayUrl;
                msg.channel.sendFile(item.contentUrl, null, reply);
                return;
            case 'TimeZone':
                item = data.res.timeZone.primaryCityTime;
                reply = "**" + moment(item.time).format("MMM D, YYYY HH:mm:ss A") + "** - `" + item.location + "`";
                break;
            default:
                item = data.res.webPages.value[0];
                reply = "I found **" + numeral(data.res.webPages.totalEstimatedMatches).format('0,0') + "** pages.  Here's the first:\n\n" +
                    "**" + item.name + "** - `" + item.displayUrl + "`\n" + (data.shortUrl ? data.shortUrl.id : item.url);
        }

        return reply;
    });
}

module.exports = Search;