const { Playlist: DiscordPlaylist } = require('discord.js-music');

class Playlist {
  static applyToClass(target) {
    for (const prop of [
      'add',
      'start',
    ]) Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop));
  }

  /**
   * Add content to the playlist.
   * @param {Response} res
   * @param {String} content A string of content to add.
   * @param {number} [position=Infinity] The position at which to add the song(s).
   * @param {String} [type='normal'] One of `normal`, `playlist`
   * @return {Playlist}
   */
  async add(res, content, options) {
    res.send('adding songs to playlist...');

    const added = await super.add(content, options);
    if (added.length < 1) {
      res.error('Unable to find that resource.');
      return false;
    } else if (added.length === 1) {
      res.success(`added \`${added[0].title}\` to playlist`);
    } else {
      res.success(`added **${added.length}** songs to playlist`);
    }

    return true;
  }

  async start(response) {
    if (!this.current) return response.error('There is no song currently available to play.');

    await super.start(response.message.member.voiceChannel);
    response.success(`now playing \`${this.current.title}\``);
  }
}

Playlist.applyToClass(DiscordPlaylist);
