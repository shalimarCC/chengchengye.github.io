<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="姓名" v-model="ruleForm.name"></el-input>
        <el-select v-model="ruleForm.sex" placeholder="性别">
            <el-option
            label="男"
            value="1">
            </el-option>
            <el-option
            label="女"
            value="0">
            </el-option>
        </el-select>
        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="ruleForm.status" placeholder="注册状态">
            <el-option
            label="已注册"
            value="1">
            </el-option>
            <el-option
            label="未注册"
            value="0">
            </el-option>
        </el-select>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="手机号码" v-model="ruleForm.mobile"></el-input>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="邮箱" v-model="ruleForm.email"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="员工编号" v-model="ruleForm.memberCode"></el-input>
        <el-select v-model="ruleForm.isAvailable" placeholder="在职状态">
            <el-option
            label="在职"
            value="1">
            </el-option>
            <el-option
            label="离职"
            value="0">
            </el-option>
        </el-select>
        <el-select v-model="ruleForm.accountStatus" placeholder="账号状态">
            <el-option
            label="有效"
            value="0">
            </el-option>
            <el-option
            label="无效"
            value="1">
            </el-option>
        </el-select>
        <el-select v-model="ruleForm.channelId" placeholder="渠道短码">
            <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="活动短码" v-model="ruleForm.campaignCode"></el-input>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

        <el-button class="filter-item" @click="addStaff" style="float:right" type="primary" icon="edit" size="medium">添加</el-button>
        <el-button class="filter-item" @click="incStaff" style="float:right" type="primary" icon="edit" size="medium">员工导入</el-button>
        <el-button class="filter-item" @click="getOut" style="float:right" type="primary" icon="edit" size="medium">登录记录导出</el-button>

    </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" @selection-change="handleSelectionChange" border fit highlight-current-row style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column align="center" label="姓名" min-width="80">.
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="员工编号" min-width="120">
            <template slot-scope="scope">
                <span>{{scope.row.memberCode}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="邮箱" min-width="180">
            <template slot-scope="scope">
                <span>{{scope.row.mail}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="手机号码" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.mobile}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="性别" min-width="40">
            <template slot-scope="scope">
                <span v-if="scope.row.sex == 0">女</span>
                <span v-else-if="scope.row.sex == 1">男</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="生日" min-width="100">
            <template slot-scope="scope">
                {{setTime(scope.row.birthday)}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属公司" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所在部门" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.departmentName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="注册状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 0">未注册</span>
                <span v-else-if="scope.row.status == 1">已注册</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="渠道短码" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.channelShortCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动短码" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.campaignCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="注册门店码" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.registerShopCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="在职状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isavailable == 0">离职</span>
                <span v-else-if="scope.row.isavailable == 1">在职</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="离职时间" min-width="100">
            <template slot-scope="scope">
                {{setTime(scope.row.quitTime)}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="账号状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.accountStatus == 1">无效</span>
                <span v-else-if="scope.row.accountStatus == 0">有效</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="资产回收日期" min-width="100">
            <template slot-scope="scope">
                {{setTime(scope.row.invalidTime)}}
            </template>
        </el-table-column>

       <el-table-column align="center" label="操作" width="250" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="findAboutUser(scope.row.userId)">编辑</el-button>
                <!-- <el-button type="primary" size="small" plain :disabled="scope.row.accountStatus == 1" @click="setDisabled(scope.row.userId)">设为失效</el-button> -->
                <el-button type="primary" size="small" plain :disabled="scope.row.isavailable == 1" @click="resetStatus(scope.row.userId)">状态重置</el-button>
                <el-button type="primary" size="small" plain  @click="loginRecord(scope.row.userId)">登录记录</el-button>
                <div v-if="scope.row.loginIsBackAccountMannager == 1">
                    <el-button type="primary" size="small" plain v-if="scope.row.isAdministrator == 0"  @click="resetManage(scope.row.userId)">设为管理员</el-button>
                    <el-button type="primary" size="small" plain v-if="scope.row.isAdministrator == 1"  @click="resetManage(scope.row.userId)">取消管理员</el-button>
                </div>
            </template>
        </el-table-column>

    </el-table>
    <!-- 分页 -->
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
    <!-- 新增与编辑员工 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="120px" :rules="dataFormRules" ref="staffForm" :model="staffForm">
            <el-form-item label="员工姓名">
                <el-input v-model="staffForm.name" placeholder="请输入员工姓名"></el-input>
            </el-form-item>

            <el-form-item label="员工编号" prop="memberCode">
                <el-input v-model="staffForm.memberCode" placeholder="请输入员工编号" :disabled="dialogTitle=='编辑员工'"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="mail">
                <el-input v-model="staffForm.mail" placeholder="请输入邮箱" :disabled="dialogTitle=='编辑员工'"></el-input>
            </el-form-item>

            <el-form-item label="性别">
                <el-select v-model="staffForm.sex" placeholder="请输入性别">
                    <el-option
                    label="男"
                    :value="1">
                    </el-option>
                    <el-option
                    label="女"
                    :value="0">
                    </el-option>

                    <el-option
                    label="未选择"
                    :value="-1"
                    v-show="false">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="生日">
                <el-date-picker
                    v-model="staffForm.birthday"
                    type="date"
                    placeholder="选择生日日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="手机号码">
                <el-input v-model="staffForm.mobile" placeholder="请输入手机号码" :disabled="dialogTitle=='编辑员工'"></el-input>
            </el-form-item>

            <el-form-item label="所属公司" prop="companyId">
                <el-select v-model="staffForm.companyId"  @change="depTreeByCompany" :disabled="dialogTitle=='编辑员工'">
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所在部门">
                <el-cascader
                :options="options"
                :props="props"
                placeholder="请先选择公司"
                v-model="departmentId"
                change-on-select
                :disabled="staffForm.companyId == ''"
                ></el-cascader>
            </el-form-item>

            <!-- <el-form-item label="是否设为管理员" v-if="isSuperAdministrator == 1">
                <el-radio-group v-model="staffForm.isAdministrator">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item> -->

        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="insertOrUpdate">确 定</el-button>
        </div>

    </el-dialog>
    <!-- 员工导入 -->
    <el-dialog title="导入员工" :visible.sync="dialogFormVisible1">
        <el-form label-width="120px">
            <el-form-item label="所属公司">
                <el-select v-model="incForm.companyId"  @change="depTreeByCompany">
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-button size="small" type="primary" @click="clearStaffImport">清除缓存</el-button>
                <p v-if="importWarn" style="color:#f00;">所属公司存在缓存信息时会导致导入员工失败</p>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="incForm.tempType" placeholder="请选择类型">
                    <el-option
                    label="离职员工导入"
                    value="1">
                    </el-option>
                    <el-option
                    label="新员工导入"
                    value="2">
                    </el-option>
                    <el-option
                    label="员工部门导入"
                    value="3">
                    </el-option>
                    <el-option
                    label="员工名单重导入"
                    value="10">
                    </el-option>
                </el-select>
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
                    :data="incForm"
                    :headers="dataHeaders"
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
            <el-button size="medium" @click="dialogFormVisible1 = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="submitUpload">确 定</el-button>
        </div>

    </el-dialog>

    <el-dialog title="浏览上传数据" :visible.sync="dialogFormVisible2">
        <div>
            <span>公司名称:{{department.headInfo.companyName}}</span>&nbsp;&nbsp;
            <span>模板类型:{{department.headInfo.templateType}}</span>&nbsp;&nbsp;
            <span>创建时间:{{setTime(department.headInfo.generatedTime)}}</span>&nbsp;&nbsp;
            <span>文件序号:{{department.headInfo.fileSequenceNumber}}</span>&nbsp;&nbsp;
        </div>
        <el-table :data="department.overView" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="员工姓名" min-width="80" v-if="incForm.tempType!=3">
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
                    <span>{{scope.row.mail}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="部门编号" min-width="80" v-if="incForm.tempType==3">
                <template slot-scope="scope">
                    <span>{{scope.row.departmentId}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="性别" min-width="80" v-if="incForm.tempType==2">
                <template slot-scope="scope">
                    <span v-if="scope.row.sex == 0">女</span>
                <span v-else-if="scope.row.sex == 1">男</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="手机号码" min-width="120" v-if="incForm.tempType==2">
                <template slot-scope="scope">
                    <span>{{scope.row.mobile}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="离职日期" min-width="80" v-if="incForm.tempType==1">
                <template slot-scope="scope">
                    <span>{{scope.row.quitTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="失效日期" min-width="80" v-if="incForm.tempType==1">
                <template slot-scope="scope">
                    <span>{{scope.row.invalidTime}}</span>
                </template>
            </el-table-column>

        </el-table>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="assureImportAboutUser">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="请选择导出时间范围:" :visible.sync="dialogFormVisible3">
        <el-form>
            <el-form-item label="登录时间">
                <el-date-picker
                    v-model="startEndTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="登录时间(起)"
                    end-placeholder="结束日期(止)">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible3 = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="userLoginByUserIds">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseUrl } from '../../../config/env';
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import Cookie from '../../../config/mUtils';
import {
    userExtendAllOfPage,
    upadteBackAccountMannager,
    findCompanyIdOrName,
    clearImportMemoryBackStage,
    insertOrUpdate,
    depTreeByCompany,
    assureImportAboutUser,
    findAboutUser,
    resetStatus,
    findImportTemplateDictUrlByType,
    findChannelAll
    ,userLoginByUserIds
} from '../../../api/getData';
export default {
    data() {
        return {
            importWarn:true,
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            dialogTitle:'新增员工',
            ruleForm:{
                mobile:'',
                name:'',
                sex:'',
                status:'',
                isAvailable:'',
                accountStatus:'',
                memberCode:'',
                email:'',
                companyId:'',
                channelId:'',
                campaignCode:'',
                // registerShopCode:'',
                pageNo:1,
                pageSize:10
            },
            dialogFormVisible3:false,
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
            startEndTime:'',
            companyList:[],
            staffForm:{
                id:'',
                name:'',
                memberCode:'',
                mail:'',
                sex:'',
                birthday:'',
                mobile:'',
                companyId:'',
                departmentIdArr:[],
                isAdministrator:'',
            },
            departmentId:[],
            dataFormRules:{
                memberCode:[
                    {required: true, message: '请输入员工编号', trigger: 'blur'}
                ],
                mail:[
                    {required: true, message: '请输入邮箱', trigger: 'blur'}
                ],
                companyId:[
                    {required: true, message: '请输入所属公司', trigger: 'blur'}
                ],

            },
            props:{
                value:'id',
                children:'children',
                label:'name'
            },
            options: [],
            basePath:'',
            dialogFormVisible1:false,
            incForm:{
                tempType:'',
                companyId:''
            },
            dialogFormVisible2:false,
            department:{
                headInfo:{
                    companyName:'',
                    templateType:'',
                    generatedTime:'',
                    fileSequenceNumber:'',
                },

                overView:[],
            },
            incType:1,
            isSuperAdministrator:0,
            typeList:[],
            setDisabledList:[],
            passAll:'',
            startTime:'',
            endTime:''
        }
    },
    created() {
        this.isSuperAdministrator = this.$store.state.Cookie.mutations.fetch().isSuperAdministrator;
        this.dataHeaders.ut = this.$store.state.Cookie.mutations.fetch().cookieValue;
        this.dataHeaders.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        this.dataHeaders.Authorization = `${CryptoJS.MD5(Cookie.mutations.fetch().cookieValue + Cookie.mutations.fetch().id).toString()}`;;
        this.dataHeaders.clientId = 3;
        this.dataHeaders.companyId = `${"1"}`;
        this.dataHeaders.f = `${"3"}`;
        this.dataHeaders.phoneModel = `${"1.0.0"}`;
        this.dataHeaders.os = `${"1.0.0"}`;
        this.dataHeaders.v = `${"1.0.0"}`;
        this.dataHeaders.deviceId = `${"0001"}`;
        this.basePath = baseUrl+"/back-user-web/user/user/userImport.do";
        this.userExtendAllOfPage();
        this.findCompanyIdOrName();
        this.findChannelAll();
    },

    methods: {
        //全选
        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.userId);
            });
            this.passAll = JSON.stringify(arr);
        },
        //登录记录
        loginRecord(userId){
            this.$router.push('/loginRecord'+'?'+'userId='+userId)
        },
        getOut(){
            this.dialogFormVisible3 = true;
        },
        //获取导出
        userLoginByUserIds() {
            if(this.startEndTime[0]!='' && this.startEndTime[0]!=undefined){
                this.startTime =  this.setTimestamp(this.startEndTime[0]);
            }
            if(this.startEndTime[1]!='' && this.startEndTime[1]!=undefined){
                this.endTime =  this.setTimestamp(this.startEndTime[1]);
            }
            window.location.href = baseUrl +'/back-user-web/user/userLogin/userLoginByUserIds.do?userIds='+this.passAll+
                '&startTime='+this.startTime+'&endTime='+this.endTime+'&platformId='+this.dataHeaders.platformId;
        },
        //获取渠道
        async findChannelAll() {
            try {
                const res = await findChannelAll();
                if (res.data.code == 0) {
                    this.typeList = res.data.data;
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
        async userExtendAllOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await userExtendAllOfPage(obj);

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
        //根据公司ID查询部门
        async depTreeByCompany(){

            try{
                if(this.staffForm.companyId == ''){
                    return;
                }
                const res = await depTreeByCompany({companyId:this.staffForm.companyId});
                if(res.data.code == 0){
                    this.options = res.data.data.tree;

                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
            this.$message({
                type: 'error',
                message: '获取数据失败,请联系管理员！404'
            });

            }
        },
        //状态重置
        async resetStatus(id){

            try{
                const res = await resetStatus({id:id});
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        message: '状态重置成功'
                    });
                    this.userExtendAllOfPage()
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
            this.$message({
                type: 'error',
                message: '获取数据失败,请联系管理员！404'
            });

            }
        },
        //设为失效
        // async setDisabled(memberCode){
        //      try {
        //         this.listLoading = false;
        //         const res = await userExtendAllOfPage({memberCode:memberCode});
        //         if (res.data.code == 0) {
        //             this.setDisabledList = res.data.data.list;
        //            console.log(this.setDisabledList);
        //         } else {
        //             this.$message({
        //                 type: 'error',
        //                 message: res.data.error
        //             });
        //         }
        //     } catch (err) {
        //         this.$message({
        //             type: 'error',
        //             message: '获取数据失败,请联系管理员！404'
        //         });

        //     }
        // },
        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.userExtendAllOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.userExtendAllOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm = {
                mobile:'',
                name:'',
                sex:'',
                status:'',
                accountStatus:'',
                memberCode:'',
                email:'',
                isDeleted:'',
                companyId:'',
                channelId:'',
                campaignCode:'',
                // registerShopCode:'',
                pageNo:1,
                pageSize:10
            }
            this.userExtendAllOfPage();
        },
        //搜索
        handleFilter(){
            this.userExtendAllOfPage();
        },
        //新增
        addStaff(){
            this.dialogTitle = '新增员工';
            this.staffForm = {
                id:'',
                name:'',
                memberCode:'',
                mail:'',
                sex:'',
                birthday:'',
                mobile:'',
                companyId:'',
                departmentIdArr:'',
                isAdministrator:'',
            };
            this.departmentId = [];
            this.dialogFormVisible = true;
        },

        //编辑
        async findAboutUser(id){

            try{
                this.dialogTitle = '编辑员工';
                const res = await findAboutUser({id:id});
                if(res.data.code == 0){
                    this.staffForm = res.data.data;
                    this.depTreeByCompany();
                    if(res.data.data.departmentIdArr !== null){
                        this.departmentId = res.data.data.departmentIdArr;

                    }else{
                        this.departmentId = [];
                    }

                    this.dialogFormVisible = true;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
            this.$message({
                type: 'error',
                message: '获取数据失败,请联系管理员！404'
            });

            }
        },

        //保存
        async insertOrUpdate () {
            try {
                let obj = JSON.parse(JSON.stringify(this.staffForm));
                if(obj.birthday!="" && obj.birthday!=null){
                    obj.birthday = this.setTimestamp(obj.birthday);
                }else{
                    obj.birthday = '';
                }
                obj.departmentIdArr = JSON.stringify(this.departmentId);
                const res = await insertOrUpdate(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '操作成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    //this.resetForm();
                    this.userExtendAllOfPage();
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

        //导入
        incStaff(){
            this.incForm = {
                tempType:'',
                companyId:''
            }
            this.dialogFormVisible1 = true;
            if(this.$refs.upload!=undefined){
                this.$refs.upload.clearFiles();
            }

        },
        //清除缓存缓存
        clearStaffImport(){
            this.clearImportMemoryBackStage();
        },
        //缓存操作
        async clearImportMemoryBackStage(){
            try{
                const res = await clearImportMemoryBackStage({companyId:this.incForm.companyId,type:this.incForm.tempType});
                if(res.data.code == 0){
                    console.log(res.data.data);
                    this.$message({
                        type: 'success',
                        message: res.data.data
                    });
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
            }
        },
        //保存
        async assureImportAboutUser(){
            try {
                let obj = new Object();
                obj.type = this.incType;
                obj.companyId = this.incForm.companyId;
                obj.userInfo = this.department.userInfo;
                obj.importUserInfo = this.department.importUserInfo;
                obj.templateType = this.department.headInfo.templateType;
                const res = await assureImportAboutUser(obj);

                if(res.data.code==0){
                    this.$notify({
                        title: '成功',
                        message: '导入成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible2 = false;

                }else if(res.data.code == 175){
                    this.$confirm('导入的文件中部分员工已完善部门信息，是否覆盖原有部门信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.incType = 0;
                        this.assureImportAboutUser();
                    }).catch(() => {
                        this.dialogFormVisible1 = false;
                        this.dialogFormVisible2 = false;
                        this.$message({
                            type: 'info',
                            message: '已取消上传'
                        });
                    });

                }else{

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

        //是否设为管理员
        async resetManage(id){
            try {
                this.listLoading = false;
                const res = await upadteBackAccountMannager({id:id});
                if (res.data.code == 0) {
                    this.userExtendAllOfPage();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员'
                });

            }
        },
        //时间戳转换
        setTime(time) {
            if(time!=null && time!=''){
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
            }else{
                return ''
            }

        },
        //时间转换时间戳
        setTimestamp(time) {
            const t = new Date(time);
            return t.getTime()
        },

        //上传确认
        submitUpload() {
            this.$refs.upload.submit();
        },
        // 上传成功后的回调
        uploadSuccess (response, file, fileList) {
            if(response.code == 0){
                this.dialogFormVisible1 = false;
                this.department = response.data.success;
                this.dialogFormVisible2 = true;
            }else if(response.code == 169){

                this.$confirm('导入的文件中部分信息存在错误，请下载并修改后重新导入', '提示', {
                    confirmButtonText: '下载',
                    type: 'error'
                }).then(() => {
                    window.open(response.error);
                }).catch(() => {

                });

            }else{
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
  .el-upload-list{
    display:none;
  }
</style>


