/**
 * Created by Will on 1/14/2017.
 */

const Soundcloud = require('../interfaces/Soundcloud');
const Youtube = require('../interfaces/Youtube');

/**
 * @typedef {Object} Song
 * @property {String} name
 * @property {String} url - a display URL
 * @property {String} type
 * @property {Number|String} duration
 */

class Playlist  {
    constructor()   {

        /**
         * @type {Array.<Song>}
         */
        this.list = [];
        this._pos = 0;
        this.sc = new Soundcloud(this);
        this.yt = new Youtube(this);
    }

    get length()    {
        return this.list.length;
    }

    get pos()   {
        return this._pos + 1;
    }

    set pos(newPos) {
        if(!this.hasNext()|| !this.hasPrev()) return;
        this._pos = newPos - 1;
    }

    get current()   {
        return this.list[this.pos];
    }

    prev()  {
        return --this.pos;
    }

    hasPrev()   {
        return (this._pos - 1) >= 0;
    }

    next()  {
        return ++this.pos;
    }

    hasNext()   {
        return (this._pos + 1) <= this.length;
    }

    add(args)   {
        return Promise.all([
            this.sc.add(args),
            this.yt.add(args)
        ]).then(() => this);
    }

    addSong(song)   {
        this.list.push(song);
    }
}

module.exports = Playlist;