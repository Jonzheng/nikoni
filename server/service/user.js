const { mysql } = require('../config/db')
const conf = require('../config/conf')

const request = require('../util/request')


exports = module.exports = {
  /**
   * 用户进入小程序时注册
   */
  resgist: async (ctx) => {
    console.log('---',new Date(),'---')
    let body = ctx.request.body
    let userCode = body.userCode
    userCode = '081Vs2iZ1IXOTU0t0tgZ1WmbiZ1Vs2iP'
    let res = await getOpenid(userCode)
    console.log(res)
    let openid = res.openid
    openid = openid ? openid : '001'
    await mysql.raw('insert into t_user(openid, c_date) values (?,now())on duplicate key update latest_date = now()', openid);
    let data = await getUser(openid)
    ctx.body = data;
  },
  updateUser: async (ctx) => {
    let body = ctx.request.body
    let openid = body.openid
    let nickName = body.nickName
    let showName = body.showName ? body.showName : ''
    let avatarUrl = body.avatarUrl
    let gender = body.gender
    await mysql("t_user").where("openid", openid).update({ nick_name: nickName,show_name: showName, avatar_url: avatarUrl, gender: gender})
    let data = await getUser(openid)
    ctx.body = data;
  },
}


getOpenid = (userCode) => {
  // url = 'https://job.xiyanghui.com/api/q1/json'
  url = conf.loginApi + userCode
  return request({
    url: url,
    method: 'get'
  })
}

getUser = (openid) => {
  return mysql('t_user').select('*').where('openid', openid)
}

