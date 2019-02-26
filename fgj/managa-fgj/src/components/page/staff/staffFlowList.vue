<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-select v-model="ruleForm.accountType" placeholder="账户类别" style="width: 200px;margin-right:15px;">
            <el-option label="积分账户" value="0">
            </el-option>
            <el-option label="点赞积分账户" value="1">
            </el-option>
            <el-option label="积分冻结账户" value="2">
            </el-option>
            <el-option label="现金支出账户" value="3">
            </el-option>
        </el-select>


        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="流出方" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.outFlowAccount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="流入方" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.inFlowAccount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="金额" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.sum}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="时间" min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="货币类型" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.currencyType}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="流水类型" min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.flowType}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="原因" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.reason}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="备注" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
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
import {accountFlowPage} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            ruleForm:{
                accountType:'',
                userId:'',
                pageNo:1,
                pageSize:10
            }
        }
    },
    created() {
        this.ruleForm.userId = this.$route.params.id;
        this.accountFlowPage();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,14)

                 if(str == "/staffFlowList"){
                    this.ruleForm.userId = this.$route.params.id;
                    this.accountFlowPage();
                }

            },
        }
    },
    methods: {
        //获取列表
        async accountFlowPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await accountFlowPage(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.page.totalSize;
                    this.dataSource = res.data.data.page.list;
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
            this.accountFlowPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.accountFlowPage()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                accountType:'',
                userId:this.$route.params.id,
                pageNo:1,
                pageSize:10
            }
            this.accountFlowPage();
        },
        //搜索
        handleFilter(){
            this.accountFlowPage();
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
            return y + '-' + m + '-' + d
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


