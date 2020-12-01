<template>
  <div class="app-container">
    <div>
      <el-row>
        <el-col :span="6">
          总计：
          <el-input v-model="total" type="number" placeholder="请输入数值" @blur="blur()"></el-input>
        </el-col>
      </el-row>
      <br>
      <el-tag :span="6">范围：{{ floor }}~{{ ceil }}</el-tag>
      <el-tag v-if="this.total >= this.floor && this.total <= this.ceil" :span="6" type="success">在范围内</el-tag>
      <el-tag v-else-if="this.total < this.floor" :span="6" type="warning">数量设置过大</el-tag>
      <el-tag v-else-if="this.total > this.ceil" :span="6" type="danger">数量设置过小</el-tag>
    </div>
    <hr>
    <el-table
      :data="items"
      style="width: 100%" highlight-current-row>
      <el-table-column label="名称" width="360" type="index">
        <template scope="scope">
          <el-input size="small" v-model="scope.row.name" placeholder="请输入名称"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="单价"
        width="220">
        <template scope="scope">
          <el-input size="small" v-model="scope.row.price" type="number" placeholder="请输入价格" @blur="blur()"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="数量"
        width="220">
        <template scope="scope">
          <el-input size="small" v-model="scope.row.num" type="number" placeholder="请输入数量" @blur="blur()"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-button plain @click="addRow">新增一行</el-button>
    <el-button plain @click="start" :loading="!!countLock">开始计算</el-button>
    <hr>
    <div class="res">
      <div v-if="this.comNum > -2" class="item-step">{{ comNum == -1 ? step : '组合：' + comNum }}</div>
      <div class="item" v-for="(item, index) in arr" :key="item.name">
        <span class="idx">{{ index + 1 + offset }}.</span>{{ item }}
      </div>
      <div v-if="this.arr.length > 0" class="item-step">
        <el-button @click="pre" plain>上一页</el-button>
        <el-button @click="next" plain>下一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>

const sum = (...arr) => [].concat(...arr).reduce((acc, val) => Number(acc) + Number(val), 0);
const reg = /^[0-9]+.?[0-9]*$/;
let res = new Set()
const range = 11
const pageSize = 10
let _arr = []

export default {
  filters: {
  },
  data() {
    return {
      total: 46888.2,
      arr: [],
      comNum: 0,
      offset: 0,
      step: '计算ing',
      countLock: false,
      items: [{
        name: '雪糕',
        price: 4.1,
        num: 3200
      }, {
        name: '咖啡',
        price: 3.5,
        num: 3100
      }, {
        name: '牛奶',
        price: 2.3,
        num: 3050
      }, {
        name: '香草',
        price: 2.4,
        num: 3050
      }, {
        name: '草莓',
        price: 1.6,
        num: 3050
      }, {
        name: '苹果',
        price: 1.2,
        num: 3000
      }]
    }
  },
  computed: {
    floor: function () {
      let items = this.items
      let f = sum(items.map(it => it.price * it.num))
      return Math.round(f * 100) / 100
    },
    ceil: function () {
      let items = this.items
      let c = sum(items.map(it => it.price * (it.num + range)))
      return Math.round(c * 100) / 100
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this._step = 0
    },
    blur() {
      let items = this.items
      let f = sum(items.map(it => it.price * it.num))
      let c = sum(items.map(it => it.price * (it.num + range)))
      console.log(Math.round(f * 100) / 100, Math.round(c * 100) / 100)
    },
    handleCurrentChange(row, event, column) {
      console.log(event)
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.items[index].input = true
    },
    handleDelete(index, row) {
      this.items.splice(index, 1)
    },
    addRow(){
      let item =  {
        name: '-',
        price: 1.1,
        num: 100
      }
      this.items.push(item)
    },
    start(){
      if (this.countLock) return;
      this.countLock = true
      this._idx = -1
      _arr = []
      this.arr = []
      this.comNum = -1
      setTimeout(()=>{
        this.compute()
      }, 100)
    },
    compute(){
      console.log(this.countLock)
      let { total, items, arr } = this
      total = Number(total)
      let spends = sum(items.map(it => it.price * it.num))
      console.log(spends<total, spends,'<', total)
      if (total < spends) {
        this.$message.error('数值不在范围内');
        this.countLock = false
        return;
      }
      let brr = []
      for (let it of items){
        let name = it.name
        let price = Number(it.price)
        let num = Number(it.num)
        let top = num + range
        let sin = []
        console.log(it)
        while (num < top) {
          let spend = Math.round(price * num * 100) / 100
          let vv = { name, price, num, spend }
          sin.push(vv)
          num += 1
        }
        brr.push(sin)
      }
      let mp = {}
      let com = []
      let itemLen = items.length
      console.log(brr)
      for (let i = 0; i < range ** brr.length; i++){
        let m = 0
        let ct = []
        while (m < itemLen){
          let n = Math.floor(i / range ** m) % range
          ct.push(brr[m][n])
          m += 1
        }
        com.push(ct)
      }
      for (let c of com){
        this._step += 1
        let sp = Math.round(sum(c.map(it => it.spend)) * 100) / 100
        let ss = c.map(it => it.name +'*' + it.num +'='+it.spend).join('\n')
        if (!mp[sp]){
          mp[sp] = [ss]
        }else{
          mp[sp].push(ss)
        }
      }
      _arr = mp[total] || []
      console.log(_arr)
      this.next()
      this.countLock = false
      this.$message({
        message: '计算完了',
        type: 'success'
      });
    },
    pre() {
      let comNum = _arr.length
      this._idx -= 1
      this._idx = this._idx < 0 ? Math.floor(comNum / pageSize) : this._idx
      let offset = this._idx * pageSize
      this.offset = offset
      this.arr = _arr.slice(offset, offset + pageSize)
    },

    next() {
      let comNum = _arr.length
      this.comNum = comNum
      this._idx += 1
      this._idx = this._idx > Math.floor(comNum / pageSize) ? this._idx = 0 : this._idx
      let offset = this._idx * pageSize
      let arr = _arr.slice(offset, offset + pageSize)
      this.arr = arr
      this.offset = offset
      console.log(offset, '/', pageSize, ';comNum:', comNum)
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  margin-bottom: 50px;
}
.app-container .res{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.app-container .res .item-step{
  display: flex;
  color: #4a5fe2;
  border-bottom: 1rpx solid #bbb;
  width: 100%;
  padding: 11px 0;
  font-size: 23px;
  margin-bottom: 8px;
}
.app-container .res .item{
  display: flex;
  color: #4a5fe2;
  border-bottom: 1rpx solid #bbb;
  width: 300px;
  padding: 11px 0;
  white-space: pre;
  word-break: break-all;
  margin-bottom: 8px;
}
.app-container .res .item .idx{
  color: #ccc;
  width: 50px;
}
</style>
