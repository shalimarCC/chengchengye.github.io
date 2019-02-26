<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="企业名称" v-model="ruleForm.companyName"></el-input>
        <el-date-picker
            v-model="ruleForm.createTimeStamp"
            type="date"
            placeholder="提交时间" style="width: 200px;">
        </el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="企业名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="姓名" min-width="100">
           <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>

            </template>
        </el-table-column>

        <el-table-column align="center" label="电话" min-width="100">
           <template slot-scope="scope">
                <span>{{scope.row.phone}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="邮箱" min-width="100">
           <template slot-scope="scope">
                {{scope.row.mail}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="提交时间" min-width="100">
           <template slot-scope="scope">
                {{setTime(scope.row.createTime)}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="处理时间" min-width="100">
           <template slot-scope="scope">
                {{setTime(scope.row.dealTime)}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="处理人" min-width="100">
           <template slot-scope="scope">
                {{scope.row.dealUserName}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="数据来源" min-width="100">
           <template slot-scope="scope">
                <span v-if="scope.row.clientType == 0">Web</span>
                <span v-else-if="scope.row.clientType == 1">H5</span>
                <span v-else-if="scope.row.clientType == 2">微信</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="状态" min-width="100">
           <template slot-scope="scope">
                <span v-if="scope.row.status == 0">未处理</span>
                <span v-else-if="scope.row.status == 1">已处理</span>
            </template>
        </el-table-column>

       <el-table-column align="center" label="操作" width="350">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="findTrialApplyById(scope.row.id)">查看详情</el-button>
                <el-button type="primary" size="small" v-if="scope.row.status == 0" plain @click="companyInvalid(scope.row.id)">设为已处理</el-button>
                <el-button type="warning" size="small" v-else-if="scope.row.status == 1" plain>已处理</el-button>
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


    <el-dialog title="申请详情" :visible.sync="dialogFormVisible">

        <el-form label-width="200px">
            <el-form-item label="企业名称">
                <span>{{applyForm.companyName}}</span>
            </el-form-item>

            <el-form-item label="企业规模（人数）">
                <span v-if="applyForm.companyScale==0">1-50人</span>
                <span v-else-if="applyForm.companyScale==1">51-100人</span>
                <span v-else-if="applyForm.companyScale==2">101-500人</span>
                <span v-else-if="applyForm.companyScale==3">501-2000人</span>
                <span v-else-if="applyForm.companyScale==4">2001-5000人</span>
                <span v-else-if="applyForm.companyScale==5">5000人以上</span>
            </el-form-item>

            <el-form-item label="姓名">
                <span>{{applyForm.userName}}</span>
            </el-form-item>

            <el-form-item label="电话">
                <span>{{applyForm.phone}}</span>
            </el-form-item>

            <el-form-item label="职位">
                <span>{{applyForm.position}}</span>
            </el-form-item>

            <el-form-item label="邮箱">
                <span>{{applyForm.mail}}</span>
            </el-form-item>

            <el-form-item label="数据来源">
                <span v-if="applyForm.clientType == 0">Web</span>
                <span v-else-if="applyForm.clientType == 1">H5</span>
                <span v-else-if="applyForm.clientType == 2">微信</span>
            </el-form-item>

            <el-form-item label="留言">
                <span>{{applyForm.message}}</span>
            </el-form-item>

        </el-form>

    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findTrialApplyOfPage,findTrialApplyById,dealTrialApply} from '../../../api/getData';
export default {
    data() {
        return {

            ruleForm:{
                companyName:'',
                createTimeStamp:'',
                pageNo:1,
                pageSize:10
            },

            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            applyForm:{}


        }
    },
    created() {
        this.findTrialApplyOfPage();


    },

    methods: {
        //获取列表
        async findTrialApplyOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                if(obj.createTimeStamp!=''&&obj.createTimeStamp!=null){
                    obj.createTimeStamp = this.setTimestamp(obj.createTimeStamp);
                }
                this.listLoading = false;
                const res = await findTrialApplyOfPage(obj);

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
            this.limit = val;
            this.findTrialApplyOfPage()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.findTrialApplyOfPage()
        },
        //重置
        resetForm() {
            this.ruleForm = {
                companyName:'',
                createTimeStamp:'',
                pageNo:1,
                pageSize:10
            },
            this.findTrialApplyOfPage();
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findTrialApplyOfPage();
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
            return y + '-' + m + '-' + d
        },
        //时间转换时间戳
        setTimestamp(time) {
            const t = new Date(time);
            return t.getTime()
        },




        //查看详情
        async findTrialApplyById(id){
            try {
                const res = await findTrialApplyById({ id:id });
                if (res.data.code == 0) {

                    this.dialogFormVisible = true;
                    this.applyForm = res.data.data;

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

        //确认已处理
        companyInvalid(id){
            this.$confirm('确认该申请已处理完毕？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dealTrialApply(id);
            }).catch(() => {

            });
        },
        async dealTrialApply(id){
            try {
                const res = await dealTrialApply({ id:id });
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '处理成功'
                    });
                    this.findTrialApplyOfPage();
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


