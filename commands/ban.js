/**
 * Created by Will on 10/31/2016.
 */

const date = require('date.js');
const schedule = require('node-schedule');

/**
 * @param client
 * @param msg
 * @param args
 * @return {string|undefined}
 */
function Ban(client, msg, args) {

    if(!msg.member) {
        return;
    }

    if(!msg.member.hasPermission('BAN_MEMBERS')) {
        return 'if you can\'t do it, I sure as hell won\'t';
    }

    let lastMention;
    for(lastMention = 0; lastMention < args.length; lastMention++)   {
        if(!/<!?[0-9]+>/.test(args[lastMention]))  {
            break;
        }
    }

    if(args.length == lastMention + 1)  {
        return;
    }

    const out = [];
    msg.mentions.users.forEach(user => {
        if(!user.equals(client.user)) {
            out.push(msg.guild.members.get(user.id).ban());
        }
    });

    msg.mentions.roles.forEach(role => {
        role.forEach(member => {
            out.push(member.ban());
        });
    });

    const until = date(args.slice(lastMention + 1).join(' '));
    schedule.scheduleJob(until, () => {
        Promise.all([
            Promise.all(out),
            msg.channel.createInvite({
                maxAge: 86400,
                maxUses: out.length
            })
        ]).then(resolutions => {
            for(const member of resolutions[0])    {
                msg.guild.unban(member);
                member.sendMessage(resolutions[1].url);
            }
        });
    });

    Promise.all(out).then(banned => {
        return 'banned until ' + until + ':\n\n' + banned.reduce(obj => {
                return obj.user.username + '#' + obj.user.discriminator + '\n';
            });
    }).catch(failed => {
        return 'failed to ban:\n\n' + failed.reduce(obj => {
                return obj.user.username + '#' + obj.user.discriminator + '\n';
            });
    })
}

module.exports = Ban;