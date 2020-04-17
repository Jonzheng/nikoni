const { mysql } = require('../config/db')

exports = module.exports = {
  updateColor: async (ctx) => {
    let body = ctx.request.body
    let openid = body.openid
    let hira = body.hira
    let kata = body.kata
    let space = body.space
    let data = []
    if (openid){
      await mysql.raw('update t_link_rank set hira = ?, kata=?, space=? where openid = ?', [hira,kata,space,openid]);
    }
    ctx.data = data
  },
  buyColor: async (ctx) => {
    let body = ctx.request.body
    let openid = body.openid
    let balance = body.balance
    let color = body.color
    let data = []
    if (openid){
      await mysql.raw('update t_link_rank set coin = ?, myco=concat(myco,",",?) where openid = ?', [balance,color,openid]);
      data = await mysql('t_link_rank').select('*').where('openid', openid)
    }
    ctx.data = data
  },
}