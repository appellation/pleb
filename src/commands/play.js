/**
 * Created by Will on 8/25/2016.
 */

const Playlist = require('../util/audio/PlaylistOperator');

exports.func = (res, msg, args) => {
    return Playlist.init(msg, res).then(operator => {
        return operator.add(args);
    }).then(operator => {
        return operator.start(res);
    });
};

exports.validator = val => val.ensureCanPlay();
