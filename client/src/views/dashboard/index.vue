<template>
  <div class="dashboard-container">
    <div class="dashboard-text">：{{ nickname }}</div>
    <div class="dashboard-text">：{{ date }}</div>
    <el-button type="primary" @click="yell">测试</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { hello } from '../../api/user'

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
      date: ''
    }
  },
  methods: {
    yell(){
      console.log('yell............')
      console.log(process.env.VUE_APP_BASE_API)
      hello().then((res)=>{
        console.log(res)
        this.nickname = res.data
        this.date = res.date
      }).catch((err)=>{
        console.log(err)
      })
    }
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
