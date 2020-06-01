const { mysql } = require('../config/db')
const { cos } = require('../util/qcos')

const BucketAudio = 'audio-1256378396'
const BucketVideo = 'video-1256378396'
const Region = 'ap-guangzhou'
const PreAudio = 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/'
const SufAudio = '.mp3'
const PreVideo = 'https://video-1256378396.cos.ap-guangzhou.myqcloud.com/'
const SufVideo = '.mp4'
const PreImage = 'https://image-1256378396.cos.ap-guangzhou.myqcloud.com/'
const PreAvatar = 'https://avatar-sk-1256378396.cos.ap-nanjing.myqcloud.com/'

exports = module.exports = {
  queryAudio: async (ctx) => {
    let body = ctx.request.body
    let fileId = body.fileId
    let data = []
    if (fileId) {
      let list = await mysql('t_list').select('*').andWhere('file_id', fileId)
      let audio = await mysql('t_audio').select('*').andWhere('file_id', fileId)
      data = { list, audio }
    } else {
      let params = {
        Bucket: BucketAudio,
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
      data = { content, audio }
    }

    ctx.body = data
  },
  publishAudio: async (ctx) => {
    let body = ctx.request.body
    let { fileId, title, serifu, koner, roma, cv, stars, shadow } = body
    let cName = title.split('_')[0]
    let flst = fileId.split("_") //["ssr", "xtz", "0", "1"]
    let level = flst[0]
    let sName = flst[1]
    let ski = flst[2]
    let ver = flst[3]
    let cate = "y"

    let avatar = `${PreAvatar}_${level}_${sName}.png`
    let srcImage = `${PreImage}_${level}_${sName}_0.png`
    let srcAudio = `${PreAudio}${fileId}.mp3`
    let srcVideo = `${PreVideo}${fileId}.mp4`

    //获得视频文件大小
    let paramsGet = {
      Bucket: BucketVideo,
      Region: Region,
      Prefix: fileId
    }
    let videoSize = 0
    function getVideoSize(paramsGet) {
      return new Promise((resolve, reject) => {
        cos.getBucket(paramsGet, function (err, data) {
          if (err) {
            console.log(err)
          } else {
            if (data["Contents"].length > 0) videoSize = data["Contents"][0].Size
          }
          resolve()
        })
      })
    }
    await getVideoSize(paramsGet)
    //await 在async修饰的函数下,必须是Promise才有效果

    await mysql('t_list').insert({
      file_id: fileId,
      src_video: srcVideo,
      video_size: videoSize,
      title: title,
      serifu: serifu,
      stars: stars,
      koner: koner,
      roma: roma,
      src_image: srcImage,
      level: level,
      cate: cate,
      status: 3
    })

    await mysql('t_audio').insert({
      file_id: fileId,
      src_audio: srcAudio,
      c_name: cName,
      avatar: avatar,
      cv: cv,
      s_name: sName,
      shadow: shadow,
      level: level,
      ski: ski,
      ver: ver,
      cate: cate,
      status: 3
    })
    ctx.body = body
  }
}