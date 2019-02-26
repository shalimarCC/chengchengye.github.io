<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="账户名称" v-model="ruleForm.keyWord"></el-input>
        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="ruleForm.status" placeholder="审核状态" style="width: 200px;margin-right:15px;">
            <el-option label="待审核" value="0">
            </el-option>
            <el-option label="已通过" value="1">
            </el-option>
            <el-option label="未通过" value="2">
            </el-option>
        </el-select>
        <el-select v-model="ruleForm.type" placeholder="类型" style="width: 200px;margin-right:15px;">
            <el-option label="金额调整" value="0">
            </el-option>
            <el-option label="账户充值" value="1">
            </el-option>
        </el-select>


        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="流入账户" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.inFlowAccountName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="流出账户" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.outFlowAccountName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="金额" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.sum}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="流水类型" min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.type}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="原因" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.reason}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="货币类型" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.currencyType}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="备注" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="财务批次" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.finBatch}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="审核状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.status==0">待审核</span>
                <span v-else-if="scope.row.status==1">已通过</span>
                <span v-else-if="scope.row.status==2">未通过</span>
                <span v-else-if="scope.row.status==3">已完成</span>
            </template>
        </el-table-column>




       <el-table-column align="center" label="审核" width="350">
            <template slot-scope="scope">
                <el-button type="success" size="small" :disabled="scope.row.status != 0" plain @click="changeStatus(scope.row.id,0)">通过</el-button>
                <el-button type="warning" size="small" :disabled="scope.row.status != 0" plain @click="changeStatus(scope.row.id,1)">不通过</el-button>

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


    <el-dialog title="失败原因" :visible.sync="dialogFormVisible">
        <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6}"
        placeholder="请输入内容"
        v-model="financeForm.reason">
        </el-input>
        <div slot="footer" class="dialog-footer" :span="24">
          <el-button @click="dialogFormVisible = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="batchExam" size="medium">确 定</el-button>
        </div>
    </el-dialog>


  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {batchTmpPage,findCompanyIdOrName,batchExam} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            companyList:[],
            accList:[],
            reasonsList:[],
            ruleForm:{
                companyId:'',
                keyWord:'',
                status:'',
                type:'',
                pageNo:1,
                pageSize:10
            },
            financeForm:{
                id:'',
                option:'',
                reason:'',
            },
        }
    },
    created() {
        this.batchTmpPage();
        this.findCompanyIdOrName();
    },

    methods: {
        //获取列表
        async batchTmpPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await batchTmpPage(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.batchTmpPage.totalSize;
                    this.dataSource = res.data.data.batchTmpPage.list;
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
            this.batchTmpPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.batchTmpPage()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                id:'',
                versionsMark:'',
                type:'',
                pageNo:1,
                pageSize:10
            }
            this.batchTmpPage();
        },
        //搜索
        handleFilter(){
            this.batchTmpPage();
        },
        //查询所有公司
        async findCompanyIdOrName(){
            try {

                const res = await findCompanyIdOrName();

                if (res.data.code == 0) {
                    this.companyList = res.data.data;
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

        //点击改变状态
        changeStatus(id,status){
            if(status==0){
                this.financeForm = {
                    id:id,
                    option:status,
                    reason:'',
                };
                this.batchExam();
            }else{
                this.financeForm = {
                    id:id,
                    option:status,
                    reason:'',
                };
                this.dialogFormVisible = true;
            }
        },
        //提交审核结果
        async batchExam() {
            try {
                const res = await batchExam(this.financeForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '改变状态成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.batchTmpPage();
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


