const resolvers = require('../../util/resolvers');
const moment = require('moment');
const Sherlock = require('sherlockjs');
const { Argument } = require('discord-handles');

exports.exec = ({ response: res, args }) => {
  setTimeout(() => {
    res.edit = false;
    res.success(`I'm reminding you ${args.reminder.eventTitle}, ${args.user}`);
  }, args.reminder.startDate - Date.now());
  return res.success(`reminder set for ${moment(args.reminder.startDate).format('dddd, MMMM Do YYYY, h:mm:ss a ZZ')}`);
};

exports.middleware = function* (cmd) {
  const user = yield new Argument('user')
    .setPrompt('Who would you like to remind?')
    .setRePrompt('Please remind a valid user (`me` or a mention).')
    .setResolver(c => {
      if (c === 'me') return cmd.message.author;
      return resolvers.user(c);
    });

  yield new Argument('reminder')
    .setPrompt(`What would you like **${user.tag}** to be reminded of? (Also include when you'd like them to be reminded.)`)
    .setRePrompt('Please provide a valid reminder format.')
    .setPattern(/.*/)
    .setResolver(c => {
      const parsed = Sherlock.parse(c);
      return parsed.startDate && parsed.eventTitle ? parsed : null;
    });
};
