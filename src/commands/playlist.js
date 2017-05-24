const Playlist = require('../util/audio/Playlist');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    async exec(cmd) {
        const list = Playlist.get(this.bot, cmd.message.guild);
        list.stop();
        list.reset();
        await list.add(cmd.response, cmd.args.list, 'playlist');
        return list.start(cmd.response);
    }

    * arguments(Argument) {
        yield new Argument('list')
            .setPrompt('What playlist would you like to search for?')
            .setPattern(/.*/);
    }

    validator(val) {
        return val.ensureCanPlay();
    }
};
