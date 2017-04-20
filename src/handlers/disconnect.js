module.exports = (client, close) => {
    client.log.hook({
        title: 'Disconnected',
        description: `Code: ${close.code}`,
        color: 0xff5e5e
    });
};
