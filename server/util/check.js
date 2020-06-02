const { mysql } = require('../config/db')

const getToken = () => {
  return request({
    url: conf.tokenApi,
    method: 'get'
  })
}

const postCheck = (token, content) => {
  let url = `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${token}`
  return request({
    url: url,
    method: 'post',
    data: { content }
  })
}

exports = module.exports = {
  checkAuth : async (ctx, next) => {
    let body = ctx.request.body
    let { token } = body
    console.log('checkToken:', token)
    if(!token){
      return ctx.body = {'code': -1, 'data': '无权限访问'}
    }else{
      let res = await mysql('t_auth').select('code').where('id', 100)
      if (res && res.code != token){
        return ctx.body = {'code': -1, 'data': '无权限访问'}
      }
      await next()
    }
  },
  checkContent: async (ctx, next) => {
    let body = ctx.request.body
    let { content } = body
    let res = await mysql('t_auth').select('code').where('id', 201)
    let token = ''
    if (res && res.code) {
      token = res.code
    } else {
      res = await getToken()
      console.log(res)
      if (res.errcode == 0){
        token = res.access_token
        await mysql("t_auth").update({ code: token }).where('id', 201)
      }
    }
    res = await postCheck(token, content)
    console.log(res)
    if (res && res.errcode == 0){
      await next()
    }else{
      return ctx.body = {'code': res.errcode, 'data': '内容含有违法违规内容'}
    }
  }
}