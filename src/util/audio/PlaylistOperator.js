/**
 * Created by Will on 1/14/2017.
 */

const {EventEmitter} = require('events');

const Playlist = require('./Playlist');
const VC = require('./voiceConnection');
const storage = require('../storage/playlists');
const settings = require('../storage/settings');

class PlaylistOperator extends EventEmitter {

    /**
     * @constructor
     * @param {VoiceConnection} conn
     */
    constructor(conn)   {
        super();

        if(!conn) throw new Error('No voice connection');

        /**
         * @type {VoiceConnection}
         */
        this.vc = conn;

        /**
         * @type {Guild}
         */
        this.guild = conn.channel.guild;

        /**
         * @type {Playlist}
         */
        this.playlist = new Playlist();

        /**
         * @type {StreamDispatcher}
         */
        this.dispatcher = null;

        /**
         * @type {number}
         * @private
         */
        this._vol = settings.get(this.guild.id).get('volume') || 0.2;
    }

    /**
     * Initialize a new Playlist.
     * @param {Message} msg
     * @param {Response} res
     * @return {Promise.<PlaylistOperator>}
     */
    static init(msg, res)  {
        return new Promise(resolve => {
            if(!storage.has(msg.guild.id)) return resolve(VC.checkCurrent(msg.client, msg.member));

            const pl = storage.get(msg.guild.id);
            const conn = pl.vc;
            pl.destroy();
            return resolve(conn);
        }).catch(err => {
            res.error(err);
            return Promise.reject();
        }).then(conn => {
            const operator = new PlaylistOperator(conn);

            storage.set(msg.guild.id, operator);
            return operator;
        });
    }

    /**
     * Start the playlist.
     */
    start(res) {
        this._start();
        res.success(`now playing \`${this.playlist.current.name}\``);
    }

    /**
     * Play the playlist.
     * @private
     */
    _start() {
        this.stop('temp');
        if(!this.playlist.current) return;

        this.emit('start', this);

        const stream = this.playlist.current.stream();
        this.dispatcher = this.vc.playStream(stream, { volume: this._vol });
        this.dispatcher.once('end', this._end.bind(this));
    }

    /**
     * The dispatcher end event listener.
     * @param reason
     * @private
     */
    _end(reason)  {
        if(reason === 'temp') return;
        if(reason === 'terminal' || !this.playlist.hasNext()) return this._destroy();
        this.playlist.next();
        this._start();
    }

    /**
     * Stop the playlist.
     */
    stop(reason = 'temp')  {
        this.emit('stop', this);
        if(this.dispatcher) this.dispatcher.end(reason);
    }

    /**
     * Pause the playlist.
     */
    pause() {
        if(this.dispatcher && this.dispatcher.speaking) this.dispatcher.pause();
    }

    /**
     * Resume the playlist.
     */
    resume()    {
        if(this.dispatcher && !this.dispatcher.speaking) this.dispatcher.resume();
    }

    /**
     * Add command arguments to a playlist.
     * @param {Array} args
     * @return {Promise.<PlaylistOperator>}
     */
    add(args)   {
        return this.playlist.add(args).then(() => this);
    }

    /**
     * Set the playlist volume.
     * @param {number} vol
     */
    set volume(vol) {
        this._vol = vol / 100;
        settings.get(this.guild.id).set('volume', this._vol);
        if(this.dispatcher) this.dispatcher.setVolumeLogarithmic(this._vol);
    }

    /**
     * Get the playlist volume.
     * @return {number}
     */
    get volume()    {
        return (this.dispatcher ? this.dispatcher.volume : this._vol) * 100;
    }

    destroy() {
        this.stop('terminal');
    }

    /**
     * Destroy this playlist.
     */
    _destroy()   {
        this.vc.disconnect();
        storage.delete(this.guild.id);
    }
}

module.exports = PlaylistOperator;