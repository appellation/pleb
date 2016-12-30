/**
 * Created by Will on 12/2/2016.
 */

const Play = require('./play');
const playlist = require('./playlist');
const VC = require('./voiceConnection');

exports.func = (msg, args, handler) => {
    let list;
    return VC.checkUser(msg).then(conn => {
        list = new playlist(conn);
        return list.yt.addPlaylistQuery(args.join(' '));
    }).then(() => {
        return Play.func(msg, args, handler, {
            playlistIn: list,
        });
    });
};

exports.validator = (msg, args) => {
    return args.length > 0 && msg.channel.type === 'text';
};