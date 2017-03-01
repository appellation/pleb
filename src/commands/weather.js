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
            for (var i = 0; i < locationRes.results[0].address_components.length; i++) {
                var component = locationRes.results[0].address_components[i];
                if(component.types[0] === 'locality') {
                    city = component.long_name;
                }
            }
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

                let day1Time = timezone().tz(weatherRes.timezone).add(1, 'days').format('ddd');
                let day1TempMin = convertFToC(weatherRes.daily.data[0].temperatureMin);
                let day1TempMax = convertFToC(weatherRes.daily.data[0].temperatureMax);
                let day1Icon = new Image();
                day1Icon.src = path.join(__dirname, '..', 'assets', 'images', 'weather', `${getIcon(weatherRes.daily.data[0].icon)}.png`);

                let day2Time = timezone().tz(weatherRes.timezone).add(2, 'days').format('ddd');
                let day2TempMin = convertFToC(weatherRes.daily.data[1].temperatureMin);
                let day2TempMax = convertFToC(weatherRes.daily.data[1].temperatureMax);
                let day2Icon = new Image();
                day2Icon.src = path.join(__dirname, '..', 'assets', 'images', 'weather', `${getIcon(weatherRes.daily.data[1].icon)}.png`);

                let day3Time = timezone().tz(weatherRes.timezone).add(3, 'days').format('ddd');
                let day3TempMin = convertFToC(weatherRes.daily.data[2].temperatureMin);
                let day3TempMax = convertFToC(weatherRes.daily.data[2].temperatureMax);
                let day3Icon = new Image();
                day3Icon.src = path.join(__dirname, '..', 'assets', 'images', 'weather', `${getIcon(weatherRes.daily.data[2].icon)}.png`);

                let day4Time = timezone().tz(weatherRes.timezone).add(4, 'days').format('ddd');
                let day4TempMin = convertFToC(weatherRes.daily.data[3].temperatureMin);
                let day4TempMax = convertFToC(weatherRes.daily.data[3].temperatureMax);
                let day4Icon = new Image();
                day4Icon.src = path.join(__dirname, '..', 'assets', 'images', 'weather', `${getIcon(weatherRes.daily.data[3].icon)}.png`);

                ctx.drawImage(background, 0, 0);

                ctx.fillStyle = '#ffffff';
                ctx.font='22px NotoSans';
                ctx.fillText(city, 30, 40);
                
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(275, 30, 1, canvas.height - 60);

                ctx.fillStyle = '#ffffff';
                ctx.font='70px NotoSans';
                ctx.fillText(`${convertFToC(weatherRes.currently.temperature)}°`, 80, 205);
                
                ctx.textAlign = 'center'; 
                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day1Time, 365, 60);
                
                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day2Time, 475, 60);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day3Time, 595, 60);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day4Time, 705, 60);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day1TempMin, 365, 170);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day1TempMax, 365, 210);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day2TempMin, 475, 170);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day2TempMax, 475, 210);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day3TempMin, 595, 170);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day3TempMax, 595, 210);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day4TempMin, 705, 170);

                ctx.fillStyle = '#ffffff';
                ctx.font='25px NotoSans';
                ctx.fillText(day4TempMax, 705, 210);
                
                ctx.drawImage(day1Icon, 330, 70, 60, 60);
                ctx.drawImage(day2Icon, 440, 70, 60, 60);
                ctx.drawImage(day3Icon, 560, 70, 60, 60);
                ctx.drawImage(day3Icon, 670, 70, 60, 60);
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
