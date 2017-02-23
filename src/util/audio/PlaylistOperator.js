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
     * @param {Playlist} [list]
     */
    constructor(conn, list) {
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
        this.playlist = list || new Playlist();

        /**
         * @type {StreamDispatcher}
         */
        this.dispatcher = null;

        /**
         * @type {number}
         * @private
         */
        this._vol = settings.get(this.guild.id).get ? settings.get(this.guild.id).get('volume') || 0.2 : 0.2;
    }

    /**
     * Find a PlaylistOperator and ensure empty or passed playlist.
     * @param {GuildMember} member
     * @param {Playlist} [list]
     * @return {Promise.<PlaylistOperator>}
     */
    static init(member, list) {
        if(storage.has(member.guild.id)) {
            const op = storage.get(member.guild.id);
            op.stop();
            op.playlist = list || new Playlist();
            return Promise.resolve(op);
        }

        return VC.checkCurrent(member)
            .then(conn => {
                const op = new PlaylistOperator(conn, list);
                storage.set(member.guild.id, op);
                return op;
            });
    }

    /**
     * Start a new Playlist.
     * @param {Array} args
     * @param {Response} res
     * @param {GuildMember} member
     * @return {Promise}
     */
    static startNew(args, res, member) {
        const pl = new Playlist();
        return pl.add(args).then(list => {
            return PlaylistOperator.init(member, list).then(op => op.start(res), res.error.bind(res));
        }, err => {
            if(err.response && err.response.statusCode === 403)
                res.error('Unauthorized to load all or part of that resource.  It likely contains private content.');
            else res.error(err.message || err);
        });
    }

    /**
     * Start the playlist.
     */
    start(res) {
        if(this.playlist.length) {
            this._start();
            res.success(`now playing \`${this.playlist.current.name}\``);
        } else {
            res.error('Nothing available to play.');
        }
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
    _end(reason) {
        if(reason === 'temp') return;
        if(reason === 'terminal' || !this.playlist.hasNext()) return this._destroy();
        this.playlist.next();
        this._start();
    }

    /**
     * Stop the playlist.
     */
    stop(reason = 'temp') {
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
    resume() {
        if(this.dispatcher && !this.dispatcher.speaking) this.dispatcher.resume();
    }

    /**
     * Add command arguments to a playlist.
     * @param {Array} args
     * @return {Promise.<PlaylistOperator>}
     */
    add(args) {
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
    get volume() {
        return (this.dispatcher ? this.dispatcher.volume : this._vol) * 100;
    }

    destroy() {
        this.stop('terminal');
    }

    /**
     * Destroy this playlist.
     */
    _destroy() {
        storage.delete(this.guild.id);
    }
}

module.exports = PlaylistOperator;