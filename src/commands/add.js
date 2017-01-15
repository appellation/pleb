/**
 * Created by Will on 9/11/2016.
 */

const Playlist = require('../util/audio/PlaylistOperator');
const storage = require('../util/storage/playlists');

exports.func = (msg, args) => {
    if(args[0] === 'next') {
        return storage.get(msg.guild.id).add(args).then(operator => {
            const pl = operator.playlist;
            pl.list.splice(pl.pos, 0, pl.list.pop());
            return `added \`${pl.getNext().name}\``;
        });
    }
    storage.get(msg.guild.id).add(args);
    return 'added';
};

exports.validator = (msg, args) => {
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return msg.guild && storage.has(msg.guild.id) && args.length > 0 && voiceChannel && voiceChannel.members.has(msg.author.id);
};