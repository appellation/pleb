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
        this.table = thonk.r.table(guild.id);
        this.guild = guild;
    }

    init()  {
        return this.provider.ensureTable(this.guild.id);
    }
}

module.exports = GuildSettings;