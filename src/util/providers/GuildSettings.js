/**
 * Created by Will on 1/18/2017.
 */

class GuildSettings {

    /**
     * @param {RethinkProvider} thonk
     * @param {Guild} guild
     */
    constructor(thonk, guild)   {
        this._provider = thonk;
        this._table = this._provider.r.table('guilds');
        this.guild = guild;
        this._key = this.table.get(this.guild.id);
    }

    init()  {
        return this._ensureGuild();
    }

    _ensureGuild()  {
        return this._table.hasFields(this.guild.id).branch(null, this.table.insert({
            id: this.guild.id
        })).run();
    }

    get(key)    {
        return this._key.hasFields(key).branch(this._key(key), null).run();
    }

    set(key, value) {
        return this._table.insert({
            id: this.guild.id,
            [key]: value,
        }, { conflict: 'update' }).run();
    }
}

module.exports = GuildSettings;