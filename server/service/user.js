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
    let follow = await mysql('t_follow').select('openid', 'follow_id').where('status', 1).andWhere(function(){this.where('openid', openid).orWhere('follow_id', openid)})
    let follows = follow.filter((item) => {return item.openid == openid})
    let fans = follow.filter((item) => {return item.follow_id == openid})
    user['heartCount'] = heart.length
    user['followCount'] = follows.length
    user['fansCount'] = fans.length
    user['isFollow'] = fans.filter((item) => {return item.openid == mineId}).length > 0
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
  clearNews: async (ctx) => {
    let body = ctx.request.body
    let { openid } = body
    await mysql("t_user").where("openid", openid).update({ news: 0 })
    ctx.body = 200
  },
  follow: async (ctx) => {
    let body = ctx.request.body
    let { openid, followId } = body
    await mysql.raw('insert into t_follow(openid, follow_id) values (?,?)on duplicate key update status = 1, c_date = now()', [openid, followId]);
    await mysql("t_user").where("openid", followId).increment({ news: 1 })
    // 可能互相关注
    let res = await mysql("t_follow").where("openid", followId).andWhere('follow_id', openid).update({ status: 2 })
    if (res){
      await mysql("t_follow").where("openid", openid).andWhere('follow_id', follow_id).update({ status: 2 })
    }
    ctx.body = res
  },
  unFollow: async (ctx) => {
    let body = ctx.request.body
    let { openid, followId } = body
    await mysql.raw('update t_follow set status = 0 where openid = ? and follow_id = ?', [openid, followId]);

    // 更新互相关注的状态
    let res = await mysql("t_follow").where("openid", followId).andWhere('follow_id', openid).andWhere('status', 2).update({ status: 1 })
    if (res){
      await mysql("t_follow").where("openid", openid).andWhere('follow_id', follow_id).update({ status: 2 })
    }
    ctx.body = res
  },
  queryFollow: async (ctx) => {
    let body = ctx.request.body
    let { openid, pageNo, pageSize } = body
    pageNo = pageNo ? pageNo : 1
    pageSize = pageSize ? pageSize : 10
    let offset = (pageNo - 1) * pageSize
    let data = await mysql.raw('select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tf.status,tf.news,tf.c_date FROM t_follow tf LEFT JOIN t_user tur on (tf.follow_id = tur.openid) where tf.status = 1 and tf.openid = ? limit ?,?', [openid, offset, pageSize]);
    ctx.body = data[0];
  },
  queryFans: async (ctx) => {
    let body = ctx.request.body
    let { openid, pageNo, pageSize } = body
    pageNo = pageNo ? pageNo : 1
    pageSize = pageSize ? pageSize : 10
    let offset = (pageNo - 1) * pageSize
    let data = await mysql.raw('select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tf.status,tf.news,tf.c_date FROM t_follow tf LEFT JOIN t_user tur on (tf.openid = tur.openid) where tf.status = 1 and tf.follow_id = ? limit ?,?', [openid, offset, pageSize]);
    ctx.body = data[0];
  },
  queryHeart: async (ctx) => {
    let body = ctx.request.body
    let { openid } = body
    let data = await mysql.raw('select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,th.record_id,th.file_id,th.c_date from t_heart th LEFT JOIN t_user tur on (th.user_id = tur.openid) WHERE th.master_id = ? and th.user_id != ? and th.status = 1 ORDER BY th.c_date desc limit 0,30', [openid, openid]);
    ctx.body = data[0];
  },
  
  // 通知--点赞、评论、关注
  queryNews: async (ctx) => {
    let body = ctx.request.body
    let { openid } = body
    let resHeart = await mysql.raw(`select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,th.record_id,th.file_id,unix_timestamp(th.c_date) as times, th.c_date, 'heart' as type from t_heart th LEFT JOIN t_user tur on (th.user_id = tur.openid) WHERE th.master_id = ? and th.status = 1 and tur.openid != ? ORDER BY th.c_date desc limit 0,30`, [openid, openid]);
    resHeart = resHeart[0]
    let resComment = await mysql.raw(`select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tc.record_id,tc.file_id,tc.content, unix_timestamp(tc.c_date) as times, tc.c_date, 'comment' as type from t_comment tc LEFT JOIN t_user tur on (tc.user_id = tur.openid) WHERE tc.master_id = ? and tc.status = 1 and tur.openid != ? ORDER BY tc.c_date desc limit 0,30`, [openid, openid]);
    resComment = resComment[0]
    let resFans = await mysql.raw(`select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tf.c_date,unix_timestamp(tf.c_date) as times, 'fans' as type FROM t_follow tf LEFT JOIN t_user tur on (tf.openid = tur.openid) where tf.status != 0 and tf.follow_id = ? ORDER BY tf.c_date desc limit 0,30`, openid);
    resFans = resFans[0]
    let data = resHeart.concat(resComment).concat(resFans)
    let minIdx = Math.min(30, data.length)
    data = data.slice(0, minIdx)
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

