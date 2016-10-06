/**
 * Created by Will on 10/6/2016.
 */

const fs = require('fs');
const shuffle = require('knuth-shuffle').knuthShuffle;

function Airhorn(client, msg, args) {
    const vc = client.guilds.find('id', msg.guild.id).members.find('id', msg.author.id).voiceChannel;
    if(vc) {
        Promise.all([
            vc.join(),
            new Promise((resolve, reject) => {
                fs.readdir('assets/audio', function(err, files) {
                    if(err) {
                        reject(err);
                    }   else {
                        resolve(files);
                    }
                });
            }).then(shuffle)
        ]).then(function(resolutions)   {
            return resolutions[0].playFile('assets/audio/' + resolutions[1][0]);
        }).then(function(dispatcher)    {
            dispatcher.once('end', () => {
                vc.leave();
            });
        }).catch(function(err)  {
            console.error(err);
        });
    }   else {
        console.error(vc);
    }
}

module.exports = Airhorn;