/**
 * Created by Will on 2/25/2017.
 */
const heapdump = require('heapdump');
const path = require('path');
const fs = require('fs');
const gcs = require('@google-cloud/storage')({
    projectId: process.env.google_cloud_project_id,
    keyFilename: path.join(process.cwd(), 'gauth.json')
});

const bucket = gcs.bucket('pleb-heapdumps');

exports.func = res => {
    return new Promise((resolve, reject) => {
        heapdump.writeSnapshot((err, filename) => {
            if(err) return reject(err);

            bucket.upload(path.join(process.cwd(), filename), (err, file) => {
                fs.unlinkSync(path.join(process.cwd(), filename));
                if(err) return reject(err);

                file.getSignedUrl({
                    expires: Date.now() + 60000,
                    action: 'read'
                }, (err, url) => {
                    if(err) return reject(err);
                    resolve(res.dm(url));
                });
            });
        });
    });
};

exports.validator = (val, cmd) => val.applyValid(cmd.message.author.id === '116690352584392704', 'This command is owner-only.');