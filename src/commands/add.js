/**
 * Created by Will on 9/11/2016.
 */

const Play = require('./play');
const storage = require('../util/storage/playlists');

exports.func = (msg, args, handler) => {
    if(args[0] === 'shuffle') {
        return Play.func(msg, args.slice(1), handler, {
            playlistIn: storage.get(msg.guild.id),
            shuffle: true
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