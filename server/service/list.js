const { mysql } = require('../config/db')

exports = module.exports = {
  queryList: async (ctx) => {
    let body = ctx.request.body
    let { fileId, pageNo, pageSize, title, level } = body
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
}