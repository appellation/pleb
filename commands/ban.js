/**
 * Created by Will on 10/31/2016.
 */

const dateJS = require('date.js');
const moment = require('moment');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string|Promise|undefined}
 */
function Ban(client, msg, args) {

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
    while(args[i].match(/<!?[0-9]/))    {
        i++;
    }

    const banned = [];
    for(const user of msg.mentions.users)   {
        banned.push(
            client.fetchUser(user[0]).then(resolved => {
                return msg.guild.fetchMember(resolved);
            }).then(member => {
                for(const role of member.roles) {
                    if(role[1].comparePositionTo(authorTopRole) >= 0)   {
                        member.restrictedUse = dateJS(args.slice(i));
                        return member;
                    }
                }

                if(member.roles.size == 0) {
                    return member;
                }
            })
        )
    }

    return Promise.all(banned).then(members => {
        return members.map(member => {
            return member.toString();
        }).join('\n');
    });
}

module.exports = Ban;