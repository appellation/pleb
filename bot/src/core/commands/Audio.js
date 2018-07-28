const { Command } = require('discord-handles');
const url = require('url');

module.exports = class AudioCommand extends Command {
  get playlist() {
    return this.guild.playlist;
  }

  get player() {
    return this.playlist.player;
  }

  async add(content, searchPlaylists = false) {
    this.response.send('adding songs to playlist...');

    const parsed = url.parse(content);
    if (!['http:', 'https:'].includes(parsed.protocol)) content = `ytsearch:${content}`;

    const loaded = await this.client.lavaqueue.load(content);
    if (loaded.loadType === 'LOAD_FAILED') {
      this.response.error('failed to load your query. please try again, maybe with a different selection.');
      return false;
    }

    if (loaded.loadType === 'NO_MATCHES' || loaded.tracks.length < 1) {
      this.response.error('unable to find anything for your query');
      return false;
    }

    if (['TRACK_LOADED', 'SEARCH_RESULT'].includes(loaded.loadType) && !searchPlaylists) {
      await this.playlist.add(loaded.tracks[0].track);
      this.response.success(`added \`${loaded.tracks[0].title}\` to playlist`);
    } else if (loaded.loadType === 'PLAYLIST_LOADED' || searchPlaylists) {
      await this.playlist.add(...loaded.tracks.map(t => t.track));
      this.response.success(`added **${loaded.tracks.length}** songs to playlist`);
    } else {
      return false;
    }

    return true;
  }

  async start() {
    const member = this.member || await this.guild.fetchMember(this.author.id);
    if (!member) return this.response.error('I couldn\'t find you in this guild. Please make sure you\'re not invisible.');
    if (!member.voiceChannelID) return this.response.error('You\'ve disconnected from your voice channel.');

    if (!this.guild.me.voiceChannelID || member.voiceChannelID !== this.guild.me.voiceChannelID)
      await this.player.join(member.voiceChannelID, { deaf: true });

    const started = await this.playlist.start();
    const np = await this.playlist.current();

    if (started && np) {
      const track = await this.client.lavaqueue.decode(np.track);
      return this.response.success(`now playing \`${track.title}\``);
    }

    return this.response.error('unable to start: there\'s nothing in the playlist');
  }
};
