/**
 * Created by Will on 10/6/2016.
 */

const fs = require('fs');
const shuffle = require('knuth-shuffle').knuthShuffle;

function Airhorn(client, msg, args) {
    const vc = msg.member.voiceChannel;
    if(vc) {
        return Promise.all([
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
        });
    }   else {
        return Promise.resolve();
    }
}

module.exports = Airhorn;