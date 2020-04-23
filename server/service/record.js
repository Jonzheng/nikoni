const { mysql } = require('../config/db')

exports = module.exports = {
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
}