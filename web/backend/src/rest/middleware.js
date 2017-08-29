const errs = require('restify-errors');
const jwt = require('jsonwebtoken');

const User = require('../structures/User');

class MiddlewareRegistry {
  constructor(router) {
    this.router = router;

    this.identification = this.identification.bind(this);
    this.authorization = this.authorization.bind(this);
    this.global = [
      this.session.bind(this),
      this.socket.bind(this)
    ];
  }

  async user(req, res, next) {
    if (!req.authorization) return next();

    const { userID } = jwt.decode(req.authorization);
    const userInfo = await this.router.server.db.getUser(userID);
    if (!userInfo) return next();

    req.user = new User(this.router.server, req.authorization, userInfo);
    return next();
  }

  socket(req, res, next) {
    if (!req.session) return next();

    const socket = this.router.server.socket.connections.get(req.session);
    if (socket) {
      req.socket = socket;
      return next();
    }

    return next(new errs.BadRequestError('invalid session specified'));
  }

  session(req, res, next) {
    if (!req.headers['x-session']) return next();

    const header = req.headers['x-session'].match(/^\S+$/);
    if (!header) return next();

    const id = header[0];
    if (this.router.rest.server.socket.connections.has(id)) req.session = id;
    return next();
  }

  identification(req, res, next) {
    if (!req.session) return next(new errs.UnauthorizedError('no identification'));
    return next();
  }

  authorization(req, res, next) {
    if (!req.headers.authorization) return next(new errs.UnauthorizedError('no authorization'));

    const header = req.headers.authorization.match(/^JWT (\S+)$/);
    if (!header) return next(new errs.UnauthorizedError('invalid authorization format'));

    const token = header[1];
    try {
      var decoded = jwt.verify(token, process.env.secret);
    } catch (e) {
      return next(new errs.UnauthorizedError(e.message));
    }

    req.authorization = decoded;
    next();
  }
}

module.exports = MiddlewareRegistry;
