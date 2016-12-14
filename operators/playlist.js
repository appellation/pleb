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
        this.dispatcher = null;

        /**
         * @type {PlaylistStructure}
         */
        this.list = listIn || new PlaylistStructure();
    }

    /**
     * Start the playlist.
     * @param {Message} msg - The message used to execute this method.
     * @param {[]} args
     */
    start(msg, args) {
        this.init = true;
        this.msg = msg;

        this.once('init', function(playlist)   {
            if(playlist.list.length === 1)  {
                if(!SCPlaylist.isSoundCloudURL(args[0]) && !YTPlaylist.isYouTubeURL(args[0]))    {
                    this.msg.reply('now playing ' + playlist.getCurrent().url).catch(() => null);
                }   else    {
                    this.msg.reply('now playing').catch(() => null);
                }
            }
        });

        this._playQueue();
    }

    _playQueue() {
        if (this.dispatcher) {
            this.stop();
        }

        if (this.list && this.list.hasCurrent()) {
            const stream = this.getStream();

            if(!stream)  {
                this.emit('error', 'No stream.');
                return;
            }

            this.dispatcher = this.play(stream);

            if(this.list.list.length > 1)  {
                const message = '**' + (this.list.pos + 1) + '** of ' + this.list.list.length + ': `' + this.list.getCurrent().name + "`";
                this.msg ? this.msg.channel.sendMessage(message).catch(() => null) : null;
            }

            if(this.init)    {
                this.emit('init', this.list);
                this.init = false;
            }

            this.once('stop', this._noContinue);
            this.once('destroy', this._noContinue);

            this.dispatcher.once('end', this._end.bind(this));
        }
    }

    _noContinue()   {
        this.removeListener('stop', this._noContinue);
        this.removeListener('destroy', this._noContinue);

        if(this.dispatcher && typeof this.dispatcher.removeListener === 'function') {
            this.dispatcher.removeListener('end', this._end.bind(this));
        }
        storage.delete(this.vc.channel.guild.id);
    }

    _end() {
        this.removeListener('stop', this._noContinue);
        this.removeListener('destroy', this._noContinue);

        if (this.list.hasNext()) {
            this.list.next();
            this._playQueue();
        }   else {
            this._noContinue();
        }
    }

    /**
     * Add an array of command arguments to the playlist.
     * @param {[]} args
     * @returns {Promise}
     */
    add(args)   {

        const self = this;

        if(args.length === 0)   {
            return new Promise(function(resolve)    {
                resolve(self.list);
            });
        }

        const YT = new YTPlaylist(this.list);
        const SC = new SCPlaylist(this.list);

        if(SCPlaylist.isSoundCloudURL(args[0]))    {
            return SC.add(args[0]);

        }   else    {
            return YT.add(args);
        }
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
    };

    /**
     * Stop playback.
     */
    stop() {
        this.emit('stop');
        if(this.dispatcher) {
            this.dispatcher.end();
            this.dispatcher = null;
        }
        this.emit('stopped');
    };

    /**
     * Destroy the audio connection.
     */
    destroy() {
        this.stop();
        this.emit('destroy');
        this.list = null;
        storage.delete(this.vc.channel.guild.id);
        if(this.vc) {
            this.vc.disconnect();
            this.vc = null;
            this.removeAllListeners();
        }
        if(this.dispatcher) {
            this.dispatcher.removeAllListeners();
        }
        this.emit('destroyed');
    };

    /**
     * Pause playback.
     */
    pause() {
        this.emit('pause');
        if(this.dispatcher) {
            this.dispatcher.pause();
            this.emit('paused');
        }
    };

    /**
     * Resume playback.
     */
    resume() {
        this.emit('resume');
        if(this.dispatcher) {
            this.dispatcher.resume();
            this.emit('resumed');
        }
    };

    /**
     * Shuffle the playlist.
     */
    shuffle() {
        this.emit('shuffle');
        this.stop();
        this.list.shuffle();
        this.emit('shuffled');
    };

    /**
     * Play a stream.
     * @param stream
     * @returns {EventEmitter}
     */
    play(stream) {
        this.emit('start');
        const dispatcher = this.vc.playStream(stream);
        dispatcher.setVolumeDecibels(0);
        this.emit('started', this.list);
        return dispatcher;
    };
}


module.exports = Playlist;
