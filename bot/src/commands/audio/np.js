const AudioCommand = require('../../core/commands/Audio');
const moment = require('moment');
const { Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  async pre() {
    await new Validator(this).ensureGuild();

    const np = await this.playlist.current();
    await new Validator(this).apply(() => Boolean(np), 'I\'m not currently playing anything');

    this.pos = moment.duration(Number(np.position), 'ms');
    this.np = await this.client.lavaqueue.decode(np.track);
  }

  exec() {
    const pos = Math.floor((this.pos.asMilliseconds() / this.np.length) * 10);
    const trackBar = `${'\u25ac'.repeat(pos)}\u2b24${'\u25ac'.repeat(9 - pos)}`;
    const length = moment.duration(this.np.length, 'ms');

    const currentTime = this.pos.asMinutes() >= 1 ? this.pos.format('h:m:ss') : `0:${this.pos.format('ss')}`;
    return this.response.send(`\`${this.np.title}\`\n<${this.np.uri}>\n${trackBar} ${currentTime} / ${length.format('h:m:ss')}`);
  }
};

exports.triggers = [
  'np',
  'nowplaying',
];
