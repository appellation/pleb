/**
 * Created by Will on 9/11/2016.
 */

const Playlist = require('../util/audio/PlaylistOperator');
const storage = require('../util/storage/playlists');

exports.func = (msg, args) => {
    if(args[0] === 'shuffle') {
        return Playlist.init(msg, args).then(operator => {
            operator.shuffle();
            return operator.playQueue();
        });
    }   else if(args[0] === 'next') {
        return storage.get(msg.guild.id).add(args).then(list => {
            list.list.splice(list.pos + 1, 0, list.list.pop());
            return `added \`${list.getNext().name}\``;
        });
    }
    storage.get(msg.guild.id).add(args);
    return 'added';
};

exports.validator = (msg, args) => {
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return msg.guild && storage.has(msg.guild.id) && args.length > 0 && voiceChannel && voiceChannel.members.has(msg.author.id);
};