/**
 * Created by Will on 9/24/2016.
 */

const fs = require('fs');
const random = require('random-js');

const engine = random.engines.mt19937().autoSeed();

function Dick(client, msg, args)    {
    const file = './data/dick.json';

    let uid;
    if(args[0]) {
        uid = args[0].match(/<@([0-9]+)>/)[1];
    }   else    {
        uid = msg.author.id;
    }

    new Promise(function(resolve, reject)   {
        if(fs.existsSync(file)) {
            fs.readFile(file, (err, data) => {
                if(err) {
                    reject(err);
                }   else    {
                    resolve(data);
                }
            });
        }   else    {
            fs.writeFile(file, "{}", (err) => {
                if(err) {
                    reject(err);
                }   else    {
                    resolve("{}");
                }
            })
        }
    }).then(JSON.parse).then(function(data)  {
        let dick = "8";
        let count;

        if(data[uid]) {
            count = data[uid];
        }   else    {
            count = random.integer(1, 15)(engine);
            data[uid] = count;
            fs.writeFile(file, JSON.stringify(data), (err) => {
                if(err) {
                    console.error(err);
                    msg.reply(err);
                }
            });
        }

        for(let i = 0; i < count; i++) {
            dick += "="
        }

        dick += "D";

        msg.channel.sendMessage(dick);
    }).catch(function(err)  {
        console.error(err);
        msg.reply(err);
    })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Dick;