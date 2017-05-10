const resolvers = require('../util/command/resolvers');
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

    return cmd.response.send(`8${'='.repeat(count)}D ${user}`);
};

exports.arguments = function* (Argument) {
    yield new Argument('user')
        .setResovler(resolvers.user);
};
