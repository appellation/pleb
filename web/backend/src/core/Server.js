const restify = require('restify');
const rethinkdb = require('rethinkdbdash');
const corsMiddleware = require('restify-cors-middleware');

const Router = require('./Router');

class Server {
  constructor() {
    this.rest = restify.createServer();

    const cors = corsMiddleware({
      origins: ['*'],
      allowHeaders: ['Authorization']
    });

    this.rest.pre(cors.preflight);
    this.rest.use(cors.actual);

    this.rest.use(restify.plugins.bodyParser());
    this.rest.use(restify.plugins.queryParser());

    this.db = rethinkdb({ servers: [{ host: 'rethink' }], db: 'pleb' });

    this.router = new Router(this);
    this.router.register();

    this.rest.listen(8080, () => console.log('listening to port 8080'));
  }
}

module.exports = Server;
