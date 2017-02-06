/**
 * Created by Will on 8/25/2016.
 */

const Playlist = require('../util/audio/PlaylistOperator');

exports.func = (res, msg, args) => {
    return Playlist.init(msg).then(operator => {
        return operator.add(args);
    }).then(operator => {
        return operator.start();
    });
};

exports.validator = val => val.ensureCanPlay();
