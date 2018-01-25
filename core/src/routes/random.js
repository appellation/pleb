const axios = require('axios');

let next = 0;
const instance = axios.create({
  async adapter(config) {
    while (next > Date.now()) await new Promise(r => setTimeout(r, next));

    const response = await axios.defaults.adapter(config);
    const r = response.data.result;

    if (r.requestsLeft < 1) {
      const reset = new Date();
      reset.setDate(reset.getDate() + 1);
      reset.setHours(0, 0, 0, 0);
      next = reset.getMilliseconds();
    } else {
      next = Date.now() + r.advisoryDelay;
    }

    return response;
  }
});

instance.interceptors.request.use(config => {
  return {
    url: 'https://api.random.org/json-rpc/1/invoke',
    data: JSON.stringify({
      jsonrpc: '2.0',
      method: config.url,
      params: Object.assign({ apiKey: process.env.random }, config.data),
      id: Math.floor(Math.random() * 1000),
    }),
    method: 'post',
  };
});

instance.interceptors.response.use(response => {
  const d = JSON.parse(response.data);
  if (d.error) throw new Error(d.error.message);
  response.data = d.result;
  return response;
});

module.exports = (router) => {
  router.get('/random/dick', async (ctx, next) => {
    const rng = await instance.post('generateIntegers', {
      n: 1,
      min: 1,
      max: 69,
    });

    ctx.body = `8${'='.repeat(rng.data.random.data[0])}D`;
    await next();
  });

  router.get('/random', async (ctx, next) => {
    const q = ctx.request.query;
    ctx.assert(q.min, 400);
    ctx.assert(q.max, 400);
    const rng = await instance.post('generateIntegers', {
      n: 1,
      min: q.min,
      max: q.max,
    });
    ctx.body = String(rng.data.random.data[0]);
    await next();
  });
};
