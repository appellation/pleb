var _ = require("underscore");
/**
 * Created by Will on 8/31/2016.
 */

(function() {

    const ytStream = require('youtube-audio-stream');
    const request = require('request');
    const EventEmitter = require('events');

    const PlaylistStructure = require('../structures/playlist');
    const YTPlaylist = require('../interfaces/yt');
    const SCPlaylist = require('../interfaces/sc');

    class Playlist {

        /**
         * Operate a generic playlist.
         * @param {VoiceConnection} conn
         * @param {PlaylistStructure} [listIn]
         * @constructor
         */
        constructor(conn, listIn) {
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

            /**
             * @type {EventEmitter}
             */
            this.ee = new EventEmitter();
        }

        /**
         * Start the playlist.
         * @param {Message} msg - The message used to execute this method.
         */
        start(msg) {

            var init = true;
            const self = this;

            function recurse() {

                if (self.dispatcher) {
                    self.stop();
                }

                if (self.list.hasCurrent()) {
                    const stream = self.getStream();

                    if(!stream)  {
                        self.ee.emit('error', 'No stream.');
                        return;
                    }

                    self.dispatcher = self.play(stream);

                    if(init)    {
                        self.ee.emit('init', self.list);
                        init = false;
                    }

                    if(self.list.list.length > 1)  {
                        const message = 'now playing ' + (self.list.pos + 1) + ' of ' + self.list.list.length + ': ' + self.list.getCurrent().name;
                        msg.channel.sendMessage(message);
                    }

                    self.ee.once('stopping', stopping);

                    self.dispatcher.removeListener('end', end); // clear any previous listeners
                    self.dispatcher.once('end', end);

                    function stopping() {
                        self.dispatcher.removeAllListeners('end');     // prevent end song code from triggering
                        console.log('removed end listener. count: ' + self.dispatcher.listenerCount('end'));
                    }

                    function end()  {
                        console.log('end song');
                        self.dispatcher = null;

                        if (self.list.hasNext()) {
                            console.log('playing next');
                            self.list.next();
                            self.ee.removeListener('stopping', stopping);       // clean-up the stopping listener since it wasn't used
                            recurse();
                        } else {
                            self.ee.emit('end');
                        }
                    }
                }   else    {
                    self.ee.emit('end');
                }
            }

            recurse();
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

            const query = args.length > 1;

            const YT = new YTPlaylist(this.list);
            const SC = new SCPlaylist(this.list);

            if(query || YTPlaylist.isYouTubeURL(args[0]))   {
                return YT.add(args);

            }   else if(SCPlaylist.isSoundCloudURL(args[0]))    {
                return SC.add(args[0]);

            }   else    {
                return new Promise(function(resolve, reject)    {
                    reject();
                });
            }
        }

        /**
         * Get the raw audio stream for the current playlist item.
         * @returns {Stream}
         */
        getStream() {
            const url = this.list.getCurrent().url;
            if(YTPlaylist.isVideo(url))    {
                return ytStream(url);
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
            if (this.list.hasNext()) {
                this.list.next();
                this.ee.emit('next', this.list);
                return this.list.getCurrent();
            }
        };

        /**
         * Stop playback.
         * IMPORTANT: `stopping` event MUST get emitted first in order to not trigger `recurse()`
         */
        stop() {
            if(this.dispatcher) {
                this.ee.emit('stopping');
                this.ee.removeAllListeners('start');
                this.dispatcher.end();
                this.dispatcher = null;
                this.ee.emit('stopped');
            }
        };

        /**
         * Destroy the audio connection.
         */
        destroy() {
            this.stop();
            if(this.vc) {
                this.vc.disconnect();
                this.vc = null;
                this.ee.emit('destroyed');
            }
        };

        /**
         * Pause playback.
         */
        pause() {
            if(this.dispatcher) {
                this.dispatcher.pause();
                this.ee.emit('paused');
            }
        };

        /**
         * Resume playback.
         */
        resume() {
            if(this.dispatcher) {
                this.dispatcher.resume();
                this.ee.emit('resumed');
            }
        };

        /**
         * Shuffle the playlist.
         */
        shuffle() {
            this.stop();
            this.list.shuffle();
            this.ee.emit('shuffled');
        };

        /**
         * Play a stream.
         * @param stream
         * @returns {EventEmitter}
         */
        play(stream) {

            if (this.dispatcher) {
                this.stop();
            }

            const self = this;
            const dispatcher = this.vc.playStream(stream);

            self.ee.emit('start', self.list);

            return dispatcher;
        };
    }


    module.exports = Playlist;
})();
