const log = require('../util/log');

exports.func = async (res, msg, args) => {
    let data;
    try {
        data = await new Promise((resolve, reject) => {
            try {
                log.query(args.length ? JSON.parse(args[0]) : {}, (err, data) => {
                    if(err) reject(err);
                    else resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });
    } catch (e) {
        return res.error(e);
    }

    return msg.channel.sendFile(Buffer.from(JSON.stringify(data)), 'pleb.log');
};

exports.validator = val => val.ensureIsOwner();