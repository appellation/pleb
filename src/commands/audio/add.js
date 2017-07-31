const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');
const { DiscordPlaylist } = require('cassette');

exports.exec = async (cmd) => {
  const list = DiscordPlaylist.get(cmd.client.bot.cassette, cmd.message.guild);

  let added;
  try {
    added = await list.add(cmd.args.song, cmd.args.next ? list.pos : undefined);
  } catch (e) {
    return cmd.response.error(e.message || e);
  }

  if (added.length === 0) {
    return cmd.response.error('Could not add anything to the playlist.');
  } else if (added.length === 1) {
    cmd.response.success(`Successfully added \`${added[0].title}\` to playlist.`);
  } else {
    cmd.response.success(`Successfully added **${added.length}** songs to playlist.`);
  }

  if (!list.playing) {
    await list.start(cmd.message.member);
    return cmd.response.success(`Now playing \`${list.current.title}\``);
  }
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
