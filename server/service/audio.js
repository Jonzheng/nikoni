const { mysql } = require('../config/db')
const Bucket = 'audio-1256378396'
const Region = 'ap-guangzhou'

exports = module.exports = {
  queryAudio: async (ctx) => {
    let body = ctx.request.body
    let fileId = body.fileId
    let data = []
    if (fileId){
      let list = await mysql('t_list').select('*').andWhere('file_id', fileId)
      let audio = await mysql('t_audio').select('*').andWhere('file_id', fileId)
      data = {"list":list,"audio":audio}
    }else{
      let params = {
        Bucket: Bucket,
        Region: Region
      }
      let lst = []
      function list() {
        return new Promise((resolve) => {
          cos.getBucket(params, function (err, data) {
            if (err) {
              console.log(err)
            } else {
              console.log(data)
              lst = data
            }
            resolve()
          })
        })
      }
  
      await list()
      let content = lst["Contents"]
      let audio = await mysql('t_audio').select('*')
      data = {"content":content, "audio":audio}
    }

    ctx.data = data
  },
}