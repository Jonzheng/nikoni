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
    <el-dialog :title="editTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" style="margin-top: -8vh;">
      <img class="sk-cover" :src="skCover"> </img>
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
          <el-input v-model="vv" autocomplete="off" placeholder="自动补全单词(非必填)-例：幸(こう)運(うん)　/　輪(わ)っか" @input="toSaveDict(vv)" @focus="selectAll($event)"/>
        </el-form-item>
        <el-form-item label="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" placeholder="例：山兔_技能叁" @change="autoTitle(form.title, 0)" @focus="selectAll($event)"/>
        </el-form-item>
        <el-form-item label="台词" :label-width="formLabelWidth">
          <el-input v-model="form.serifu" autocomplete="off" placeholder="例：幸(こう)運(うん)の輪(わ)っか" @input="autoMap()" @change="autoSplit(form.serifu, 0)" />
        </el-form-item>
        <el-form-item label="译文" :label-width="formLabelWidth">
          <el-input v-model="form.koner" autocomplete="off" placeholder="例：幸运之环！"　@change="autoSplit(form.koner, 1)" @focus="selectAll($event)"/>
        </el-form-item>
        <el-form-item label="罗马音" :label-width="formLabelWidth">
          <el-input v-model="form.roma" autocomplete="off" placeholder="例：kou un no wakka" @input="toLower()" @focus="selectAll($event)" />
        </el-form-item>
        <el-form-item label="cv" :label-width="formLabelWidth">
          <el-input v-model="form.cv" autocomplete="off" placeholder="例：丰崎爱生" @change="autoTitle(form.cv, 1)" @focus="selectAll($event)"/>
        </el-form-item>
        <el-form-item label="--" :label-width="formLabelWidth">
          <el-input v-model="form.shadow" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number v-model="form.stars" :min="10" label="stars" />
          <el-button plain @click="rePlay()">播 放</el-button>
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

