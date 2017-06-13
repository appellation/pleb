module.exports = class {
  constructor({ bot }) {
    this.bot = bot;
  }

  exec(cmd) {
    const loop = this.bot.playlists.get(cmd.message.guild.id).toggleLoop();
    return cmd.response.success(`${loop ? 'Started' : 'Stopped'} looping current song.`);
  }

  validate(val) {
    return val.ensurePlaylist(this.bot);
  }
};
