const storage = require('../storage/settings');
const Settings = require('./GuildSettings');

class BaseProvider {
    getGuild() {
        throw new Error('getGuild method was not implemented.');
    }

    updateGuild() {
        throw new Error('updateGuild method was not implemented.');
    }

    async initializeGuilds(client) {
        return Promise.all(client.guilds.map(g => this.constructor.initializeGuild(g)));
    }

    static async initializeGuild(guild, data) {
        const provider = new this;
        const setting = new Settings(provider, guild);

        if(data) setting.updateCache(data);
        else await setting.loadCache();

        storage.set(guild.id, setting);
        return setting;
    }
}

module.exports = BaseProvider;
