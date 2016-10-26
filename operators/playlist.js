/**
 * Created by Will on 8/31/2016.
 */

(function() {

    const request = require('request');
    const EventEmitter = require('events');
    const ytdl = require('ytdl-core');

    const PlaylistStructure = require('../structures/playlist');
    const YTPlaylist = require('../interfaces/yt');
    const SCPlaylist = require('../interfaces/sc');

    class Playlist extends EventEmitter {

        /**
         * Operate a generic playlist.
         * @param {VoiceConnection} conn
         * @param {PlaylistStructure} [listIn]
         * @constructor
         */
        constructor(conn, listIn) {
            super();

            if (!conn) {
                throw new Error('No voice connection.');
            }

            /**
             * @type {VoiceConnection}
             */
            this.vc = conn;

            /**
             * @type {StreamDispatcher|null}
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
            var init = true;
            const self = this;

            function playQueue() {
                if (self.dispatcher) {
                    self.stop();
                }

                if (self.list.hasCurrent()) {
                    const stream = self.getStream();

                    if(!stream)  {
                        self.emit('error', 'No stream.');
                        return;
                    }

                    self.dispatcher = self.play(stream);

                    if(init)    {
                        self.emit('init', self.list);
                        init = false;
                    }

                    if(self.list.list.length > 1)  {
                        const message = '**' + (self.list.pos + 1) + '** of ' + self.list.list.length + ': `' + self.list.getCurrent().name + "`";
                        msg.channel.sendMessage(message);
                    }

                    self.once('stop', noContinue);
                    self.once('destroy', noContinue);

                    self.dispatcher.once('end', end);
                    function end() {
                        self.dispatcher = null;

                        if (self.list.hasNext()) {
                            self.list.next();
                            playQueue();
                        }
                    }

                    function noContinue()   {
                        if(self.dispatcher && typeof self.dispatcher.removeListener == 'function') {
                            self.dispatcher.removeListener('end', end);
                        }
                    }
                }
            }

            self.once('init', function(playlist)   {
                if(playlist.list.length === 1)  {
                    if(!SCPlaylist.isSoundCloudURL(args[0]) && !YTPlaylist.isYouTubeURL(args[0]))    {
                        msg.reply('now playing ' + playlist.getCurrent().url);
                    }   else    {
                        msg.reply('now playing');
                    }
                }
            });

            playQueue();
        };

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
                this.emit('stopped');
            }
        };

        /**
         * Destroy the audio connection.
         */
        destroy() {
            this.emit('destroy');
            this.stop();
            if(this.vc) {
                this.vc.disconnect();
                this.vc = null;
                this.emit('destroyed');
            }
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
            dispatcher.setVolumeDecibels(-20);
            this.emit('started', this.list);
            return dispatcher;
        };
    }


    module.exports = Playlist;
})();
