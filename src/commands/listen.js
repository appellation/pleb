/**
 * Created by Will on 10/18/2016.
 */

exports.func = (res, msg) => msg.member.listen = msg;
exports.validator = val => {
    return val.ensureGuild() && val.applyValid(process.env.google_cloud_project_id, 'Google Cloud Speech is not configured.');
};
// exports.disabled = true;