/**
 * Created by Will on 1/14/2017.
 */

const Playlist = require('./Playlist');
const VC = require('./voiceConnection');
const storage = require('../storage/playlists');

class PlaylistOperator  {

    /**
     * @constructor
     * @param {VoiceConnection} conn
     */
    constructor(conn)   {

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
        this._vol = 0.2;
    }

    /**
     * Initialize a new Playlist.
     * @param msg
     * @return {Promise.<PlaylistOperator>}
     */
    static init(msg)  {
        return new Promise(resolve => {
            if(!storage.has(msg.guild.id)) return resolve(VC.checkCurrent(msg.client, msg.member));

            const pl = storage.get(msg.guild.id);
            const conn = pl.vc;
            pl.destroy();
            return resolve(conn);
        }).then(conn => {
            const playlist = new PlaylistOperator(conn);
            storage.set(msg.guild.id, playlist);
            return playlist;
        });
    }

    /**
     * Start the playlist.
     */
    start() {
        this.stop();
        const stream = this.playlist.current.stream();
        this.dispatcher = this.vc.playStream(stream);
        this.dispatcher.setVolume(this._vol);
        this.dispatcher.on('end', this._end.bind(this));
    }

    /**
     * The dispatcher end event listener.
     * @param reason
     * @private
     */
    _end(reason)  {
        if(!this.playlist.hasNext() || reason === 'manual') return;
        this.playlist.next();
        this.start();
    }

    /**
     * Stop the playlist.
     */
    stop()  {
        if(this.dispatcher) this.dispatcher.end('manual');
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
        if(this.dispatcher) this.dispatcher.setVolume(this._vol);
    }

    /**
     * Get the playlist volume.
     * @return {number}
     */
    get volume()    {
        return (this.dispatcher ? this.dispatcher.volume : this._vol) * 100;
    }

    /**
     * Destroy this playlist.
     */
    destroy()   {
        this.stop();
        storage.delete(this.guild.id);
    }
}

module.exports = PlaylistOperator;