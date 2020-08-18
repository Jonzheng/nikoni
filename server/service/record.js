const { mysql } = require('../config/db')
const cache = require("../util/redis")

const sortRecords = (recordes, pageSize = 30) =>{
  let showIdxs = []
  let sortedRecords = []
  while (recordes.length - showIdxs.length > 0) {
    let pageList = []
    let max = 2
    while (recordes.length > showIdxs.length && pageList.length < pageSize){
      for (let [i, v] of recordes.entries()) {
        if (showIdxs.includes(i)) continue;
        if (pageList.filter(it => it.master_id == v.master_id).length < max && pageList.length < pageSize){
          pageList.push(v)
          showIdxs.push(i)
        }
      }
      max += 1
    } // while end
    sortedRecords = sortedRecords.concat(pageList)
  }
  return sortedRecords
}

exports = module.exports = {
  queryRecord: async (ctx) => {
    let body = ctx.request.body
    let { masterId, admin, openid, fileId, pageNo, pageSize, recordIds, mine } = body
    let data = []
    if (masterId && openid){ // 个人页、他人页
      data = {}
      pageNo = pageNo ? pageNo : 1
      pageSize = pageSize ? pageSize : 20
      let offset = (pageNo - 1) * pageSize
      let res = {}
      if (mine == 1){
        res = await mysql('t_record').count('record_id as total').where('master_id', masterId)
      } else {
        res = await mysql('t_record').count('record_id as total').where('master_id', masterId).andWhere('status', 1)
      }
      let total = res[0]['total']
      data['total'] = total

      res = await mysql.raw('select th.user_id heart_ud, tre.*, tli.serifu, tli.title from t_record tre LEFT JOIN t_list tli on tre.file_id = tli.file_id LEFT JOIN t_heart th on tre.record_id = th.record_id and th.status = 1 and th.user_id = ? where tre.master_id = ? ORDER BY tre.status desc,tre.c_date desc limit ?,?',[openid, masterId, offset, pageSize])
      let records = res[0]
      for (let red of records){
        if (red.comm > 0) {
          let commKey = `comm_${red.record_id}`
          red.comments = JSON.parse(await cache.get(commKey))
        }
      }
      data['records'] = records

    }else if(fileId && openid){ // 详情页
      let res = await mysql.raw('select th.user_id heart_ud,t_re.*,t_ur.nick_name,t_ur.show_name,t_ur.avatar_url,t_ur.openid,t_ur.cv from t_record t_re inner join t_user t_ur on (t_re.master_id = t_ur.openid) left join t_heart th on (th.record_id = t_re.record_id and th.status = 1 and th.user_id = ?) where t_re.file_id = ? and t_re.status = 1 order by t_re.c_date desc', [openid, fileId])
      data = res[0]
    }else if (openid && recordIds){ // 单点更新
      let reds = recordIds.split(',')
      let res = await mysql('t_record').select('*').whereIn('t_record.record_id', reds)
      let heart = await mysql('t_heart').select('*').whereIn('t_heart.record_id', reds).andWhere('status', 1).andWhere('user_id', openid)
      for (let val of res){
        val.heart_ud = heart.filter(it=>it.record_id == val.record_id).length == 1
      }
      data = res
    } else if(openid){ // 查询全部-以后再分页-小程序
      data = {}
      pageNo = pageNo ? pageNo : 1
      pageSize = pageSize ? pageSize : 20
      let idx = (pageNo - 1) * pageSize
      // let records = await cache.get('records')
      // let reCount = await cache.get('reCount') || 0
      // if(records && reCount < 10){
      //   reCount += 1
      //   records = JSON.parse(records)
      //   data['records'] = records.slice(idx, idx + pageSize)
      // } else {
      // }
      // await cache.set('records', res[0])
      let res = await mysql('t_record').count('record_id as total').where('status','>', 0)
      let total = res[0]['total']
      data['total'] = total
      res = await mysql.raw('select th.user_id heart_ud,t_re.*, tli.serifu, tli.title,t_ur.nick_name,t_ur.show_name,t_ur.avatar_url,t_ur.openid,t_ur.cv from t_record t_re LEFT JOIN t_list tli on t_re.file_id = tli.file_id inner join t_user t_ur on (t_re.master_id = t_ur.openid) left join t_heart th on (th.record_id = t_re.record_id and th.status = 1 and th.user_id = ?) where t_re.status = 1 order by t_re.c_date desc', [openid])
      let allRecords = sortRecords(res[0])
      let records = allRecords.slice(idx, idx + pageSize)
      for (let red of records){
        if (red.comm > 0) {
          let commKey = `comm_${red.record_id}`
          red.comments = JSON.parse(await cache.get(commKey))
        }
      }
      data['records'] = records
      let avatars = []
      for (let record of allRecords){
        let avatar = record.avatar_url || ''
        if (avatars.filter(it => it.url == avatar).length == 0){
          avatars.push({ url: avatar, openid: record.openid, cv: record.cv })
        }
      }
      data['avatars'] = avatars
    }else if(admin == 'admini' && masterId){ // 小程序无引用
      let res = await mysql.raw('select th.user_id heart_ud, tre.*, tli.serifu, tli.title from t_record tre LEFT JOIN t_list tli on tre.file_id = tli.file_id LEFT JOIN t_heart th on tre.record_id = th.record_id and th.status = 1 and th.user_id = ? ORDER BY tre.c_date desc',[masterId])
      data = res[0].slice(idx, idx + pageSize)
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
