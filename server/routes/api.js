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



router.get('/', checkAuth, regist)

router.post('/', login)
router.post('/login', login)

router.post('/user', regist)
router.put('/user', updateUser)

router.post('/updateColor', updateColor)
router.post('/buyColor', buyColor)

router.get('/comment', queryComment)
router.post('/comment', saveComment)
router.del('/comment', deleteComment)

router.get('/detail', queryDetail)

router.put('/updateHeart', updateHeart)
router.put('/cancelHeart', cancelHeart)

router.post('/queryRank', queryRank)
router.post('/checkRank', checkRank)
router.post('/saveRank', saveRank)

router.post('/record', updateRecord)

router.post('/updateZan', updateZan)
router.post('/cancelZan', cancelZan)


module.exports = router
