/**
 * Created by Will on 1/18/2017.
 */

class GuildSettings {

    /**
     * @param {RethinkProvider} thonk
     * @param {Guild} guild
     */
    constructor(thonk, guild) {
        this.provider = thonk;
        this.guild = guild;
        this._table = this.provider.r.table('guilds');

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
        return this._table.get(this.guild.id).run();
    }

    async loadCache() {
        this._updateCache(await this.getAll());
    }

    getCached(key) {
        return this.cache[key];
    }

    async get(key) {
        if(key in this.cache) {
            return this.cache[key];
        } else {
            const data = await this._table.get(this.guild.id)(key).run();
            this.cache[key] = data;
            return data;
        }
    }

    async set(key, value) {
        const inserted = await this._table.get(this.guild.id).update(Object.assign({ id: this.guild.id }, { [key]: value }), { returnChanges: 'always' }).run();
        if(this.toCache.includes(key)) this._updateCache(inserted.changes[0].new_val);
    }

    _updateCache(data) {
        this.cache = {};
        for(const key of this.toCache) this.cache[key] = data[key];
    }
}

module.exports = GuildSettings;