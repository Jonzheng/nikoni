const router = require('koa-router')()
const { checkAuth } = require('../util/check')
const { regist, login, updateUser, updateAvatar } = require('../service/user')
const { updateColor, buyColor } = require('../service/color')
const { queryComment, saveComment, deleteComment } = require('../service/comment')

const { queryDetail } = require('../service/detail')
const { updateHeart, cancelHeart } = require('../service/heart')
const { queryRank, checkRank, saveRank } = require('../service/rank')

const { updateRecord, saveRecord } = require('../service/record')
const { updateZan, cancelZan } = require('../service/zan')
const { queryList, queryListMerge } = require('../service/list')


router.get('/', checkAuth, regist)

router.post('/regist', regist)
router.post('/login', login)
router.post('/updateUser', updateUser)
router.post('/updateAvatar', updateAvatar)

router.post('/queryList', queryList)
router.post('/queryList/merge', queryListMerge)
router.post('/api/queryList', queryList)
router.get('/queryList', queryList)

router.get('/user', (ctx)=>{
  let data = {nickname:'get=Nikoni', date: new Date()}
  ctx.body = data
})
router.post('/user', (ctx)=>{
  let data = {nickname:'post=Kona', date: new Date()}
  ctx.body = data
})
// router.post('/user', regist)
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

router.post('/updateRecord', updateRecord)
router.post('/saveRecord', saveRecord)

router.post('/updateZan', updateZan)
router.post('/cancelZan', cancelZan)


module.exports = router
