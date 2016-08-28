/**
 * Created by Will on 8/27/2016.
 *
 */

const shuffle = require('knuth-shuffle').knuthShuffle;

/**
 * Structure a playlist of Streams.
 * @constructor
 */
function Playlist() {

    // VARIABLES

    const that = this;

    /**
     * The playlist array.
     * @type {Stream[]}
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
     * @returns {Stream[]}
     */
    this.get = function()   {
        return list;
    };

    /**
     * Check if there is a current song.
     * @returns {boolean}
     */
    this.hasCurrent = function() {
        return typeof list[pos] === 'undefined';
    };

    /**
     * Get the current Stream.
     * @returns {Stream|boolean}
     */
    this.getCurrent = function()    {
        if(that.hasCurrent())   {
            return list[pos];
        }   else    {
            return false;
        }
    };

    /**
     * Advance the playlist position counter.
     */
    this.next = function()  {
        if(this.isNext()) {
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
     * Get the next Stream in the playlist;
     * @returns {Stream|boolean}
     */
    this.getNext = function()   {
        if(this.hasNext())   {
            return list[pos + 1];
        }   else    {
            return false;
        }
    };

    /**
     * Shuffles the playlist.
     */
    this.shuffle = function()   {
        shuffle(list);
        pos = 0;
    };

    /**
     * Push a Stream to the playlist.
     * @param {Stream} stream
     */
    this.add = function(stream)   {
        list.push(stream);
    }
}

module.exports = Playlist;