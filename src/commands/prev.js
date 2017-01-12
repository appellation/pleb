/**
 * Created by Will on 11/11/2016.
 */

const Playlist = require('../util/playlist');
const storage = require('../util/storage/playlists');

exports.func = (msg, args) => {
    Playlist.init(msg, args).then(operator => {
        for(let i = 0; i < parseInt(args[0]); i++) operator.list.prev();
        operator.playQueue();
    });
};

exports.validator = (msg, args) => {
    const parsed = parseInt(args[0] || 1);
    const voiceChannel = msg.guild.member(msg.client.user).voiceChannel;
    return msg.guild && storage.has(msg.guild.id) && !isNaN(parsed) && parsed > 0 && voiceChannel && voiceChannel.members.has(msg.author.id);
};