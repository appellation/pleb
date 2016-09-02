/**
 * Created by Will on 8/31/2016.
 */

"use strict";

(function() {
    const PlaylistStructure = require('../structures/playlist');
    const EventEmitter = require('events');

    /**
     * @abstract
     */
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
         * @param {GetStream} getStream - Function to get a stream from a StreamStructure
         */
        start(getStream) {

            var init = true;
            const self = this;

            function recurse(getStream) {

                if (self.vc.playing) {
                    self.stop();
                }

                if (self.list.hasCurrent()) {
                    self.play(getStream(self.list.getCurrent())).then(function (intent) {

                        if(init)    {
                            self.ee.emit('init');
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
                            recurse(getStream);
                        } else {
                            self.ee.emit('end');
                        }
                    }).catch(function (err) {
                        self.ee.emit('error', err);
                        console.error(err);
                    });
                }
            }

            recurse(getStream);
        };

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
            this.vc.stopPlaying();
            this.ee.emit('stopped');
        };

        /**
         * Destroy the audio connection.
         */
        destroy() {
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
