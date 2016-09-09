/**
 * Created by Will on 8/31/2016.
 */

"use strict";

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

                    console.log(self.dispatcher);

                    /*
                     * Resolves on stream end, if not destroyed.
                     */
                    new Promise(function (resolve, reject) {
                        var cancel = false;
                        self.ee.once('destroyed', function () {
                            cancel = true;
                            reject();
                        });
                        self.ee.once('stopped', function () {
                            cancel = true;
                            reject();
                        });
                        if (cancel) {
                            return;
                        }

                        self.dispatcher.once('end', function () {
                            self.dispatcher = null;
                            resolve();
                        })
                    }).then(function () {
                        if (self.list.hasNext()) {
                            self.list.next();
                            recurse();
                        } else {
                            self.ee.emit('end');
                        }
                    }).catch(function (err) {
                        self.ee.emit('error', err);
                        console.error(err);
                    });
                }   else    {
                    self.ee.emit('end');
                }
            }

            this.ee.once('end', function() {
                self.destroy();
            });

            recurse();
        };

        /**
         * Add an array of command arguments to the playlist.
         * @param {[]} args
         * @returns {Promise}
         */
        add(args)   {
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
         */
        stop() {
            this.ee.removeAllListeners('start');
            this.dispatcher.end();
            this.dispatcher = null;
            this.ee.emit('stopped');
        };

        /**
         * Destroy the audio connection.
         */
        destroy() {
            this.stop();
            this.vc.disconnect();
            this.ee.emit('destroyed');
            this.vc = null;
        };

        /**
         * Pause playback.
         */
        pause() {
            if (!this.vc.paused) {
                this.dispatcher.pause();
                this.ee.emit('paused');
            }
        };

        /**
         * Resume playback.
         */
        resume() {
            if (this.vc.paused) {
                this.dispatcher.resume();
                this.ee.emit('resumed');
            }
        };

        /**
         * Shuffle the playlist.
         */
        shuffle() {
            if (this.dispatcher) {
                this.stop();
            }
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
