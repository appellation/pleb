const { get } = require('axios');
const timezone = require('moment-timezone');
const path = require('path');
const { createCanvas, Image, registerFont } = require('canvas');
const { Argument, Command } = require('discord-handles');

const root = path.resolve(__dirname, '..', '..', '..', 'assets');

registerFont(path.resolve(root, 'fonts', 'NotoSans-Bold.ttf'), { family: 'NotoSans' });
registerFont(path.resolve(root, 'fonts', 'NotoSans-Regular.ttf'), { family: 'NotoSans' });

module.exports = class extends Command {
  async pre() {
    await new Argument(this, 'location')
      .setInfinite()
      .setResolver(c => c || null)
      .setPrompt('For where would you like to get weather information?');
  }

  async exec() {
    const { data: location } = await get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: this.args.location,
        key: process.env.youtube,
      },
    });

    if (location.status !== 'OK') {
      switch (location.status) {
        case 'ZERO_RESULTS':
          return this.channel.sendMessage('No results found');
        case 'REQUEST_DENIED':
          return this.channel.sendMessage('Request denied');
        case 'INVALID_REQUEST':
          return this.channel.sendMessage('Invalid request');
        case 'OVER_QUERY_LIMIT':
          return this.channel.sendMessage('Over limit');
        case 'UNKNOWN_ERROR':
          return this.channel.sendMessage('An unkown error has occured');
      }
    }

    const latitude = location.results[0].geometry.location.lat;
    const longitude = location.results[0].geometry.location.lng;

    const locality = location.results[0].address_components.find(loc => loc.types.includes('locality'));
    const governing = location.results[0].address_components.find(gov => gov.types.includes('administrative_area_level_1'));
    const country = location.results[0].address_components.find(cou => cou.types.includes('country'));
    const continent = location.results[0].address_components.find(con => con.types.includes('continent'));

    const city = locality || governing || country || continent || {};

    const { data: weather } = await get(`https://api.darksky.net/forecast/${process.env.darksky}/${latitude},${longitude}`);

    const canvas = createCanvas(800, 250);
    const ctx = canvas.getContext('2d');

    const icon = new Image();
    const background = new Image();

    icon.src = path.join(root, 'images', 'weather', `${getIcon(weather.currently.icon)}.png`);
    background.src = path.join(root, 'images', 'weather', 'weatherbg.png');

    ctx.drawImage(background, 0, 0);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px NotoSans';
    ctx.fillText(city.long_name || 'Unknown', 30, 40);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(275, 30, 1, canvas.height - 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = '70px NotoSans';
    ctx.fillText(`${convertFToC(weather.currently.temperature)}°`, 80, 205);

    ctx.drawImage(icon, 80, 40, 90, 90);

    const timePlacements = [[365, 60], [475, 60], [595, 60], [705, 60]];
    const minPlacements = [[365, 170], [475, 170], [595, 170], [705, 170]];
    const maxPlacements = [[365, 210], [475, 210], [595, 210], [705, 210]];
    const imagePlacements = [[330, 70], [440, 70], [560, 70], [670, 70]];

    for (let i = 0; i < 4; i++) {
      const Time = timezone().tz(weather.timezone).add(parseInt(i) + 1, 'days').format('ddd');
      const Min = convertFToC(weather.daily.data[i].temperatureMin);
      const Max = convertFToC(weather.daily.data[i].temperatureMax);

      const newImage = new Image();
      newImage.src = path.join(root, 'images', 'weather', `${getIcon(weather.daily.data[i].icon)}.png`);
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

    this.response.send(undefined, undefined, { files: [{ attachment: canvas.toBuffer() }] });
  }
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
