const { mysql } = require('../config/db')

exports = module.exports = {
  queryRank: async (ctx) => {
    let body = ctx.request.body
    let openid = body.openid
    let data = []
    if (openid){
        data = await mysql('t_link_rank').select('*').where('openid', openid)
    }else{
        data = await mysql('t_link_rank').select('*').where('round','>', 0).orderBy('total_coin', 'desc').leftJoin('t_user', 't_link_rank.openid', 't_user.openid')
    }
    ctx.data = data
  },
  checkRank: async (ctx) => {
    let body = ctx.request.body
    let openid = body.openid
    let check_coin = body.check_coin
    let ran = body.ran
    let old_coin = 0
    let result = []
    if (openid){
      await mysql.raw('update t_link_rank set latest=now() where openid = ?', [openid]);
      if (check_coin > 0){ //签到
        await mysql.raw('update t_link_rank set check_coin=check_coin+?,total_coin=total_coin+?,ran=?, s_date=now() where openid = ?', [check_coin,check_coin,ran, openid]);
      }

      result = await mysql('t_link_rank').select('*').where('openid', openid)
      if (result.length == 1){
        let t_rank = result[0]
        old_coin = t_rank.check_coin
        if (old_coin > 0){
          await mysql.raw('update t_link_rank set coin = coin+?,check_coin=0 where openid = ?', [old_coin, openid]);
          result = await mysql('t_link_rank').select('*').where('openid', openid)
        }
        result[0]["old_coin"] = old_coin
      }else if(result.length == 0){
        await mysql.raw('insert t_link_rank (openid,point,s_date) values(?,?,date_sub(now(), interval -1 day))', [openid, 0])
        result = await mysql('t_link_rank').select('*').where('openid', openid)
        result[0]["old_coin"] = old_coin
      }
    }
    ctx.data = result
  },
  saveRank: async (ctx) => {
    let body = ctx.request.body
    let openid = body.openid
    let point = body.point
    let status = body.status
    //例:puz = 'ka,na,tsu,a'
    let puz = body.puz
    let check_coin = body.check_coin

    let puz_map = {}
    let pn_sp = puz.split(",")

    let result = await mysql('t_link_rank').select('*').where('openid', openid)
    if (result && result.length > 0){
      let rank = result[0]
      let re_point = rank.point
      point = point > re_point ? point:re_point
      let re_puz = rank.puz
      if (re_puz != ""){ // puz已经有记录,例:puz = 'ra,6;ka,12;na,3;ta,10;tsu,2;'
        let puz_sp = re_puz.split(";")
        for (let sp of puz_sp){
          if (sp == "") continue
          let sps = sp.split(",")
          let spk = sps[0]
          let spv = sps[1]
          puz_map[spk] = spv
        }
      }
    }
    for (let p of pn_sp){
      let pnum = puz_map[p]
      pnum = pnum ? parseInt(pnum) + 1 : 1
      puz_map[p] = pnum
    }
    // puz_map -> puz
    puz = ""
    for (let k in puz_map){
      if (k == "") continue
      let pu = k + "," + puz_map[k] + ";"
      puz += pu
    }

    // let ss = mysql.raw('insert t_link_rank (openid,point,puz,check_coin,status,latest) values(?,?,?,?,?,now())on duplicate key update point=?,puz=?,check_coin=check_coin+?,round=round+1,status=?,latest=now()', [openid,point,puz,check_coin,status, point,puz,check_coin,status]).toString()
    
    await mysql.raw('insert t_link_rank (openid,point,puz,check_coin,status,s_date,latest) values(?,?,?,?,?,date_sub(now(), interval -1 day),now())on duplicate key update point=?,puz=?,check_coin=check_coin+?,total_coin=total_coin+?,round=round+1,status=?,latest=now()', [openid,point,puz,check_coin,status, point,puz,check_coin,check_coin,status])
    let data = await mysql('t_link_rank').select('*').where('openid', openid)
    ctx.data = data
  },
}