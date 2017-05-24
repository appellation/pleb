require('dotenv').config();
const { ShardingManager } = require('discord.js');
const path = require('path');

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
    token: process.env.discord
});

manager.spawn();
