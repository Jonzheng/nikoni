/* eslint-disable no-irregular-whitespace */
<template>
  <div class="dashboard-container">
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
        <el-form-item label="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" @change="autoTitle(form.title, 0)" />
        </el-form-item>
        <el-form-item label="serifu" :label-width="formLabelWidth">
          <el-input v-model="form.serifu" autocomplete="off" @input="autoMap()" @change="autoSplit(form.serifu, 0)" />
        </el-form-item>
        <el-form-item label="koner" :label-width="formLabelWidth">
          <el-input v-model="form.koner" autocomplete="off" @change="autoSplit(form.koner, 1)" />
        </el-form-item>
        <el-form-item label="roma" :label-width="formLabelWidth">
          <el-input v-model="form.roma" autocomplete="off" @input="toLower()" />
        </el-form-item>
        <el-form-item label="cv" :label-width="formLabelWidth">
          <el-input v-model="form.cv" autocomplete="off" @change="autoTitle(form.cv, 1)" />
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
import { queryAudio, publishAudio } from '../../api/audio'

const words = {　'限り':'限(かぎ)り','参上':'参(さん)上(じょう)','不死身':'不(ふ)死(じ)身(み)','騙':'騙(だま)','万事':'万(ばん)事(じ)','休す':'休(きゅう)す','危ない':'危(あぶ)ない','匂い':'匂(にお)い','完了':'完(かん)了(りょう)','切()':'切(き)','厄介':'厄(やっ)介(かい)','任務':'任(にん)務(む)','今回':'今(こん)回(かい)','気持':'気(き)持(もち)','休()':'休(やす)','閉()':'閉(と)','怪談':'怪(かい)談(だん)','安ら':'安(やす)ら','結末':'結(けつ)末(まつ)','新し':'新(あたら)し','今度':'今(こん)度(ど)','退屈':'退(たい)屈(くつ)','話()':'話(はなし)','世界':'世(せ)界(かい)','昔()':'昔(むかし)','楽し':'楽(たの)し','先()':'先(さき)','物語':'物(もの)語(かたり)','嫌い':'嫌(きら)い','拾()':'拾(す)','行灯':'行(あん)灯(どう)','最初':'最(さい)初(しょ)','弱点':'弱(じゃく)点(てん)','矢':'矢(や)','疾風':'疾(しっ)風(ぷう)','打ち':'打(う)ち','破れ':'破(やぶ)れ','喰':'喰(く)','痒く':'痒(かゆ)','源家':'源(みなもと)家(け)','内緒':'内(ない)緒(しょ)','抜け':'抜(ぬ)け','出し':'出(だ)し','神楽':'神(かぐ)楽(ら)','絶対':'絶(ぜっ)対(たい)','大会':'大(たい)会(かい)','次()':'次(つぎ)','約束':'約(やく)束(そく)','適当':'適(てき)当(とう)','感動':'感(かん)動(どう)','曲()':'曲(きょく)','心配':'心(しん)配(ぱい)', '主人': '主(しゅ)人(じん)', '人間': '人(にん)間(げん)','最後':'最(さい)後(ご)','信念':'信(しん)念(ねん)','目覚':'目(め)覚(ざ)','貫()':'貫(つらぬ)','通す':'通(とお)す', '実力':'実(じつ)力(りょく)', '場所': '場(ば)所(しょ)', '鈴鹿':'鈴(すず)鹿(か)','御前':'御(ご)前(ぜん)','意志':'意(い)志(し)', '故郷':'故(こ)郷(きょう)','騒()':'騒(さわ)', '倒れ':'倒(たお)れ','疲れ':'疲(つか)れ', '必ず':'必(かなら)ず','取り':'取(と)り','戻す':'戻(もど)す', '後ろ':'後ろ','隙き':'隙(す)き', '山()': '山(やま)','証()':'証(あかし)',　'踊()': '踊(おど)', '残()': '残(のこ)', '特()': '特(とく)', '別()': '別(べつ)', '髪()': '髪(かみ)', '型()': '型(がた)', '空()': '空(そら)', '連()': '連(つ)', '灯()': '灯(とう)', '火()': '火(ひ)', '紅()': '紅(こう)', '道()': '道(みち)', '通()': '通(つう)', '食()': '食(た)', '？()': '？(官译)', '巫()': '巫(み)', '女()': '女(こ)', '声()': '声(ごえ)', '違()': '違(ちが)', '揺()': '揺(ゆ)', '晴()': '晴(せい)', '明()': '明(めい)', '不()': '不(ふ)', '屈()': '屈(くっ)', '恐()': '恐(おそ)', '占()': '占(うらな)', '師()': '師(し)', '願()': '願(ねが)', '庭()': '庭(てい)', '院()': '院(いん)', '儀()': '儀(ぎ)', '式()': '式(しき)', '行()': '行(い)', '儚()': '儚(はかな)', '妖()': '妖(よう)', '怪()': '怪(かい)', '清()': '清(きよ)', '隙()': '隙(すき)', '部()': '部(ぶ)', '欲()': '欲(よく)', '漆()': '漆(しっ)', '黑()': '黑(こく)', '狭()': '狭(はざ)', '思()': '思(おも)', '始()': '始(はじ)', '燈()': '燈(あおあんどん)', '語()': '語(がた)', '終わ': '終(お)わ', '案()': '案(あん)', '内()': '内(ない)', '助()': '助(たす)', '眠()': '眠(れむ)', '楽()': '楽(たの)', '魔()': '魔(えんま)', '在()': '在(ざい)', '髑()': '髑(どく)', '髏()': '髏(ろ)', '輪()': '輪(りん)', '杯()': '杯( さかずき)', '冥()': '冥(めい)', '府()': '府(ふ)', '服()': '服(ぷく)', '魂()': '魂(たましい)', '魄()': '魄(ぱく)', '返()': '返(かえ)', '花()': '花(はな)', '泥()': '泥(でい)', '差()': '差(さ)', '臆()': '臆(おく)', '病()': '病(びょう)', '世()': '世(よ)', '界()': '界(かい)', '現()': '現(げん)', '実()': '実(じつ)', '幻()': '幻(げん)', '影()': '影(えい)','嵐':'嵐(あらし)', '耽()': '耽(ふけ)', '荒()': '荒(すさび)', '口()': '口(くち)', '雑()': '雑(ざ)', '魚()': '魚(ぎょ)', '如()': '如(ごこ)', '相()': '相(あい)', '足()': '足(た)', '元()': '元(もと)', '伏()': '伏(ふ)', '存()': '存(そん)', '付()': '付(ず)', '津()': '津(みけつ)', '叶()': '叶(かな)', '运()': '运(うん)', '豊()': '豊(ほう)', '作()': '作(つく)', '届()': '届(とど)', '光()': '光(ひかり)', '矢()': '矢(し)', '仲()': '仲(なか)', '包()': '包(つつ)', '後()': '後(ご)', '幸()': '幸(こう)', '奇()': '奇(き)', '跡()': '跡(せき)', '必()': '必(かなら)', '大()': '大(おお)', '事()': '事(こと)', '子()': '子(ご)', '冷()': '冷(つめ)', '優()': '優(やさ)', '雪()': '雪(ゆき)', '見()': '見(み)', '絶()': '絶(ぜ)', '対()': '対(たい)', '守()': '守(まも)', '舞()': '舞(ま)', '梅()': '梅(うめ)', '瞬()': '瞬(しゅん)', '消()': '消(け)', '枯()': '枯(か)', '落()': '落(お)', '俺()': '俺(おれ)', '名()': '名(な)', '強()': '強(つよ)', '権()': '権(げん)', '化()': '化(げ)', '酒()': '酒(さけ)', '呑()': '呑(てん)', '童()': '童(どう)', '爆()': '爆(ばく)', '誕()': '誕(たん)', '狗()': '狗(ぐ)', '参()': '参(さん)', '仕()': '仕(つかまつ)', '入()': '入(はい)', '支()': '支(し)', '配()': '配(はい)', '羽()': '羽(はれ)', '刃()': '刃(やいば)', '込()': '込(こ)', '深()': '深(ふか)', '流()': '流(りゅう)', '高()': '高(たか)', '指()': '指(ゆび)', '羅()': '羅(えんえんら)', '鞭()': '鞭(むち)', '逆()': '逆(ぎゃく)', '竹()': '竹(まんねんだけ)', '笛()': '笛(ふえ)', '吹()': '吹(ふ)', '厄()': '厄(やっ)', '介()': '介(かい)', '迷()': '迷(めい)', '惑()': '惑(わく)', '二()': '二(に)', '会()': '会(あ)', '静()': '静(しず)', '失()礼()': '失(しつ)礼(れい)', '姫()': '姫(ひめ)', '攻()': '攻(こう)', '覚()': '覚(おぼ)', '天()': '天(てん)', '黄()': '黄(おう)', '金()': '金(きん)', '酷()': '酷(ひど)', '遭()': '遭(あ)', '狙()': '狙(ねら)', '毎()': '毎(まい)', '日()': '日(う)', '送()': '送(おく)', '業()': '業(ごう)', '得()': '得(とく)', '痛()': '痛(い)', '鴆()': '鴆(ちん)', '触()': '触(さわ)', '蝕()': '蝕(うしば)', '諦()': '諦(あきら)', '程()': '程(てい)', '効()': '効(き)', '聖()': '聖(きせい)', '解()': '解(ほど)', '地()': '地(じ)', '宿()': '宿(やど)', '万()': '万(ばん)', '物()': '物(もの)', '今()': '今(きょ)', '囲()': '囲(い)', '蘇()': '蘇(よみがえ)', '寂()': '寂(さび)', '懲()': '懲(こ)', '任()': '任(まか)', '決()': '決(き)', '機()': '機(き)', '集()': '集(しゅう)', '中()': '中(ちゅう)', '海()': '海(うみ)', '叫()': '叫(さけ)', '年()': '年(ねん)', '過()': '過(す)', '言()': '言(い)', '動()': '動(どう)', '復()': '復(ふく)', '讐()': '讐(しゅう)', '神()': '神(かみ)', '木()': '木(ぼく)', '呼()': '呼(よ)', '受()': '受(う)', '蝶()': '蝶(ちょう)', '飛()': '飛(と)', '速()': '速(はや)', '餌()': '餌(えさ)', '怠()': '怠(なま)', '虫()': '虫(むし)', '液()': '液(えき)', '味()': '味(あじ)', '望()': '望(のぞ)', '絞()': '絞(し)', '殺()': '殺(ころ)', '可()': '可(かわ)', '哀()': '哀(あい)', '想()': '想(そう)', '末()': '末(まつ)', '分()': '分(ぶん)', '飾()': '飾(かざ)', '謙()': '謙(けん)', '虚()': '虚(きょ)', '忘()': '忘(わす)', '弁()': '弁(わきま)', '小()': '小(こ)', '降()': '降(こう)', '臨()': '臨(りん)', '舌()': '舌(あかじた)', '収()': '収(しゅう)', '穫()': '穫(かく)', '貴()': '貴(き)', '雷()': '雷(らい)', '笼()': '笼(ろう)', '鬼()': '鬼(おに)', '霊()': '霊(れい)', '簡()': '簡(かん)', '単()': '単(たん)', '的()': '的(てき)', '炎()': '炎(ほのお)', '呪()': '呪(のろ)', '召()': '召(しょう)', '喚()': '喚(かん)', '身()': '身(み)', '使()': '使(つか)', '尽()': '尽(つ)', '腰()': '腰(こし)', '抜()': '抜(ぬ)', '幽()': '幽(ゆう)', '好()': '好(す)', '去()': '去(さ)', '生()': '生(い)', '賑()': '賑(にぎ)', '命()': '命(いのち)', '風()': '風(ふう)', '体()': '体(たい)', '散()': '散(ち)', '怒()': '怒(いか)', '耳()': '耳(みみ)', '妾()': '妾(わらわ)', '上()': '上(うえ)', '彼()': '彼(ひ)', '岸()': '岸(がん)', '頂戴': '頂(ちょう)戴(だい)', '慎()': '慎(つつし)', '者()': '者(もの)', '来()': '来(き)', '起()': '起( お)', '傷()': '傷(きず)', '丈()': '丈(じょう)', '夫()': '夫(ぶ)', '悪()': '悪(わる)', '春()': '春(しゅん)', '最()': '最(さい)', '血()': '血(ち)', '飲()': '飲(の)', '暴()': '暴(ぼう)', '闇()': '闇(やみ)', '水()': '水(すい)', '当()': '当( とう)', '度()': '度(ど)', '嫌()': '嫌(きら)', '撃()': '撃(げき)', '張()': '張(ば)', '罰()': '罰(ばつ)', '毒()': '毒(どく)', '逃()': '逃(に)', '負()': '負(ま)', '碁()': '碁(ご)', '待()': '待(ま)', '教()': '教(おし)', '離()': '離(はな)', '苦()': '苦(くる)', '歌()': '歌(うた)', '心()': '心(こころ)', '桜()': '桜(さくら)', '少し': '少(すこ)し', '感()': '感(かん)', '獄()': '獄(ごく)', '急()': '急(いそ)', '我()': '我(われ)', '一()': '一(いち)', '一緒': '一(いっ)緒(しょ)', '本()': '本(ほん)', '無()': '無(む)', '局()': '局(きょく)', '鴞()': '鴞(ふくろう)', '燃()': '燃(も)', '聞()': '聞(き)', '戻()': '戻(もど)', '力()': '力(ちから)', '誰()': '誰(だれ)', '遊()': '遊(あそ)', '手()': '手(て)', '自()': '自(じ)', '君()': '君(きみ)', '様()': '様(さま)', '駄()': '駄(だ)', '気()': '気(き)', '前()': '前(まえ)', '僕()': '僕(ぼく)', '目()': '目(め)', '死()': '死(し)', '知()': '知(し)', '愚()': '愚(おろ)', '母()': '母(はは)', '何()': '何(なに)', '私()': '私(わたし)'　}

const PreAudio = 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/'

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
  },
  methods: {
    toLower() {
      this.form.roma = this.form.roma.toLowerCase()
    },
    autoMap() {
      let serifu = this.form.serifu
      for (let k in words) {
        if (serifu.indexOf(k) > -1) {
          serifu = serifu.replace(k, words[k])
        }
      }
      this.form.serifu = serifu
    },
    autoSplit(val, idx) {
      console.log(val, idx)
      let sp = val.split('/')
      if(idx == 1){
        this.form.koner = sp[1]
      }else{
        this.form.serifu = sp[0]
      }
    },
    autoTitle(val, idx) {
      console.log(val, idx)
      val = val.replace('CV：', '')
      let sp = val.split(' ')
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
