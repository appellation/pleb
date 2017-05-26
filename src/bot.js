require('./util/extensions');
require('moment-duration-format');
require('dotenv').config({ silent: true });

const discord = require('discord.js');
const Raven = require('raven');

const Log = require('./util/Log');
const Handler = require('./util/command/Handler');
const Provider = require('./providers/SQLProvider');

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

        this.log = new Log(this.client);
        this.playlists = new Map();
        this.guildSettings = new Map();
        this.provider = new Provider();
        this.handler = new Handler(this);

        this.log.verbose('instantiated client');

        if (process.env.raven) {
            Raven.config(process.env.raven, {
                captureUnhandledRejections: true
            }).install();

            Raven.wrap(this._load.bind(this))();
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
        this.client.on('guildCreate', this.onGuildCreate.bind(this));
        this.client.on('message', this.onMessage.bind(this));
        this.client.on('guildDeleteHandler', this.onGuildDelete.bind(this));
        this.client.on('error', e => Raven.captureException(e));

        this.log.verbose('instantiated event listeners');

        this.client.login(process.env.discord);
    }

    async onInit() {
        this.log.info('client is ready: %s#%s', this.client.user.username, this.client.user.discriminator);
        await this.provider.initialize();
        await this.provider.initializeGuilds(this);

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
    }

    onMessage(message) {
        this.log.silly('message received: %s#%s | %s', message.author.username, message.author.discriminator, message.cleanContent);
        this.handler.handle(message);
    }

    onGuildDelete(guild) {
        if (this.playlists.has(guild.id)) this.playlists.get(guild.id).destroy();
    }
};
