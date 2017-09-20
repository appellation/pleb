const Sequelize = require('sequelize');

class DB extends Sequelize {
  static get snowflakeType() {
    return {
      type: Sequelize.STRING(19),
      validate: {
        isInt: true,
        len: [16, 19],
      },
      primaryKey: true,
    };
  }

  constructor(client) {
    super({
      dialect: 'postgres',
      database: 'postgres',
      username: 'postgres',
      password: 'postgres',
      host: process.env.db_host || 'postgres',
      logging: (m) => client.log.debug(m),
    });
    this.client = client;

    this.addHook('afterSave', (instance) => {
      this.query(`NOTIFY ${instance.constructor.name}, "${instance.id}"`);
    });

    this.addHook('afterBulkCreate', (instances) => {
      this.query(`NOTIFY ${instances[0].constructor.name}, "${instances.map(i => i.id).join(',')}"`);
    });

    this.define('setting', {
      key: Sequelize.STRING,
      value: Sequelize.STRING,
    }, { timestamps: true });

    this.define('guild', {
      id: DB.snowflakeType,
      region: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      joinedAt: Sequelize.DATE,
      memberCount: Sequelize.INTEGER,
      icon: Sequelize.STRING,
    }, {
      timestamps: true,
      paranoid: true,
    });

    this.define('user', {
      id: DB.snowflakeType,
      username: Sequelize.STRING,
      discriminator: {
        type: Sequelize.STRING,
        validate: {
          len: [4, 4],
          isInt: true,
        },
      },
      avatar: Sequelize.STRING,
      createdAt: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
    });

    this.define('channel', {
      id: DB.snowflakeType,
      name: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      type: Sequelize.ENUM('voice', 'text'),
    }, { timestamps: true });

    this.define('guildMember', {
      nickname: Sequelize.STRING,
      joinedAt: Sequelize.DATE,
    });

    this.define('message', {}, { timestamps: true });
    this.define('usage', {
      command: Sequelize.STRING,
    }, {
      timestamps: true,
      name: {
        singular: 'usage',
        plural: 'usage',
      }
    });

    this.models.usage.belongsTo(this.models.message);

    this.models.guild.hasMany(this.models.setting);
    this.models.guild.hasMany(this.models.channel);

    this.models.user.hasMany(this.models.guild, { foreignKey: 'ownerId' });

    this.models.channel.hasMany(this.models.message);
    this.models.user.hasMany(this.models.message, { foreignKey: 'authorId' });

    this.models.user.belongsToMany(this.models.guild, { through: this.models.guildMember });
    this.models.guild.belongsToMany(this.models.user, { through: this.models.guildMember });
  }

  async initialize() {
    await this.authenticate();
    await this.sync();
  }

  async sync() {
    await super.sync({ force: true });

    await this.models.guild.bulkCreate(this.client.guilds.map(g => ({
      id: g.id,
      region: g.region,
      createdAt: g.createdAt,
      joinedAt: g.joinedAt,
      memberCount: g.memberCount,
      icon: g.icon,
    })));
  }
}

module.exports = DB;
