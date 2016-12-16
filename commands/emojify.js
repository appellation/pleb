/**
 * Created by Will on 11/13/2016.
 */

const sharp = require('sharp');
const request = require('request');
const imgSize = require('image-size');

function Emojify(msg, args) {

    return new Promise((resolve, reject) => {

        let img;
        if(msg.attachments.size === 0)   {
            img = args[0];
        }   else {
            img = msg.attachments.first().proxyURL;
        }

        let chunks = [];

        request.get(img).on('data', data => {
            chunks.push(data);
        }).on('end', () => {
            resolve(Buffer.concat(chunks));
        }).on('error', err => {
            reject(err);
        });
    }).then(buffer => {
        const size = imgSize(buffer);
        if(size.width > 128 || size.height > 128)   {

            return new Promise((resolve, reject) => {

                sharp(buffer).resize(128, 128).toBuffer((err, newBuff) => {
                    if(err) return reject(err);
                    resolve(newBuff);
                });
            });
        }

        return buffer;
    }).then(buffer => {
        return msg.guild.createEmoji(buffer, args[1] || args[0]);
    }).catch(console.error);
}

module.exports = {
    triggers: 'emojify',
    func: Emojify,
    disabled: true
};