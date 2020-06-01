<template>
  <div class="dashboard-container">
    <el-table :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
      <el-table-column label="Date" prop="date" />
      <el-table-column label="Name" prop="name" />
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
    <el-dialog title="发布" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="serifu" :label-width="formLabelWidth">
          <el-input v-model="form.serifu" autocomplete="off" />
        </el-form-item>
        <el-form-item label="koner" :label-width="formLabelWidth">
          <el-input v-model="form.koner" autocomplete="off" />
        </el-form-item>
        <el-form-item label="roma" :label-width="formLabelWidth">
          <el-input v-model="form.roma" autocomplete="off" />
        </el-form-item>
        <el-form-item label="cv" :label-width="formLabelWidth">
          <el-input v-model="form.cv" autocomplete="off" />
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
import { publishAudio } from '../../api/audio'

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
      tableData: [{
        date: '2020-05-02',
        name: '康纳酱',
        address: '底特律的汉克家'
      }, {
        date: '2020-05-04',
        name: '马库斯',
        address: '底特律的汉克家'
      }, {
        date: '2020-05-01',
        name: '罗拉',
        address: '底特律的汉克家'
      }, {
        date: '2020-05-03',
        name: '汉克',
        address: '底特律的汉克家'
      }],
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
      form: {
        fileId: '',
        title: '',
        serifu: '',
        koner: '',
        roma: '',
        cv: '',
        stars: 10,
        shadow: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // this.getList()
  },
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true
      console.log(index, row);
      var request = new XMLHttpRequest();
      var url = this.file
      request.open('GET', url, true);
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
          peaks = peaks.map(item => { return Math.round(Math.abs(item) * 120) })
          peaks = peaks.map(item => {
            item = item === 0 ? 3 : item > 100 ? 100 : item
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
      })
    },
    fetchData() {
      this.listLoading = true
      // getList().then(resp => {
      //   console.log(resp)
      //   this.list = resp.list
      //   this.listLoading = false
      // })
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
