/**
 * Created by Will on 8/31/2016.
 */

const request = require('request');
const EventEmitter = require('events');
const ytdl = require('ytdl-core');

const PlaylistStructure = require('../structures/playlist');
const YTPlaylist = require('../interfaces/yt');
const SCPlaylist = require('../interfaces/sc');
const storage = require('../storage/playlists');

class Playlist extends EventEmitter {

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
         * @type {VoiceConnection}
         */
        this.vc = conn;

        /**
         * @type {StreamDispatcher}
         */
        this._dispatcher = null;

        /**
         * @type {PlaylistStructure}
         */
        this.list = listIn || new PlaylistStructure();

        /**
         * @type {boolean}
         */
        this.continue = true;

        /**
         * @type {number}
         */
        this.volume = 1;
    }

    /**
     * Start the playlist.
     * @param {Message} msg - The message used to execute this method.
     * @param {[]} args
     */
    start(msg, args) {
        this.init = true;
        this.msg = msg;
        this.continue = true;

        this.once('init', playlist => {
            if(playlist.list.length === 1)  {
                if(!SCPlaylist.isSoundCloudURL(args[0]) && !YTPlaylist.isYouTubeURL(args[0]))    {
                    msg.reply('now playing ' + playlist.getCurrent().url);
                }   else    {
                    msg.reply('now playing');
                }
            }
        });

        this._playQueue();
    }

    /**
     * Play the queue.
     * @private
     */
    _playQueue()    {
        if (this._dispatcher) this._dispatcher.end();
        if (!this.list || !this.list.hasCurrent()) return;

        const stream = this.getStream();
        if(!stream)  {
            this.emit('error', 'No stream.');
            return;
        }

        this._dispatcher = this.play(stream);
        this._dispatcher.setVolume(this.volume);

        if(this.init)    {
            this.emit('init', this.list);
            this.init = false;
        }

        if(this.list.list.length > 1)  {
            const message = '**' + (this.list.pos + 1) + '** of ' + this.list.list.length + ': `' + this.list.getCurrent().name + "`";
            if(this.msg) this.msg.channel.sendMessage(message).catch(() => null);
        }

        this._dispatcher.once('end', this._end.bind(this));
    }

    setVolume(vol)  {
        this.volume = vol;
        this._dispatcher.setVolume(vol);
    }

    /**
     * Dispatcher end listener.
     * @param reason - the reason the dispatcher was ended.
     * @private
     */
    _end(reason)  {
        if(!this.continue)  {
            if(this._dispatcher) this._dispatcher.end();
            return;
        }

        if (this.list.hasNext()) {
            this.list.next();
            this._playQueue();
        }   else   {
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

        const YT = new YTPlaylist(this.list);
        const SC = new SCPlaylist(this.list);

        if(SCPlaylist.isSoundCloudURL(args[0])) return SC.add(args[0]);
        else return YT.add(args);
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
     * @returns {StreamStructure} Previous song.
     */
    prev()  {
        this.emit('prev');
        if(this.list.hasPrev()) {
            this.list.prev();
            this.emit('preved');
            return this.list.getCurrent();
        }
    }

    /**
     * Advance the playlist.
     * @returns {StreamStructure} Next song.
     */
    next() {
        this.emit('next');
        if (this.list.hasNext()) {
            this.list.next();
            this.emit('nexted', this.list);
            return this.list.getCurrent();
        }
    }

    /**
     * Stop playback.
     */
    stop() {
        this.emit('stop');
        this.continue = false;
        if(this._dispatcher) {
            this._dispatcher.end();
        }
        this.emit('stopped');
    }

    /**
     * Destroy the playlist.
     */
    destroy() {
        this.stop();
        this.emit('destroy');
        storage.delete(this.vc.channel.guild.id);
        this.emit('destroyed');
    }

    /**
     * Pause playback.
     */
    pause() {
        this.emit('pause');
        if(this._dispatcher) {
            this._dispatcher.pause();
            this.emit('paused');
        }
    }

    /**
     * Resume playback.
     */
    resume() {
        this.emit('resume');
        if(this._dispatcher) {
            this._dispatcher.resume();
            this.emit('resumed');
        }
    }

    /**
     * Shuffle the playlist.
     */
    shuffle() {
        this.emit('shuffle');
        this.stop();
        this.list.shuffle();
        this.emit('shuffled');
    }

    /**
     * Play a stream.
     * @param stream
     * @returns {EventEmitter}
     */
    play(stream) {
        this.emit('start');
        const dispatcher = this.vc.playStream(stream);
        this.emit('started', this.list);
        return dispatcher;
    }
}


module.exports = Playlist;