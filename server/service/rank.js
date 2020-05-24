const { mysql } = require('../config/db')

exports = module.exports = {
  queryRank: async (ctx) => {
    let body = ctx.request.body
    let { openid, pageNo, pageSize } = body
    pageNo = pageNo ? pageNo : 1
    pageSize = pageSize ? pageSize : 10
    let offset = (pageNo - 1) * pageSize
    let data = {}
    if (openid){
      data = await mysql('t_link_rank').select('*').where('openid', openid)
      data = data[0]
    }else{
      let ranks = await mysql('t_link_rank').select('*').where('round','>', 0).orderBy('total_coin', 'desc').leftJoin('t_user', 't_link_rank.openid', 't_user.openid').limit(pageSize).offset(offset)
      let res = await mysql('t_link_rank').count('file_id as total').where('round','>', 0)
      let total = res[0]
      data['ranks'] = ranks
      data['total'] = total
    }
    ctx.body = data
  },
  checkRank: async (ctx) => {
    let body = ctx.request.body
    let { openid, checkCoin, ran } = body
    let oldCoin = 0
    let res = []
    if (openid){
      await mysql.raw('update t_link_rank set latest=now() where openid = ?', [openid]);
      if (checkCoin > 0){ //签到
        await mysql.raw('update t_link_rank set check_coin=check_coin+?,total_coin=total_coin+?,ran=?, s_date=now() where openid = ?', [checkCoin,checkCoin,ran, openid]);
      }

      res = await mysql('t_link_rank').select('*').where('openid', openid)
      if (res.length == 1){
        let rank = res[0]
        oldCoin = rank.check_coin
        if (oldCoin > 0){
          await mysql.raw('update t_link_rank set coin = coin+?,check_coin=0 where openid = ?', [oldCoin, openid]);
          res = await mysql('t_link_rank').select('*').where('openid', openid)
        }
        res[0]["oldCoin"] = oldCoin
      }else if(res.length == 0){
        await mysql.raw('insert t_link_rank (openid,point,s_date) values(?,?,date_sub(now(), interval -1 day))', [openid, 0])
        res = await mysql('t_link_rank').select('*').where('openid', openid)
        res[0]["oldCoin"] = oldCoin
      }
    }
    ctx.body = res
  },
  saveRank: async (ctx) => {
    let body = ctx.request.body
    let { openid, point, status, checkCoin, puz } = body
    //例:puz = 'ka,na,tsu,a'
    let puzMap = {}
    let pnSp = puz.split(",")

    let result = await mysql('t_link_rank').select('*').where('openid', openid)
    if (result && result.length > 0){
      let rank = result[0]
      let rePoint = rank.point
      point = point > rePoint ? point:rePoint
      let re_puz = rank.puz
      if (re_puz != ""){ // puz已经有记录,例:puz = 'ra,6;ka,12;na,3;ta,10;tsu,2;'
        let puz_sp = re_puz.split(";")
        for (let sp of puz_sp){
          if (sp == "") continue
          let sps = sp.split(",")
          let spk = sps[0]
          let spv = sps[1]
          puzMap[spk] = spv
        }
      }
    }
    for (let p of pnSp){
      let pnum = puzMap[p]
      pnum = pnum ? parseInt(pnum) + 1 : 1
      puzMap[p] = pnum
    }
    // puzMap -> puz
    puz = ""
    for (let k in puzMap){
      if (k == "") continue
      let pu = k + "," + puzMap[k] + ";"
      puz += pu
    }

    // let ss = mysql.raw('insert t_link_rank (openid,point,puz,check_coin,status,latest) values(?,?,?,?,?,now())on duplicate key update point=?,puz=?,check_coin=check_coin+?,round=round+1,status=?,latest=now()', [openid,point,puz,checkCoin,status, point,puz,checkCoin,status]).toString()
    
    await mysql.raw('insert t_link_rank (openid,point,puz,check_coin,status,s_date,latest) values(?,?,?,?,?,date_sub(now(), interval -1 day),now())on duplicate key update point=?,puz=?,check_coin=check_coin+?,total_coin=total_coin+?,round=round+1,status=?,latest=now()', [openid,point,puz,checkCoin,status,point,puz,checkCoin,checkCoin,status])
    let data = await mysql('t_link_rank').select('*').where('openid', openid)
    ctx.body = data
  },
}