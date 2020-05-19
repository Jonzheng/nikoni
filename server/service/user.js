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
    let { openid, mineId } = body
    let res = await mysql('t_user').select('*').where('openid', openid)
    let heart = await mysql('t_heart').select('user_id').where('master_id', openid).andWhere('status', 1)
    let user = res[0]
    let follow = await mysql('t_follow').select('openid', 'follow_id').where('openid', openid).orWhere('follow_id', openid)
    let follows = follow.filter((item) => {return item.follow_id == openid})
    let fans = follow.filter((item) => {return item.openid == openid})
    user['heartCount'] = heart.length
    user['followCount'] = follows.length
    user['fansCount'] = fans.length
    user['isFollow'] = fans.includes(mineId)
    ctx.body = user;
  },
  updateUser: async (ctx) => {
    let body = ctx.request.body
    let { openid, nickName, showName, avatarUrl, gender, city, province, country } = body
    showName = showName ? showName : ''
    await mysql("t_user").where("openid", openid).update({ nick_name: nickName,show_name: showName, avatar_url: avatarUrl, gender: gender, city:city, province:province, country:country})
    let data = await mysql('t_user').select('*').where('openid', openid)
    ctx.body = data;
  },
  updateProfile: async (ctx) => {
    let body = ctx.request.body
    let { openid, showName, motto } = body
    showName = showName ? showName : ''
    motto = motto ? motto : ''
    await mysql("t_user").where("openid", openid).update({ show_name: showName, motto: motto })
    ctx.body = 200;
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
  },
  follow: async (ctx) => {
    let body = ctx.request.body
    let { openid, followId } = body
    await mysql.raw('insert into t_follow(openid, follow_id) values (?,?)on duplicate key update c_date = now()', [openid, followId]);
    ctx.body = 200
  },
  unFollow: async (ctx) => {
    let body = ctx.request.body
    let { openid, followId } = body
    await mysql.raw('update t_follow set status = 0 where openid = ? and follow_id = ?', [openid, followId]);
    ctx.body = 200
  },
  queryFollow: async (ctx) => {
    let body = ctx.request.body
    let { openid } = body
    let data = await mysql.raw('select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tf.c_date FROM t_follow tf LEFT JOIN t_user tur on (tf.openid = tur.openid) where tf.openid = ?', openid);
    ctx.body = data[0];
  },
  queryFans: async (ctx) => {
    let body = ctx.request.body
    let { openid } = body
    let data = await mysql.raw('select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tf.c_date FROM t_follow tf LEFT JOIN t_user tur on (tf.follow_id = tur.openid) where tf.follow_id = ?', openid);
    ctx.body = data[0];
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

