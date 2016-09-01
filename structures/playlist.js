/**
 * Created by Will on 8/27/2016.
 *
 */

const shuffle = require('knuth-shuffle').knuthShuffle;

/**
 * Structure a playlist of Streams.
 * @constructor
 */
function PlaylistStructure() {

    // VARIABLES

    const self = this;

    /**
     * The playlist array.
     * @type {StreamStructure[]}
     */
    const list = [];

    /**
     * Current position in the playlist.
     * @type {number}
     */
    var pos = 0;


    // FUNCTIONS

    /**
     * Get the playlist.
     * @returns {StreamStructure[]}
     */
    this.get = function()   {
        return list;
    };

    /**
     * Check if there is a current song.
     * @returns {boolean}
     */
    this.hasCurrent = function() {
        return typeof list[pos] !== 'undefined';
    };

    /**
     * Get the current StreamStructure.
     * @returns {StreamStructure}
     */
    this.getCurrent = function()    {
        return list[pos];
    };

    /**
     * Advance the playlist position counter.
     */
    this.next = function()  {
        if(self.hasNext()) {
            pos++;
        }
    };

    /**
     * Check if there is a next song.
     * @returns {boolean}
     */
    this.hasNext = function()    {
        return typeof list[pos + 1] !== 'undefined';
    };

    /**
     * Get the next StreamStructure in the playlist;
     * @returns {StreamStructure}
     */
    this.getNext = function()   {
        return list[pos + 1];
    };

    /**
     * Get the length of the playlist.
     * @returns {Number}
     */
    this.length = function()    {
        return list.length;
    };

    this.pos = function()   {
        return pos;
    };

    /**
     * Shuffles the playlist.
     */
    this.shuffle = function()   {
        shuffle(list);
        pos = 0;
    };

    /**
     * Push a StreamStructure to the playlist.
     * @param {StreamStructure} stream
     */
    this.add = function(stream)   {
        list.push(stream);
    }
}

module.exports = PlaylistStructure;