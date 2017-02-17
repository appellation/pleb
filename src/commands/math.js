/**
 * Created by Will on 2/16/2017.
 */

const math = require('mathjs');
exports.func = (res, msg, args) => {
    let out;
    try {
        out = math.eval(args.join(' '));
    } catch (e) {
        return res.error(`Error: \`${e.message}\``);
    }

    res.success(`**${args.join(' ')}** = \`${out}\``);
};

exports.validator = val => val.ensureArgs();