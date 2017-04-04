/**
 * Created by Will on 1/18/2017.
 */

class GuildSettings {

    /**
     * @param {BaseProvider} provider
     * @param {Guild} guild
     */
    constructor(provider, guild) {
        this.provider = provider;
        this.guild = guild;

        // data that is cached
        this.cache = {};

        // data to be cached locally
        this.toCache = ['prefix'];
    }

    /**
     * Gets all guild settings.
     * @return {*}
     */
    async getAll() {
        const data = await this.provider.getGuild(this.guild.id);
        this.updateCache(data);
        return data;
    }

    async loadCache() {
        await this.getAll();
    }

    getCached(key) {
        return this.cache[key];
    }

    async get(key, force = false) {
        if(key in this.cache && !force) {
            return this.cache[key];
        } else {
            return (await this.getAll())[key];
        }
    }

    async set(key, value) {
        const inserted = await this.provider.updateGuild(this.guild.id, { [key]: value });
        this.updateCache(inserted);
        return inserted;
    }

    updateCache(data = {}) {
        if(data === null) data = {};
        this.cache = {};
        for(const key of this.toCache) this.cache[key] = data[key];
    }
}

module.exports = GuildSettings;
