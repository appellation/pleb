const Playlist = require('./Playlist');
const VC = require('./voiceConnection');
const bot = require('../../bot');

class PlaylistOperator {

    /**
     * @constructor
     * @param {Playlist} [list]
     */
    constructor(list) {
        /**
         * @type {Playlist}
         */
        this.playlist = list || new Playlist();

        /**
         * @type {VoiceConnection}
         */
        this.vc = null;

        Object.defineProperty(this, 'client', { value: this.guild.client });

        /**
         * Whether to loop the playlist.
         * @type {boolean}
         */
        this.loop = false;

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
        if (bot.playlists.has(member.guild.id)) {
            const op = bot.playlists.get(member.guild.id);
            op.stop();
            op.playlist = list || new Playlist();
            return op;
        }

        const conn = await VC.checkCurrent(member);
        const op = new PlaylistOperator(conn, list);
        bot.playlists.set(member.guild.id, op);
        return op;
    }

    /**
     * Start a new Playlist.
     * @param {String} content
     * @param {Response} res
     */
    static async startNew(content, res) {
        const pl = new Playlist();

        try {
            await pl.add(res, content);
        } catch (err) {
            if (err.response && err.response.statusCode === 403)
                res.error('Unauthorized to load all or part of that resource.  It likely contains private content.');
            else res.error(err.message || err);
            return;
        }

        const op = await PlaylistOperator.init(res.message.member, pl);
        op.start(res);
    }

    /**
     * Start the playlist.
     */
    start(res) {
        if (this.playlist.length) {
            this._start();
            res.success(`now playing \`${this.playlist.current.title}\``);
        } else {
            res.error('Nothing currently in playlist. This is unintended, but we don\'t know why.');
        }
    }

    /**
     * Play the playlist.
     * @private
     */
    _start() {
        this.stop('temp');
        if (!this.playlist.current) return;

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
        console.trace(`ended with reason: ${reason}`);
        this.dispatcher.stream.destroy();
        this.dispatcher = null;
        if (reason === 'temp') return;
        if (reason === 'terminal' || (!this.playlist.hasNext() && !this.loop)) return this._destroy();
        if (!this.loop) this.playlist.next();
        this._start();
    }

    /**
     * Stop the playlist.
     */
    stop(reason = 'temp') {
        if (this.dispatcher) {
            console.trace(`ending with reason: ${reason}`);
            this.dispatcher.end(reason);
        }
    }

    /**
     * Pause the playlist.
     */
    pause() {
        if (this.dispatcher && this.dispatcher.speaking) this.dispatcher.pause();
    }

    /**
     * Resume the playlist.
     */
    resume() {
        if (this.dispatcher && !this.dispatcher.speaking) this.dispatcher.resume();
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

    destroy() {
        this.stop('terminal');
    }

    /**
     * Destroy this playlist.
     */
    _destroy() {
        this.vc.disconnect();
        bot.playlists.delete(this.guild.id);
    }
}

module.exports = PlaylistOperator;
