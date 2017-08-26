const errs = require('restify-errors');
const jwt = require('jsonwebtoken');

exports.authorization = (req, res, next) => {
  if (!req.headers.authorization) return next(new errs.UnauthorizedError('no authorization'));

  const header = req.headers.authorization.match(/^JWT (\S+)$/);
  if (!header) return next(new errs.UnauthorizedError('invalid authorization format'));

  const token = header[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.secret);
  } catch (e) {
    return next(new errs.UnauthorizedError(e.message));
  }

  req.authorization = decoded;
  next();
};
