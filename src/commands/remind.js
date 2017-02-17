/**
 * Created by nelso + lantern<3 on 10/25/2016.
 */

const schedule = require('node-schedule');
const moment = require('moment');
const date = require('date.js');

exports.func = (res, msg, args) => {
    let remIndex = args.indexOf('to');
    remIndex = remIndex === -1 ? 0 : remIndex;

    const atIndex = args.lastIndexOf('at');
    const inIndex = args.lastIndexOf('in');

    const timeIndex = atIndex > inIndex ? args.lastIndexOf('at') : args.lastIndexOf('in');

    if(timeIndex < remIndex) {
        return 'can\'t parse that :cry:';
    }

    const newDate = date(args.slice(timeIndex + 1).join(' '));
    if(newDate <= new Date()) {
        return 'that date doesn\'t seem to be valid.';
    }

    schedule.scheduleJob(newDate, () => {
        if (args[0] == 'me') {
            res.success(args.slice(remIndex + 1, timeIndex).join(' '));
        } else {
            res.success(args[0] + ', ' + args.slice(remIndex + 1, timeIndex).join(' '));
        }
    });

    return 'reminder set for ' + moment(newDate).format('dddd, MMMM Do YYYY, h:mm:ss a ZZ');
};