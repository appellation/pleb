const args = require('../util/command/arguments');
const dicks = new Map();

exports.exec = (cmd) => {
    let user = cmd.args.user || cmd.message.author;

    let count;
    if(dicks.has(user)) {
        count = dicks.get(user);
    } else {
        count = Math.floor(Math.random() * 25) + 1;
        dicks.set(user, count);
    }

    return cmd.response.send(`${user} 8${'='.repeat(count)}D`);
};

exports.arguments = function* () {
    yield args.user().setOptional();
};
