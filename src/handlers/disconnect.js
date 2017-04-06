module.exports = (client, close) => {
    client.log.hook({
        title: `Disconnected with code **${close.code}**`,
        color: 0xf44242
    });
};
