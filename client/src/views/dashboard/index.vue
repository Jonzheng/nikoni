/* eslint-disable no-irregular-whitespace */
<template>
  <div class="dashboard-container">
    <!--
    <el-button type="primary" @click="reShadow">计算</el-button>
    <el-input type="textarea" :rows="10" v-model="shs" />
    -->
    <el-table :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
      <el-table-column label="fileId" prop="fileId" />
      <el-table-column label="level" prop="level" />
      <el-table-column label="sName" prop="sName" />
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
    <div class="dashboard-text">：{{ nickname }}</div>
    <div class="dashboard-text">：{{ date }}</div>
    <el-input v-model="level" placeholder="level" @input="levelInput" />

    <el-button type="primary" @click="yell">测试</el-button>
    <el-button type="primary" @click="getList">查询</el-button>

    <div class="dashboard-container">
      <div class="dashboard-text">：{{ total }}</div>
      <div class="dashboard-text">：{{ list }}</div>
    </div>
    -->
    <!-- Form -->
    <el-dialog :title="editTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth">
          <el-radio v-model="skill" label="触碰" border @change="skillChange(skill)"></el-radio>
          <el-radio v-model="skill" label="出场" border @change="skillChange(skill)"></el-radio>
          <el-radio v-model="skill" label="技能壹" border @change="skillChange(skill)"></el-radio>
          <el-radio v-model="skill" label="技能贰" border @change="skillChange(skill)"></el-radio>
          <el-radio v-model="skill" label="技能叁" border @change="skillChange(skill)"></el-radio>
          <el-radio v-model="skill" label="受击" border @change="skillChange(skill)"></el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-input v-model="vv" autocomplete="off" @input="toSaveDict(vv)" @focus="selectAll($event)"/>
        </el-form-item>
        <el-form-item label="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" @change="autoTitle(form.title, 0)" @focus="selectAll($event)"/>
        </el-form-item>
        <el-form-item label="serifu" :label-width="formLabelWidth">
          <el-input v-model="form.serifu" autocomplete="off" @input="autoMap()" @change="autoSplit(form.serifu, 0)" />
        </el-form-item>
        <el-form-item label="koner" :label-width="formLabelWidth">
          <el-input v-model="form.koner" autocomplete="off" @change="autoSplit(form.koner, 1)" @focus="selectAll($event)"/>
        </el-form-item>
        <el-form-item label="roma" :label-width="formLabelWidth">
          <el-input v-model="form.roma" autocomplete="off" @input="toLower()" @focus="selectAll($event)" />
        </el-form-item>
        <el-form-item label="cv" :label-width="formLabelWidth">
          <el-input v-model="form.cv" autocomplete="off" @change="autoTitle(form.cv, 1)" @focus="selectAll($event)"/>
        </el-form-item>
        <el-form-item label="shadow" :label-width="formLabelWidth">
          <el-input v-model="form.shadow" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="stars" :label-width="formLabelWidth">
          <el-input-number v-model="form.stars" :min="10" label="stars" />
        </el-form-item>
        <!--
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="publish">发 布</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { hello } from '../../api/user'
import { queryList } from '../../api/list'
import { queryAudio, publishAudio, queryDict, saveDict } from '../../api/audio'

const PreAudio = 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/'
const fileIds = []


const maxNum = 100

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
const getPeaks = (buffer, perSecPx) => {
  const { sampleRate, length } = buffer;
  // 每一份的点数=44100 / 100 = 441
  const sampleSize = ~~(sampleRate / perSecPx);
  const first = 0;
  const last = ~~(length / sampleSize)
  const peaks = [];
  const chan = buffer.getChannelData(0);
  for (let i = first; i <= last; i++) {
    const start = i * sampleSize;
    const end = start + sampleSize;
    let min = 0;
    let max = 0;
    for (let j = start; j < end; j++) {
      const value = chan[j];
      if (value > max) {
        max = value;
      }
      if (value < min) {
        min = value;
      }
    }
    // 波峰
    peaks[2 * i] = max;
    // 波谷
    peaks[2 * i + 1] = min;
  }
  return peaks;
}

