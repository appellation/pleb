/**
 * Created by Will on 1/18/2017.
 */

/* eslint-disable */
const settings = require('../util/storage/settings');

exports.func = (msg, args) => {
    const g = settings.get(msg.guild.id);
    if(args[0] === 'set')
        g.set('test', args.slice(1).join(' ')).then(console.log).catch(console.error);
    else
        console.log(g.get('test'));

};
/* eslint-disable */