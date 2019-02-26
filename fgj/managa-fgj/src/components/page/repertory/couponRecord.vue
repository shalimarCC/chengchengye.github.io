<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:10px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="批次编号" v-model="ruleForm.batchCode">
        </el-input>



        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

     </div>

    <el-table :key='tableKey' ref="multipleTable" :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column
        type="selection"
        width="50"
        align="center">
        </el-table-column>

        <el-table-column align="center" label="批次编号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.batchCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="导入时间" width="250">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="导入数量" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.importSum}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="来源" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.source}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="备注" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作人" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.createUsername}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="recordContent(scope.row.id)">查看详情</el-button>
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
import {findCardBatchOfPage} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            ruleForm:{
                batchCode:'',
                pageNo:1,
                pageSize:10
            },

        }
    },
    created() {
        this.findCardBatchOfPage();
    },

    methods: {
        //获取列表
        async findCardBatchOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })

                this.listLoading = false;
                const res = await findCardBatchOfPage(obj);

                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.dataSource = res.data.data.list;

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
            this.findCardBatchOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCardBatchOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                batchCode:'',
                pageNo:1,
                pageSize:10
            };

            this.findCardBatchOfPage()
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findCardBatchOfPage()
        },



        recordContent(id){
            this.$router.push('/couponRecordContent/'+id);
        },

        //时间戳转换
        setTime(time) {
            if(time==null){
                return '';
            }
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

<style>
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


