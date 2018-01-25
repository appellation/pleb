const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fsn = require('fs-nextra');
const Redis = require('redis-p');
const path = require('path');

const Bot = require('./core/Bot');
const DB = require('./core/DB');

// const redis = Redis.createClient({ host: 'redis' });
const app = new Koa();
const router = new Router();
const bot = new Bot(app);
const db = DB(app);

(async () => {
  const routes = await fsn.scan(path.resolve(__dirname, 'routes'));
  for (const [dir, stats] of routes) {
    if (stats.isFile() && path.extname(dir) === '.js') require(dir)(router);
  }

  await bot.connect('localhost:32768');
  await bot.subscribe(['MESSAGE_CREATE']);
  await db.initialize(true);
})();

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
