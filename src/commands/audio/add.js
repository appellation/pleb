const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');
const { DiscordPlaylist } = require('cassette');

exports.exec = async (cmd) => {
  const list = DiscordPlaylist.get(cmd.client.bot.cassette, cmd.message.guild);

  try {
    await list.add(cmd.args.song, cmd.args.next ? list.pos : undefined);
  } catch (e) {
    await cmd.response.error(e.message || e);
    return;
  }

  if (!list.playing) list.start(cmd.message.member);
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
