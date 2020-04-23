const router = require('koa-router')({
  prefix: '/api'
})
const { checkAuth } = require('../util/check')
const { regist, updateUser, login } = require('../service/user')
const { updateColor, buyColor } = require('../service/color')
const { queryComment, saveComment, deleteComment } = require('../service/comment')

const { queryDetail } = require('../service/detail')
const { updateHeart, cancelHeart } = require('../service/heart')
const { queryRank, checkRank, saveRank } = require('../service/rank')

const { updateRecord } = require('../service/record')
const { updateZan, cancelZan } = require('../service/zan')
const { queryList } = require('../service/list')



// router.get('/', checkAuth, regist)

// router.post('/', login)
router.get('/', (ctx)=>{
  let data = {nick_name:'Foo', date: new Date()}
  ctx.body = data
})
router.post('/', (ctx)=>{
  let data = {nick_name:'Foo', date: new Date()}
  ctx.body = data
})
router.post('/login', login)

router.post('/queryList', queryList)

router.get('/user', (ctx)=>{
  let data = {nick_name:'Jon', date: new Date()}
  ctx.body = data
})
router.post('/user', regist)
router.put('/user', updateUser)

router.post('/updateColor', updateColor)
router.post('/buyColor', buyColor)

router.post('/queryComment', queryComment)
router.post('/saveComment', saveComment)
router.post('/deleteComment', deleteComment)

router.post('/queryDetail', queryDetail)

router.post('/updateHeart', updateHeart)
router.post('/cancelHeart', cancelHeart)

router.post('/queryRank', queryRank)
router.post('/checkRank', checkRank)
router.post('/saveRank', saveRank)

router.post('/record', updateRecord)

router.post('/updateZan', updateZan)
router.post('/cancelZan', cancelZan)


module.exports = router
