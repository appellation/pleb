/**
 * Created by Will on 9/7/2016.
 */

const Playlist = require('../util/audio/PlaylistOperator');
const storage = require('../util/storage/playlists');

exports.func = (msg, args) => {
    if(args.length > 0) {
        return Playlist.init(msg).then(operator => {
            return operator.add(args);
        }).then(operator => {
            operator.playlist.shuffle();
            return operator.start();
        });
    }   else    {
        const operator = storage.get(msg.guild.id);
        operator.playlist.shuffle();
        operator.start();
    }
};

exports.validator = msg => storage.has(msg.guild.id);