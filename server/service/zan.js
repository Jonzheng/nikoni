const { mysql } = require('../config/db')

exports = module.exports = {
  updateZan: async (ctx) => {
    let body = ctx.request.body
    let { commId, userId } = body
    await mysql.raw('insert t_zan (comm_id, user_id) values(?,?)on duplicate key update status = 1', [commId, userId]);
    await mysql.raw('update t_comment set stars = stars+1 where id = ?', commId);
    ctx.body = 200
  },
  cancelZan: async (ctx) => {
    let body = ctx.request.body
    let { commId, userId } = body
    await mysql.raw('update t_zan set status = 0 where comm_id = ? and user_id = ?', [commId, userId]);
    await mysql.raw('update t_comment set stars = stars-1 where id = ?', commId);
    ctx.body = 200
  },
}