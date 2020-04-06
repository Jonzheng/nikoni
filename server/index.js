const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
const conf = require('./config/conf')
const router = require('./routes/api')
const response = require('./util/response')

app.use(koaBody({formLimit: '100mb', jsonLimit: '100mb', textLimit: '100mb', multipart: true}))
app.use(response)

app.use(router.routes(), router.allowedMethods())

app.listen(conf.port, () => console.log(`listening on port ${conf.port}`))

