<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="姓名" v-model="ruleForm.name"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="邮箱" v-model="ruleForm.mail"></el-input>
        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>


        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="employeesInc" size="medium" type="primary" icon="edit">员工充值</el-button>
        <router-link to="/prepaidRecords">
            <el-button class="filter-item" size="medium" type="primary" icon="edit">充值记录</el-button>
        </router-link>
        <el-button class="filter-item" style="float:right;margin-right:10px;" size="medium" type="primary" icon="edit" @click="billListExport">员工流水导出</el-button>
    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column
        type="selection"
        width="55"
        align="center">
        </el-table-column>

        <el-table-column align="center" label="姓名" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
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

        <el-table-column align="center" label="所属公司" min-width="180">
            <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="积分账户" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.fbAcc}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="点赞积分账户" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.ppAcc}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="积分冻结账户" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.fbfAcc}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="现金支出账户" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.cAcc}}</span>
            </template>
        </el-table-column>


       <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
                <el-button type="primary" size="small" :disabled="scope.row.id == 1" plain @click="batchFlowPage(scope.row.userId)">查看流水</el-button>

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

    <!-- 员工充值弹框 -->
    <el-dialog title="员工充值" :visible.sync="dialogFormVisible">
        <el-form label-width="120px">
                <el-form-item label="积分总额">
                    <el-input-number v-model="billForm.totalAmount" :min="0" placeholder="请输入积分总额"></el-input-number>
                </el-form-item>
                <el-form-item label="所属公司">
                    <el-select v-model="billForm.companyId" @change="accountOperateReasons">
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户类型">
                    <el-select v-model="billForm.accountType" placeholder="请选择类型">
                        <el-option
                        label="积分账户"
                        value="0">
                        </el-option>
                        <el-option
                        label="点赞积分账户"
                        value="1">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="充值原因">
                    <el-select v-model="billForm.reasonId" no-data-text="请先选择公司">
                        <el-option
                            v-for="item in accountList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="billForm.remark" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="上传文件">
                    <el-upload
                        ref="upload"
                        :auto-upload="false"
                        class="upload-demo"
                        style="display: inline-block;"
                        :action="basePath"
                        :onError="uploadError"
                        :onSuccess="uploadSuccess"
                        :data="billForm"
                        :headers="dataHeaders"
                        :file-list="fileList"
                        :beforeUpload="beforeAvatarUpload">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="下载模板">
                    <el-button size="medium" type="primary" @click="">下载</el-button>
                    Tip：请先选择类型
                </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="submitUpload">确 定</el-button>
        </div>

    </el-dialog>

    <!-- 浏览上传数据弹框 -->
    <el-dialog title="浏览上传数据" :visible.sync="dialogFormVisible2">
        <div>
            <span>积分总额:{{department.headInfo.sum}}</span>&nbsp;&nbsp;
            <span>所属公司:{{department.headInfo.companyName}}</span>&nbsp;&nbsp;
            <span>账户类型:{{department.headInfo.accountType}}</span>&nbsp;&nbsp;
            <span>充值原因:{{department.headInfo.templateType}}</span>&nbsp;&nbsp;
        </div>
        <el-table :data="department.overView" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="员工姓名" min-width="80">
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

            <el-table-column align="center" label="所属企业" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="导入结果" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.impRes}}</span>
                </template>
            </el-table-column>

        </el-table>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="impConfirm">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 导出员工流水时间范围弹框 -->
    <el-dialog class="billListExportDialog"  title="请选择您要导出的员工流水的时间范围" :visible.sync="dialogFormVisible3" center>
        <span class="staffOutBady">
            <el-date-picker
                v-model="exportDate.timeFrom"
                type="date"
                placeholder="流水时间" style="width: 200px;">
            </el-date-picker> 至
            <el-date-picker
                v-model="exportDate.timeEnd"
                type="date"
                placeholder="流水时间" style="width: 200px;margin-right:15px;">
            </el-date-picker>
        </span>
        <span slot="footer" class="dialog-footer dialog-footer-staff">
            <el-button @click="dialogFormVisible3 = false">取 消</el-button>
            <el-button type="primary" @click="billListExportCommit">确 定</el-button>
        </span>
    </el-dialog>


  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import Cookie from '../../../config/mUtils'
