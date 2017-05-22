require('dotenv').config();
const { ShardingManager } = require('discord.js');
// const site = require('../site/index');
const path = require('path');

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
    token: process.env.discord
});

manager.spawn();
