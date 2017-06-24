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

  Canvas.registerFont(path.resolve(__dirname, '..', '..', '..', 'assets', 'fonts', 'NotoSans-Regular.ttf'), { family: 'NotoSans' });
  Canvas.registerFont(path.resolve(__dirname, '..', '..', '..', 'assets', 'fonts', 'NotoSans-Bold.ttf'), { family: 'NotoSansBold' });

  const images = path.resolve(__dirname, '..', '..', '..', 'assets', 'images', 'weather');

  const canvas = new Canvas(800, 250);
  const ctx = canvas.getContext('2d');

  const Image = Canvas.Image;

  const icon = new Image();
  const background = new Image();

  icon.src = path.resolve(images, `${getIcon(weatherRes.currently.icon)}.png`);
  background.src = path.resolve(images, 'weatherbg.png');

  ctx.drawImage(background, 0, 0);

  ctx.fillStyle = '#ffffff';
  ctx.font='22px NotoSans';
  ctx.fillText(city.long_name ? city.long_name : 'Unknown', 30, 40);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(275, 30, 1, canvas.height - 60);

  ctx.fillStyle = '#ffffff';
  ctx.font='70px NotoSans';
  ctx.fillText(`${convertFToC(weatherRes.currently.temperature)}°`, 80, 205);

  ctx.drawImage(icon, 80, 40, 90, 90);

  const timePlacements = [[365, 60], [475, 60], [595, 60], [705, 60]];

  const minPlacements = [[365, 170], [475, 170], [595, 170], [705, 170]];

  const maxPlacements = [[365, 210], [475, 210], [595, 210], [705, 210]];

  const imagePlacements = [[330, 70], [440, 70], [560, 70], [670, 70]];

  for (let i = 0; i < 4; i++) {
    const Time = timezone().tz(weatherRes.timezone).add(parseInt(i) + 1, 'days').format('ddd');
    const Min = convertFToC(weatherRes.daily.data[i].temperatureMin);
    const Max = convertFToC(weatherRes.daily.data[i].temperatureMax);

    const newImage = new Image();
    newImage.src = path.resolve(__dirname, '..', '..', '..', 'assets', 'images', 'weather', `${getIcon(weatherRes.daily.data[i].icon)}.png`);
    ctx.drawImage(newImage, imagePlacements[i][0], imagePlacements[i][1], 60, 60);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '25px NotoSans';
    ctx.fillText(Time, timePlacements[i][0], timePlacements[i][1]);

    ctx.fillStyle = '#ffffff';
    ctx.font = '25px NotoSans';
    ctx.fillText(Min, minPlacements[i][0], minPlacements[i][1]);

    ctx.fillStyle = '#ffffff';
    ctx.font = '25px NotoSans';
    ctx.fillText(Max, maxPlacements[i][0], maxPlacements[i][1]);
  }

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
