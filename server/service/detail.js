const { mysql } = require('../config/db')

exports = module.exports = {
  queryDetail: async (ctx) => {
    let data = {}
    let body = ctx.request.body
    let file_id = body.file_id
    let cate = body.cate
    let user_id = body.user_id
    data["listResult"] = []
    data["audioResult"] = []
    data["recordResult"] = []
    data["listOther"] = []
    if (file_id){
        data["listResult"] = await mysql('t_list').select('*').where('cate', cate).andWhere('file_id', file_id).andWhere('status', 1)
        data["audioResult"] = await mysql('t_audio').select('*').where('file_id', file_id).andWhere('status', 1)
        data["recordResult"] = await mysql.raw('select th.user_id heart_ud,t_re.*,t_ur.*,to_days(now()) - to_days(t_re.c_date) dday from t_record t_re inner join t_user t_ur on (t_re.master_id = t_ur.openid) left join t_heart th on (th.record_id = t_re.record_id and th.status = 1 and th.user_id = ?) where t_re.file_id = ? and t_re.status = 1 order by case when to_days(now()) - to_days(t_re.c_date) < 3 then 0 else 1 end,heart desc', [user_id, file_id])
        //ssr_yzq_0_3  ssr_h_0_0  ssr_hnj_0_0
        let fids = file_id.split("_")
        let level = fids[0]
        let sname = fids[1]
        let start_str = level + "_" + sname + "_"
        let slen = start_str.length
        data["listOther"] = await mysql.raw('select * from t_list where status=? and cate=? and substr(file_id, 1, ?) =?',[1,cate,slen,start_str])
    }else{
        data["listResult"] = await mysql('t_list').select('*').where('cate', cate)
        data["audioResult"] = await mysql('t_audio').select('*')
    }
    ctx.data = data
  },
}