<template>
  <div class="dashboard-container">
    <div class="dashboard-text">：{{ nickname }}</div>
    <div class="dashboard-text">：{{ date }}</div>
    <el-button type="primary" @click="yell">测试</el-button>
    <el-button type="primary" @click="getList">查询</el-button>

    <div class="dashboard-container">
      <div class="dashboard-text">：{{ total }}</div>
      <div class="dashboard-text">：{{ list }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { hello } from '../../api/user'
import { queryList, postList } from '../../api/list'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data: function() {
    return {
      nickname: 'creeper',
      date: '',
      list: [],
      total: 0
    }
  },
  methods: {
    yell(){
      hello().then((res)=>{
        console.log(res)
        this.nickname = res.nickname
        this.date = res.date
      }).catch((err)=>{
        console.log(err)
      })
    },
    getList(){
      let data = {pageNo: 1, pageSize:20, level: 'n', title: '木'}
      console.log(data)
      queryList(data).then((res)=>{
        console.log(res)
        this.list = res.list
        this.total = res.total
        setTimeout(()=>{
          this.total = 0
        }, 3000)
      }).catch((e)=>{
        console.log(e)
      })
    },
  }
}

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.btn{
  width: 120px;
  height: 50px;
  border: 1px solid red;
}
.btn:hover{
  background: #999；
}
</style>
