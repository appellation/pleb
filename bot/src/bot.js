require('./util/extensions');
require('./util/extensions/Playlist');
require('./util/extensions/Validator');
require('moment-duration-format');

const axios = require('axios');
const discord = require('discord.js');
const Constants = require('discord.js/src/util/Constants');
const Raven = require('raven');

const Logger = require('./core/Logger');
const Handler = require('./core/commands/Handler');
const DB = require('./core/DB');

module.exports = new class extends discord.Client {
  constructor() {
    super({
      messageCacheLifetime: 1800,
      messageSweepInterval: 900,
      disabledEvents: [Constants.Events.TYPING_START]
    });

    this.log = new Logger(this);
    this.db = new DB(this);
    this.handler = new Handler(this);

    this.log.verbose('instantiated client');

    if (process.env.raven) {
      Raven.config(process.env.raven, {
        captureUnhandledRejections: true
      }).install();
      this.log.verbose('loaded raven');
    } else {
      process.on('unhandledRejection', this.log.error);
    }

    this.once('ready', this.onInit.bind(this));
    this.on('reconnecting', this.onReconnecting.bind(this));
    this.on('resume', this.onResume.bind(this));
    this.on('disconnect', this.onDisconnect.bind(this));
    this.on('error', e => Raven.captureException(e));

    this.on('guildCreate', this.onGuildCreate.bind(this));
    this.on('guildDelete', this.onGuildDelete.bind(this));

    this.on('channelCreate', this.onChannelCreate.bind(this));
    this.on('channelDelete', this.onChannelDelete.bind(this));

    this.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
    this.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));

    this.on('message', this.onMessage.bind(this));
    this.on('messageUpdate', this.onMessageUpdate.bind(this));

    this.log.verbose('initialized event listeners');
    this.login(process.env.discord);
  }

  async onInit() {
    this.log.info('client is ready: %s#%s', this.user.username, this.user.discriminator);
    await this.db.initialize();

    this.log.hook({
      title: 'Initialized',
      color: 0x00ff93
    });

    this.log.verbose('initialized database');
    await this.updateStats();
    this.log.verbose('synchronized stats');
  }

  onReconnecting() {
    this.log.hook({
      title: 'Reconnecting',
      color: 0xf4f141
    });
  }

  onResume(replayed) {
    for (const guild of this.guilds.values()) guild.playlist.stop('continue');

    this.log.hook({
      title: 'Resumed',
      description: `Replayed **${replayed}** events.`,
      color: 0x9bffd5
    });
  }

  onDisconnect(close) {
    for (const guild of this.guilds.values()) guild.playlist.stop();

    this.log.hook({
      title: 'Disconnected',
      description: `Code: ${close.code}`,
      color: 0xff5e5e
    });
  }

  async onGuildCreate(guild) {
    await this.db.models.guild.create({
      id: guild.id,
      region: guild.region,
      createdAt: guild.createdAt,
      memberCount: guild.memberCount,
      icon: guild.icon,
      guildMembers: guild.members.map(m => ({
        id: m.id,
        nickname: m.nickname,
        joinedAt: m.joinedAt,
      })),
      channels: guild.channels.map(c => ({
        id: c.id,
        name: c.name,
        createdAt: c.createdAt,
        type: c.type,
      }))
    }, { include: [
      this.db.models.guildMember,
      this.db.models.channel,
    ] });

    const channel = guild.channels.find(c => {
      const perms = c.permissionsFor(guild.me);
      return c.type === 'text' && perms && perms.has(discord.Permissions.FLAGS.SEND_MESSAGES);
    });

    if (channel) await channel.send('Sup.  Try `@Pleb help`.');
  }

  async onGuildDelete(guild) {
    const playlist = guild.playlist;
    if (playlist) playlist.destroy();

    await this.db.models.guild.destroy({
      where: { id: guild.id },
    });

    await this.db.models.guildMember.destroy({
      where: { guildId: guild.id },
    });

    await this.db.models.channel.destroy({
      where: { guildId: guild.id },
    });
  }

  async onChannelCreate(channel) {
    await this.db.models.channel.create({
      id: channel.id,
      name: channel.name,
      createdAt: channel.createdAt,
      type: channel.type,
    });
  }

  async onChannelDelete(channel) {
    await this.db.models.channel.destroy({ where: { id: channel.id } });
  }

  async onGuildMemberAdd(member) {
    await this.db.models.guildMember.create({
      guildId: member.guild.id,
      userId: member.id,
      nickname: member.nickname,
      joinedAt: member.joinedAt,
    });

    await this.db.models.guild.increment('memberCount', { where: { id: member.guild.id } });
  }

  async onGuildMemberRemove(member) {
    await this.db.models.guildMember.destroy({
      where: {
        guildId: member.guild.id,
        userId: member.id,
      },
    });

    await this.db.models.guild.increment('memberCount', {
      by: -1,
      where: { id: member.guild.id }
    });
  }

  async onMessage(message) {
    await this.db.models.message.create({
      id: message.id,
      content: message.content,
      channelId: message.channel.id,
    });

    await this.handler.handle(message);
  }

  async onMessageUpdate(o, n) {
    await this.db.models.messageEdit.create({
      content: n.content,
    });
  }

  async updateStats() {
    if (process.env.discord_pw) {
      await axios.post(`https://bots.discord.pw/api/bots/${this.user.id}/stats`, {
        shard_id: this.shard.id,
        shard_count: this.shard.count,
        server_count: this.guilds.size
      }, {
        headers: { Authorization: process.env.discord_pw }
      });
    }
  }
};
