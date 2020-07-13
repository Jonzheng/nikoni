const { mysql } = require('../config/db')

exports = module.exports = {
  queryRecord: async (ctx) => {
    let body = ctx.request.body
    let { masterId, admin, openid, fileId } = body
    let data = []
    if (masterId && openid){ // 个人页、他人页
        let res = await mysql.raw('select th.user_id heart_ud, tre.*, tli.serifu, tli.title from t_record tre LEFT JOIN t_list tli on tre.file_id = tli.file_id LEFT JOIN t_heart th on tre.record_id = th.record_id and th.status = 1 and th.user_id = ? where tre.master_id = ? ORDER BY tre.status desc,tre.c_date desc',[openid,masterId])
        data = res[0]
    }else if(fileId && openid){ // 详情页
      let res = await mysql.raw('select th.user_id heart_ud,t_re.*,t_ur.nick_name,t_ur.show_name,t_ur.avatar_url,t_ur.openid from t_record t_re inner join t_user t_ur on (t_re.master_id = t_ur.openid) left join t_heart th on (th.record_id = t_re.record_id and th.status = 1 and th.user_id = ?) where t_re.file_id = ? and t_re.status = 1 order by t_re.c_date desc', [openid, fileId])
      data = res[0]
    }else if(openid){ // 查询全部-以后再分页-小程序
      let res = await mysql.raw('select th.user_id heart_ud,t_re.*, tli.serifu, tli.title,t_ur.nick_name,t_ur.show_name,t_ur.avatar_url,t_ur.openid from t_record t_re LEFT JOIN t_list tli on t_re.file_id = tli.file_id inner join t_user t_ur on (t_re.master_id = t_ur.openid) left join t_heart th on (th.record_id = t_re.record_id and th.status = 1 and th.user_id = ?) where t_re.status = 1 order by t_re.c_date desc', [openid])
      data = res[0]
    }else if(admin == 'admini' && masterId){ // 小程序无引用
      let res = await mysql.raw('select th.user_id heart_ud, tre.*, tli.serifu, tli.title from t_record tre LEFT JOIN t_list tli on tre.file_id = tli.file_id LEFT JOIN t_heart th on tre.record_id = th.record_id and th.status = 1 and th.user_id = ? ORDER BY tre.c_date desc',[masterId])
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
    // await mysql("t_follow").where("openid", masterId).orWhere("follow_id", masterId).increment({ news: 1 })
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
    await mysql("t_heart").where("record_id", recordId).delete()
    ctx.body = 200
  }
}