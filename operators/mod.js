/**
 * Created by nelso on 11/22/2016.
 */

const djs = require('discord.js');

class ModOperator   {

    /**
     * @constructor
     * @param {Client} client
     * @param {GuildMember} actor
     * @param {UserResolvable} actee
     * @param {string} reason
     * @param {Guild} guild
     * @param {GuildChannel} channel
     */
    constructor(client, actor, actee, reason, guild, channel)    {
        this.client = client;
        this.actor = actor;
        this.actee = actee;
        this.reason = reason;
        this.guild = guild;
        this.channel = channel;
    }

    /**
     * Ban a member.
     * @return {Promise.<Message>|string}
     */
    ban()   {
        const v = this._verify('ban');
        if(v) return v;

        return this.guild.fetchMember(this.actee).ban().then(() => {
            return this._log('ban');
        });
    }

    /**
     * Kick a member.
     * @return {Promise.<Message>|string}
     */
    kick()  {
        const v = this._verify('kick');
        if(v) return v;

        return this.guild.member(this.actee).kick().then(() => {
            return this._log('kick');
        });
    }

    /**
     * Mute member in channel.
     * @return {Promise.<Message>|string}
     */
    mute()  {
        const v = this._verify('mute');
        if(v) return v;

        let perm;
        if(this.channel.type === 'voice')    {
            perm = {
                'SPEAK': false
            }
        }   else {
            perm = {
                'SEND_MESSAGES': false
            }
        }

        return this.channel.overwritePermissions(this.actee, perm).then(() => {
            return this._log('mute in ' + this.channel);
        });
    }

    /**
     * Unban a user.
     * @return {Promise.<Message>|string}
     */
    unban() {
        const v = this._verify('unban');
        if(v) return v;

        return Promise.all([
            this.client.fetchUser(this.actee),
            this.guild.fetchBans()
        ]).then(([user, bans]) => {
            return bans.get(user.id);
        }).then(user => {
            return user ? this.guild.unban(user) : Promise.reject('can\'t unban someone that isn\'t banned');
        }).then(user => {
            this.user = user;
            return this._log('unban');
        });
    }

    /**
     * Create an invite.
     * @return {Promise.<Message>|string}
     */
    invite()    {
        const v = this._verify('invite');
        if(v) return v;

        return this.channel.createInvite({
            maxUses: 1
        }).then(invite => {

            const invited = this.client.fetchUser(this.actee);

            return invited.then(user => {
                if(user instanceof djs.User)    {
                    return user.sendMessage(invite.toString()).catch(() => {
                        return this.actor.sendMessage(`invite for ${this.actee}: ${invite}`);
                    });
                }   else    {
                    return this.actor.sendMessage(`invite for ${this.actee}: ${invite}`);
                }
            });
        }).then(() => {
            return this._log('invite');
        });
    }

    /**
     * Unmute a member.
     * @returns {Promise.<Message>|string}
     */
    unmute()    {
        const v = this._verify('unmute');
        if(v) return v;

        let perm;
        if(this.channel.type === 'voice')    {
            perm = {
                'SPEAK': true
            }
        }   else {
            perm = {
                'SEND_MESSAGES': true
            }
        }

        return this.channel.overwritePermissions(this.actee, perm).then(() => {
            return this._log('unmute in ' + this.channel);
        });
    }

    /**
     * Send a message to the mod log.
     * @param {string} action
     * @return {Promise.<Message>|undefined}
     * @private
     */
    _log(action)  {
        let icon;
        switch(action)  {
            case 'ban':
            case 'kick':
            case 'mute':
                icon = ':x:';
                break;
            default:
                icon = ':white_check_mark:';
                break;
        }

        const fetch = typeof this.actee === 'string' ? this.client.fetchUser(this.actee) : Promise.resolve();

        return Promise.all([
            this._sendChannel,
            fetch
        ]).then(([channel, user]) => {
            if(this.actee instanceof djs.GuildMember)
                user = this.actee.user;

            let userDisp;
            if(user || this.actee instanceof djs.User)    {
                userDisp = `${user.toString()} - \`${user.username}#${user.discriminator}\` (${user.id})`;
            }   else {
                userDisp = this.actee;
            }

            let text;
            text = `${icon} **${action}**\n`;
            text += `**User:** ${userDisp}\n`;
            text += `**Mod:** ${this.actor}\n`;
            text += `**Reason:** ${this.reason}`;

            return channel ? channel.sendMessage(text).catch(err => void err) : Promise.resolve();
        });
    }

    /**
     * Get mod log channel.
     * @return {Promise.<TextChannel>|undefined}
     */
    get _sendChannel()   {
        return new Promise(resolve => {
            let channel = this.guild.channels.find('name', 'mod-log');
            if(!channel)    {
                return resolve(this.guild.createChannel('mod-log', 'text').catch(err => void err));
            }
            return resolve(channel);
        });
    }

    /**
     * Check both client and actor permissions.  Undefined for verified.
     * @param {string} action
     * @return {string|undefined}
     * @private
     */
    _verify(action) {
        let perm;
        switch (action) {
            case 'ban':
            case 'unban':
                perm = 'BAN_MEMBERS';
                break;
            case 'kick':
                perm = 'KICK_MEMBERS';
                break;
            case 'invite':
                perm = 'CREATE_INSTANT_INVITE';
                break;
            case 'mute':
            case 'unmute':
                perm = 'MANAGE_ROLES_OR_PERMISSIONS';
        }

        const act = this.isActorAuthorized(perm);
        const cli = this.clientCanTakeAction(action);

        if(act) return 'action not authorized';
        if(cli) return 'client not authorized';
    }

    /**
     * Whether the actor is authorized.
     * @param {PermissionResolvable} perm
     * @return {boolean}
     */
    isActorAuthorized(perm)  {
        if(this.actor.guild.owner.id === this.actor.id) return true;

        const member = this.guild.member(this.actee);
        if(!member) return true;
        if(!this.actor.hasPermission(perm)) return false;

        return this.actor.highestRole.position > member.highestRole.position;
    }

    /**
     * Whether the client can take a given action.
     * @param {string} action
     * @return {boolean}
     */
    clientCanTakeAction(action)   {
        switch (action)   {
            case 'ban':
                this._requireActeeGuildMember();
                return this.actee.bannable;
            case 'unban':
                return this._clientHasPermission('BAN_MEMBERS');
            case 'kick':
                this._requireActeeGuildMember();
                return this.actee.kickable;
            case 'invite':
                return this._clientHasPermission('CREATE_INSTANT_INVITE');
            case 'mute':
            case 'unmute':
                this._requireActeeGuildMember();
                return this._clientHasPermission('MANAGE_ROLES_OR_PERMISSIONS');
            default:
                return false;
        }
    }

    /**
     * Whether the client has the given permission.
     * @param {PermissionResolvable} perm
     * @return {boolean}
     * @private
     */
    _clientHasPermission(perm)  {
        return this.guild.member(this.client.user).hasPermission(perm);
    }

    /**
     * Require the actee to be a GuildMember
     * @private
     * @throws Error
     */
    _requireActeeGuildMember()  {
        if(!(this.actee instanceof djs.GuildMember)) throw new Error();
    }
}

module.exports = ModOperator;