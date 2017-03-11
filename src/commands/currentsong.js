/**
 * Created by Will on 1/16/2017.
 */

const storage = require('../util/storage/playlists');
const {RichEmbed} = require('discord.js');
const moment = require('moment');

exports.func = async (res, msg) => {
    const embed = new RichEmbed();
    const operator = storage.get(msg.guild.id);
    const playlist = operator.playlist;
    const cur = playlist.current;
    const info = playlist.info;

    embed.setURL(cur.url)
        .setTitle(cur.name)
        .setThumbnail(cur.thumbnail)
        .setAuthor(cur.author)
        .addField('Duration', `${moment.duration(operator.dispatcher.time, 'ms').format('hh[h] mm[m] ss[s]')} / ${cur.duration}`, true)
        .addField('Song', `${playlist.pos} / ${playlist.length}`, true)
        .setColor(cur.type === 'youtube' ? 0xFF0000 : 0xFF5500);

    if(Object.keys(info).length > 0) {
        embed.addField('Playlist', `[${info.title}](${info.displayURL})`, true);
    }

    return res.send({embed});
};

exports.validator = val => val.ensurePlaylist();

exports.triggers = [
    'current',
    'currentsong'
];