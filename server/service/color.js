const { mysql } = require('../config/db')

exports = module.exports = {
  updateColor: async (ctx) => {
    let body = ctx.request.body
    let { openid, hira, kata, space } = body
    let data = []
    if (openid){
      await mysql.raw('update t_link_rank set hira = ?, kata=?, space=? where openid = ?', [hira,kata,space,openid]);
    }
    ctx.body = data
  },
  buyColor: async (ctx) => {
    let body = ctx.request.body
    let { openid, balance, color } = body
    let data = []
    if (openid){
      await mysql.raw('update t_link_rank set coin = ?, myco=concat(myco,",",?) where openid = ?', [balance,color,openid]);
      data = await mysql('t_link_rank').select('*').where('openid', openid)
    }
    ctx.body = data
  },
}