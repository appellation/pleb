const { Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensurePlaylist().apply(this.guild.playlist.current, 'No song available to loop');
  }

  exec() {
    const loop = this.guild.playlist.current.toggleLoop();
    return this.response.success(`${loop ? 'Started' : 'Stopped'} looping current song.`);
  }
};
