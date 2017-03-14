/**
 * Created by Will on 2/16/2017.
 */

const math = require('mathjs');
exports.func = async (res, msg, args) => {
    let out;
    try {
        out = math.eval(args.join(' '));
    } catch (e) {
        return res.error(`Error: \`${e.message}\``);
    }

    return res.success(`**${args.join(' ')}** = \`${out}\``);
};

exports.validator = val => val.ensureArgs();