const moment = require('moment');
const xkcd = require('xkcd');
const { number } = require('../../util/random');
const { Command } = require('discord-handles');

module.exports = class extends Command {
  exec() {
    let num;
    do {
      num = number(1758);
    } while (num === 404);

    xkcd(num, data => this.response.send(`${data.title}\n${moment().month(data.month-1).format('MMMM')} ${data.day}, ${data.year}\n${data.img}`));
  }
};
