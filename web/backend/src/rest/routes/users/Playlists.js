const Route = require('../../Route');

class PlaylistsRoute extends Route {
  constructor(router) {
    super(router);
    this.middleware.push(this.router.middleware.authorization);
    this.path = '/users/:userID/playlists';
  }

  async get(req, res) {
    const lists = await this.router.rest.server.db.r.table('playlists').filter({ userID: req.params.userID });
    res.json(lists);
  }
}

module.exports = PlaylistsRoute;
