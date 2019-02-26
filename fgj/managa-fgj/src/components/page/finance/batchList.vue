<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">
        <el-switch
        v-model="ruleForm.tableType"
        active-text="正式"
        :active-value="1"
        :inactive-value="0"
        inactive-text="草稿"
        @change="changeType">
        </el-switch>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-left:100px;margin-right:15px;" class="filter-item" placeholder="充值/调整批次号" v-model="ruleForm.batchNo"></el-input>

        <el-select v-model="ruleForm.status" placeholder="状态" style="width: 200px;margin-right:15px;">
            <el-option label="待审核" value="0">
            </el-option>
            <el-option label="已通过" value="1">
            </el-option>
            <el-option label="未通过" value="2">
            </el-option>
        </el-select>
        <el-select v-model="ruleForm.type" placeholder="类型" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in flowList"
                :key="item.type"
                :label="item.name"
                :value="item.type">
            </el-option>
        </el-select>


        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="充值/调整批次" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.raBatch}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="财务批次" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.finBatch}}</span>
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

        <el-table-column align="center" label="货币类型" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.currencyType}}</span>
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

        <el-table-column align="center" label="流水条数" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.flowAmount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="时间" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.status==0">待审核</span>
                <span v-else-if="scope.row.status==1">已通过</span>
                <span v-else-if="scope.row.status==2">未通过</span>
                <span v-else-if="scope.row.status==3">已完成</span>
            </template>
        </el-table-column>




       <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
                <el-button type="success" size="small" v-if="scope.row.status == 1||scope.row.status == 3" plain @click="batchFlowList(scope.row.id)">查看流水</el-button>
                <el-button type="primary" size="small" v-else-if="scope.row.status == 0" disabled plain>等待审核</el-button>
                <el-button type="danger" size="small" v-else-if="scope.row.status == 2" @click="causeBatch(scope.row.id)" plain>查看原因</el-button>
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
import {fullBatchPage,flowTypeList,batchExamReason} from '../../../api/getData';
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
                tableType:0,
                batchNo:'',
                status:'',
                type:'',
                pageNo:1,
                pageSize:10
            },
            flowList:[]
        }
    },
    created() {
        this.fullBatchPage();
        this.flowTypeList();
    },

    methods: {
        //获取列表
        async fullBatchPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await fullBatchPage(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.batchPage.totalSize;
                    this.dataSource = res.data.data.batchPage.list;
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
            this.fullBatchPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.fullBatchPage()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                tableType:0,
                batchNo:'',
                status:'',
                type:'',
                pageNo:1,
                pageSize:10
            }
            this.fullBatchPage();
        },
        //搜索
        handleFilter(){
            this.fullBatchPage();
        },
        //失败原因
        async causeBatch (id){
            try {

                const res = await batchExamReason({id:id});
                if (res.data.code == 0) {
                    this.$notify({
                        title: '失败原因',
                        message: res.data.data.reason,
                        type: 'warning',
                        duration: 5000
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }

            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },
        //查询所有公司
        async flowTypeList(){
            try {

                const res = await flowTypeList();

                if (res.data.code == 0) {
                    this.flowList = res.data.data.list;
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

        batchFlowList(id){
            this.$router.push("/batchFlowList/"+id)
        },

        changeType(event){
            this.ruleForm = {
                tableType:event,
                batchNo:'',
                status:'',
                type:'',
                pageNo:1,
                pageSize:10
            }
            this.fullBatchPage();
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


