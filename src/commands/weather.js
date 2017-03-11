/**
 * Created by Artful on 1/03/2017.
 */

const request = require('request-promise-native');
const timezone = require('moment-timezone');
const path = require('path');
const Canvas = require('canvas');

exports.func = (response, msg, args) => {

    let geocodeOptions = {
        uri: 'https://maps.googleapis.com/maps/api/geocode/json?',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        qs: {
            address : args.join(' '),
            key: process.env.youtube
        },
        json: true
    };

    return request(geocodeOptions).then((locationRes) => {
        if(locationRes.status !== 'OK') {
            switch(locationRes.status){
            case 'ZERO_RESULTS':
                return response.error('No results found');
            case 'REQUEST_DENIED':
                return response.error('Request denied');
            case 'INVALID_REQUEST':
                return response.error('Invalid request');
            case 'OVER_QUERY_LIMIT':
                return response.error('Over limit');
            case 'UNKNOWN_ERROR':
                return response.error('An unnkown error has occurred');
            }
        } else {
            let city;
            let weatherOptions = {
                uri: `https://api.darksky.net/forecast/${process.env.darksky}/${locationRes.results[0].geometry.location.lat},${locationRes.results[0].geometry.location.lng}`,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true
            };
            
            const locality = locationRes.results[0].address_components.find(loc => loc.types.includes('locality'));
            const governing = locationRes.results[0].address_components.find(gov => gov.types.includes('administrative_area_level_1'));
            const country = locationRes.results[0].address_components.find(cou => cou.types.includes('country'));
            const continent = locationRes.results[0].address_components.find(con => con.types.includes('continent'));

            city = locality || governing || country || continent || {};

            return request(weatherOptions).then((weatherRes) => {
                
                Canvas.registerFont(path.join(__dirname, '..', 'assets', 'fonts', 'NotoSans-Regular.ttf'), { family: 'NotoSans' });
                Canvas.registerFont(path.join(__dirname, '..', 'assets', 'fonts', 'NotoSans-Bold.ttf'), { family: 'NotoSansBold' });

                let canvas = new Canvas(800, 250);
                let ctx = canvas.getContext('2d');
                let Image = Canvas.Image;
                let icon = new Image();
                let background = new Image();
                icon.src = path.join(__dirname, '..', 'assets', 'images', 'weather', `${getIcon(weatherRes.currently.icon)}.png`);
                background.src = path.join(__dirname, '..', 'assets', 'images', 'weather', 'weatherbg.png');

                const
                    times = [],
                    tempMaxes = [],
                    tempMins = [],
                    icons = [],
                    time = timezone().tz(weatherRes.timezone);

                for(let i = 0; i < 4; i++) {
                    times.push(time.add(i + 1, 'days').format('ddd'));
                    tempMins.push(convertFToC(weatherRes.daily.data[i].temperatureMin));
                    tempMaxes.push(convertFToC(weatherRes.daily.data[i].temperatureMax));

                    const img = new Image();
                    img.src = path.join(__dirname, '..', 'assets', 'images', 'weather', `${getIcon(weatherRes.daily.data[i].icon)}.png`);
                    icons.push(img);
                }

                ctx.drawImage(background, 0, 0);

                ctx.fillStyle = '#ffffff';
                ctx.font='22px NotoSans';
                ctx.fillText(city.long_name ? city.long_name : 'Unknown', 30, 40);
                
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(275, 30, 1, canvas.height - 60);

                ctx.fillStyle = '#ffffff';
                ctx.font='70px NotoSans';
                ctx.fillText(`${convertFToC(weatherRes.currently.temperature)}°`, 80, 205);
                
                ctx.textAlign = 'center'; 
                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(times[0], 365, 60);
                
                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(times[1], 475, 60);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(times[2], 595, 60);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(times[3], 705, 60);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(tempMins[0], 365, 170);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(tempMaxes[0], 365, 210);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(tempMins[1], 475, 170);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(tempMaxes[1], 475, 210);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(tempMins[2], 595, 170);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(tempMaxes[2], 595, 210);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(tempMins[3], 705, 170);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(tempMaxes[3], 705, 210);
                
                ctx.drawImage(icons[0], 330, 70, 60, 60);
                ctx.drawImage(icons[1], 440, 70, 60, 60);
                ctx.drawImage(icons[2], 560, 70, 60, 60);
                ctx.drawImage(icons[3], 670, 70, 60, 60);
                ctx.drawImage(icon, 80, 40, 90, 90);
                
                return msg.channel.sendFile(canvas.toBuffer());
            });
        }
    });
};

function getIcon(icon) {
    if (icon === 'clear-day' || icon === 'partly-cloudy-day') {
        return 'clear';
    } else if (icon === 'clear-night' || icon === 'partly-cloudy-night') {
        return 'night';
    } else if (icon === 'rain' || icon === 'thunderstorm') {
        return 'rain';
    } else if (icon === 'snow' || icon === 'sleet' || icon === 'fog') {
        return 'snow';
    } else if (icon === 'wind' || icon === 'tornado') {
        return 'night';
    } else if (icon === 'cloudy') {
        return 'cloudy';
    } else {
        return 'night';
    }
}

function convertFToC(temp) {
    return Math.round((temp - 32) * 0.5556);
}

exports.validator = val => val.ensureArgs();
