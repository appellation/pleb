const { Argument } = require('discord-handles');

exports.exec = async (cmd) => {
    let res;
    try {
        res = await Promise.resolve(eval(cmd.args.code));
    } catch (e) {
        res = e.message;
    }

    const inspected = require('util').inspect(res, { depth: 1 });
    return (inspected.length <= 6000) ? cmd.message.channel.send(inspected, { split: true, code: 'js' }) : cmd.response.error('that response would be too big');
};

exports.arguments = function* () {
    yield new Argument('code')
        .setInfinite();
};

exports.validator = val => val.ensureIsOwner() && val.ensureArgs();
