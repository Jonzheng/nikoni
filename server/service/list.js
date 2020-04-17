const { mysql } = require('../config/db')

exports = module.exports = {
  queryList: async (ctx) => {
    let body = ctx.request.body
    let fileId = body.fileId
    let pageNo = body.pageNo
    let pageSize = body.pageSize
    let title = body.title
    let level = body.level
    let data = []
    if (fileId != undefined){
      data = await mysql('t_list').select('*').where('file_id', fileId)
    }else if (pageNo != undefined){
      var offset = (pageNo - 1) * pageSize
      var liket = '%'+title+'%'
      if (level) {
        data = await mysql('t_list').select('*').where('title', 'like', liket).andWhere('level', level).orderBy('stars', 'desc').limit(pageSize).offset(offset)
        var res = await mysql('t_list').count('file_id as total').where('title', 'like', liket).andWhere('level', level)
        t_list.push({total: res[0]['total']})
      }else{
        data = await mysql('t_list').select('*').where('title', 'like', liket).orderBy('stars', 'desc').limit(pageSize).offset(offset)
        var res = await mysql('t_list').count('file_id as total').where('title', 'like', liket)
        t_list.push({total: res[0]['total']})
      }
    }else{
      data = await mysql('t_list').select('*').where('status', 1).orderBy('stars', 'desc')
    }
    ctx.data = data
  },
}