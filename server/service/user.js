const { mysql } = require('../config/db')
const conf = require('../config/conf')
const crypto = require('crypto')

const request = require('../util/request')


exports = module.exports = {
  /**
   * 用户进入小程序时注册
   */
  regist: async (ctx) => {
    console.log('---',new Date(),'---')
    let body = ctx.request.body
    let userCode = body.userCode
    let res = await getOpenid(userCode)
    let openid = res.openid
    openid = openid ? openid : '001'
    await mysql.raw('insert into t_user(openid, c_date) values (?,now())on duplicate key update latest_date = now()', openid);
    let data = await mysql('t_user').select('*').where('openid', openid)
    ctx.body = data;
  },
  getUser: async (ctx) => {
    let body = ctx.request.body
    let { openid } = body
    let res = await mysql('t_user').select('*').where('openid', openid)
    ctx.body = res[0];
  },
  updateUser: async (ctx) => {
    let body = ctx.request.body
    let { openid, nickName, showName, avatarUrl, gender, city, province, country } = body
    showName = showName ? showName : ''
    await mysql("t_user").where("openid", openid).update({ nick_name: nickName,show_name: showName, avatar_url: avatarUrl, gender: gender, city:city, province:province, country:country})
    let data = await mysql('t_user').select('*').where('openid', openid)
    ctx.body = data;
  },
  updateAvatar: async (ctx) => {
    let body = ctx.request.body
    let { openid, avatarUrl } = body
    await mysql("t_user").where("openid", openid).update({ avatar_url: avatarUrl })
    let data = await mysql('t_user').select('*').where('openid', openid)
    ctx.body = data;
  },
  login: async (ctx) => {
    let body = ctx.request.body
    let { authName, authCode } = body
    if (!authName || !authCode){
      ctx.body = 1001
      return
    }
    authCode = crypto.createHash('md5').update(authCode).digest('hex')
    let data = await mysql('t_user').select('*').where('auth_name', authName).andWhere('auth_code', authCode).andWhere('status', 2)
    ctx.body = data
  }
}


getOpenid = (userCode) => {
  // url = 'https://job.xiyanghui.com/api/q1/json'
  url = conf.loginApi + userCode
  return request({
    url: url,
    method: 'get'
  })
}