const aList = [[{"cate":"kana_a","roma":"a","hira":"あ","kata":"ア"},{"cate":"kana_a","roma":"i","hira":"い","kata":"イ"},{"cate":"kana_a","roma":"u","hira":"う","kata":"ウ"},{"cate":"kana_a","roma":"e","hira":"え","kata":"エ"},{"cate":"kana_a","roma":"o","hira":"お","kata":"オ"}],[{"cate":"kana_ka","roma":"ka","hira":"か","kata":"カ"},{"cate":"kana_ka","roma":"ki","hira":"き","kata":"キ"},{"cate":"kana_ka","roma":"ku","hira":"く","kata":"ク"},{"cate":"kana_ka","roma":"ke","hira":"け","kata":"ケ"},{"cate":"kana_ka","roma":"ko","hira":"こ","kata":"コ"}],[{"cate":"kana_sa","roma":"sa","hira":"さ","kata":"サ"},{"cate":"kana_sa","roma":"shi","hira":"し","kata":"シ"},{"cate":"kana_sa","roma":"su","hira":"す","kata":"ス"},{"cate":"kana_sa","roma":"se","hira":"せ","kata":"セ"},{"cate":"kana_sa","roma":"so","hira":"そ","kata":"ソ"}],[{"cate":"kana_ta","roma":"ta","hira":"た","kata":"タ"},{"cate":"kana_ta","roma":"chi","hira":"ち","kata":"チ"},{"cate":"kana_ta","roma":"tsu","hira":"つ","kata":"ツ"},{"cate":"kana_ta","roma":"te","hira":"て","kata":"テ"},{"cate":"kana_ta","roma":"to","hira":"と","kata":"ト"}],[{"cate":"kana_na","roma":"na","hira":"な","kata":"ナ"},{"cate":"kana_na","roma":"ni","hira":"に","kata":"ニ"},{"cate":"kana_na","roma":"nu","hira":"ぬ","kata":"ヌ"},{"cate":"kana_na","roma":"ne","hira":"ね","kata":"ネ"},{"cate":"kana_na","roma":"no","hira":"の","kata":"ノ"}],[{"cate":"kana_ha","roma":"ha","hira":"は","kata":"ハ"},{"cate":"kana_ha","roma":"hi","hira":"ひ","kata":"ヒ"},{"cate":"kana_ha","roma":"fu","hira":"ふ","kata":"フ"},{"cate":"kana_ha","roma":"he","hira":"へ","kata":"ヘ"},{"cate":"kana_ha","roma":"ho","hira":"ほ","kata":"ホ"}],[{"cate":"kana_ma","roma":"ma","hira":"ま","kata":"マ"},{"cate":"kana_ma","roma":"mi","hira":"み","kata":"ミ"},{"cate":"kana_ma","roma":"mu","hira":"む","kata":"ム"},{"cate":"kana_ma","roma":"me","hira":"め","kata":"メ"},{"cate":"kana_ma","roma":"mo","hira":"も","kata":"モ"}],[{"cate":"kana_ya","roma":"ya","hira":"や","kata":"ヤ"},{"cate":"","roma":"","hira":"","kata":""},{"cate":"kana_ya","roma":"yu","hira":"ゆ","kata":"ユ"},{"cate":"","roma":"","hira":"","kata":""},{"cate":"kana_ya","roma":"yo","hira":"よ","kata":"ヨ"}],[{"cate":"kana_ra","roma":"ra","hira":"ら","kata":"ラ"},{"cate":"kana_ra","roma":"ri","hira":"り","kata":"リ"},{"cate":"kana_ra","roma":"ru","hira":"る","kata":"ル"},{"cate":"kana_ra","roma":"re","hira":"れ","kata":"レ"},{"cate":"kana_ra","roma":"ro","hira":"ろ","kata":"ロ"}],[{"cate":"kana_wa","roma":"wa","hira":"わ","kata":"ワ"},{"cate":"","roma":"","hira":"","kata":""},{"cate":"","roma":"","hira":"","kata":""},{"cate":"","roma":"","hira":"","kata":""},{"cate":"kana_wa","roma":"wo","hira":"を","kata":"ヲ"}],[{"cate":"kana_n","roma":"n","hira":"ん","kata":"ン"}]]
const gaList = [[{"cate":"kana_a","roma":"ga","hira":"が","kata":"ガ"},{"cate":"kana_a","roma":"gi","hira":"ぎ","kata":"ギ"},{"cate":"kana_a","roma":"gu","hira":"ぐ","kata":"グ"},{"cate":"kana_a","roma":"ge","hira":"げ","kata":"ゲ"},{"cate":"kana_a","roma":"go","hira":"ご","kata":"ゴ"}]]
const zaList = [[{"cate":"kana_a","roma":"za","hira":"ざ","kata":"ザ"},{"cate":"kana_a","roma":"ji","hira":"じ","kata":"ジ"},{"cate":"kana_a","roma":"zu","hira":"ず","kata":"ズ"},{"cate":"kana_a","roma":"ze","hira":"ぜ","kata":"ゼ"},{"cate":"kana_a","roma":"zo","hira":"ぞ","kata":"ゾ"}]]
const daList = [[{"cate":"kana_a","roma":"da","hira":"だ","kata":"ダ"},{"cate":"kana_a","roma":"di","hira":"ぢ","kata":"ヂ"},{"cate":"kana_a","roma":"du","hira":"づ","kata":"ヅ"},{"cate":"kana_a","roma":"de","hira":"で","kata":"デ"},{"cate":"kana_a","roma":"do","hira":"ど","kata":"ド"}]]
const baList = [[{"cate":"kana_a","roma":"ba","hira":"ば","kata":"バ"},{"cate":"kana_a","roma":"bi","hira":"び","kata":"ビ"},{"cate":"kana_a","roma":"bu","hira":"ぶ","kata":"ブ"},{"cate":"kana_a","roma":"be","hira":"べ","kata":"ベ"},{"cate":"kana_a","roma":"bo","hira":"ぼ","kata":"ボ"}]]
const paList = [[{"cate":"kana_a","roma":"pa","hira":"ぱ","kata":"パ"},{"cate":"kana_a","roma":"pi","hira":"ぴ","kata":"ピ"},{"cate":"kana_a","roma":"pu","hira":"ぷ","kata":"プ"},{"cate":"kana_a","roma":"pe","hira":"ぺ","kata":"ペ"},{"cate":"kana_a","roma":"po","hira":"ぽ","kata":"ポ"}]]
const smList = [[
                {"cate":"kana_a","roma":"kya","hira":"きゃ","kata":"キャ"},
                {"cate":"kana_a","roma":"kyu","hira":"きょ","kata":"キュ"},
                {"cate":"kana_a","roma":"kyo","hira":"きょ","kata":"キョ"},
                {"cate":"kana_a","roma":"sha","hira":"しゃ","kata":"シャ"},
                {"cate":"kana_a","roma":"shu","hira":"しゅ","kata":"シュ"},
                {"cate":"kana_a","roma":"sho","hira":"しょ","kata":"ショ"},
                {"cate":"kana_a","roma":"cha","hira":"ちゃ","kata":"チャ"},
                {"cate":"kana_a","roma":"chu","hira":"ちゅ","kata":"チュ"},
                {"cate":"kana_a","roma":"cho","hira":"ちょ","kata":"チョ"},
                {"cate":"kana_a","roma":"nya","hira":"にゃ","kata":"ニャ"},
                {"cate":"kana_a","roma":"nyu","hira":"にゅ","kata":"ニュ"},
                {"cate":"kana_a","roma":"nyo","hira":"にょ","kata":"ニョ"},
                {"cate":"kana_a","roma":"hya","hira":"ひゃ","kata":"ヒャ"},
                {"cate":"kana_a","roma":"hyu","hira":"ひゅ","kata":"ヒュ"},
                {"cate":"kana_a","roma":"hyo","hira":"ひょ","kata":"ヒョ"},
                {"cate":"kana_a","roma":"mya","hira":"みゃ","kata":"ミャ"},
                {"cate":"kana_a","roma":"myu","hira":"みゅ","kata":"ミュ"},
                {"cate":"kana_a","roma":"myo","hira":"みょ","kata":"ミョ"},
                {"cate":"kana_a","roma":"rya","hira":"りゃ","kata":"リャ"},
                {"cate":"kana_a","roma":"ryu","hira":"りゅ","kata":"リュ"},
                {"cate":"kana_a","roma":"ryo","hira":"りょ","kata":"リョ"},
                {"cate":"kana_a","roma":"gya","hira":"ぎゃ","kata":"ギャ"},
                {"cate":"kana_a","roma":"gyu","hira":"ぎゅ","kata":"ギュ"},
                {"cate":"kana_a","roma":"gyo","hira":"ぎょ","kata":"ギョ"},
                {"cate":"kana_a","roma":"ja","hira":"じゃ","kata":"ジャ"},
                {"cate":"kana_a","roma":"ju","hira":"じゅ","kata":"ジュ"},
                {"cate":"kana_a","roma":"jo","hira":"じょ","kata":"ジョ"},
                {"cate":"kana_a","roma":"bya","hira":"びゃ","kata":"ビャ"},
                {"cate":"kana_a","roma":"byu","hira":"びゅ","kata":"ビュ"},
                {"cate":"kana_a","roma":"byo","hira":"びょ","kata":"ビョ"},
                {"cate":"kana_a","roma":"pya","hira":"ぴゃ","kata":"ピャ"},
                {"cate":"kana_a","roma":"pyu","hira":"ぴゅ","kata":"ピュ"},
                {"cate":"kana_a","roma":"pyo","hira":"ぴょ","kata":"ピョ"},
                {"cate":"kana_a","roma":"-","hira":"ー"},
              ]]

