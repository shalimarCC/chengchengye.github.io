<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">

            <el-select v-model="ruleForm.tagId" placeholder="所属标签">
            <el-option
                v-for="item in likeLabel"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
            </el-select>

            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="medium">搜索</el-button>
            <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>


    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">



        <el-table-column align="center" label="时间" min-width="100">
            <template slot-scope="scope">
                {{scope.row.createTime}}
            </template>
        </el-table-column>



        <el-table-column align="center" label="点赞人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="被赞人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.receiverName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="点赞标签" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.tagName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="点赞评语" min-width="200">
            <template slot-scope="scope">
                <span>{{scope.row.praiseWords}}</span>
            </template>
        </el-table-column>

    </el-table>
    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="ruleForm.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="ruleForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {praiseRecord,praiseTagList} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm:{
                tagId:'',
                pageNo:1,
                pageSize:10
            },
            dataSource: [],
            offset: '0',

            count: null,

            tableKey: 0,
            listLoading: true,
            likeLabel:[],
        }
    },
    created() {
        this.findPraiseRecord();
        this.findPraiseTagList();

    },

    methods: {
        //获取点赞列表
        async findPraiseRecord() {
            try {
                this.listLoading = false;
                const res = await praiseRecord(this.ruleForm);

                if (res.data.code == 0) {

                    this.count = res.data.data.praiseRecordPage.totalSize;
                    this.dataSource = res.data.data.praiseRecordPage.list;

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

        //获取点赞标签列表
        async findPraiseTagList() {
            try {
                this.listLoading = false;
                const res = await praiseTagList();

                if (res.data.code == 0) {
                    this.likeLabel = res.data.data.tagList;
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
            this.ruleForm.pageSize = val;
            this.findPraiseRecord()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findPraiseRecord()
        },

        //重置
        resetForm() {
            this.ruleForm = {
                tagId:'',
                pageNo:1,
                pageSize:10
            },
            this.findPraiseRecord();
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findPraiseRecord();
        },

        //时间戳转换
        setTime(time) {
            const t = new Date(time);
            let y = t.getFullYear();
            let m = t.getMonth() + 1;
            let d = t.getDate();
            let h = t.getHours();
            let f = t.getMinutes();
            let s = t.getSeconds();
            if (m < 10) {
                m = '0' + m
            }
            if (d < 10) {
                d = '0' + d
            }
            if (h < 10) {
                h = '0' + h
            }
            if (f < 10) {
                f = '0' + f
            }
            if (s < 10) {
                s = '0' + s
            }
            return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
        },
        //时间转换时间戳
        setTimestamp(time) {
            const t = new Date(time);
            return t.getTime()
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


