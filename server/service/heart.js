const { mysql } = require('../config/db')

exports = module.exports = {
  updateHeart: async (ctx) => {
    let body = ctx.request.body
    let { recordId, userId, fileId, masterId } = body
    let res = await mysql('t_heart').insert({'record_id':recordId, 'user_id':userId, 'file_id':fileId, 'master_id':masterId})
    // console.log(res)
    // let res = await mysql.raw('insert t_heart (record_id,user_id,file_id,master_id) values(?,?,?,?)on duplicate key update status = 1', [recordId, userId, fileId, masterId])
    console.log("==========res=====")
    console.log(res)
    console.log("==========res=====")
    await mysql("t_record").where("record_id", recordId).increment({ heart: 1 })
    if(userId != masterId){
      await mysql("t_user").where("openid", masterId).increment({ news: 1 })
    }
    ctx.body = 200
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