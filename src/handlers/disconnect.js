module.exports = (client, close) => {
    client.log.hook({
        title: 'Disconnected',
        description: `Code: ${close.code}`,
        color: 0xff5e5e
    }).then(() => {
        process.exit(0);
    }).catch(() => {
        process.exit(0);
    });
};
