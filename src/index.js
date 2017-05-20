require('./util/extensions');
require('moment-duration-format');
require('dotenv').config({ silent: true });

const path = require('path');
const Discord = require('discord.js');
const Raven = require('raven');
const handles = require('discord-handles');

const Log = require('./util/log');
const Provider = require('./util/providers/SQLProvider');
const Validator = require('./util/command/Validator');

const settings = require('./util/storage/settings');
const playlists = require('./util/storage/playlists');

const idPattern = `^<@!?${process.env.discord_client_id}>\\s*`;

new class extends Discord.Client {
    constructor() {
        super({
            messageCacheLifetime: 1800,
            messageSweepInterval: 900,
            disabledEvents: [
                'TYPING_START',
                'TYPING_STOP',
            ]
        });

        this.log = new Log(this);
        this.log.verbose('instantiated client');

        this.provider = new Provider();

        this.handler = new handles.Client({
            directory: path.join('.', 'src', 'commands'),
            validator: message => {
                const guild = message.guild;
                let regex;
                if(!guild) regex = new RegExp('');
                else regex = new RegExp(`^(${(settings.has(guild.id) && settings.get(guild.id).getCached('prefix') ? `${RegExp.escape(settings.get(guild.id).getCached('prefix'))}|` : '') + idPattern})\\s*`);

                if((message.channel.name === 'pleb' || message.channel.type === 'dm' || regex.test(message.content)) && ((message.member && !message.member.roles.find('name', 'no-pleb')) || message.channel.type === 'dm')) {
                    return message.content.replace(regex, '');
                }
            },
            Validator
        });

        this.handler.on('commandStarted', command => {
            command.message.client.log.debug('command started: %s', command.resolvedContent);
        });

        this.handler.on('invalidCommand', validator => {
            validator.command.response.error(validator.reason);
        });

        this.handler.on('commandFailed', ({ command, error }) => {
            command.message.client.log.error('command failed: %s | %s', command, error);
            command.response.error(`\`${error}\`\nYou should never receive an error like this.  Bot owner has been notified.`);
        });

        this.handler.on('error', (err) => {
            if(process.env.raven) Raven.captureException(err);
            else console.error(err); // eslint-disable-line no-console
        });

        if(process.env.raven) {
            Raven.config(process.env.raven, {
                captureUnhandledRejections: true
            }).install();

            Raven.wrap(this._load.bind(this))();
            this.log.verbose('loaded functions with raven');
        } else {
            this._load();
            this.log.verbose('loaded functions');
        }
    }

    _load() {
        this.once('ready', this.onInit.bind(this));
        this.on('reconnecting', this.onReconnecting.bind(this));
        this.on('resume', this.onResume.bind(this));
        this.on('disconnect', this.onDisconnect.bind(this));
        this.on('guildCreate', this.onGuildCreate.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('guildDeleteHandler', this.onGuildDelete.bind(this));
        this.on('error', e => Raven.captureException(e));

        this.log.verbose('instantiated event listeners');

        this.login(process.env.discord);
    }

    async onInit() {
        this.log.info('client is ready: %s#%s', this.user.username, this.user.discriminator);
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
        for(const [, p] of playlists) p.stop('continue');

        this.log.hook({
            title: 'Resumed',
            description: `Replayed **${replayed}** events.`,
            color: 0x9bffd5
        });
    }

    onDisconnect(close) {
        this.log.hook({
            title: 'Disconnected',
            description: `Code: ${close.code}`,
            color: 0xff5e5e
        });
    }

    onGuildCreate(guild) {
        guild.defaultChannel.send('Sup.  Try `@Pleb help`.').catch(() => null);
        Provider.initializeGuild(guild);
    }

    onMessage(message) {
        this.log.silly('message received: %s#%s | %s', message.author.username, message.author.discriminator, message.cleanContent);
        this.handler.handle(message);
    }

    onGuildDelete(guild) {
        if(playlists.has(guild.id)) playlists.get(guild.id).destroy();
    }
};
