const Sequelize = require('sequelize');
const Settings = require('./GuildSettings');

class SQLProvider {
    constructor() {
        const sq = new Sequelize({
            host: 'postgres',
            username: 'postgres',
            dialect: 'postgres'
        });

        this.models = {
            Guild: sq.define('guild', {
                id: {
                    type: Sequelize.STRING,
                    primaryKey: true
                },
                prefix: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null
                }
            })
        };
    }

    initialize() {
        return Object.values(this.models).map(model => model.sync());
    }

    async initializeGuilds(bot) {
        const stored = new Map();
        for (const instance of await this.models.Guild.findAll()) {
            if (bot.client.guilds.has(instance.get('id'))) stored.set(instance.get('id'), instance.toJSON());
        }

        const settings = await Promise.all(bot.client.guilds.map(g => this.initializeGuild(g, stored.get(g.id) || {})));
        for (const s of settings) bot.guildSettings.set(s.guild.id, s);
        return settings;
    }

    async initializeGuild(guild, cached) {
        const settings = new Settings(this, guild);
        await settings.loadCache(cached);
        return settings;
    }
}

module.exports = SQLProvider;
