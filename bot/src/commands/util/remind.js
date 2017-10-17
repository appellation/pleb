const resolvers = require('../../util/resolvers');
const moment = require('moment');
const Sherlock = require('sherlockjs');
const { Argument, Command } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    const user = await new Argument(this, 'user')
      .setPrompt('Who would you like to remind?')
      .setRePrompt('Please remind a valid user (`me` or a mention).')
      .setResolver((c, m) => {
        if (c === 'me') return this.message.author;
        return resolvers.user(c, m);
      });

    await new Argument(this, 'reminder')
      .setPrompt(`What would you like **${user.tag}** to be reminded of? (Also include when you'd like them to be reminded.)`)
      .setRePrompt('Please provide a valid reminder format.')
      .setPattern(/.*/)
      .setResolver(c => {
        const parsed = Sherlock.parse(c);
        return parsed.startDate && parsed.eventTitle ? parsed : null;
      });
  }

  exec() {
    setTimeout(() => {
      this.response.edit = false;
      this.response.success(`I'm reminding you ${this.args.reminder.eventTitle}, ${this.args.user}`);
    }, this.args.reminder.startDate - Date.now());
    return this.response.success(`reminder set for ${moment(this.args.reminder.startDate).format('dddd, MMMM Do YYYY, h:mm:ss a ZZ')}`);
  }
};
