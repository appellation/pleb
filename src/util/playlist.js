/**
 * Created by Will on 8/31/2016.
 */

const request = require('request');
const EventEmitter = require('events');
const ytdl = require('ytdl-core');

const PlaylistStructure = require('./structures/playlist');
const YTPlaylist = require('./interfaces/yt');
const SCPlaylist = require('./interfaces/sc');
const storage = require('./storage/playlists');

class PlaylistOperator extends EventEmitter {

    /**
     * Operate a generic playlist.
     * @param {VoiceConnection} conn
     * @param {PlaylistStructure} [listIn]
     * @constructor
     */
    constructor(conn, listIn) {
        super();

        if (!conn) throw new Error('No voice connection.');

        /**
         * The voice connection to play on.
         * @type {VoiceConnection}
         */
        this.vc = conn;

        /**
         * The dispatcher for the current audio.
         * @type {StreamDispatcher}
         * @private
         */
        this._dispatcher = null;

        /**
         * The playlist.
         * @type {PlaylistStructure}
         */
        this.list = listIn || new PlaylistStructure();

        /**
         * Whether to continue to the next song on end.
         * @type {boolean}
         */
        this.continue = true;

        /**
         * Whether this playlist has not been started.
         * @type {boolean}
         */
        this.init = true;

        /**
         * Volume of the playlist.
         * @type {number}
         * @private
         */
        this._volume = 1;

        /**
         * YouTube interactions with the playlist.
         * @type {YTPlaylist}
         */
        this.yt = new YTPlaylist(this.list);

        /**
         * SoundCloud interactions with the playlist.
         * @type {SCPlaylist}
         */
        this.sc = new SCPlaylist(this.list);
    }

    /**
     * Start the playlist.
     * @param {Message} msg - The message used to execute this method.
     * @param {[]} args
     */
    start(msg, args) {
        this.msg = msg;
        this.continue = true;

        this.once('init', playlist => {
            let out;
            if(playlist.list.length === 1)  {
                if(!SCPlaylist.isSoundCloudURL(args[0]) && !YTPlaylist.isYouTubeURL(args[0]))    {
                    out = 'now playing ' + playlist.getCurrent().url;
                }   else    {
                    out = 'now playing';
                }
            }   else {
                out = `**${playlist.list.length}** songs in queue`;
            }

            msg.channel.sendMessage(out).catch(() => null);
        });

        this._playQueue();
    }

    /**
     * Play the queue.
     * @private
     */
    _playQueue()    {
        this.stop();
        if (!this.list || !this.list.hasCurrent()) return;

        const stream = this.getStream();
        if(!stream) return this.emit('error', 'No stream.');

        this._dispatcher = this.play(stream);
        this.continue = true;

        if(this.init) {
            this.emit('init', this.list);
            this.init = false;
        }

        this._dispatcher.once('end', this._end.bind(this));
    }

    set volume(vol)  {
        this._volume = vol;
        this._dispatcher.setVolume(vol);
    }

    get volume()    {
        return this._dispatcher.volume;
    }

    /**
     * Dispatcher end listener.
     * @private
     */
    _end()  {
        if(!this.continue) return;

        if (this.list.hasNext()) {
            this.list.next();
            this._playQueue();
        }   else   {
            this.emit('end');
            this.destroy();
        }
    }

    /**
     * Add an array of command arguments to the playlist.
     * @param {[]} args
     * @returns {Promise}
     */
    add(args)   {
        if(args.length === 0) return Promise.resolve(this.list);

        if(SCPlaylist.isSoundCloudURL(args[0])) return this.sc.add(args[0]);
        return this.yt.add(args);
    }

    /**
     * Get the raw audio stream for the current playlist item.
     * @returns {Stream}
     */
    getStream() {
        const url = this.list.getCurrent().url;
        if(YTPlaylist.isVideo(url))    {
            return ytdl(url, {
                filter: 'audioonly',
                quality: 'lowest'
            });
        }   else if(SCPlaylist.isSoundCloudStream(url))   {
            return request({
                url: url,
                followAllRedirects: true,
                qs: {
                    client_id: process.env.soundcloud
                },
                encoding: null
            });
        }
    }

    /**
     * Revert the playlist to the previous song.
     * @returns {StreamStructure|undefined} Previous song.
     */
    prev()  {
        if(!this.list.hasPrev()) return;
        this.list.prev();
        return this.list.getCurrent();
    }

    /**
     * Advance the playlist.
     * @returns {StreamStructure|undefined} Next song.
     */
    next() {
        if (!this.list.hasNext()) return;
        this.list.next();
        return this.list.getCurrent();
    }

    /**
     * Stop playback.
     */
    stop() {
        this.continue = false;
        if(this._dispatcher && this._dispatcher.speaking) this._dispatcher.end();
    }

    /**
     * Destroy the playlist.
     */
    destroy() {
        this.stop();
        storage.delete(this.vc.channel.guild.id);
    }

    /**
     * Pause playback.
     */
    pause() {
        if(this._dispatcher && !this._dispatcher.paused) this._dispatcher.pause();
    }

    /**
     * Resume playback.
     */
    resume() {
        if(this._dispatcher && this._dispatcher.paused) this._dispatcher.resume();
    }

    /**
     * Shuffle the playlist.
     */
    shuffle() {
        this.stop();
        this.list.shuffle();
    }

    /**
     * Play a stream.
     * @param stream
     * @returns {EventEmitter}
     */
    play(stream) {
        this.emit('start', this.list);
        const dispatcher = this.vc.playStream(stream);
        dispatcher.setVolume(this._volume);
        this.emit('started', this.list);
        return dispatcher;
    }
}


module.exports = PlaylistOperator;