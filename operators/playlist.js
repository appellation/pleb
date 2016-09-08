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

                if (self.vc.playing) {
                    self.stop();
                }

                if (self.list.hasCurrent()) {
                    const stream = self.getStream();

                    if(!stream)  {
                        self.ee.emit('error', 'No stream.');
                        return;
                    }

                    self.play(stream).then(function (intent) {

                        if(init)    {
                            self.ee.emit('init', self.list);
                            init = false;
                        }

                        /**
                         * Resolves on stream end, if not destroyed.
                         */
                        return new Promise(function (resolve, reject) {
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

                            intent.once('end', function () {
                                resolve();
                            })
                        });
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

            function updateList(playlist)   {
                if(playlist.list.length > 1)  {
                    msg.channel.sendMessage('now playing ' + (playlist.pos + 1) + ' of ' + playlist.list.length + ': ' + playlist.getCurrent().name);
                }
            }

            this.ee.on('start', updateList);

            this.ee.once('end', function() {
                self.destroy();
            });

            recurse();
        };

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
            this.vc.stopPlaying();
            this.ee.emit('stopped');
        };

        /**
         * Destroy the audio connection.
         */
        destroy() {
            this.ee.removeAllListeners('start');
            this.vc.destroy();
            this.ee.emit('destroyed');
            this.vc = null;
        };

        /**
         * Pause playback.
         */
        pause() {
            if (!this.vc.paused) {
                this.vc.pause();
                this.ee.emit('paused');
            }
        };

        /**
         * Resume playback.
         */
        resume() {
            if (this.vc.paused) {
                this.vc.resume();
                this.ee.emit('resumed');
            }
        };

        /**
         * Shuffle the playlist.
         */
        shuffle() {
            if (this.vc.playing) {
                this.stop();
            }
            this.list.shuffle();
            this.ee.emit('shuffled');
        };

        /**
         * Play a stream.
         * @param {Stream} stream
         * @returns {EventEmitter}
         */
        play(stream) {

            if (this.vc.playing) {
                this.stop();
            }

            const self = this;
            const rawStream = this.vc.playRawStream(stream);

            rawStream.then(function()  {
                self.ee.emit('start', self.list);
            });

            return rawStream;
        };
    }


    module.exports = Playlist;
})();
