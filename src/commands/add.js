const Playlist = require('../audio/Playlist');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        const list = Playlist.get(this.bot, cmd.message.guild);
        return list.add(cmd.response, cmd.args.song);
    }

    * arguments(Argument) {
        yield new Argument('song')
            .setPrompt('What would you like to add?')
            .setPattern(/.*/);
    }

    validate(val) {
        return val.ensureCanPlay();
    }
};
