const router = require('koa-router')({
  prefix: '/api'
})
const { resgist, updateUser } = require('../service/user')
const { checkAuth } = require('../util/check')



router.get('/', resgist)
router.post('/', checkAuth, resgist)

router.get('/user', updateUser)


module.exports = router
