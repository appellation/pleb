const request = require('axios');
const timezone = require('moment-timezone');
const path = require('path');
const Canvas = require('canvas');

exports.exec = async ({ response, message: msg, args }) => {

  const geocodeOptions = {
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    params: {
      address : args.location,
      key: process.env.youtube
    }
  };

  const locationRes = (await request(geocodeOptions)).data;

  if (locationRes.status !== 'OK') {
    switch (locationRes.status) {
      case 'ZERO_RESULTS':
        return response.error('No results found');
      case 'REQUEST_DENIED':
        return response.error('Request denied');
      case 'INVALID_REQUEST':
        return response.error('Invalid request');
      case 'OVER_QUERY_LIMIT':
        return response.error('Over limit');
      case 'UNKNOWN_ERROR':
        return response.error('An unkown error has occurred');
      default:
        return response.error('I got no fucking clue what just happened, but it borke.');
    }
  }

  const weatherOptions = {
    url: `https://api.darksky.net/forecast/${process.env.darksky}/${locationRes.results[0].geometry.location.lat},${locationRes.results[0].geometry.location.lng}`
  };

  const locality = locationRes.results[0].address_components.find(loc => loc.types.includes('locality'));
  const governing = locationRes.results[0].address_components.find(gov => gov.types.includes('administrative_area_level_1'));
  const country = locationRes.results[0].address_components.find(cou => cou.types.includes('country'));
  const continent = locationRes.results[0].address_components.find(con => con.types.includes('continent'));

  const city = locality || governing || country || continent || {};

  const weatherRes = (await request(weatherOptions)).data;
  Canvas.registerFont(path.join(__dirname, '..', '..', '..', 'assets', 'fonts', 'NotoSans-Regular.ttf'), { family: 'NotoSans' });
  Canvas.registerFont(path.join(__dirname, '..', '..', '..', 'assets', 'fonts', 'NotoSans-Bold.ttf'), { family: 'NotoSansBold' });

  const images = path.join(__dirname, '..', '..', '..', 'assets', 'images', 'weather');

  const canvas = new Canvas(800, 250);
  const ctx = canvas.getContext('2d');
  const Image = Canvas.Image;
  const icon = new Image();
  const background = new Image();
  icon.src = path.resolve(images, `${getIcon(weatherRes.currently.icon)}.png`);
  background.src = path.resolve(images, 'weatherbg.png');

  const day1Time = timezone().tz(weatherRes.timezone).add(1, 'days').format('ddd');
  const day1TempMin = convertFToC(weatherRes.daily.data[0].temperatureMin);
  const day1TempMax = convertFToC(weatherRes.daily.data[0].temperatureMax);
  const day1Icon = new Image();
  day1Icon.src = path.resolve(images, `${getIcon(weatherRes.daily.data[0].icon)}.png`);

  const day2Time = timezone().tz(weatherRes.timezone).add(2, 'days').format('ddd');
  const day2TempMin = convertFToC(weatherRes.daily.data[1].temperatureMin);
  const day2TempMax = convertFToC(weatherRes.daily.data[1].temperatureMax);
  const day2Icon = new Image();
  day2Icon.src = path.resolve(images, `${getIcon(weatherRes.daily.data[1].icon)}.png`);

  const day3Time = timezone().tz(weatherRes.timezone).add(3, 'days').format('ddd');
  const day3TempMin = convertFToC(weatherRes.daily.data[2].temperatureMin);
  const day3TempMax = convertFToC(weatherRes.daily.data[2].temperatureMax);
  const day3Icon = new Image();
  day3Icon.src = path.resolve(images, `${getIcon(weatherRes.daily.data[2].icon)}.png`);

  const day4Time = timezone().tz(weatherRes.timezone).add(4, 'days').format('ddd');
  const day4TempMin = convertFToC(weatherRes.daily.data[3].temperatureMin);
  const day4TempMax = convertFToC(weatherRes.daily.data[3].temperatureMax);
  const day4Icon = new Image();
  day4Icon.src = path.resolve(images, `${getIcon(weatherRes.daily.data[3].icon)}.png`);

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

  return msg.channel.send(void 0, { files: [{ attachment: canvas.toBuffer() }] });
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

exports.arguments = function* (Argument) {
  yield new Argument('location')
    .setPattern(/.*/)
    .setPrompt('For where would you like to get weather information?');
};
