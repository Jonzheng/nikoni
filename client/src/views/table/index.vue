<template>
  <div class="app-container">
    <el-table
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
      <el-table-column label="Title" width="110">
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
      <el-table-column label="Level" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.level }}
        </template>
      </el-table-column>
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
    </el-table>
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
      level: "sr",
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
