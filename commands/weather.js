/**
 * Created by Will on 11/6/2016.
 */

const rp = require('request-promise-native');
const moment = require('moment');

function Weather(client, msg, args) {
    const rpDarksky = rp.defaults({
        baseUrl: 'https://api.darksky.net/forecast/' + process.env.darksky,
        qs: {
            exclude: 'minutely,hourly,daily'
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
            address: args.join(' ')
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

        const cur = weather.currently;
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

        out += `:thermometer: \`${cur.temperature}\`F (feels like \`${cur.apparentTemperature}\`)\n` +
            `:wind_blowing_face: \`${cur.windSpeed}\`MPH at \`${cur.windBearing}\`°\n` +
            `:compression: \`${cur.pressure}\`mb\n` +
            `:sweat_drops: \`${Math.round(cur.humidity * 100)}\`% humidity\n`;

        if(cur.precipIntensity)    {
            switch(cur.precipType)  {
                case 'rain':
                    out += ':cloud_rain: Rain';
                    break;
                case 'snow':
                    out += ':cloud_snow: Snow';
                    break;
                case 'sleet':
                    out += ':umbrella: Sleet';
                    break;
            }

            out += ` - \`${Math.round(cur.precipProbability * 100)}\`% at \`${cur.precipIntensity}\`in/hr`
        }

        return out;
    });
}

module.exports = Weather;