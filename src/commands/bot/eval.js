const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');

exports.exec = async (cmd) => {
  let res;
  try {
    res = await eval(cmd.args.code);
  } catch (e) {
    res = e.message;
  }

  const inspected = require('util').inspect(res, { depth: 1 });
  return (inspected.length <= 6000) ? cmd.message.channel.send(inspected, { split: true, code: 'js' }) : cmd.response.error('that response would be too big');
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureIsOwner();
  yield new Argument('code')
    .setPrompt('What code would you like to eval?')
    .setInfinite();
};
