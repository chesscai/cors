const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.body = 'HELLO'
})

router.post('/', async (ctx, next) => {
  ctx.body = 'HELLO'
})

router.head('/', async (ctx, next) => {
  ctx.body = 'HELLO'
})

router.put('/', async (ctx, next) => {
  ctx.body = 'HELLO'
})

router.get('/json', async (ctx, next) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = 'HELLO'
})

router.get('/cookie', async (ctx, next) => {
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.body = 'HELLO'
})

router.put('/max_age', async (ctx, next) => {
  ctx.set('Access-Control-Max-Age', 10);
  ctx.body = 'HELLO'
})

module.exports = router
