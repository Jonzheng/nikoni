const router = require('koa-router')()
const { checkAuth, checkContent } = require('../util/check')
const { regist, login, getUser, updateUser, updateAvatar, uploadAvatar, updateProfile, follow, unFollow, queryFollow, queryFans, queryHeart, queryNews, clearNews } = require('../service/user')
const { updateColor, buyColor } = require('../service/color')
const { queryComment, saveComment, deleteComment } = require('../service/comment')

const { queryDetail } = require('../service/detail')
const { updateHeart, cancelHeart } = require('../service/heart')
const { queryRank, checkRank, saveRank } = require('../service/rank')

const { updateRecord, saveRecord, queryRecord, deleteRecord, report } = require('../service/record')
const { updateZan, cancelZan } = require('../service/zan')
const { queryList, queryListMerge } = require('../service/list')
const { queryAudio, publishAudio, queryDict, saveDict } = require('../service/audio')


router.get('/', checkAuth, regist)

router.post('/regist', regist)
router.post('/login', login)
router.post('/getUser', getUser)
router.post('/report', report)
router.post('/updateUser', updateUser)
router.post('/updateAvatar', updateAvatar)
router.post('/uploadAvatar', uploadAvatar)
router.post('/updateProfile', checkContent, updateProfile)

router.post('/follow', follow)
router.post('/unFollow', unFollow)
router.post('/queryFollow', queryFollow)
router.post('/queryFans', queryFans)
router.post('/queryHeart', queryHeart)
router.post('/queryNews', queryNews)
router.post('/clearNews', clearNews)

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
router.post('/saveComment', checkContent, saveComment)
router.post('/deleteComment', deleteComment)

router.post('/queryDetail', queryDetail)

router.post('/updateHeart', updateHeart)
router.post('/cancelHeart', cancelHeart)

router.post('/queryRank', queryRank)
router.post('/checkRank', checkRank)
router.post('/saveRank', saveRank)

router.post('/queryRecord', queryRecord)
router.post('/updateRecord', updateRecord)
router.post('/saveRecord', saveRecord)
router.post('/deleteRecord', deleteRecord)

router.post('/updateZan', updateZan)
router.post('/cancelZan', cancelZan)

router.post('/queryAudio', queryAudio)
router.post('/publishAudio', publishAudio)
router.post('/queryDict', queryDict)
router.post('/saveDict', saveDict)


module.exports = router
