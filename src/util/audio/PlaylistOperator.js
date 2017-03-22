/**
 * Created by Will on 1/14/2017.
 */

const Playlist = require('./Playlist');
const VC = require('./voiceConnection');
const storage = require('../storage/playlists');
const settings = require('../storage/settings');
const log = require('../log');

class PlaylistOperator {

    /**
     * @constructor
     * @param {VoiceConnection} conn
     * @param {Playlist} [list]
     */
    constructor(conn, list) {
        if(!conn) throw new Error('No voice connection');

        log.silly('constructing new playlist');

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
        this._vol = 0.2;
    }

    /**
     * Find a PlaylistOperator and ensure empty or passed playlist.
     * @param {GuildMember} member
     * @param {Playlist} [list]
     * @return {PlaylistOperator}
     */
    static async init(member, list) {
        log.debug('initializing new playlist');
        if(storage.has(member.guild.id)) {
            log.silly('found existing playlist: stopping it');
            const op = storage.get(member.guild.id);
            op.stop();
            op.playlist = list || new Playlist();
            return op;
        }

        const conn = await VC.checkCurrent(member);
        const op = new PlaylistOperator(conn, list);
        storage.set(member.guild.id, op);
        return op;
    }

    /**
     * Start a new Playlist.
     * @param {Array} args
     * @param {Response} res
     * @param {GuildMember} member
     */
    static async startNew(args, res, member) {
        const pl = new Playlist();

        log.debug('starting new playlist from args');
        try {
            const list = await pl.add(args);

            const op = await PlaylistOperator.init(member, list);
            op.start(res);
            log.debug('playlist started');
        } catch (err) {
            log.error('playlist failed to start: %s', err);
            if(err.response && err.response.statusCode === 403)
                res.error('Unauthorized to load all or part of that resource.  It likely contains private content.');
            else res.error(err.message || err);
        }
    }

    /**
     * Start the playlist.
     */
    start(res) {
        log.debug('attempting to play playlist');
        if(this.playlist.length) {
            this._start();
            log.debug('playlist now playing');
            res.success(`now playing \`${this.playlist.current.name}\``);
        } else {
            res.error('Nothing currently in playlist.');
        }
    }

    /**
     * Play the playlist.
     * @private
     */
    _start() {
        log.debug('starting a song');
        this.stop('temp');
        if(!this.playlist.current) return;

        const stream = this.playlist.current.stream();
        this.dispatcher = this.vc.playStream(stream, { volume: this._vol });
        this.dispatcher.once('end', this._end.bind(this));
        log.debug('dispatcher initialized and streaming');
    }

    /**
     * The dispatcher end event listener.
     * @param reason
     * @private
     */
    _end(reason) {
        log.debug('dispatcher ended');
        this.dispatcher.stream.destroy();
        this.dispatcher = null;
        log.debug('dispatcher stream destroyed; dispatcher unset');
        if(reason === 'temp') return;
        if(reason === 'terminal' || !this.playlist.hasNext()) return this._destroy();
        this.playlist.next();
        this._start();
    }

    /**
     * Stop the playlist.
     */
    stop(reason = 'temp') {
        log.debug(`stop called: ${reason}`);
        if(this.dispatcher) this.dispatcher.end(reason);
    }

    /**
     * Pause the playlist.
     */
    pause() {
        log.debug('pausing');
        if(this.dispatcher && this.dispatcher.speaking) this.dispatcher.pause();
    }

    /**
     * Resume the playlist.
     */
    resume() {
        log.debug('resuming');
        if(this.dispatcher && !this.dispatcher.speaking) this.dispatcher.resume();
    }

    /**
     * Add command arguments to a playlist.
     * @param {Array} args
     * @return {PlaylistOperator}
     */
    async add(args) {
        log.debug('adding args to playlist');
        await this.playlist.add(args);
        return this;
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
        log.debug('called for manual playlist destruction');
        this.stop('terminal');
    }

    /**
     * Destroy this playlist.
     */
    _destroy() {
        log.debug('destroying playlist');
        this.vc.disconnect();
        storage.delete(this.guild.id);
        log.debug('disconnected and deleted playlist');
    }
}

module.exports = PlaylistOperator;