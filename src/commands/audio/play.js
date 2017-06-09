const Playlist = require('../../core/audio/Playlist');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    async exec(cmd) {
        const list = Playlist.get(this.bot, cmd.message.guild);
        list.stop();
        list.reset();
        await list.add(cmd.response, cmd.args.song);
        return list.start(cmd.response);
    }

    * arguments(Argument) {
        yield new Argument('song')
            .setPrompt('What song would you like to add?')
            .setPattern(/.*/);
    }

    validate(val) {
        return val.ensureCanPlay();
    }
};
