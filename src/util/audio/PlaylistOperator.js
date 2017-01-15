/**
 * Created by Will on 1/14/2017.
 */

const Playlist = require('./Playlist');
const VC = require('./voiceConnection');
const storage = require('../storage/playlists');

class PlaylistOperator  {
    constructor(conn)   {
        this.vc = conn;
        this.playlist = new Playlist();
        this.dispatcher = null;
        this._vol = 0.2;
    }

    static init(msg)  {
        return new Promise(resolve => {
            if(storage.has(msg.guild.id)) {
                const pl = storage.get(msg.guild.id);
                const conn = pl.vc;
                pl.destroy();
                return resolve(conn);
            }
            return resolve(VC.checkCurrent(msg.client, msg.member));
        }).then(conn => {
            const playlist = new PlaylistOperator(conn);
            storage.set(msg.guild.id, playlist);
            return playlist;
        });
    }

    start() {
        this.stop();
        const stream = this.playlist.current.stream();
        this.dispatcher = this.vc.playStream(stream);
        this.dispatcher.setVolume(this._vol);
        this.dispatcher.on('end', this._end.bind(this));
    }

    _end(reason)  {
        if(!this.playlist.hasNext() || reason === 'manual') return;
        this.playlist.next();
        this.start();
    }

    stop()  {
        if(this.dispatcher) this.dispatcher.end('manual');
    }

    add(args)   {
        return this.playlist.add(args).then(() => this);
    }

    set volume(vol) {
        this._vol = vol / 100;
        if(this.dispatcher) this.dispatcher.setVolume(this._vol);
    }

    get volume()    {
        return (this.dispatcher ? this.dispatcher.volume : this._vol) * 100;
    }

    destroy()   {
        this.stop();
        storage.delete(this.vc.channel.guild.id);
    }
}

module.exports = PlaylistOperator;