/**
 * Created by Will on 1/14/2017.
 */

const Soundcloud = require('./interfaces/Soundcloud');
const Youtube = require('./interfaces/Youtube');

const shuffle = require('knuth-shuffle').knuthShuffle;

/**
 * @typedef {Object} Song
 * @property {String} name
 * @property {String} url - a display URL
 * @property {String} type
 * @property {Number|String} duration
 * @property {String} thumbnail
 * @property {String} author
 */

class Playlist {

    /**
     * @constructor
     */
    constructor() {

        /**
         * The array of songs.
         * @type {Array.<Song>}
         */
        this.list = [];

        /**
         * The array pointer.
         * @type {number}
         * @private
         */
        this._pos = 0;

        /**
         * Information about this playlist. (Not guaranteed to be accurate,
         * since songs can be arbitrarily manipulated.)
         * @type {Object}
         * @property {string} title
         * @property {string} description
         * @property {string} thumbnail - URL to thumbnail image.
         * @property {string} displayURL - URL to playlist itself
         * @property {string} author
         */
        this.info = {};

        /**
         * The SoundCloud interface.
         * @type {Soundcloud}
         */
        this.sc = new Soundcloud(this);

        /**
         * The YouTube interface.
         * @type {Youtube}
         */
        this.yt = new Youtube(this);
    }

    /**
     * Get the length of the playlist.
     * @return {Number}
     */
    get length() {
        return this.list.length;
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
        return this.list[this._pos];
    }

    /**
     * Send the playlist back one song.
     * @return {number}
     */
    prev() {
        if(this.hasPrev()) this._pos--;
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
        if(this.hasNext()) this._pos++;
        return this.pos;
    }

    /**
     * Whether there is a next song.
     * @return {boolean}
     */
    hasNext() {
        return (this._pos + 1) <= this.list.length - 1;
    }

    /**
     * Get the next song.
     * @return {Song}
     */
    getNext() {
        return this.list[this._pos + 1];
    }

    /**
     * Get the last song.
     * @return {Song|*}
     */
    getLast() {
        return this.list[this.list.length - 1];
    }

    /**
     * Shuffle the playlist.
     */
    shuffle() {
        this.list = shuffle(this.list);
        this._pos = 0;
    }

    /**
     * Add command arguments to the playlist.  Order is not guaranteed.
     * @param args
     * @param {Response} res
     * @return {Promise.<Playlist>}
     */
    add(args, res) {
        return Promise.all([
            this.sc.add(args),
            this.yt.add(args)
        ]).then(() => this);
    }

    /**
     * Add a song to the playlist.
     * @param {Song} song
     * @returns {Song}
     */
    addSong(song) {
        this.list.push(song);
        return song;
    }
}

module.exports = Playlist;