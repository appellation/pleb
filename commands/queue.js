/**
 * Created by Will on 12/1/2016.
 */

const storage = require('../storage/playlists');

/**
 * @param msg
 * @param args
 * @return string|undefined
 */
function Queue(msg, args)   {
    const playlist = storage.get(msg.guild.id);

    const perPage = 5;
    const parsed = parseInt(args[0]);
    if(args[0]) if(isNaN(parsed) && parsed <= 0) return;
    const pos = !args[0] ? playlist.list.pos : (parsed - 1) * perPage;

    const list = playlist.list.list;
    const part = list.slice(pos, pos + perPage);
    return part.reduce((prev, song, index) => {
        return `${prev}**${index + pos + 1}** of ${list.length} - \`${song.name}\`\n`;
    },
        args[0] ? `Page **${Math.floor(pos/perPage + 1)}** of **${Math.ceil(list.length/perPage)}**\n` : "⭐ "
    );
}

module.exports = {
    func: Queue,
    triggers: 'queue',
    validator: (msg, args) => {
        const parsed = parseInt(args[0]);
        return msg.guild && storage.has(msg.guild.id) && (args[0] ? (!isNaN(parsed) && parsed > 0) : true);
    }
};