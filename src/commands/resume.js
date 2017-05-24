const Playlist = require('../audio/Playlist');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        return Playlist.get(this.bot, cmd.message.guild).resume();
    }

    validate(val) {
        return val.ensurePlaylist(this.bot);
    }
};
