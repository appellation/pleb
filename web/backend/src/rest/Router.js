const path = require('path');
const { loadDirectory } = require('../util');

const DIRECTORY = path.resolve(__dirname, '..', '..', 'routes');

class Router {
  constructor(rest) {
    this.rest = rest;
  }

  async register() {
    const files = await loadDirectory(DIRECTORY);

    for (const loc of files) {
      const route = new (require(loc))(this);
      for (const method of ['get', 'post', 'update', 'delete'])
        if (method in route)
          this.rest.http[method](route.path, ...route.middleware, route[method].bind(route));
    }
  }
}

module.exports = Router;
