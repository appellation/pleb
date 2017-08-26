const Route = require('../../core/Route');
const middleware = require('../../util/middleware');

class PlaylistsRoute extends Route {
  constructor(router) {
    super(router);
    this.middleware.push(middleware.authorization);
    this.path = '/users/:userID/playlists';
  }

  async get(req, res) {
    const lists = await this.router.server.db.table('playlists').filter({ userID: req.params.userID });
    res.json(lists);
  }
}

module.exports = PlaylistsRoute;