export default {
  name: 'Dashboard',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data: function() {
    return {
      tableData: [],
      editTitle: '',
      file: 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/ssr_gq_0_3.mp3',
      search: '',
      list: [],
      listLoading: true,
      nickname: 'creeper',
      date: '',
      level: 'sr',
      total: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      skill: '1',
      vv: '',
      shs: '',
      form: {
        fileId: '',
        title: '',
        serifu: '',
        koner: '',
        roma: '',
        cv: '',
        stars: 10,
        shadow: ''
      },
      formLabelWidth: '100px'
    }
  },
  computed: {
    getLower: {
      get: function() {
        return this.form.roma;
      },
      set: function(val) {
        this.form.roma = val.toUpperCase();
      }
    },
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.fetchData()
    queryDict().then(data =>{
      let dict = {}
      for (let it of data){
        dict[it.kk] = it.vv
      }
      this.dict = dict
      console.log(dict)
    })
  },
  methods: {
    toLower() {
      this.form.roma = this.form.roma.toLowerCase()
    },
    autoMap() {
      let serifu = this.form.serifu
      for (let k in this.dict) {
        if (serifu.indexOf(k) > -1) {
          serifu = serifu.replace(k, this.dict[k])
        }
      }
      this.form.serifu = serifu
    },
    autoSplit(val, idx) {
      console.log(val, idx)
      let sp = val.split('/')
      if(idx == 1){
        this.form.koner = sp.length > 1 ? sp[1] : val
      }else{
        this.form.serifu = sp[0]
      }
    },
    autoTitle(val, idx) {
      console.log(val, idx)
      val = val.replace('CV：', '')
      let sp = val.split(' ')
      console.log(sp)
      if (sp.length != 2) return
      if(idx == 1){
        this.form.cv = sp[1]
      }else{
        let title = sp[0].split('/')[0]
        this.form.title = title
      }
    },
    skillChange(val) {
      if (!this.form.title) return
      let sp = this.form.title.split('_')
      this.form.title = sp[0] + '_' + val
    },
    toSaveDict(vv) {
      vv = vv.trim()
      if (!vv) return
      let kk = vv.replace(/\(.*?\)/g, '')
      let data = {kk, vv}
      saveDict(data).then(data=>{
        console.log(kk, vv)
        this.dict[kk] = vv
        this.$message({
          message: '发布成功：' + kk + '=' + vv ,
          type: 'success'
        });
      })
    },
    selectAll(event) {
      event.currentTarget.select();
    },
    pp(fileId){
      return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        var srcAudio = `${PreAudio}${fileId}.mp3`
        console.log(srcAudio)
        request.open('GET', srcAudio, true);
        request.responseType = 'arraybuffer';
        // 下面就是对音频文件的异步解析
        request.onload = () => {
          context.decodeAudioData(request.response, (buffer) => {
            var source = context.createBufferSource();
            var analyser = context.createAnalyser();
            source.buffer = buffer;
            source.connect(analyser);
            analyser.connect(context.destination);
            analyser.fftSize = 128;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);
            source.start();
            analyser.getByteTimeDomainData(dataArray);
            const perSecPx = 10;
            // 获取所有波峰波谷，peaks 即为最后所需波形数据
            let peaks = getPeaks(buffer, perSecPx);
            peaks = peaks.map(item => { return Math.round(Math.abs(item) * maxNum) })
            peaks = peaks.map(item => {
              item = item === 0 ? 3 : item > 100 ? 100 : item
              item = item > 95 ? Math.round(item - Math.random() * 20) : item
              return item
            })
            this.form.shadow = peaks.join(',')
            resolve(this.form.shadow)
          }, function(err) {
            console.log(err)
            reject(err)
          })
        }
        request.send()
      })
    },
    reShadow(){
      for (let fileId of fileIds){
        this.pp(fileId).then((data)=>{
          let sql = `update t_audio set shadow = '${data}' where file_id = '${fileId}';   `
          console.log(sql)
          this.shs = this.shs + sql
        })
      }
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true
      var { fileId } = row
      this.form.fileId = fileId
      this.editTitle = fileId
      var request = new XMLHttpRequest();
      var srcAudio = `${PreAudio}${fileId}.mp3`
      console.log(srcAudio)
      request.open('GET', srcAudio, true);
      // request.setRequestHeader('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
      // request.setRequestHeader('Content-Type','audio/mp3')
      request.responseType = 'arraybuffer';

      // 下面就是对音频文件的异步解析
      request.onload = () => {
        context.decodeAudioData(request.response, (buffer) => {
          var source = context.createBufferSource();
          var analyser = context.createAnalyser();
          source.buffer = buffer;
          source.connect(analyser);
          analyser.connect(context.destination);
          analyser.fftSize = 128;
          var bufferLength = analyser.frequencyBinCount;
          var dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);
          source.start();
          analyser.getByteTimeDomainData(dataArray);
          const perSecPx = 10;
          // 获取所有波峰波谷，peaks 即为最后所需波形数据
          let peaks = getPeaks(buffer, perSecPx);
          peaks = peaks.map(item => { return Math.round(Math.abs(item) * 200) })
          peaks = peaks.map(item => {
            item = item === 0 ? 3 : item > 100 ? 100 : item
            item = item > 98 ? Math.round(item - Math.random() * 20) : item
            return item
          })
          console.log(peaks.length)
          this.form.shadow = peaks.join(',')
          console.log(this.form.shadow)
        }, function(err) {
          console.log(err)
        })
      }

      request.send()
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handlechange(value) {
      console.log(value);
    },
    publish() {
      console.log(this.form)
      publishAudio(this.form).then(res => {
        console.log(res)
        this.dialogFormVisible = false
        this.$message({
          message: '发布成功：' + this.form.fileId,
          type: 'success'
        });
        this.fetchData()
      }).catch(err => {
        console.log(err)
      })
    },
    fetchData() {
      this.listLoading = true
      queryAudio().then(resp => {
        const tableData = []
        const fileIds = resp.fileIds
        for (const fileId of fileIds) {
          const level = fileId.split('_')[0]
          const sName = fileId.split('_')[1]
          const item = { fileId, level, sName }
          tableData.push(item)
        }
        this.tableData = tableData
        this.listLoading = false
      })
    },
    levelInput(e) {
      console.log(e)
      this.level = e
    },
    yell() {
      hello().then((res) => {
        console.log(res)
        this.nickname = res.nickname
        this.date = res.date
      }).catch((err) => {
        console.log(err)
      })
    },
    getList() {
      this.listLoading = true
      const data = { pageNo: 1, pageSize: 50 }
      data['level'] = this.level
      console.log(data)
      queryList(data).then((res) => {
        console.log(res)
        this.list = res.list
        this.total = res.total
        this.listLoading = false
        setTimeout(() => {
          this.total = 0
        }, 3000)
      }).catch((e) => {
        console.log(e)
        this.listLoading = false
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

<style>
.dashboard-container{
  padding-bottom: 300px;
}
.box{
  margin: 20px 0;
  display: flex;
  align-items: center;
}
.box-line{
  margin: 0 20px;
  width: 50%;
}

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
