const Playlist = require('../../core/audio/Playlist');

module.exports = class {
  constructor({ bot }) {
    this.bot = bot;
  }

  async exec(cmd) {
    const list = Playlist.get(this.bot, cmd.message.guild);

    try {
      await list.add(cmd.response, cmd.args.song, cmd.args.next ? list.pos : undefined);
    } catch (e) {
      await cmd.response.error(e.message || e);
      return;
    }

    if (!list.playing) list.start(cmd.response);
  }

  * arguments(Argument) {
    yield new Argument('next')
      .setPattern(/next/i)
      .setOptional();

    yield new Argument('song')
      .setPrompt('What would you like to add?')
      .setPattern(/.*/);
  }

  validate(val) {
    return val.ensureCanPlay();
  }
};
