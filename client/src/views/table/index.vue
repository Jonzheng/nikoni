<template>
  <div class="app-container">

  <el-form>
    <el-form-item>
      <el-radio v-model="level" label="sp" checked border @change="levelChange('')">SP</el-radio>
      <el-radio v-model="level" label="ssr" border @change="levelChange('')">SSR</el-radio>
      <el-radio v-model="level" label="sr" border @change="levelChange('')">SR</el-radio>
      <el-radio v-model="level" label="r" border @change="levelChange('')">R</el-radio>
      <el-radio v-model="level" label="n" border @change="levelChange('')">N</el-radio>
      <el-radio v-model="level" label="m" border @change="levelChange('')">阴阳师</el-radio>
    </el-form-item>
  </el-form>
    <el-table
      class="t-list"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title" width="200">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Serifu" align="center">
        <template slot-scope="scope">
          {{ scope.row.serifu }}
        </template>
      </el-table-column>
      <el-table-column label="Koner" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.koner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.stars }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        </template>
      </el-table-column>
      <!--
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.c_date }}</span>
        </template>
      </el-table-column>
      -->
    </el-table>
    <el-dialog :title="editTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="title" label-width="100px">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="台词" label-width="100px">
          <el-input v-model="form.serifu" autocomplete="off" />
        </el-form-item>
        <el-form-item label="译文" label-width="100px">
          <el-input v-model="form.koner" autocomplete="off" />
        </el-form-item>
        <el-form-item label="罗马音" label-width="100px">
          <el-input v-model="form.roma" autocomplete="off" />
        </el-form-item>
        <el-form-item label="cv" label-width="100px">
          <el-input v-model="form.cv" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" label-width="100px">
          <el-input-number v-model="form.stars" :min="10" label="stars" />
          <el-button plain @click="rePlay()">播 放</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update()" disabled>保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { queryList } from '../../api/list'

export default {
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
  data() {
    return {
      list: [],
      level: "sp",
      listLoading: true,
      dialogFormVisible: false,
      editTitle: '',
      form: {
        fileId: '',
        title: '',
        serifu: '',
        koner: '',
        roma: '',
        cv: '',
        stars: 10,
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = { pageNo: 1, pageSize: 30 }
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
    },
    levelChange(){
      console.log(this.level)
      this.getList()
    },
    handleEdit(index, row, suffix='.mp3') {
      console.log(row)
      let { file_id, title, serifu, koner, roma, cv, stars } = row
      this.dialogFormVisible = true
      this.form.fileId = file_id
      this.form.title = title
      this.form.serifu = serifu
      this.form.koner = koner
      this.form.roma = roma
      this.form.cv = cv
      this.form.stars = stars
      this.editTitle = file_id
    },
    rePlay(){

    },
    update(){
      
    }
  }
}
</script>

<style lang="scss" scoped>
.t-list{
  margin-bottom: 80px;
}
</style>
