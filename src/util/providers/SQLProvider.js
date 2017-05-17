const Sequelize = require('sequelize');
const Base = require('./BaseProvider');

class SQLProvider extends Base {
    constructor() {
        super();
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

    async initialize() {
        const sync = [];
        for(const m in this.models)
            if(this.models.hasOwnProperty(m))
                sync.push(this.models[m].sync());
        await Promise.all(sync);
    }

    async getGuild(guildID) {
        const instance = await this.models.Guild.findOne({
            where: { id: guildID }
        });

        return instance ? instance.toJSON() : {};
    }

    async updateGuild(guildID, data = {}) {
        await this.models.Guild.upsert(Object.assign(data, { id: guildID }));
        return this.getGuild(guildID);
    }

    async initializeGuilds(client) {
        const guilds = await this.models.Guild.findAll();
        const guildMap = new Map(guilds.map(g => [g.get('id'), g]));

        for(const g of client.guilds.values()) {
            const data = guildMap.has(g.id) ? guildMap.get(g.id).toJSON() : {};
            this.constructor.initializeGuild(g, data);
        }
    }
}

module.exports = SQLProvider;
