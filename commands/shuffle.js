/**
 * Created by Will on 9/7/2016.
 */

const Play = require('./play');
const storage = require('../storage/playlists');

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|string}
 */
function Shuffle(msg, args) {

    if(args.length > 0) {
        return Play.func(msg, args, {
            shuffle: true
        });
    }   else    {
        const playlist = storage.get(msg.guild.id);

        if(playlist && playlist.list.list.length > 0)    {
            return Play.func(msg, args, {
                playlistIn: playlist,
                shuffle: true
            });
        }   else    {
            return 'takes two (or more 🤔) to tango.';
        }
    }
}

module.exports = {
    func: Shuffle,
    triggers: 'shuffle'
};
