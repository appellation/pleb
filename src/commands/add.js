/**
 * Created by Will on 9/11/2016.
 */

const Playlist = require('../util/playlist');
const storage = require('../util/storage/playlists');

exports.func = (msg, args) => {
    if(args[0] === 'shuffle') {
        Playlist.init(msg, args).then(operator => {
            operator.shuffle();
            operator.playQueue();
        });
    }   else {
        storage.get(msg.guild.id).add(args);
        return 'added';
    }
};

exports.validator = (msg, args) => {
    const voiceChannel = msg.guild.member(msg.client.user);
    return msg.guild && storage.has(msg.guild.id) && args.length > 0 && voiceChannel && voiceChannel.members.has(msg.author.id);
};