import {baseUrl} from '../../../config/env'
import {userAccountPage,findCompanyIdOrName,certainTypeReasons,impConfirm,userFlowExportBackStage} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            passAll:[],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            ruleForm:{
                name:'',
                email:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            },
            companyList:[],
            accountList:[],
            basePath:'',
            billForm:{
                totalAmount:'',
                companyId:'',
                accountType:'',
                reasonId:'',
                remark:'',
            },
            fileList:[],
            dataHeaders:{
                platformId:'',
                ut:'',
                Authorization:'',
                clientId:'',
                companyId:'',
                f:'',
                phoneModel:'',
                os:'',
                v:'',
                deviceId:''
            },
            dialogFormVisible2:false,
            department:{
                headInfo:{
                    companyName:'',
                    templateType:'',
                    accountType:'',
                    fileSequenceNumber:'',
                },

                overView:[],
            },
            dialogFormVisible3:false,
            prepaidList:[],
            prepaidForm:{
                pageNo:1,
                pageSize:10,
                count: null,
            },
            incType:1,
            dialogFormVisible3:false,
            exportDate:{
                timeFrom:'',
                timeEnd:''
            }
        }
    },
    created() {
        this.dataHeaders.ut = Cookie.mutations.fetch().cookieValue;
        this.dataHeaders.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        this.dataHeaders.Authorization = `${CryptoJS.MD5(Cookie.mutations.fetch().cookieValue + Cookie.mutations.fetch().id).toString()}`;;
        this.dataHeaders.clientId = 3;
        this.dataHeaders.companyId = `${"1"}`;
        this.dataHeaders.f = `${"3"}`;
        this.dataHeaders.phoneModel = `${"1.0.0"}`;
        this.dataHeaders.os = `${"1.0.0"}`;
        this.dataHeaders.v = `${"1.0.0"}`;
        this.dataHeaders.deviceId = `${"0001"}`;
        this.basePath = baseUrl+"/back-account-web/account/accountBackStage/userAccountRecharge.do";
        this.userAccountPage();
        this.findCompanyIdOrName();
    },

    methods: {
        //选择列表复选框
        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.userId);
            })
            this.passAll = arr;
        },
        //员工流水导出判断
        billListExport(){
            this.exportDate.timeFrom = '';
            this.exportDate.timeEnd ='';
            if(this.passAll && this.passAll.length==0){
                this.$message.error('请选择员工');
            }else{
                this.dialogFormVisible3 = true;
            }
        },
        //员工流水导出
        billListExportCommit(){
            if(!this.exportDate.timeFrom && !this.exportDate.timeEnd){
                this.$message.error('请选择导出时间范围');
            }else{
                this.userFlowExportBackStage();
            }
        },
        //获取员工流水导出
        async userFlowExportBackStage() {
            try {
                const res = await userFlowExportBackStage({userIds:JSON.stringify(this.passAll),begin:this.setTimestamp(this.exportDate.timeFrom),end:this.setTimestamp(this.exportDate.timeEnd)});

                if (res.data.code == 0) {
                    this.dialogFormVisible3 = false;
                    var f = document.createElement("form");
                    document.body.appendChild(f);
                    var i = document.createElement("input");
                    i.type = "hidden"; f.appendChild(i);
                    i.value = "5"; i.name = "price";
                    f.action = res.data.data.url; //下载的url 地址
                    f.submit();
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

        //获取列表
        async userAccountPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await userAccountPage(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.userAccountPage.totalSize;
                    this.dataSource = res.data.data.userAccountPage.list;
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
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.userAccountPage()
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
        //查询充值原因
        async accountOperateReasons(id){
            try {

                const res = await certainTypeReasons({companyId:id,types:'7,8'});

                if (res.data.code == 0) {
                    this.billForm.reasonId = '';
                    this.accountList = res.data.data.reasons;
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

        //查看流水
        batchFlowPage(id) {
            this.$router.push("/staffFlowList/"+id);
        },
        //查看流水分页
        handleSizeChange1(val) {
            this.ruleForm.pageSize = val;
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
                name:'',
                email:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            }
            this.userAccountPage();
        },
        //搜索
        handleFilter(){
            this.userAccountPage();
        },
        //充值导入
        employeesInc(){
            this.billForm = {
                totalAmount:'',
                companyId:'',
                accountType:'',
                reasonId:'',
                remark:'',
            };
            this.dialogFormVisible = true;
          //  this.$refs.upload.clearFiles();
            this.fileList = [];
        },


        async impConfirm(){
            try {
                var obj = new Object();
                obj.sn = this.department.headInfo.fileSequenceNumber;
                obj.confirm = this.incType;
                const res = await impConfirm(obj);

                if (res.data.code == 0) {
                    this.dialogFormVisible2 = false;
                    this.userAccountPage()
                } else if(res.data.code == 177){
                    this.$confirm('最近一周存在相同金额的导入，请确认是否重复导入?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.incType = 0;
                        this.impConfirm();
                        this.$message({
                            type: 'success',
                            message: '充值成功'
                        });
                    }).catch(() => {
                        this.dialogFormVisible = false;
                        this.dialogFormVisible2 = false;
                        this.$message({
                            type: 'info',
                            message: '已取消上传'
                        });
                    });
                }else {
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

        submitUpload() {
            this.$refs.upload.submit();
        },
        // 上传成功后的回调
        uploadSuccess (response, file, fileList) {
            if(response.code == 0){
                this.department = response.data;
                this.dialogFormVisible = false;
                this.dialogFormVisible2 = true;

            }else if(response.code == 169){
                this.$refs.upload.clearFiles();
                this.$confirm('导入的文件中部分信息存在错误，请下载并修改后重新导入', '提示', {
                    confirmButtonText: '下载',
                    type: 'error'
                }).then(() => {
                    window.open(response.error);
                }).catch(() => {

                });

            }else{
                this.$refs.upload.clearFiles();
                this.$message({
                    type: 'error',
                    message: response.error
                });
            }
        },
        // 上传错误
        uploadError (response, file, fileList) {
            this.$message({
                type: 'error',
                message: response.data.error
            });
        },
        // 上传前对文件的大小的判断
        beforeAvatarUpload (file) {
            const extension = file.name.split('.')[1] === 'xls'
            const extension2 = file.name.split('.')[1] === 'xlsx'
            const isLt2M = file.size / 1024 / 1024 < 5
            if (!extension && !extension2 ) {
                alert('上传模板只能是 xls、xlsx、doc、docx 格式!')
            }
            if (!isLt2M) {
                alert('上传模板大小不能超过 5MB!')
            }
            return extension || extension2 && isLt2M
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
  .staffOutBady{
    display:block;
    text-align:center;
  }
  .dialog-footer-staff .el-button{
      padding:12px 50px;
  }
  .billListExportDialog >>> .el-dialog {
    position: relative;
    margin: 0 auto 50px;
    background: #fff;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-sizing: border-box;
    width: 50%;
    padding: 20px 0;
}
</style>


