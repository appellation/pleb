/**
 * Created by Will on 10/29/2016.
 */

function Sanitize(client, msg, args)    {
    let num = parseInt(args[0], 10) || 10;

    return msg.channel.fetchMessages().then(collection => {
        let messages = collection.findAll('author', client.user);

        if(messages.length > 0) {

            if(num > messages.length - 1)   {
                num = messages.length - 1;
            }

            const out = [];
            for(let i = 0; i < num; i++)    {
                out.push(messages[i].delete());
            }

            return Promise.all(out);
        }
    });
}

module.exports = Sanitize;