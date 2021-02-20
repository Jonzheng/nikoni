const { mysql } = require('../config/db')
const conf = require('../config/conf')
const crypto = require('crypto')
const request = require('../util/request')
const cos = require('../util/qcos')
const fs = require('fs')
const cache = require("../util/redis")

const Region = 'ap-guangzhou'
const BucketAvatar = 'avatar-1256378396'

const uploadAvatar = (filename, filePath) => {
  return new Promise((resolve, reject) =>{
    cos.putObject({
      Bucket: BucketAvatar,
      Region: Region,
      Key: filename,
      Body: filePath,
    }, (err, data) => {
      if (err){
        reject(err)
      }else{
        resolve(data)
      }
    })
  })
}

const getOpenid = (userCode) => {
  // url = 'https://job.xiyanghui.com/api/q1/json'
  let url = conf.loginApi + userCode
  return request({
    url: url,
    method: 'get'
  })
}

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
    let date = new Date()
    let key = `uv_${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`
    await cache.sadd(key, openid, 3600 * 7)
    ctx.body = data;
  },
  getUser: async (ctx) => {
    let body = ctx.request.body
    let { openid, mineId } = body
    openid = openid ? openid : '404'
    let res = await mysql('t_user').select('*').where('openid', openid)
    let heart = await mysql('t_heart').select('user_id').where('master_id', openid).andWhere('status', 1)
    let user = res[0]
    let follow = await mysql('t_follow').select('openid', 'follow_id').whereNot('status', 0).andWhere(function(){this.where('openid', openid).orWhere('follow_id', openid)})
    let follows = follow.filter((item) => {return item.openid == openid})
    let fans = follow.filter((item) => {return item.follow_id == openid})

    user['heartUv'] = [...new Set(heart.map(it=>it.user_id))].length
    user['heartCount'] = heart.length
    user['followCount'] = follows.length
    user['fansCount'] = fans.length
    user['isFollow'] = fans.filter((item) => {return item.openid == mineId}).length > 0
    let date = new Date()
    let key = `uv_${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`
    user.nikoUv = await cache.scard(key)
    ctx.body = user;
  },
  updateUser: async (ctx) => {
    let body = ctx.request.body
    let { openid, nickName, avatarUrl, gender, city, province, country } = body
    let res = await mysql('t_user').select('*').where('openid', openid)
    if(res && res[0] && !res[0].avatar_url){
      await mysql("t_user").where("openid", openid).update({ nick_name: nickName, avatar_url: avatarUrl, gender: gender, city:city, province:province, country:country})
    }
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
  uploadAvatar: async (ctx) => {
    let { openid } = ctx.request.body
    let files = ctx.request.files
    let data = ''
    if (files){
      let file = files['avatar']
      let filename = `${openid}.png`
      let fileStream = fs.createReadStream(file.path);
      let res = await uploadAvatar(filename, fileStream).then(async ret=>{
        if (ret && ret.Location){
          let t = new Date().getTime()
          let avatarUrl = `https://${ret.Location}?t=${t}&imageView2/1/w/120/h/120`
          await mysql("t_user").where("openid", openid).update({ avatar_url: avatarUrl })
          data = avatarUrl
        }
      })
    }
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
    let user = await mysql('t_user').select('nick_name', 'show_name', 'avatar_url').where('auth_name', authName).andWhere('auth_code', authCode).andWhere('status', 2)
    let token = crypto.createHash('md5').update(`${authName}_${authCode}`).digest('hex')
    await mysql("t_auth").where("auth_name", authName).update({ code: token })
    user['token'] = token
    ctx.body = user
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
    let res = await mysql("t_follow").where("openid", followId).andWhere('follow_id', openid).andWhere('status', 1).update({ both: 1 })
    if (res){
      await mysql("t_follow").where("openid", openid).andWhere('follow_id', followId).update({ both: 1 })
    }
    ctx.body = res
  },
  unFollow: async (ctx) => {
    let body = ctx.request.body
    let { openid, followId } = body
    await mysql("t_follow").where("openid", openid).andWhere('follow_id', followId).update({ status: 0, both: 0 })
    // 更新互相关注的状态
    let res = await mysql("t_follow").where("openid", followId).andWhere('follow_id', openid).update({ both: 0 })
    ctx.body = res
  },
  queryFollow: async (ctx) => {
    let body = ctx.request.body
    let { openid, pageNo, pageSize } = body
    pageNo = pageNo ? pageNo : 1
    pageSize = pageSize ? pageSize : 99
    let offset = (pageNo - 1) * pageSize
    let data = await mysql.raw('select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tf.both,tf.news,tf.c_date FROM t_follow tf LEFT JOIN t_user tur on (tf.follow_id = tur.openid) where tf.status != 0 and tf.openid = ? limit ?,?', [openid, offset, pageSize]);
    ctx.body = data[0];
  },
  queryFans: async (ctx) => {
    let body = ctx.request.body
    let { openid, pageNo, pageSize } = body
    pageNo = pageNo ? pageNo : 1
    pageSize = pageSize ? pageSize : 99
    let offset = (pageNo - 1) * pageSize
    let data = await mysql.raw('select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tf.both,tf.news,tf.c_date FROM t_follow tf LEFT JOIN t_user tur on (tf.openid = tur.openid) where tf.status != 0 and tf.follow_id = ? limit ?,?', [openid, offset, pageSize]);
    ctx.body = data[0];
  },
  queryHeart: async (ctx) => {
    let body = ctx.request.body
    let { openid, pageNo, pageSize } = body
    pageNo = pageNo ? pageNo : 1
    pageSize = pageSize ? pageSize : 99
    let offset = (pageNo - 1) * pageSize
    let data = await mysql.raw('select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,th.record_id,th.file_id,th.c_date from t_heart th LEFT JOIN t_user tur on (th.user_id = tur.openid) WHERE th.master_id = ? and th.user_id != ? and th.status = 1 ORDER BY th.c_date desc limit ?,?', [openid, openid, offset, pageSize]);
    ctx.body = data[0];
  },
  
  // 通知--点赞、评论、关注
  queryNews: async (ctx) => {
    let body = ctx.request.body
    let { openid } = body
    let resHeart = await mysql.raw(`select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,th.record_id,th.file_id,unix_timestamp(th.c_date) as times, th.c_date, 'heart' as type from t_heart th LEFT JOIN t_user tur on (th.user_id = tur.openid) WHERE th.master_id = ? and th.status = 1 and tur.openid != ? ORDER BY th.c_date desc limit 0,50`, [openid, openid]);
    resHeart = resHeart[0]
    let resComment = await mysql.raw(`select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tc.record_id,tc.file_id,tc.content, unix_timestamp(tc.c_date) as times, tc.c_date, 'comment' as type from t_comment tc LEFT JOIN t_user tur on (tc.user_id = tur.openid) LEFT JOIN t_comment tc2 on (tc.re_id = tc2.id) WHERE tc.status = 1 and tc.file_id != 'chat' and tc.user_id != ? and (tc.master_id = ? or tc2.user_id = ?) ORDER BY tc.c_date desc limit 0,50`, [openid, openid, openid]);
    resComment = resComment[0]
    let resChat = await mysql.raw(`select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tc.record_id,tc.file_id,tc.content, unix_timestamp(tc.c_date) as times, tc.c_date, 'chat' as type from t_comment tc LEFT JOIN t_user tur on (tc.master_id = tur.openid) WHERE tc.status = 1 and tc.record_id like '%?%' and tc.file_id = ? ORDER BY tc.c_date desc limit 0,50`, [openid, 'chat']);
    resChat = resChat[0]
    let resFans = await mysql.raw(`select tur.openid,tur.nick_name,tur.show_name,tur.motto,tur.avatar_url,tf.c_date,unix_timestamp(tf.c_date) as times, 'fans' as type FROM t_follow tf LEFT JOIN t_user tur on (tf.openid = tur.openid) where tf.status != 0 and tf.follow_id = ? ORDER BY tf.c_date desc limit 0,50`, openid);
    resFans = resFans[0]
    let data = resHeart.concat(resComment).concat(resFans).concat(resChat)
    let minIdx = Math.min(150, data.length)
    data = data.slice(0, minIdx)
    ctx.body = data;
  },
}
