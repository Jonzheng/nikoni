const { mysql } = require('../config/db')

exports = module.exports = {
  updateHeart: async (ctx) => {
    let body = ctx.request.body
    let record_id = body.record_id
    let user_id = body.user_id
    let file_id = body.file_id
    let master_id = body.master_id
    data = await mysql.raw('insert t_heart (record_id,user_id,file_id,master_id) values(?,?,?,?)on duplicate key update status = 1', [record_id, user_id, file_id, master_id]);
    data = await mysql.raw('update t_record set heart = heart+1 where record_id = ?', record_id);
    ctx.data = data
  },
  cancelHeart: async (ctx) => {
    let body = ctx.request.body
    let record_id = body.record_id
    let user_id = body.user_id
    data = await mysql.raw('update t_heart set status = 0 where record_id = ? and user_id = ?', [record_id, user_id]);
    data = await mysql.raw('update t_record set heart = heart-1 where record_id = ?', record_id);
    ctx.data = data
  },

}