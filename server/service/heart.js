const { mysql } = require('../config/db')

const Levels = [{'uv': 0, 'pv': -1}, {'uv': 1, 'pv': 1}, {'uv': 4, 'pv': 15}, {'uv': 9, 'pv': 53}, {'uv': 16, 'pv': 127}, {'uv': 25, 'pv': 249}, {'uv': 36, 'pv': 431}, {'uv': 49, 'pv': 685}, {'uv': 64, 'pv': 1023}, {'uv': 81, 'pv': 1457}]

const getCvLevel = (uv, pv) =>{
  let cv = 0
  for (let [idx, it] of Levels.entries()){
    if (uv >= it.uv && pv >= it.pv) cv = idx
  }
  return cv
}

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
    // 更新cvLevel
    let heart = await mysql('t_heart').select('user_id').where('master_id', masterId).andWhere('status', 1)
    let uv = [...new Set(heart.map(it=>it.user_id))].length
    let pv = heart.length
    let cv = getCvLevel(uv, pv)
    await mysql("t_user").where("openid", masterId).update({ cv: cv })
    ctx.body = count
  },
  cancelHeart: async (ctx) => {
    let body = ctx.request.body
    let { recordId, userId, masterId } = body
    let count = await mysql("t_heart").where("record_id", recordId).andWhere("user_id", userId).andWhere("status", 1).update({ status: 0 })
    if(count > 0){
      await mysql("t_record").where("record_id", recordId).decrement({ heart: 1 })
    }
    // 更新cvLevel
    let heart = await mysql('t_heart').select('user_id').where('master_id', masterId).andWhere('status', 1)
    let uv = [...new Set(heart.map(it=>it.user_id))].length
    let pv = heart.length
    let cv = getCvLevel(uv, pv)
    await mysql("t_user").where("openid", masterId).update({ cv: cv })
    ctx.body = count
  },

}