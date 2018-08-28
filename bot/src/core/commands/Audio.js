const { Command } = require('discord-handles');
const url = require('url');

module.exports = class AudioCommand extends Command {
  get playlist() {
    return this.guild.playlist;
  }

  get player() {
    return this.playlist.player;
  }

  /**
   * Add content to the playlist of this command
   * @param {string} content Content to add, either a URL or search term
   * @param {boolean} searchPlaylists Whether to include playlist results when adding
   * @returns {[boolean, string?]} Whether the addition was successful, and title of the first song that was added if any
   */
  async add(content, searchPlaylists = false) {
    this.response.send('adding songs to playlist...');

    const parsed = url.parse(content);
    if (!['http:', 'https:'].includes(parsed.protocol)) content = `ytsearch:${content}`;

    const loaded = await this.client.lavaqueue.load(content);
    if (loaded.loadType === 'LOAD_FAILED') {
      this.response.error('failed to load your query. please try again, maybe with a different selection.');
      return [false, null];
    }

    if (loaded.loadType === 'NO_MATCHES' || loaded.tracks.length < 1) {
      this.response.error('unable to find anything for your query');
      return [false, null];
    }

    if (['TRACK_LOADED', 'SEARCH_RESULT'].includes(loaded.loadType) && !searchPlaylists) {
      const first = loaded.tracks[0];
      await this.playlist.add(first.track);
      this.response.success(`added \`${first.info.title}\` to playlist`);
      return [true, first.info.title];
    } else if (loaded.loadType === 'PLAYLIST_LOADED' || searchPlaylists) {
      await this.playlist.add(...loaded.tracks.map(t => t.track));
      this.response.success(`added **${loaded.tracks.length}** songs to playlist`);
      return [true, loaded.tracks[0].info.title];
    }

    return [false, null];
  }

  /**
   * Start the playlist
   * @param {string?} title The title of the song that is expected to play
   */
  async start(title) {
    const member = this.member || await this.guild.fetchMember(this.author.id);
    if (!member) return this.response.error('I couldn\'t find you in this guild. Please make sure you\'re not invisible.');
    if (!member.voiceChannelID) return this.response.error('You\'ve disconnected from your voice channel.');

    if (!this.guild.me.voiceChannelID || member.voiceChannelID !== this.guild.me.voiceChannelID)
      await this.player.join(member.voiceChannelID, { deaf: true });

    this.player.setVolume(40);
    const started = await this.playlist.start();
    if (started) {
      if (title) this.response.success(`now playing \`${title}\``);
      else this.response.success('now playing');
    } else {
      this.response.error('unable to start: there\'s nothing in the playlist');
    }
  }
};
