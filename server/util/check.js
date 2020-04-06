// const userService = require('../service/user')
exports = module.exports = {
  checkAuth : async function(ctx, next) {
    const body = ctx.request.body
    const { authName, authCode }= body
    console.log('checkAuth:', body)
    if(!authName || !authCode){
      console.log(authName, authCode)
      return ctx.body = {'code': -1, 'data': '无权限操作'}
    }else{
      await next()
    }
  },
}