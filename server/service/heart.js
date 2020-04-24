const { mysql } = require('../config/db')

exports = module.exports = {
  updateHeart: async (ctx) => {
    let body = ctx.request.body
    let {recordId, userId, fileId, masterId } = body
    await mysql.raw('insert t_heart (record_id,user_id,file_id,master_id) values(?,?,?,?)on duplicate key update status = 1', [recordId, userId, fileId, masterId]);
    await mysql.raw('update t_record set heart = heart+1 where record_id = ?', recordId);
    ctx.body = 200
  },
  cancelHeart: async (ctx) => {
    let body = ctx.request.body
    let {recordId, userId } = body
    await mysql.raw('update t_heart set status = 0 where record_id = ? and user_id = ?', [recordId, userId]);
    await mysql.raw('update t_record set heart = heart-1 where record_id = ?', recordId);
    ctx.body = 200
  },

}