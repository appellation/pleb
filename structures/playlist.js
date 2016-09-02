/**
 * Created by Will on 8/27/2016.
 *
 */

"use strict";

(function() {
    const shuffle = require('knuth-shuffle').knuthShuffle;

    /**
     * Structure a playlist of Streams.
     * @constructor
     */
    class PlaylistStructure {

        /**
         * Construct a PlaylistStructure.
         * @constructor
         */
        constructor()   {

            /**
             * The playlist array.
             * @type {StreamStructure[]}
             */
            this.list = [];

            /**
             * Current position in the playlist.
             * @type {number}
             */
            this.pos = 0;
        }


        /**
         * Check if there is a current song.
         * @returns {boolean}
         */
        hasCurrent() {
            return typeof this.list[this.pos] !== 'undefined';
        };

        /**
         * Get the current StreamStructure.
         * @returns {StreamStructure}
         */
        getCurrent()    {
            return this.list[this.pos];
        };

        /**
         * Advance the playlist position counter.
         */
        next()  {
            if(this.hasNext()) {
                this.pos++;
            }
        };

        /**
         * Check if there is a next song.
         * @returns {boolean}
         */
        hasNext()    {
            return typeof this.list[this.pos + 1] !== 'undefined';
        };

        /**
         * Get the next StreamStructure in the playlist;
         * @returns {StreamStructure}
         */
        getNext()   {
            return this.list[this.pos + 1];
        };

        /**
         * Shuffles the playlist.
         */
        shuffle()   {
            shuffle(this.list);
            this.pos = 0;
        };

        /**
         * Push a StreamStructure to the playlist.
         * @param {StreamStructure} stream
         */
        add(stream)   {
            this.list.push(stream);
        }
    }

    module.exports = PlaylistStructure;
})();