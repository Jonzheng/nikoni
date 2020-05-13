const { mysql } = require('../config/db')

exports = module.exports = {
  queryRecord: async (ctx) => {
    let body = ctx.request.body
    let { masterId, admin } = body
    let data = []
    if (masterId){
        let res = await mysql.raw('select th.user_id heart_ud, tre.*, tli.serifu, tli.title from t_record tre LEFT JOIN t_list tli on tre.file_id = tli.file_id LEFT JOIN t_heart th on tre.record_id = th.record_id where tre.master_id = ?',[masterId])
        data = res[0]
    }else if(admin == 'admini'){
      let res = await mysql.raw('select th.user_id heart_ud, tre.*, tli.serifu, tli.title from t_record tre LEFT JOIN t_list tli on tre.file_id = tli.file_id LEFT JOIN t_heart th on tre.record_id = th.record_id')
      data = res[0]
    }
    ctx.body = data
  },
  saveRecord: async (ctx) => {
    let body = ctx.request.body
    let { recordId, fileId, srcRecord, masterId } = body
    await mysql('t_record').insert({
      record_id: recordId,
      file_id: fileId,
      master_id: masterId,
      src_record: srcRecord
    })
    let data = await mysql('t_record').select('*').where('record_id', recordId)
    ctx.body = data
  },
  updateRecord: async (ctx) => {
    let body = ctx.request.body
    let { recordId, status } = body
    let data = await mysql("t_record").where("record_id", recordId).update({ status: status})
    ctx.body = data
  },
  // 前端直接传cos
  uploadRecord: async (ctx) => {
    let body = ctx.request.body
    let { recordId, status } = body
    let data = await mysql("t_record").where("record_id", recordId).update({ status: status})
    ctx.body = data
  },
  deleteRecord: async (ctx) => {
    let body = ctx.request.body
    let { recordId, masterId } = body
    await mysql("t_record").where("record_id", recordId).andWhere('master_id', masterId).delete()
    ctx.body = 200
  }
}