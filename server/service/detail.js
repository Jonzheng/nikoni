const { mysql } = require('../config/db')

exports = module.exports = {
  queryDetail: async (ctx) => {
    let body = ctx.request.body
    let { fileId, cate, userId } = body
    cate = cate ? cate : 'y'
    let data = {}
    data["list"] = []
    data["audio"] = []
    data["record"] = []
    if (fileId){
        data["audio"] = await mysql('t_audio').select('*').where('file_id', fileId).andWhere('status', 1)
        let res = await mysql.raw('select th.user_id heart_ud,t_re.*,t_ur.nick_name,t_ur.show_name,t_ur.avatar_url,t_ur.openid,to_days(now()) - to_days(t_re.c_date) dday from t_record t_re inner join t_user t_ur on (t_re.master_id = t_ur.openid) left join t_heart th on (th.record_id = t_re.record_id and th.status = 1 and th.user_id = ?) where t_re.file_id = ? and t_re.status = 1 order by case when to_days(now()) - to_days(t_re.c_date) < 3 then 0 else 1 end,heart desc', [userId, fileId])
        data["record"] = res[0]
        //ssr_yzq_0_3  ssr_h_0_0  ssr_hnj_0_0
        let fids = fileId.split("_")
        let level = fids[0]
        let sname = fids[1]
        res = await mysql.raw('select * from t_list where status=? and cate=? and level=? and s_name=?',[1,cate,level,sname])
        data["list"] = res[0]
    }else{
        data["audio"] = await mysql('t_audio').select('*')
    }
    ctx.body = data
  },
}