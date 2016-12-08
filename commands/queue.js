/**
 * Created by Will on 12/1/2016.
 */

const storage = require('../storage/playlists');

/**
 * @param client
 * @param msg
 * @param args
 * @return string|undefined
 */
function Queue(client, msg, args)   {
    const playlist = storage.get(msg.guild.id);
    if(!playlist) return;

    const perPage = 5;
    const parsed = parseInt(args[0]);
    if(args[0]) if(isNaN(parsed) && parsed <= 0) return;
    const pos = !args[0] ? playlist.list.pos + 1 : (parsed - 1) * perPage;

    const list = playlist.list.list;
    const part = list.slice(pos, pos + perPage);
    let out = args[0] ? `Page **${Math.floor(pos/perPage + 1)}** of **${Math.ceil((list.length-1)/perPage)}**\n` : "";
    let current = pos + 1;
    out += part.map(song => {
        const str = `**${current}** of ${list.length} - \`${song.name}\``;
        current++;
        return str;
    }).join('\n');

    return out;
}

module.exports = Queue;