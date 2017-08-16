const { DiscordPlaylist } = require('cassette');

/**
 * @typedef {Object} Song
 * @property {String} type Soundcloud or YouTube
 * @property {Function} stream The audio stream.
 * @property {String} title
 * @property {String} trackID
 * @property {String} playlistID
 */

class Playlist extends DiscordPlaylist {
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

    try {
      await super.start(response.message.member.voiceChannel);
    } catch (e) {
      response.error(e);
      return;
    }
    response.success(`now playing \`${this.current.title}\``);
  }
}

module.exports = Playlist;
