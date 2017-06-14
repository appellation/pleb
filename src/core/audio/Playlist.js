const SoundCloud = require('./interfaces/Soundcloud');
const YouTube = require('./interfaces/Youtube');

const sc = new SoundCloud();
const yt = new YouTube();

const { knuthShuffle: shuffle } = require('knuth-shuffle');

/**
 * @typedef {Object} Song
 * @property {String} type Soundcloud or YouTube
 * @property {Function} stream The audio stream.
 * @property {String} title
 * @property {String} trackID
 * @property {String} playlistID
 */

class Playlist {

  /**
   * @constructor
   */
  constructor(bot, guild) {
    this.bot = bot;

    this.guild = guild;

    /**
     * The array of songs.
     * @type {Array.<Song>}
     */
    this.songs = [];

    /**
     * The array pointer.
     * @type {number}
     * @private
     */
    this._pos = 0;

    this.loop = false;

    this.playing = false;
  }

  /**
   * Get the length of the playlist.
   * @return {Number}
   */
  get length() {
    return this.songs.length;
  }

  /**
   * Get the current position of the playlist (starting at 1).
   * @return {number}
   */
  get pos() {
    return this._pos + 1;
  }

  /**
   * Get the current playlist item.
   * @return {Song}
   */
  get current() {
    return this.songs[this._pos];
  }

  reset() {
    this.songs = [];
    this._post = 0;
  }

  /**
   * Send the playlist back one song.
   * @return {number}
   */
  prev() {
    if (this.hasPrev()) this._pos--;
    return this.pos;
  }

  /**
   * Whether there is a previous song.
   * @return {boolean}
   */
  hasPrev() {
    return (this._pos - 1) >= 0;
  }

  /**
   * Advance to the next song.
   * @return {number}
   */
  next() {
    if (this.hasNext()) this._pos++;
    return this.pos;
  }

  /**
   * Whether there is a next song.
   * @return {boolean}
   */
  hasNext() {
    return (this._pos + 1) <= this.songs.length - 1;
  }

  /**
   * Get the next song.
   * @return {Song}
   */
  getNext() {
    return this.songs[this._pos + 1];
  }

  /**
   * Get the last song.
   * @return {Song|*}
   */
  getLast() {
    return this.songs[this.songs.length - 1];
  }

  /**
   * Shuffle the playlist.
   */
  shuffle() {
    this.songs = shuffle(this.songs);
    this._pos = 0;
  }

  toggleLoop() {
    this.loop = !this.loop;
    return this.loop;
  }

  /**
   * Add content to the playlist.
   * @param {Response} res
   * @param {String} content A string of content to add.
   * @param {String} type One of `normal`, `playlist`
   * @return {Playlist}
   */
  async add(res, content, type = 'normal') {
    await res.send('adding songs to playlist...');

    let added;
    if (type === 'normal') {
      const args = content.split(' ');
      added = (await sc.get(args))
        .concat(await yt.get(args));
    } else if (type === 'playlist') {
      added = await yt.getPlaylistQuery(content);
    }

    added = added.filter(e => e);

    if (added.length < 1) {
      return res.error('Unable to find that resource.');
    } else if (added.length === 1) {
      await res.success(`added \`${added[0].title}\` to playlist`);
    } else {
      await res.success(`added **${added.length}** songs to playlist`);
    }

    this.songs.push(...added);
    return added;
  }

  get dispatcher() {
    return this.guild.voiceConnection ? this.guild.voiceConnection.dispatcher : null;
  }

  async start(response) {
    try {
      await this.ensureVoiceConnection(response.message.member);
    } catch (e) {
      response.error(e);
      return;
    }

    if (this.bot.playlists.has(this.guild.id)) {
      this.bot.playlists.get(this.guild.id).stop('temp');
    } else {
      this.bot.playlists.set(this.guild.id, this);
    }

    await new Promise(r => setTimeout(r, 150));

    if (!this.current) return response.error('There is no song currently available to play.');
    this._start();
    await response.success(`now playing \`${this.current.title}\``);
  }

  stop(reason = 'temp') {
    if (this.dispatcher) this.dispatcher.end(reason);
  }

  destroy() {
    this.stop('terminal');
  }

  pause() {
    if (this.dispatcher && this.dispatcher.speaking) this.dispatcher.pause();
  }

  resume() {
    if (this.dispatcher && !this.dispatcher.speaking) this.dispatcher.resume();
  }

  _start() {
    if (!this.current || !this.guild.voiceConnection) return;
    this.stop();
    const dispatcher = this.guild.voiceConnection.playStream(this.current.stream(), { volume: 0.2 });
    this.playing = true;
    dispatcher.once('end', (reason) => {
      this.playing = false;
      if (reason === 'temp') return;
      if (reason === 'terminal' || (!this.hasNext() && !this.loop)) return this._destroy();
      if (!this.loop) this.next();
      this._start();
    });
  }

  _destroy() {
    if (this.guild.voiceConnection) this.guild.voiceConnection.disconnect();
    this.bot.playlists.delete(this.guild.id);
  }

  ensureVoiceConnection(member) {
    if (member.guild.voiceConnection) return member.guild.voiceConnection;

    const channel = member.voiceChannel;
    if (!channel) throw new Error('You\'re not in a voice channel.');
    if (!channel.joinable) throw new Error('I can\'t join your voice channel.');
    if (!channel.speakable) throw new Error('I can\'t speak in your voice channel.');
    return channel.join();
  }

  static get(bot, guild) {
    return bot.playlists.has(guild.id) ? bot.playlists.get(guild.id) : new Playlist(bot, guild);
  }
}

module.exports = Playlist;
