const rp = require('request-promise-native');
const numeral = require('numeral');
const moment = require('moment');
const Validation = require('../../util/command/Validator');

const countryMap = {
    brazil: 'BR',
    singapore: 'MY',
    sydney: 'AU',
};

exports.exec = async (cmd) => {
    const { args, message: msg, response } = cmd;

    const cc = countryMap[msg.guild ? msg.guild.region : null] || 'US';
    const valid = new Validation(cmd);
    const res = await rp.get({
        uri: 'https://api.cognitive.microsoft.com/bing/v5.0/search',
        qs: {
            q: args.query,
            mkt: `en-${cc}`,
            count: 1,
            safeSearch: valid.ensureNSFW() ? 'Moderate' : 'Strict'
        },
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.bing,
            'X-MSEdge-ClientID': msg.author.id
        },
        json: true
    });

    if (typeof res.rankingResponse !== 'object' || Object.keys(res.rankingResponse).length === 0) return response.error('No results found.');

    // format response
    const first = res.rankingResponse.mainline.items[0];
    let item;
    const result = {
        'News': async () => {
            item = res.news.value[0];
            const url = await shortenURL(item.url);
            return `**${item.name}**\n${item.description}\n\n${url}`;
        },
        'Computation': () => {
            return `\`${res.computation.expression}\` = \`${res.computation.value}\``;
        },
        'Images': async () => {
            item = res.images.value[0];
            await msg.channel.sendFile(item.contentUrl, null, `**${item.name}**\n${item.hostPageDisplayUrl}`);
        },
        'TimeZone': () => {
            item = res.timeZone.primaryCityTime;
            return `**${moment(item.time.substring(0, item.time.length - 1), moment.ISO_8601).format('MMM D, YYYY HH:mm:ss A')}** - \`${item.location}\``;
        },
        'Default': async () => {
            item = res.webPages.value[0];
            const url = await shortenURL(item.url);
            return `I found **${numeral(res.webPages.totalEstimatedMatches).format('0,0')}** pages. Here's the first:\n\n**${item.name}** - \`${item.displayUrl}\`\n${url}`;
        }
    };

    const out = await ((result[first.answerType] || result.Default)());
    return out ? response.send(out) : null;
};

exports.arguments = function* (Argument) {
    yield new Argument('query')
        .setInfinite()
        .setPrompt('What would you like to search for?');
};

async function shortenURL(url) {
    const res = await rp.post({
        uri: 'https://www.googleapis.com/urlshortener/v1/url',
        qs: {
            key: process.env.youtube
        },
        json: true,
        body: {
            longUrl: url
        }
    });
    return res.id;
}
