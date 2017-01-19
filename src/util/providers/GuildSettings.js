/**
 * Created by Will on 1/18/2017.
 */

class GuildSettings {

    /**
     * @param {RethinkProvider} thonk
     * @param {Guild} guild
     */
    constructor(thonk, guild)   {
        this.provider = thonk;
        this.table = thonk.r.table('guilds');
        this.guild = guild;
        this.key = this.table.get(this.guild.id);
    }

    init()  {
        return this.table.hasFields(this.guild.id).branch(null, this.table.insert({
            id: this.guild.id
        }));
    }

    get(key)    {
        return this.key.hasFields(key).branch(this.key(key), null).run();
    }

    set(key, value) {
        return this.table.insert({
            id: this.guild.id,
            [key]: value,
        }, { conflict: 'update' }).run();
    }
}

module.exports = GuildSettings;