const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');

exports.exec = async (cmd) => {
  const list = cmd.guild.playlist;
  const added = await list.add(cmd.response, cmd.args.song, {
    position: cmd.args.next ? list.pos + 1 : Infinity,
  });

  if (added && !list.playing) await list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureCanPlay();
  yield new Argument('next')
    .setPattern(/next/i)
    .setOptional();

  yield new Argument('song')
    .setPrompt('What would you like to add?')
    .setInfinite();
};
