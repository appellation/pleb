require('./util/extensions');
require('moment-duration-format');
require('dotenv').config({ silent: true });

const axios = require('axios');
const discord = require('discord.js');
const Raven = require('raven');
const containerized = require('containerized');

const Logger = require('./core/data/Logger');
const Handler = require('./core/commands/Handler');
const Usage = require('./core/data/Usage');
const Spectacles = require('./core/data/Spectacles');
const Provider = require('./core/data/SQLProvider');

new class {
  constructor() {
    this.client = new discord.Client({
      messageCacheLifetime: 1800,
      messageSweepInterval: 900,
      disabledEvents: [
        'TYPING_START',
        'TYPING_STOP',
      ]
    });

    Object.defineProperty(this.client, 'bot', { value: this });

    this.log = new Logger(this.client);
    this.provider = new Provider(this);
    this.handler = new Handler(this);
    this.usage = new Usage(this);
    if (containerized()) this.spectacles = new Spectacles(this);

    this.playlists = new Map();
    this.guildSettings = new Map();

    this.log.verbose('instantiated client');

    if (process.env.raven) {
      Raven.config(process.env.raven, {
        captureUnhandledRejections: true
      }).install();

      Raven.context(this._load.bind(this));
      this.log.verbose('loaded with raven');
    } else {
      process.on('unhandledRejection', console.error); // eslint-disable-line no-console
      this._load();
    }
  }

  _load() {
    this.client.once('ready', this.onInit.bind(this));
    this.client.on('reconnecting', this.onReconnecting.bind(this));
    this.client.on('resume', this.onResume.bind(this));
    this.client.on('disconnect', this.onDisconnect.bind(this));
    this.client.on('error', e => Raven.captureException(e));

    this.client.on('guildCreate', this.onGuildCreate.bind(this));
    this.client.on('guildDelete', this.onGuildDelete.bind(this));
    this.client.on('message', this.onMessage.bind(this));

    this.log.verbose('instantiated event listeners');

    this.client.login(process.env.discord);
  }

  async onInit() {
    this.log.info('client is ready: %s#%s', this.client.user.username, this.client.user.discriminator);

    if (containerized()) {
      await this.provider.initialize();
      await this.provider.initializeGuilds();
    }

    this.log.hook({
      title: 'Initialized',
      color: 0x00ff93
    });

    this.log.verbose('initialized guilds');
  }

  onReconnecting() {
    this.log.hook({
      title: 'Reconnecting',
      color: 0xf4f141
    });
  }

  onResume(replayed) {
    for (const [, p] of this.playlists) p.stop('continue');

    this.log.hook({
      title: 'Resumed',
      description: `Replayed **${replayed}** events.`,
      color: 0x9bffd5
    });
  }

  onDisconnect(close) {
    for (const [, p] of this.playlists) p.stop('continue');

    this.log.hook({
      title: 'Disconnected',
      description: `Code: ${close.code}`,
      color: 0xff5e5e
    });
  }

  onGuildCreate(guild) {
    guild.defaultChannel.send('Sup.  Try `@Pleb help`.').catch(() => null);
    this.provider.initializeGuild(guild);
    this.updateStats();
  }

  onMessage(message) {
    this.log.silly('message received: %s#%s | %s', message.author.username, message.author.discriminator, message.cleanContent);
    this.handler.handle(message);
  }

  onGuildDelete(guild) {
    if (this.playlists.has(guild.id)) this.playlists.get(guild.id).destroy();
    this.updateStats();
  }

  async updateStats() {
    if (process.env.discord_pw) {
      await axios.post(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`, {
        shard_id: this.client.shard.id,
        shard_count: this.client.shard.count,
        server_count: this.client.guilds.size
      }, {
        headers: { Authorization: process.env.discord_pw }
      });
    }
  }
};
