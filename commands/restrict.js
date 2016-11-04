/**
 * Created by Will on 10/31/2016.
 */

const dateJS = require('date.js');
const moment = require('moment');
const _ = require('underscore');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string|Promise|undefined}
 */
function Restrict(client, msg, args) {

    if(!msg.member) {
        return;
    }

    let authorTopRole = msg.member.roles.first();
    msg.member.roles.forEach(role => {
        if(role.comparePositionTo(authorTopRole) > 0)   {
            authorTopRole = role;
        }
    });
    
    if(!msg.mentions.users) {
        return 'gotta mention someone';
    }

    let i = 0;
    while(args[i].match(/<@!?[0-9]+>/))    {
        i++;
    }

    const banned = [];
    for(const user of msg.mentions.users)   {
        if(user[1].equals(client.user) || user[1].equals(msg.author))   {
            continue;
        }

        banned.push(
            client.fetchUser(user[0]).then(resolved => {
                return msg.guild.fetchMember(resolved);
            }).then(member => {
                let perms = false;
                for(const role of member.roles) {
                    if(role[1].comparePositionTo(authorTopRole) >= 0)   {
                        perms = true;
                        break;
                    }
                }

                if(perms || member.roles.size == 0) {
                    const date = dateJS(args.slice(i).join(' '));
                    member.restrictedUse = _.isEqual(date, new Date()) ? true : date;
                    return member;
                }
            })
        )
    }

    return Promise.all(banned).then(members => {
        return '**Restricted:**\n\n' + members.map(member => {
                const date = member.restrictedUse;
                let out;
                if(date === true)   {
                    out = 'forever';
                }   else {
                    out = moment(member.restrictedUse).format('MMM DD YYYY HH:mm:ssZZ')
                }

                return member.toString() + ' | ' + out;
            }).join('\n');
    });
}

module.exports = Restrict;