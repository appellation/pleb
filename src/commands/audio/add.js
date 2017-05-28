const Playlist = require('../../audio/Playlist');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    async exec(cmd) {
        const list = Playlist.get(this.bot, cmd.message.guild);
        const added = await list.add(cmd.response, cmd.args.song);
        if (!list.playing) list.start(cmd.response);
        return added;
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
