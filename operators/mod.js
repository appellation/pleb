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
     * @return {Promise.<Message>}
     */
    ban()   {
        return this.guild.member(this.actee).ban().then(() => {
            return this._log();
        });
    }

    /**
     * Kick a member.
     * @return {Promise.<Message>}
     */
    kick()  {
        return this.guild.member(this.actee).kick().then(() => {
            return this._log('kick');
        });
    }

    /**
     * Mute member in channel.
     * @return {Promise.<Message>}
     */
    muteChannel()  {
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

    muteGuild() {
        //
    }

    /**
     * Unban a user.
     * @return {Promise.<Message>}
     */
    unban() {
        return this.guild.unban(this.actee).then(user => {
            this.user = user;
            return this._log('unban ' + user);
        });
    }

    /**
     * Create an invite.
     * @return {Promise.<Message>}
     */
    invite()    {
        this.channel.createInvite({
            maxUses: 1
        }).then(invite => {

            const invited = this.client.fetchUser(this.actee);

            return invited.then(user => {
                if(user instanceof djs.User)    {
                    user.sendMessage(invite.toString());
                }   else    {
                    this.actor.sendMessage(`invite for ${this.actee}: ${invite}`);
                }
            });
        }).then(() => {
            return this._log('invite generated for ' + this.actee);
        });
    }

    /**
     * Send a message to the mod log.
     * @param {string} action
     * @return {Promise.<Message>}
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

        let text;
        text += `${icon} **${action}**\n`;
        text += `**User:** ${this.actee}\n`;
        text += `**Mod:** ${this.actor}\n`;
        text += `**Reason:** ${this.reason}`;

        return this._sendChannel.then(channel => {
            return channel.sendMessage(text);
        });
    }

    /**
     * Get mod log channel.
     * @return {Promise<TextChannel>}
     */
    get _sendChannel()   {
        return new Promise((resolve, reject) => {
            let channel = this.guild.channels.find('name', 'mod-log');
            if(!channel)    {
                return this.guild.createChannel('mod-log', 'text').then(resolve).catch(reject);
            }
            return resolve(channel);
        });
    }

    /**
     * Get role for server-wide mute.
     * @return {Promise.<Role>}
     * @private
     */
    get _muteRole() {
        return new Promise((resolve, reject) => {
            let role = this.guild.roles.find('name', 'muted');
            if(!role)   {
                // TODO: put in options
                return this.guild.createRole();
            }
        });
    }

    /**
     * Whether the actor is authorized.
     * @param {PermissionResolvable} perm
     * @return {boolean}
     * @private
     */
    _isActorAuthorized(perm)  {
        const member = this.guild.member(this.actee);
        if(!member) return true;

        if(!this.actor.permissions.hasPermission(perm)) return false;

        return this.actor.highestRole.position > member.highestRole.position;
    }

    /**
     * Whether the client can take a given action.
     * @param {string} action
     * @return {boolean}
     * @private
     */
    _clientCanTakeAction(action)   {
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
                //
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