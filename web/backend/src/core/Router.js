const path = require('path');
const { loadDirectory } = require('../util');

const DIRECTORY = path.resolve(__dirname, '..', 'routes');

class Router {
  constructor(server) {
    this.server = server;
  }

  async register() {
    const files = await loadDirectory(DIRECTORY);

    for (const loc of files) {
      const route = new (require(loc))(this);
      for (const method of ['get', 'post', 'update', 'delete'])
        if (method in route)
          this.server.rest[method](route.path, ...route.middleware, route[method].bind(route));
    }
  }
}

module.exports = Router;
