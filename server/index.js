const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
const cors = require('koa2-cors'); // 允许其它域访问！！！
const conf = require('./config/conf')
const router = require('./routes/api')
const response = require('./util/response')

app.use(koaBody({formLimit: '100mb', jsonLimit: '100mb', textLimit: '100mb', multipart: true}))
app.use(response)
app.use(cors({
  origin:['*'],
  methods:['GET','POST'],
  alloweHeaders:['Conten-Type', 'Authorization', 'Content-Length', 'Accept', 'X-Requested-With']
}))
app.use(router.routes(), router.allowedMethods())

app.listen(conf.port, '0.0.0.0', () => console.log(`listening on port ${conf.port}`))

