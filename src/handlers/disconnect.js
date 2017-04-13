let disconnects = 0;

setTimeout(() => {
    if(disconnects > 0) disconnects--;
}, 300000); // 5 minutes

module.exports = async (client, close) => {
    await client.log.hook({
        title: `Disconnected with code **${close.code}**`,
        color: 0xf44242
    });

    if(++disconnects > 3) process.exit(0);
};
