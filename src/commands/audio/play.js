const { DiscordPlaylist } = require('cassette');
const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');

exports.exec = async (cmd) => {
  const list = DiscordPlaylist.get(cmd.client.bot.cassette, cmd.message.guild);

  list.stop();
  list.reset();

  let added;
  try {
    added = await list.add(cmd.args.song);
  } catch (e) {
    await cmd.response.error(e.message || e);
    return;
  }

  if (added.length === 0) {
    return cmd.response.error('Could not add anything to the playlist.');
  } else if (added.length === 1) {
    cmd.response.success(`Successfully added \`${added[0].title}\` to playlist.`);
  } else {
    cmd.response.success(`Successfully added **${added.length}** songs to playlist.`);
  }

  return list.start(cmd.message.member);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureCanPlay();
  yield new Argument('song')
    .setPrompt('What song would you like to add?')
    .setInfinite();
};
