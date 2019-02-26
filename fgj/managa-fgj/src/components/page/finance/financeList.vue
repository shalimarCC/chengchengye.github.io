<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="账户名称" v-model="ruleForm.accountName"></el-input>
        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="ruleForm.disabled" placeholder="有效状态" style="width: 200px;margin-right:15px;">
            <el-option label="有效" value="0">
            </el-option>
            <el-option label="失效" value="1">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="accountRecharge('')" size="medium" type="primary" icon="edit">账户充值</el-button>
    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="账户名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="账户余额" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.balance}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属公司" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="有效状态" min-width="50">
            <template slot-scope="scope">
                <span v-if="scope.row.disabled==0">有效</span>
                <span v-else-if="scope.row.disabled==1">失效</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>





       <el-table-column align="center" label="操作" width="350">
            <template slot-scope="scope">
                <el-button type="success" size="small" :disabled="scope.row.companyId == 1" v-if="scope.row.disabled==1" plain @click="changeStatus(scope.row.id,0)">设为有效</el-button>
                <el-button type="warning" size="small" :disabled="scope.row.companyId == 1" v-if="scope.row.disabled==0" plain @click="changeStatus(scope.row.id,1)">设为失效</el-button>
                <el-button type="primary" size="small" :disabled="scope.row.companyId == 1 || scope.row.disabled==1" plain @click="accountRecharge(scope.row.id)">调整余额</el-button>
                <router-link :to="'/accountDetails/'+scope.row.id"><el-button type="primary" size="small" plain>账户明细</el-button></router-link>
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


    <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form label-width="120px">
                <el-form-item label="充值账户" v-if="this.title=='账户充值'">
                    <el-select v-model="financeForm.accountId" placeholder="请选择充值账户"  @change="certainTypeReasonsCompany">
                        <el-option
                            v-for="item in accList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="this.title=='账户充值'?'充值金额':'调整金额'">
                    <el-input v-model="financeForm.sum"></el-input>

                </el-form-item>

                <el-form-item :label="this.title=='账户充值'?'充值原因':'调整原因'">
                    <el-select v-model="financeForm.reasonId" placeholder="请选择充值原因">
                        <el-option
                            v-for="item in reasonsList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="financeForm.remark"></el-input>
                </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="raSubmitForExam">确 定</el-button>
        </div>

    </el-dialog>


  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {recoverAccountBalance,companyAccountPage,findCompanyIdOrName,normalAccounts,certainTypeReasons,raSubmitForExam,changeAccountDisable,AccountDisabledLock,releaseAccountLock} from '../../../api/getData';
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
                disabled:'',
                accountName:'',
                pageNo:1,
                pageSize:10
            },
            financeForm:{
                accountId:'',
                sum:'',
                reasonId:'',
                remark:'',
            },
            title:'账户充值',
            raType:''
        }
    },
    created() {
        this.companyAccountPage();
        this.findCompanyIdOrName();
    },

    methods: {
        //获取列表
        async companyAccountPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await companyAccountPage(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.accountPage.totalSize;
                    this.dataSource = res.data.data.accountPage.list;
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
            this.companyAccountPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.companyAccountPage()
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
            this.companyAccountPage();
        },
        //搜索
        handleFilter(){
            this.companyAccountPage();
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
        //普通公司账户列表
        async normalAccounts(){
            try {

                const res = await normalAccounts();

                if (res.data.code == 0) {
                    this.accList = res.data.data.accounts;
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
         //获取账户操作原因列表
        async certainTypeReasonsCompany(id){
            try {

                const res = await certainTypeReasons({types:this.raType,accountId:id});

                if (res.data.code == 0) {
                    this.financeForm.reasonId = '';
                    this.reasonsList = res.data.data.reasons;
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
         //获取账户操作原因列表
        async certainTypeReasons(id){
            try {

                const res = await certainTypeReasons({types:this.raType,accountId:id});

                if (res.data.code == 0) {
                    this.financeForm.reasonId = '';
                    this.reasonsList = res.data.data.reasons;
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

        //账户充值
        accountRecharge(id){

            this.financeForm = {
                accountId:id,
                sum:'',
                reasonId:'',
                remark:'',
            };
            if(id==''){
                this.raType = '0';
                this.title = '账户充值';
                this.normalAccounts();
            }else{
                this.title = '调整余额';
                this.raType = '1,11';
                this.normalAccounts();
                this.certainTypeReasons(id);
            }
            this.dialogFormVisible = true;
        },
        //提交充值
        async raSubmitForExam() {
            try {
                const res = await raSubmitForExam(this.financeForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '操作成功,请等待审核',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.companyAccountPage();
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
        async changeStatus(id,type){
               if(type==1){
                    this.$confirm('企业账户失效后，企业账户以及该企业所有员工账户都将清零，确定执行该操作？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.changeAccountDisable(id,type);
                    }).catch(() => {
                    });
                }else{
                    this.changeAccountDisable(id,type);
                }
        },
        async recoverAccountBalance(id,recover){
            try {
                const res = await recoverAccountBalance({id:id,recover:recover});
                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '改变状态成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.companyAccountPage();
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
        async changeAccountDisable(id,type) {
            try {
                const res = await changeAccountDisable({id:id,disabled:type});

                if (res.data.code == 0) {
                    if(res.data.data.dialog == 1){
                        this.$confirm('是否恢复企业账户失效前数据？', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning'
                        }).then(() => {
                            this.recoverAccountBalance(id,1);
                        }).catch(() => {
                            this.recoverAccountBalance(id,0);
                        });
                    };
                    this.companyAccountPage();
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
        async recoverAccountBalance(id,recover){
            try {
                const res = await recoverAccountBalance({id:id,recover:recover});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '设置成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.companyAccountPage();
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
        //解锁
        async releaseAccountLock(id){
            try{
                const res= await releaseAccountLock({id:id,type:1});
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        message: '解除不可操作状态，可继续进行状态设置操作'
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
            }
        },
        //编辑
        async editChannel(id) {
            try {
                const res = await findChannelById({id:id});

                if (res.data.code == 0) {
                    this.financeForm = {
                        id:res.data.data.id,
                        name:res.data.data.name,
                        type:res.data.data.type,
                        shortCode:res.data.data.shortCode,
                        path:res.data.data.path,
                    };
                    this.title = '编辑版本';
                    this.dialogFormVisible = true;
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

        //保存按钮
        saveChannel(){
            if(this.financeForm.id == ''){
                this.insertChannelWithTx();
            }else{
                this.updateChannelByIdWithTx();
            }
        },



        //编辑保存

        async updateChannelByIdWithTx() {
            try {
                const res = await updateChannelByIdWithTx(this.financeForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改渠道成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findChannelOfPage();
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


