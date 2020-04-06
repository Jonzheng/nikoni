const { mysql } = require('../config/db')

exports = module.exports = {
  updateRecord: async (ctx) => {
    let body = ctx.request.body
    let record_id = body.record_id
    let status = body.status
    let data = await mysql("t_record").where("record_id", record_id).update({ status: status})
    ctx.data = data
  },
}