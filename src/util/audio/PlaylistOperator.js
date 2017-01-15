/**
 * Created by Will on 1/14/2017.
 */

const Playlist = require('./structures/Playlist');
const VC = require('./voiceConnection');
const storage = require('../storage/playlists');

class PlaylistOperator  {
    constructor(conn)   {
        this.vc = conn;
        this.playlist = new Playlist();
        this.dispatcher = null;
    }

    static init(msg)  {
        return new Promise((resolve, reject) => {
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
        console.log('hi');
        this.dispatcher = this.vc.playStream(stream);
        this.dispatcher.on('end', this._end.bind(this));
        this.dispatcher.on('start', () => console.log('start'));
        this.dispatcher.on('error', console.error);
        this.dispatcher.on('debug', console.log);
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

    destroy()   {
        this.stop();
        storage.delete(this.vc.channel.guild.id);
    }
}

module.exports = PlaylistOperator;