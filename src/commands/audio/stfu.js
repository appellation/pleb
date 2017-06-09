module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
        this.triggers = [
            'stfu',
            'stop',
            'leave'
        ];
    }

    exec(cmd) {
        if (this.bot.playlists.has(cmd.message.guild.id)) this.bot.playlists.get(cmd.message.guild.id).destroy();
        if (cmd.message.guild.voiceConnection) cmd.message.guild.voiceConnection.disconnect();
        return cmd.response.send('k 😢');
    }

    validate(val) {
        return val.ensureGuild();
    }
};
