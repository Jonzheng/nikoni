const { mysql } = require('../config/db')
const cos = require('../util/qcos')

const BucketAudio = 'audio-1256378396'
const BucketVideo = 'video-1256378396'
const Region = 'ap-guangzhou'
const PreAudio = 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/'
const PreVideo = 'https://video-1256378396.cos.ap-guangzhou.myqcloud.com/'
const PreImage = 'https://image-1256378396.cos.ap-guangzhou.myqcloud.com/'
const PreAvatar = 'https://avatar-sk-1256378396.cos.ap-nanjing.myqcloud.com/'

const getAudioList = () => {
  return new Promise((resolve, reject) => {
    cos.getBucket({
      Bucket: BucketAudio,
      Region: Region
    }, (err, res) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

const getVideoSize = (fileId) => {
  return new Promise((resolve, reject) => {
    cos.getBucket({
      Bucket: BucketVideo,
      Region: Region,
      Prefix: fileId
    }, (err, data) => {
      if (err) {
        console.log('--getVideoSize srr:\n', err)
        resolve(1)
      } else if(data["Contents"].length > 0) {
        let videoSize = data["Contents"][0].Size
        resolve(videoSize)
      }else{
        console.log('--not found:\n', data)
        resolve(1)
      }
    })
  })
}

exports = module.exports = {
  queryAudio: async (ctx) => {
    let body = ctx.request.body
    let { fileId, pageNo, pageSize } = body
    let data = {}
    if (pageNo && pageSize) {
      let offset = (pageNo - 1) * pageSize
      data = await mysql('t_list').select('*').leftJoin('t_audio', 't_list.file_id', 't_audio.file_id').limit(pageSize).offset(offset)
    } else if(fileId) {
      data = await mysql('t_list').select('*').leftJoin('t_audio', 't_list.file_id', 't_audio.file_id').where('t_list.file_id', fileId)
    } else {
      let res = await getAudioList()
      let fileIds = res["Contents"].map(item => { return item.Key.split('.')[0] })
      let audio = await (await mysql('t_audio').select('file_id')).map(item =>{ return item.file_id })
      fileIds = fileIds.filter(item => !audio.includes(item))
      data = { fileIds }
    }
    ctx.body = data
  },
  publishAudio: async (ctx) => {
    let body = ctx.request.body
    let { fileId, title, serifu, koner, roma, cv, stars, shadow, audioType } = body
    let cName = title.split('_')[0]
    let flst = fileId.split("_") //["ssr", "xtz", "0", "1"]
    let level = flst[0]
    let sName = flst[1]
    let ski = flst[2]
    let ver = flst[3]
    let cate = "y"

    let avatar = `${PreAvatar}${level}_${sName}.png`
    let srcImage = `${PreImage}${level}_${sName}_0.png`
    let srcAudio = `${PreAudio}${fileId}${audioType}`
    let srcVideo = `${PreVideo}${fileId}.mp4`

    let videoSize = await getVideoSize(fileId)
    // videoSize = 1
    await mysql('t_list').insert({
      file_id: fileId,
      src_video: srcVideo,
      video_size: videoSize,
      s_name: sName,
      title: title,
      serifu: serifu,
      stars: stars,
      koner: koner,
      roma: roma,
      src_image: srcImage,
      level: level,
      cate: cate,
      status: 1
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
      status: 1
    })
    ctx.body = body
  },
  queryDict: async (ctx) => {
    let data = await mysql('t_dict').select('*')
    ctx.body = data
  },
  saveDict: async (ctx) => {
    let body = ctx.request.body
    let { kk, vv } = body
    let res = await mysql('t_dict').insert({
      kk: kk,
      vv: vv,
    })
    ctx.body = res
  }
}
