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
      allowHeaders: ['Authorization']
    });

    this.http.pre(cors.preflight);
    this.http.use(cors.actual);

    this.http.use(restify.plugins.bodyParser());
    this.http.use(restify.plugins.queryParser());
    this.http.use(cookies.parse);

    this.router = new Router(this);
    this.router.register();

    this.http.listen(8080, () => console.log('listening on port 8080'));
  }
}

module.exports = Rest;
