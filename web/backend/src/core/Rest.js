const restify = require('restify');
const cookies = require('restify-cookies');
const corsMiddleware = require('restify-cors-middleware');

const Router = require('../rest/Router');

class Rest {
  constructor(server) {
    this.server = server;
    this.http = restify.createServer();

    const cors = corsMiddleware({
      origins: ['*'],
      allowHeaders: ['Authorization', 'x-session']
    });

    this.http.pre(cors.preflight);
    this.http.use(cors.actual);

    this.http.use(restify.plugins.bodyParser());
    this.http.use(restify.plugins.queryParser());
    this.http.use(cookies.parse);

    this.router = new Router(this);
    this.router.register();

    this.http.use(...this.router.middleware.global);

    this.http.listen(process.env.port || 3000, () => console.log('listening on port 3000'));
  }
}

module.exports = Rest;
