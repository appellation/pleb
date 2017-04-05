module.exports = (client, close) => {
    this.client.log.hook({
        title: `Shard \`${client.shard.id}\` disconnected with code **${close.code}**`,
        color: 0xf44242
    });
};
