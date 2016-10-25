/**
 * Created by nelso on 10/25/2016.
 */

const schedule = require('node-schedule');
const moment = require('moment');

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

    const timeIndex = atIndex > inIndex ? args.lastIndexOf('at') : args.lastIndexOf('in');

    if(!remIndex || !timeIndex || timeIndex == -1 || remIndex == -1 || timeIndex < remIndex)    {
        return Promise.resolve('can\'t parse that :cry:');
    }

    const date = moment(args.slice(timeIndex + 1));
    if(!date.isValid() || date < moment()) {
        return Promise.resolve('that date doesn\'t seem to be valid.');
    }

    schedule.scheduleJob(date, () => {
        msg.reply(args.slice(remIndex + 1, timeIndex));
    });

    Promise.resolve('reminder set for ' + date.format('MMMM Do, YYYY HH:mm:ssZ a'));
}

module.exports = Remind;