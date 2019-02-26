<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="批次号" v-model="ruleForm.batchNo"></el-input>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="所属公司" min-width="80">.
            <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="充值批次" min-width="120">
            <template slot-scope="scope">
                <span>{{scope.row.raBatch}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="财务批次" min-width="180">
            <template slot-scope="scope">
                <span>{{scope.row.finBatch}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="原因" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.reason}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="总金额" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.sum}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="时间" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.create_time}}</span>
            </template>
        </el-table-column>


       <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="userAccountRechargeRecDetail(scope.row.id)">查看详情</el-button>
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

    <el-dialog title="查看详情" :visible.sync="dialogFormVisible">
        <el-table :data="prepaidList" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="姓名" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="员工编号" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.memberCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="邮箱" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.email}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="金额" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.sum}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="所属公司" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>

        </el-table>
        <div class="pagination-container" style="text-align: left;margin-top: 10px;">
            <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page.sync="prepaidForm.pageNo"
            :page-sizes="[10,20,30, 50]"
            :page-size="prepaidForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="prepaidForm.count">
            </el-pagination>
        </div>

    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseUrl } from '../../../config/env'
import {userAccountRechargeRec,findCompanyIdOrName,userAccountRechargeRecDetail} from '../../../api/getData';
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
            ruleForm:{
                batchNo:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            },
            prepaidList:[],
            prepaidForm:{
                pageNo:1,
                pageSize:10,
                count: null,
            }


        }
    },
    created() {
        this.userAccountRechargeRec();
        this.findCompanyIdOrName();
    },

    methods: {
        //获取列表
        async userAccountRechargeRec() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await userAccountRechargeRec(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.recPage.totalSize;
                    this.dataSource = res.data.data.recPage.list;
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
            this.userAccountRechargeRec()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.userAccountRechargeRec()
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
        //获取充值记录列表
        async userAccountRechargeRecDetail(id) {
            try {

                const res = await userAccountRechargeRecDetail({pageSize:this.prepaidForm.pageSize,pageNo:this.prepaidForm.pageNo,batchId:id});

                if (res.data.code == 0) {
                    this.dialogFormVisible = true;
                    this.prepaidForm.count = res.data.data.detailPage.totalSize;
                    this.prepaidList = res.data.data.detailPage.list;
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
        //充值记录详情分页
        handleSizeChange1(val) {
            this.prepaidForm.pageSize = val;
            this.userAccountRechargeRec()
        },
        handleCurrentChange1(val) {
            this.prepaidForm.pageNo = val;
            this.offset = (val - 1) * this.prepaidForm.pageSize;
            this.userAccountRechargeRec()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                batchNo:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            }
            this.userAccountRechargeRec();
        },
        //搜索
        handleFilter(){
            this.userAccountRechargeRec();
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
  .el-upload-list{
    display:none;
  }
</style>


