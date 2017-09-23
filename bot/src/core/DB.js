const Sequelize = require('sequelize');

class DB extends Sequelize {
  static get snowflakeType() {
    return {
      type: Sequelize.STRING(19),
      validate: {
        is: /\d{16,19}/,
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
      this.query(`NOTIFY ${instance.constructor.name}, '${instance.id}';`);
    });

    this.addHook('afterBulkCreate', (instances) => {
      this.query(`NOTIFY ${instances[0].constructor.name}Bulk;`);
    });

    this.define('setting', {
      key: Sequelize.STRING,
      value: Sequelize.STRING,
    }, { timestamps: true });

    this.define('guild', {
      id: DB.snowflakeType,
      region: Sequelize.STRING,
      createdAt: Sequelize.DATE,
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
    }, {
      timestamps: true,
      paranoid: true,
    });

    this.define('guildMember', {
      nickname: Sequelize.STRING,
      joinedAt: Sequelize.DATE,
    });

    this.define('message', {
      id: DB.snowflakeType,
      content: Sequelize.STRING(2000)
    }, { timestamps: true });

    this.define('messageEdit', {
      content: Sequelize.STRING(2000),
    }, { timestamps: true });

    this.define('usage', {
      command: Sequelize.STRING,
    }, {
      timestamps: true,
      name: {
        singular: 'usage',
        plural: 'usage',
      }
    });

    // usage -> message
    this.models.usage.belongsTo(this.models.message);
    // messageEdit -> message
    this.models.messageEdit.belongsTo(this.models.message);

    // guild -> settings
    this.models.guild.hasMany(this.models.setting);
    // guild -> channels
    this.models.guild.hasMany(this.models.channel);
    // guild -> owner
    this.models.user.hasMany(this.models.guild, { foreignKey: 'ownerId' });

    // channel -> message
    this.models.channel.hasMany(this.models.message);
    // user -> message
    this.models.user.hasMany(this.models.message, { foreignKey: 'authorId' });

    // guild members
    this.models.user.belongsToMany(this.models.guild, { through: this.models.guildMember });
    this.models.guild.belongsToMany(this.models.user, { through: this.models.guildMember });
  }

  async initialize() {
    await this.authenticate();
    await this.sync();
  }

  async sync() {
    await super.sync({ force: true });

    await this.models.user.destroy({ truncate: true });
    await this.models.user.bulkCreate(this.client.users.map(u => ({
      id: u.id,
      username: u.username,
      discriminator: u.discriminator,
      avatar: u.avatar,
      createdAt: u.createdAt,
    })));

    await this.models.guild.destroy({ truncate: true });
    await this.models.guild.bulkCreate(this.client.guilds.map(g => ({
      id: g.id,
      region: g.region,
      createdAt: g.createdAt,
      memberCount: g.memberCount,
      icon: g.icon,
    })));

    await this.models.channel.destroy({ truncate: true });
    await this.models.channel.bulkCreate(this.client.channels.map(c => ({
      id: c.id,
      guildId: c.guild.id,
      type: c.type,
      name: c.name,
      createdAt: c.createdAt,
    })));

    await this.models.guildMember.destroy({ truncate: true });
    await this.models.guildMember.bulkCreate(this.client.guilds.reduce((a, b) => a.concat(...b.members.map(m => ({
      guildId: m.guild.id,
      userId: m.user.id,
      nickname: m.nickname,
      joinedAt: m.joinedAt,
    }))), []));
  }
}

module.exports = DB;