const kataMap = {}
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
      skCover: '',
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
        shadow: '',
        audioType: '.mp3'
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
    const kataList = aList.concat(gaList).concat(zaList).concat(daList).concat(baList).concat(paList).concat(smList)
    for (let bt of kataList){
      for (let it of bt){
        kataMap[it.hira] = it.roma
        kataMap[it.kata] = it.roma
      }
    }
    console.log('kataMap', kataMap)
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
      serifu = serifu.replace(/\（/g, '(').replace(/\）/g, ')')
      for (let k in this.dict) {
        if (serifu.indexOf(k) > -1) {
          serifu = serifu.replace(k, this.dict[k])
        }
      }
      this.autoRoma(serifu)
      this.form.serifu = serifu
    },
    autoRoma(serifu) {
      let sp = serifu.split('')
      console.log(sp)
      let rs = []
      for (let it of sp) {
        if (kataMap[it]){
          rs.push(kataMap[it])
        }
      }
      this.form.roma = rs.join('')
    },
    autoSplit(val, idx) {
      console.log(val, idx)
      let sp = val.split('/')
      if (sp.length == 1) {
        sp = val.split('  ')
      }
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
      kk = (kk.length == 1) ? kk+'()' : kk
      let data = {　kk, vv　}
      saveDict(data).then(data=>{
        console.log(kk, vv)
        this.dict[kk] = vv
        this.$message({
          message: '保存成功：' + kk + '=' + vv ,
          type: 'success'
        });
      })
    },
    selectAll(event) {
      event.currentTarget.select();
    },

    rePlay(){
      this.handleEdit(0, this.form)
    },
    handleEdit(index, row, suffix='.mp3') {
      this.dialogFormVisible = true
      this.form.audioType = suffix
      var { fileId } = row
      this.form.fileId = fileId
      this.editTitle = fileId
      var request = new XMLHttpRequest();
      var srcAudio = `${PreAudio}${fileId}${suffix}`
      let sp = fileId.split('_')
      let ln = `${sp[0]}_${sp[1]}_0.png`
      this.skCover = PreAudio.replace('audio','image') + ln
      console.log(this.skCover)
      request.open('GET', srcAudio, true)
      // request.setRequestHeader('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
      // request.setRequestHeader('Content-Type','audio/mp3')
      request.responseType = 'arraybuffer';

      // 下面就是对音频文件的异步解析
      request.onload = (ret) => {
        if (ret.target.status == 404){
          this.handleEdit(index, row, '.wav')
          return;
        }
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
          console.log('err', err)
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

.sk-cover{
  position: absolute;
  left: 42%; bottom: 0;
  width: 220px;
  height: 220px;
}

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
