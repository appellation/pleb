/**
 * Created by nelso on 11/13/2016.
 */

class Mod   {
    constructor(member, action)   {
        this.member = member;
        this.action = action;
    }

    act(onMember)    {
        if(!this.checkPerms()) return Promise.reject();

        return this.checkChannel().then(channel => {
            switch(this.action) {
                case 'unban':
                    return this.member.guild.unban(onMember).then(user => {
                        return channel.sendMessage(this.member + ' successfully unbanned ' + user);
                    });
                case 'ban':
                    return onMember.ban().then(member => {
                        return channel.sendMessage(this.member + ' successfully banned ' + member);
                    });
                case 'kick':
                    return onMember.kick().then(member => {
                        return channel.sendMessage(this.member + ' successfully kicked ' + member);
                    });
                case 'unmute':
                    return onMember.setMute(false).then(member => {
                        return channel.sendMessage(this.member + ' successfully unmuted ' + member);
                    });
                case 'mute':
                    return onMember.setMute(true).then(member => {
                        return channel.sendMessage(this.member + ' successfully muted ' + member);
                    });
                case 'undeafen':
                    return onMember.setDeaf(false).then(member => {
                        return channel.sendMessage(this.member + ' successfully undeafened ' + member);
                    });
                case 'deafen':
                    return onMember.setDeaf(true).then(member => {
                        return channel.sendMessage(this.member + ' successfully deafened ' + member);
                    });
                default:
                    return Promise.reject();
            }
        });
    }

    checkChannel()  {
        const channel = this.member.guild.channels.find('name', 'mod-log');
        if(channel && channel.type === 'text') {
            return Promise.resolve(channel);
        }

        return this.member.guild.createChannel('mod-log', 'text');
    }

    checkPerms()    {
        let perm;
        switch(this.action)  {
            case 'kick':
                perm = 'KICK_MEMBERS';
                break;
            case 'unban':
            case 'ban':
                perm = 'BAN_MEMBERS';
                break;
            case 'unmute':
            case 'mute':
                perm = 'MUTE_MEMBERS';
                break;
            case 'undeafen':
            case 'deafen':
                perm = 'DEAFEN_MEMBERS';
                break;
        }

        if(!perm)   {
            return false;
        }

        return (this.member.permissions.hasPermission(perm) && this.member.guild.members.get(this.member.client.user.id).permissions.hasPermission(perm));
    }
}