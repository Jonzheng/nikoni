const appId = 'wx2ce3e7794b9393b8'
const appSecret = '258ce2e03d8dd6f330d6d6f3423411da'

module.exports = {
    port: 4000,
    bucket: 'image-1256378396',
    region: 'ap-guangzhou',

    loginApi: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&grant_type=authorization_code&js_code=`,
    tokenApi: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
    
    cos: {
        region: 'ap-guangzhou',
        fileBucket: 'omoz',
        uploadFolder: 'upload'
    },
    
}
