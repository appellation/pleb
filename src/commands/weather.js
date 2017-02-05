/**
 * Created by Will on 11/6/2016.
 */

const rp = require('request-promise-native');
const numeral = require('numeral');
const moment = require('moment');

const weatherIconMap = {
    'clear-day': '☀',
    'clear-night': '🌜',
    rain: '🌧',
    snow: '🌨',
    sleet: '☔',
    wind: '💨',
    fog: '🌫',
    cloudy: '☁',
    'partly-cloudy-day': '⛅',
    'partly-cloudy-night': '☁'
};
const precipDescMap = {
    rain: '🌧 Rain',
    snow: '🌨 Snow',
    sleet: '☔ Sleet'
};


exports.func = (response, msg, args) => {
    if(args.length === 0) return 'no location specified';
    const poss = [
        'currently',
        'minutely',
        'hourly',
        'daily'
    ];

    let index = poss.indexOf(args[0]);
    if(index == -1) {
        args.unshift('currently');
        index = 0;
    }

    const type = poss.splice(index, 1).join('');

    const rpDarksky = rp.defaults({
        baseUrl: 'https://api.darksky.net/forecast/' + process.env.darksky,
        qs: {
            exclude: poss.join(',')
        },
        json: true,
        method: 'get'
    });

    const rpGoogle = rp.defaults({
        baseUrl: 'https://maps.googleapis.com/maps/api',
        qs: {
            key: process.env.youtube
        },
        method: 'get',
        json: true
    });

    return rpGoogle({
        uri: 'geocode/json',
        qs: {
            address: args.slice(1).join(' ')
        }
    }).then(loc => {
        if(loc.status == 'ZERO_RESULTS') return [];

        const coords = loc.results[0].geometry.location;
        return Promise.all([
            rpDarksky({
                uri: coords.lat + ',' + coords.lng
            }),
            loc.results[0]
        ]);
    }).then(([weather, loc]) => {

        if(!loc) return response.error('No location found for that query.');

        const cur = weather[type];
        let out = '';

        out += `\`${loc.formatted_address}\`\n\n${weatherIconMap[cur.icon]}`;

        out += ' **' +cur.summary + '**\n\n';

        let data;
        if(Array.isArray(cur.data)) {
            data = cur.data;
        }   else    {
            data = [cur];
        }

        if(type == 'hourly') data.splice(0, 24);

        for(let i = 0; i < data.length;)    {
            const point = data[i];

            out += '`' + moment.unix(point.time).format('MM-DD-YYYY HH:mm:ss a') + '`\n';

            if(point.temperature)   {
                out += `🌡 \`${point.temperature}F\` (feels like \`${point.apparentTemperature}\`)\n`;
            }

            if(point.windSpeed) {
                out += `🌬 \`${point.windSpeed}MPH\` at \`${point.windBearing}°\`\n`;
            }

            if(point.pressure)  {
                out += `🗜 \`${point.pressure}mb\`\n`;
            }

            if(point.humidity)  {
                out += `💦 \`${Math.round(point.humidity * 100)}%\` humidity\n`;
            }

            out += precipDescMap[point.precipType] || '☂ Precipitation';

            out += ` - \`${numeral(point.precipProbability * 100).format('0.00')}%\` at \`${numeral(point.precipIntensity).format('0.00')}in/hr\``;
            out += '\n\n';

            if(type == 'minutely')    {
                i += 10;
            }   else if(type == 'hourly')   {
                i += 4;
            }   else {
                i++;
            }
        }

        out += '*Powered by Dark Sky (<https://darksky.net/poweredby/>)*';

        return response.send(out);
    });
};

exports.validator = val => val.ensureArgs();
