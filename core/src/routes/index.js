module.exports = (router) => {
  router.get('/', async (ctx, next) => {
    ctx.body = 'meme';
    await next();
  });
};
