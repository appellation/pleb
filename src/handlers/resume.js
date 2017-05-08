module.exports = (client, replayed) => {
    client.log.hook({
        title: 'Resumed',
        description: `Replayed **${replayed}** events.`,
        color: 0x9bffd5
    });
};
