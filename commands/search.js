/**
 * Created by Will on 10/3/2016.
 */

const rp = require('request-promise-native');
const numeral = require('numeral');
const moment = require('moment');

function Search(client, msg, args)  {
    let cc;

    if(msg.guild)   {
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
    }   else    {
        cc = 'US';
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
    }).then(function(res)  {
        // format response

        const first = res.rankingResponse.mainline.items[0];
        let reply;
        let item;

        switch (first.answerType)   {
            case 'News':
                item = res.news.value[0];
                reply = shortenURL(item.url).then(url => {
                    return "**" + item.name + "**\n" + item.description + "\n\n" + url
                });
                break;
            case 'Computation':
                reply = Promise.resolve("`" + res.computation.expression + "` = `" + res.computation.value + "`");
                break;
            case 'Images':
                item = res.images.value[0];
                reply = "**" + item.name + "**\n" + item.hostPageDisplayUrl;
                msg.channel.sendFile(item.contentUrl, null, reply);
                return;
            case 'TimeZone':
                item = res.timeZone.primaryCityTime;
                reply = Promise.resolve("**" + moment(item.time.substring(0, item.time.length - 1), moment.ISO_8601).format("MMM D, YYYY HH:mm:ss A") + "** - `" + item.location + "`");
                break;
            default:
                item = res.webPages.value[0];
                reply = shortenURL(item.url).then(url => {
                    return "I found **" + numeral(res.webPages.totalEstimatedMatches).format('0,0') + "** pages.  Here's the first:\n\n" +
                    "**" + item.name + "** - `" + item.displayUrl + "`\n" + url
                });
        }

        return reply;
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

module.exports = Search;