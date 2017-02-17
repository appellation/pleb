/**
 * Created by Will on 9/7/2016.
 */

const Playlist = require('../util/audio/PlaylistOperator');
const storage = require('../util/storage/playlists');

exports.func = (res, msg, args) => {
    if(args.length > 0) {
        return Playlist.init(msg, res).then(operator => {
            return operator.add(args);
        }).then(operator => {
            operator.playlist.shuffle();
            return operator.start(res);
        });
    } else {
        const operator = storage.get(msg.guild.id);
        operator.playlist.shuffle();
        operator.start(res);
    }
};

exports.validator = val => val.ensurePlaylist() || (val.ensureArgs() && val.ensureCanPlay());