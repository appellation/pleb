/**
 * Created by Will on 12/2/2016.
 */

const Playlist = require('../util/audio/PlaylistOperator');

exports.func = (res, msg, args) => {
    return Playlist.init(msg).then(operator => {
        return operator.playlist.yt.loadPlaylistQuery(args.join(' ')).then(() => operator.start());
    });
};

exports.validator = val => val.ensureCanPlay();