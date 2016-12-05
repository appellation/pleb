/**
 * Created by Will on 12/4/2016.
 */

const heapdump = require('heapdump');

function Heapdump(client, msg, args)    {
    if(msg.author.id !== '116690352584392704') return;
    return new Promise((resolve, reject) => {
        heapdump.writeSnapshot(`${__dirname}/../assets/heapdumps/${Date.now()}.heapsnapshot`, (err, filename) => {
            if(err) return reject(err);
            return resolve(msg.channel.sendFile(filename));
        });
    });
}

module.exports = Heapdump;