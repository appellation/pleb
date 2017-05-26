module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        const list = this.bot.playlists.get(cmd.message.guild);
        for (let i = 0; i < (cmd.args.count || 1) && list.hasPrev(); i++) list.prev();
        return list.start(cmd.response);
    }

    * arguments(Argument) {
        yield new Argument('count')
            .setOptional()
            .setRePrompt('Please provide a number of songs to skip.')
            .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
    }

    validate(val) {
        return val.ensurePlaylist(this.bot);
    }
};
