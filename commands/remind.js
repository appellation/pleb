1/**
 * Created by nelso on 10/25/2016.
 */

const schedule = require('node-schedule');
const moment = require('moment');
const date = require('date.js');
/**
 *
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @constructor
 */
function Remind(client, msg, args)  {
    const remIndex = args.indexOf('to');

    const atIndex = args.lastIndexOf('at');
    const inIndex = args.lastIndexOf('in');
console.log(args);


    const timeIndex = atIndex > inIndex ? args.lastIndexOf('at') : args.lastIndexOf('in');

    if(!remIndex || !timeIndex || timeIndex == -1 || remIndex == -1 || timeIndex < remIndex)    {
        return Promise.resolve('can\'t parse that :cry:');
    }

    const newdate = date(args.slice(timeIndex + 1).join(' '));
    if(newdate < new Date()) {
        return Promise.resolve('that date doesn\'t seem to be valid.');
    }

        schedule.scheduleJob(newdate, () => {
        if (args[0].indexOf('@') == 1)
        {
            msg.reply(/*username+*/args.slice(remIndex + 1, timeIndex).join(' '))
        }
        else
        {
            msg.reply(args.slice(remIndex + 1, timeIndex).join(' '))
        }
    });

    return Promise.resolve('reminder set for ' + moment(newdate).format('dddd, MMMM Do YYYY, h:mm:ss a'));
    
}

module.exports = Remind;