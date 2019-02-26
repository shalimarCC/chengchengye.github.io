<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
           <el-button class="filter-item" @click="exportActivityUser" style="float:right" type="primary" size="medium" icon="edit">导出名单</el-button>
    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="姓名" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="性别" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.sex}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="联系电话" min-width="100">
           <template slot-scope="scope">
                {{scope.row.mobile}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动类型" min-width="100">
           <template slot-scope="scope">
                <p v-for="info in scope.row.activityTypeList">{{info}}<br/></p>
            </template>
        </el-table-column>

        <el-table-column align="center" label="报名时间" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.signUpTime}}</span>
            </template>
        </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10,20,30, 50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {activityUserPage,exportActivityUser} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: '0',
            limit: 10,
            count: null,
            currentPage: 1,
            tableKey: 0,
            listLoading: true,

        }
    },
    created() {
        this.findActivityUserPage();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,10)

                 if(str == "/applyList"){
                    this.findActivityUserPage();
                }

            },
        }
    },
    methods: {
        //获取列表
        async findActivityUserPage() {
            try {
                this.listLoading = false;
                const res = await activityUserPage({id:this.$route.params.id, pageNo: this.currentPage, pageSize: this.limit });

                if (res.data.code == 0) {

                    this.count = res.data.data.activityUserPage.totalSize;
                    this.dataSource = res.data.data.activityUserPage.list;

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },

        //导出
        async exportActivityUser() {
            try {
                const res = await exportActivityUser({ id:this.$route.params.id });

                if (res.data.code == 0) {
                    window.open(res.data.data.fileUrl);


                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },

        //分页
        handleSizeChange(val) {
            this.limit = val;
            this.findActivityUserPage()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.findActivityUserPage()
        },

    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>


