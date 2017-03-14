/**
 * Created by nelso on 3/14/2017.
 */
require('dotenv').config();
const {ShardingManager} = require('discord.js');
const path = require('path');

const manager = new ShardingManager(path.join(__dirname, 'index.js'), {
    token: process.env.discord
});
manager.spawn();