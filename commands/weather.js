/**
 * Created by Will on 11/6/2016.
 */

const rp = require('request-promise-native');
const numeral = require('numeral');
const moment = require('moment');

/**
 *
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|string}
 */
function Weather(client, msg, args) {
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
        if(loc.status == 'ZERO_RESULTS')    {
            return;
        }

        const coords = loc.results[0].geometry.location;
        return Promise.all([
            rpDarksky({
                uri: coords.lat + ',' + coords.lng
            }),
            loc.results[0]
        ]);
    }).then(res => {

        if(!res) {
            return 'no location found';
        }

        const weather = res[0];
        const loc = res[1];

        const cur = weather[type];
        let out = '';

        out += `\`${loc.formatted_address}\`\n\n`;

        switch(cur.icon)    {
            case 'clear-day':
                out += ':sunny:';
                break;
            case 'clear-night':
                out += ':last_quarter_moon_with_face:';
                break;
            case 'rain':
                out += ':cloud_rain:';
                break;
            case 'snow':
                out += ':cloud_snow:';
                break;
            case 'sleet':
                out += ':umbrella:';
                break;
            case 'wind':
                out += ':dash:';
                break;
            case 'fog':
                out += ':fog:';
                break;
            case 'cloudy':
                out += ':cloud:';
                break;
            case 'partly-cloudy-day':
                out += ':partly_sunny:';
                break;
            case 'partly-cloudy-night':
                out += ':cloud:';
                break;
        }

        out += ' **' +cur.summary + '**\n\n';

        let data;
        if(Array.isArray(cur.data)) {
            data = cur.data;
        }   else    {
            data = [cur];
        }

        if(type == 'hourly')    {
            data.splice(0, 24);
        }

        for(let i = 0; i < data.length;)    {
            const point = data[i];

            out += '`' + moment.unix(point.time).format('MM-DD-YYYY HH:mm:ss a') + '`\n';

            if(point.temperature)   {
                out += `:thermometer: \`${point.temperature}F\` (feels like \`${point.apparentTemperature}\`)\n`;
            }

            if(point.windSpeed) {
                out += `:wind_blowing_face: \`${point.windSpeed}MPH\` at \`${point.windBearing}°\`\n`;
            }

            if(point.pressure)  {
                out += `:compression: \`${point.pressure}mb\`\n`;
            }

            if(point.humidity)  {
                out += `:sweat_drops: \`${Math.round(point.humidity * 100)}%\` humidity\n`;
            }

            switch(point.precipType)  {
                case 'rain':
                    out += ':cloud_rain: Rain';
                    break;
                case 'snow':
                    out += ':cloud_snow: Snow';
                    break;
                case 'sleet':
                    out += ':umbrella: Sleet';
                    break;
                default:
                    out += ':umbrella2: Precipitation';
            }

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

        return out;
    });
}

module.exports = Weather;