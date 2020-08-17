const { mysql } = require('../config/db')

exports = module.exports = {
  queryList: async (ctx) => {
    let body = ctx.request.body
    let { fileId, pageNo, pageSize, title, level } = body
    title = title ? title : ''
    pageNo = pageNo ? pageNo : 1
    pageSize = pageSize ? pageSize : 10
    let list = []
    let total = 0
    if (fileId != undefined){
      list = await mysql('t_list').select('*').where('file_id', fileId)
    }else if (pageNo != undefined){
      let offset = (pageNo - 1) * pageSize
      let liket = '%'+title+'%'
      if (level) {
        list = await mysql('t_list').select('*').where('title', 'like', liket).andWhere('level', level).orderBy('stars', 'desc').limit(pageSize).offset(offset)
        let res = await mysql('t_list').count('file_id as total').where('title', 'like', liket).andWhere('level', level)
        total = res[0]['total']
      }else{
        list = await mysql('t_list').select('*').where('title', 'like', liket).orderBy('stars', 'desc').limit(pageSize).offset(offset)
        let res = await mysql('t_list').count('file_id as total').where('title', 'like', liket)
        total = res[0]['total']
      }
    }else{
      list = await mysql('t_list').select('*').where('status', 1).orderBy('stars', 'desc')
    }
    ctx.body = { list, total }
  },
  queryListMerge: async (ctx) => {
    let body = ctx.request.body
    let { pageNo, pageSize, title, level } = body
    title = title ? title : ''
    pageNo = pageNo ? pageNo : 1
    pageSize = pageSize ? pageSize : 20
    let list = []
    let total = 0
    let names = []
    let offset = (pageNo - 1) * pageSize
    if (level) {
      let res = await mysql.raw('select s_name,round(SUM(stars) / count(s_name)) as aver ,count(s_name) as total from `t_list` WHERE `level` = ? GROUP BY s_name ORDER BY aver desc LIMIT ?, ?', [level,offset,pageSize]);
      names = res[0].map( item => item.s_name)
      // let nameStr = names.map(item => '\''+item+'\'')
      // let orderStr = names.length>0 ? `FIELD(s_name, ${nameStr})` : '1'
      list = await mysql('t_list').select('*').whereIn('s_name', names).andWhere('level', level) //.orderByRaw(orderStr)
      res = await mysql.raw('select s_name from t_list WHERE `level` = ? GROUP BY s_name;', [level])
      total = res[0].length
    }
    ctx.body = { list, total, names }
  },
}