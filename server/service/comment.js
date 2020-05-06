const { mysql } = require('../config/db')

exports = module.exports = {
  queryComment: async (ctx) => {
    let body = ctx.request.body
    let { recordId, userId } = body
    let data = await mysql.raw('select t_cm.*,t_ur.show_name,t_ur.nick_name,t_ur.avatar_url,tz.user_id as zid from t_comment t_cm inner join t_user t_ur on (t_cm.user_id = t_ur.openid) left join t_zan tz on (t_cm.id=tz.comm_id and tz.status=1 and tz.user_id = ?) where t_cm.record_id = ? order by t_cm.c_date desc', [userId, recordId])
    ctx.body = data
  },
  saveComment: async (ctx) => {
    let body = ctx.request.body
    let { recordId, userId, fileId, masterId, content, reId, reName, reContent } = body
    reId = reId ? reId : ''
    reName = reName ? reName : ''
    reContent = reContent ?  reContent : ''
    let id = fileId + new Date().getTime()
    await mysql.raw('insert t_comment (id,record_id,user_id,file_id,master_id,content,re_id,re_name,re_content) values(?,?,?,?,?,?,?,?,?)on duplicate key update status = 1', [id, recordId, userId, fileId, masterId,content,reId,reName,reContent]);
    await mysql.raw('update t_record set comm = comm+1 where record_id = ?', recordId);

    let data = await mysql.raw('select t_cm.*,t_ur.show_name,t_ur.nick_name,t_ur.avatar_url,tz.user_id as zid from t_comment t_cm inner join t_user t_ur on (t_cm.user_id = t_ur.openid) left join t_zan tz on (t_cm.id=tz.comm_id and tz.status=1 and tz.user_id = ?) where t_cm.record_id = ? order by t_cm.c_date desc', [userId, recordId])
    ctx.body = data
  },
  deleteComment: async (ctx) => {
    let body = ctx.request.body
    let { recordId, commId, userId } = body

    await mysql.raw('delete from t_comment where id = ? and user_id = ?', [commId, userId]);
    await mysql.raw('update t_record set comm = comm-1 where record_id = ?', recordId);

    let data = await mysql.raw('select t_cm.*,t_ur.show_name,t_ur.nick_name,t_ur.avatar_url,tz.user_id as zid from t_comment t_cm inner join t_user t_ur on (t_cm.user_id = t_ur.openid) left join t_zan tz on (t_cm.id=tz.comm_id and tz.status=1 and tz.user_id = ?) where t_cm.record_id = ? order by t_cm.c_date desc', [userId, recordId])
    ctx.body = data
  },
}