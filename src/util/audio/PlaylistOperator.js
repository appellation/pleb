/**
 * Created by Will on 1/14/2017.
 */

const Playlist = require('./Playlist');
const VC = require('./voiceConnection');
const storage = require('../storage/playlists');
const settings = require('../storage/settings');

class PlaylistOperator {

    /**
     * @constructor
     * @param {VoiceConnection} conn
     * @param {Playlist} [list]
     */
    constructor(conn, list) {
        if(!conn) throw new Error('No voice connection');

        /**
         * @type {VoiceConnection}
         */
        this.vc = conn;

        /**
         * @type {Guild}
         */
        this.guild = conn.channel.guild;

        this.client = this.guild.client;

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
        if(storage.has(member.guild.id)) {
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

        let added;
        try {
            added = await pl.add(args);
        } catch (err) {
            if(err.response && err.response.statusCode === 403)
                res.error('Unauthorized to load all or part of that resource.  It likely contains private content.');
            else res.error(err.message || err);
            return;
        }

        if(added.length < 1) {
            return res.error('Unable to find that resource.');
        } else if(added.length === 1) {
            res.success(`added \`${added[0].title}\` to playlist`);
        } else {
            res.success(`added **${added.length}** songs to playlist`);
        }

        const op = await PlaylistOperator.init(member, pl);
        op.start(res);
    }

    /**
     * Start the playlist.
     */
    start(res) {
        if(this.playlist.length) {
            this._start();
            res.success(`now playing \`${this.playlist.current.title}\``);
        } else {
            res.error('Nothing currently in playlist. This is unintended, but we don\'t know why.');
        }
        res.responseMessage = null;
    }

    /**
     * Play the playlist.
     * @private
     */
    _start() {
        this.stop('temp');
        if(!this.playlist.current) return;

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
        this.dispatcher.stream.destroy();
        this.dispatcher = null;
        if(reason === 'temp') return;
        if(reason === 'terminal' || !this.playlist.hasNext()) return this._destroy();
        this.playlist.next();
        this._start();
    }

    /**
     * Stop the playlist.
     */
    stop(reason = 'temp') {
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
        this.client.log.debug('resuming');
        if(this.dispatcher && !this.dispatcher.speaking) this.dispatcher.resume();
    }

    /**
     * Add command arguments to a playlist.
     * @param {Array} args
     * @return {PlaylistOperator}
     */
    async add(args) {
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
        this.stop('terminal');
    }

    /**
     * Destroy this playlist.
     */
    _destroy() {
        this.vc.disconnect();
        storage.delete(this.guild.id);
    }
}

module.exports = PlaylistOperator;
