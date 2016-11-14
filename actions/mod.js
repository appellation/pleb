/**
 * Created by nelso on 11/13/2016.
 */

const djs = require('discord.js');

class Mod   {

    /**
     * @param {GuildMember} member
     * @param {string} action - the action to be taken
     * @param {GuildMember|User} on - the user to be acted on, given by either a guild member or a user.
     */
    constructor(member, action, on)   {
        if((on instanceof djs.User && action !== 'unban') || !(on instanceof djs.GuildMember))   {
            throw new Error('invalid arguments');
        }

        this.member = member;
        this.action = action;
        this.on = on;
    }

    act()    {
        try {
            this[this.action]()
        }   catch (e)   {
            //
        }
    }

    kick()  {
        return this.on.kick();
    }

    ban() {
        return this.on.ban();
    }

    unban() {
        return this.member.guild.unban(this.on);
    }

    mute()  {
        return this.on.setMute(true);
    }

    unmute()    {
        return this.on.setMute(false);
    }

    deafen()    {
        return this.on.setDeaf(true);
    }

    undeafen()  {
        return this.on.setDeaf(false);
    }

    checkChannel()  {
        const channel = this.member.guild.channels.find('name', 'mod-log');
        if(channel && channel.type === 'text') {
            return Promise.resolve(channel);
        }

        return this.member.guild.createChannel('mod-log', 'text');
    }

    actionable()    {
        if(this.on instanceof djs.GuildMember)    {
            return this.member.highestRole.position > this.on.highestRole.position;
        }
        return true;
    }

    checkPerms(perm)    {
        return (this.member.permissions.hasPermission(perm) && this.member.guild.members.get(this.member.client.user.id).permissions.hasPermission(perm));
    }
}