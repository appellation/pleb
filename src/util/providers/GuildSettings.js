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
        this.data = {};
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        return this._table.get(this.guild.id).update(Object.assign({ id: this.guild.id }, { [key]: value }), { returnChanges: 'always' }).run().then(this._updateCache.bind(this));
    }

    _updateCache(data) {
        this.data = data.changes[0].new_val;
        return this.data;
    }
}

module.exports = GuildSettings;