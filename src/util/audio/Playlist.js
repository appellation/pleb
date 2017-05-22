const bot = require('../../bot');
const SoundCloud = require('./interfaces/Soundcloud');
const YouTube = require('./interfaces/Youtube');

const sc = new SoundCloud();
const yt = new YouTube();

const { knuthShuffle: shuffle } = require('knuth-shuffle');

/**
 * @typedef {Object} Song
 * @property {String} type Soundcloud or YouTube
 * @property {Function} stream The audio stream.
 * @property {String} title
 * @property {String} trackID
 * @property {String} playlistID
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
        if (this.hasPrev()) this._pos--;
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
        if (this.hasNext()) this._pos++;
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
     * Add command arguments to the playlist.
     * @param {Response} res
     * @param {String} arg A string of content to add.
     * @return {Playlist}
     */
    async add(res, arg) {
        await res.send('adding songs to playlist...');

        const args = arg.split(' ');
        let added =
            (await sc.get(args))
            .concat(await yt.get(args));
        added = added.filter(e => e);

        if (added.length < 1) {
            return res.error('Unable to find that resource.');
        } else if (added.length === 1) {
            res.success(`added \`${added[0].title}\` to playlist`);
        } else {
            res.success(`added **${added.length}** songs to playlist`);
        }

        this.addSongs(added);
        return added;
    }

    /**
     * Add a song to the playlist.
     * @param {Array<?Song>} song
     */
    addSongs(songs) {
        this.list.push(...songs.filter(s => s));
    }
}

module.exports = Playlist;
