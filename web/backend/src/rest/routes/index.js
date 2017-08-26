const Route = require('../core/Route');

class IndexRoute extends Route {
  constructor(router) {
    super(router);
    this.path = '/';
  }

  get(req, res) {
    res.json({ dank: 'memes' });
  }
}

module.exports = IndexRoute;
