const { mysql } = require('../config/db')

exports = module.exports = {
  updateHeart: async (ctx) => {
    let body = ctx.request.body
    let { recordId, userId, fileId, masterId } = body
    let res = await mysql("t_heart").select('record_id').where("record_id", recordId).andWhere("user_id", userId)
    let count = 0
    if (res.length == 1){
      count = await mysql("t_heart").where("record_id", recordId).andWhere("user_id", userId).andWhere("status", 0).update({ status: 1, c_date: new Date()})
    }else{
      await mysql('t_heart').insert({'record_id':recordId, 'user_id':userId, 'file_id':fileId, 'master_id':masterId})
      count = 1
    }
    if (count > 0){
      await mysql("t_record").where("record_id", recordId).increment({ heart: 1 })
      if(userId != masterId){
        await mysql("t_user").where("openid", masterId).increment({ news: 1 })
      }
    }
    ctx.body = count
  },
  cancelHeart: async (ctx) => {
    let body = ctx.request.body
    let { recordId, userId } = body
    let count = await mysql("t_heart").where("record_id", recordId).andWhere("user_id", userId).andWhere("status", 1).update({ status: 0 })
    if(count > 0){
      await mysql("t_record").where("record_id", recordId).decrement({ heart: 1 })
    }
    ctx.body = count
  },

}