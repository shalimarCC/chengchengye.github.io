<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="消息内容" v-model="ruleForm.systemInfo">
        </el-input>

        <el-select v-model="ruleForm.type" placeholder="发送方式" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in sendWayTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.isAdmin" placeholder="发送对象" style="width: 200px;margin-right:15px;">
            <el-option
                key="0"
                label="用户"
                value="0">
            </el-option>

            <el-option
                key="1"
                label="管理员"
                value="1">
            </el-option>
        </el-select>



        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

    </div>

    <div style="margin-bottom:20px;">
        <el-button class="filter-item" type="primary" size="medium" @click="addMessage">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">


        <el-table-column align="center" label="编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="消息内容" min-width="350">
            <template slot-scope="scope">
                <span>{{scope.row.systemInfo}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发送方式" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.type}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发送对象" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.isAdmin==1">管理员</span>
                <span v-if="scope.row.isAdmin==0">用户</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发送数量" min-width="150">
            <template slot-scope="scope">
                <el-button type="text" @click="findUserInfoOfPage(scope.row.id)">{{scope.row.userSum}}</el-button>
            </template>
        </el-table-column>

        <el-table-column align="center" label="备注" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.infoRemark}}</span>
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

    <el-dialog title="新增消息" :visible.sync="dialogFormVisible" size="tiny">
        <el-form ref="form" :model="form" label-width="120px">

            <el-form-item label="发送方式" style="text-align:left;"  class="is-required">
                 <el-checkbox-group v-model="form.sendWayIdList">
                    <el-checkbox :label="info.id" v-for="info in sendWayTypeList">{{info.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="消息内容" class="is-required">
                <el-input
                placeholder="请输入消息内容，不超过300个字。"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="form.systemInfo">
                </el-input>
            </el-form-item>


            <el-form-item label="发送对象" style="text-align:left;"  class="is-required">
                <el-select v-model="form.isAdmin" placeholder="发送对象" style="width: 200px;margin-right:15px;">
                    <el-option
                        key="0"
                        label="用户"
                        value="0">
                    </el-option>

                    <el-option
                        key="1"
                        label="管理员"
                        value="1">
                    </el-option>
                </el-select>

                <el-checkbox v-model="form.isUserAll" :true-label="1" :false-label="0">所有人</el-checkbox>

                <el-button type="text" :disabled="form.isUserAll==1" @click="resetForm2">手动选择</el-button>
            </el-form-item>

            <el-form-item label="备注">
                <el-input
                placeholder="请输入其他备注信息，不超过100个字"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6}"
                v-model="form.infoTemplateRemark">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="insertInfoWithTx">确 定</el-button>
        </div>

        <el-dialog title="选择发送对象" :visible.sync="innerVisible" append-to-body width="80%">
            <div style="margin-bottom:4px;">
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="姓名" v-model="userForm.name"></el-input>
                <el-select v-model="userForm.sex" placeholder="性别">
                    <el-option
                    label="男"
                    value="1">
                    </el-option>
                    <el-option
                    label="女"
                    value="0">
                    </el-option>
                </el-select>
                <el-select v-model="userForm.companyId" placeholder="所属公司">
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="userForm.status" placeholder="注册状态">
                    <el-option
                    label="已注册"
                    value="1">
                    </el-option>
                    <el-option
                    label="未注册"
                    value="0">
                    </el-option>
                </el-select>
            </div>
            <div style="margin-bottom:4px;">
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="手机号码" v-model="userForm.mobile"></el-input>
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="邮箱" v-model="userForm.email"></el-input>
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="员工编号" v-model="userForm.memberCode"></el-input>

                <el-date-picker
                v-model="userForm.birthdayStamp"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
            </div>
            <div style="margin-bottom:20px;height:30px;">

                <el-select v-model="userForm.accountStatus" placeholder="账号状态">
                    <el-option
                    label="有效"
                    value="0">
                    </el-option>
                    <el-option
                    label="失效"
                    value="1">
                    </el-option>
                </el-select>


                <el-button class="filter-item" type="primary" icon="search" @click="handleFilter2" size="medium">搜索</el-button>
                <el-button @click="resetForm2" size="medium">重置</el-button>
            </div>

            <el-checkbox-group v-model="form.userAll">
            <el-table :key='tableKey' :data="userData" v-loading.body="listLoading" border fit height="450" highlight-current-row style="width: 100%">
                <el-table-column align="center" width="30">
                    <template slot-scope="scope">
                        <el-checkbox :label="scope.row.userId">1</el-checkbox>
                    </template>
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
                        <span>{{scope.row.shortCode}}</span>
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

                <el-table-column align="center" label="失效时间" min-width="100">
                    <template slot-scope="scope">
                        {{setTime(scope.row.invalidTime)}}
                    </template>
                </el-table-column>

            </el-table>
            </el-checkbox-group>
            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page.sync="userForm.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="userForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count2">
                </el-pagination>
            </div>
            <div slot="footer" class="dialog-footer" :span="24">
                <el-button size="medium" @click="innerVisible = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="checkUser">确 定</el-button>
            </div>
        </el-dialog>
    </el-dialog>

    <el-dialog title="查看用户" :visible.sync="dialogFormVisible2" size="tiny">
             <el-table :key='tableKey' :data="checkUserList" v-loading.body="listLoading" border fit height="450" highlight-current-row style="width: 100%">

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
                        <span>{{scope.row.shortCode}}</span>
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

            </el-table>
            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange3"
                @current-change="handleCurrentChange3"
                :current-page.sync="userCheckForm.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="userCheckForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count3">
                </el-pagination>
            </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findInfoOfPage,findSendWayTypeAll,userExtendAllOfPage,findCompanyIdOrName,insertInfoWithTx,findUserInfoOfPage} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            form:{
                systemInfo:'',
                infoTemplateRemark:'',
                sendWayIdList:[],
                isAdmin:'',
                userAll:[],
                isUserAll:0,
            },
            ruleForm:{
                name:'',
                systemInfo:'',
                //sendWayId:'',
                type:'',
                isAdmin:'',
                //isStart:'',
                pageNo:1,
                pageSize:10
            },
            sendWayTypeList:[
                {
                    name:'系统通知',
                    id:1
                },
                {
                    name:'消息通知',
                    id:2
                },
                {
                    name:'短信通知',
                    id:3
                },
                {
                    name:'公众号推送',
                    id:4
                },
            ],
            innerVisible:false,
            templateParamList:[],
            userForm:{
                mobile:'',
                name:'',
                sex:'',
                status:'',
                birthdayStamp:'',
                accountStatus:'',
                memberCode:'',
                email:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            },
            count2: null,
            userData:[],
            companyList:[],
            userCheckForm:{
                infoId:'',
                pageNo:1,
                pageSize:10
            },
            checkUserList:[],
            count3: null,
            dialogFormVisible2:false
        }
    },
    created() {
        this.findInfoOfPage();
        this.findCompanyIdOrName();
    },

    methods: {

        //查看关联用户
        async findUserInfoOfPage(id){
            try {
                this.userCheckForm.infoId = id;
                const res = await findUserInfoOfPage(this.userCheckForm);

                if (res.data.code == 0) {
                    this.checkUserList = res.data.data.list;
                    this.dialogFormVisible2 = true;
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
        handleSizeChange3(val) {
            this.ruleForm.pageSize = val;
            this.findUserInfoOfPage()
        },
        handleCurrentChange3(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findUserInfoOfPage()
        },
        //群发消息
        async insertInfoWithTx(){
            try {
                let obj = JSON.parse(JSON.stringify(this.form));
                obj.userAll = JSON.stringify(this.form.userAll);
                obj.sendWayIdList = JSON.stringify(this.form.sendWayIdList);
                obj.infoInform = obj.systemInfo;
                obj.moblieInfo = obj.systemInfo;
                obj.weChatOfficialInfo = obj.systemInfo;
                const res = await insertInfoWithTx(obj);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '推送成功'
                    });
                    this.dialogFormVisible = false;
                    this.findInfoOfPage();
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
        //选择用户确认
        checkUser(){
            this.innerVisible = false;
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
        //新增消息
        addMessage(){
            this.dialogFormVisible = true;
            this.form = {
                systemInfo:'',
                infoTemplateRemark:'',
                sendWayIdList:[],
                isAdmin:'',
                userAll:[],
                isUserAll:0,
            }
        },
        //获取用户列表
        async userExtendAllOfPage() {
            try {


                const obj = new Object();

                $.each(this.userForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })

                obj.birthdayStamp = this.setTimestamp(this.userForm.birthdayStamp);
                this.listLoading = false;
                const res = await userExtendAllOfPage(obj);

                if (res.data.code == 0) {

                    this.count2 = res.data.data.totalSize;
                    this.userData = res.data.data.list;
                    this.innerVisible = true;
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
        handleSizeChange2(val) {
            this.ruleForm.pageSize = val;
            this.userExtendAllOfPage()
        },
        handleCurrentChange2(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.userExtendAllOfPage()
        },

        //重置
        resetForm2(){
            this.userForm = {
                mobile:'',
                name:'',
                sex:'',
                status:'',
                birthdayStamp:'',
                accountStatus:'',
                memberCode:'',
                email:'',
                companyId:'',
                isAdministrator:'',
                pageNo:1,
                pageSize:10
            }
            this.userForm.isAdministrator = this.form.isAdmin;
            this.userExtendAllOfPage();
        },
        //搜索
        handleFilter2(){
            this.userForm.pageNo = 1;
            this.userExtendAllOfPage();
        },
        //查询消息模版可引用参数接口

        async findInfoTemplateParameterAll() {
            try {
                const res = await findInfoTemplateParameterAll({infoTemplateId:this.form.id});

                if (res.data.code == 0) {
                    this.templateParamList = res.data.data;
                    this.innerVisible = true;
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
        async findInfoOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findInfoOfPage(obj);

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

        //搜索
        searchForm(type){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findInfoOfPage()
        },
        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findInfoOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findInfoOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                name:'',
                pageNo:1,
                pageSize:10
            };

            this.findInfoOfPage()
        },


        //编辑
        async findInfoTemplateById (id) {
            try {
                const res = await findInfoTemplateById({infoTemplateId:id});

                if (res.data.code == 0) {
                    this.form = res.data.data;
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
        //保存
        async updateInfoTemplateByIdWithTx(){
            try {
                let obj = JSON.parse(JSON.stringify(this.form));
                obj.sendWayIdList = JSON.stringify(this.form.sendWayIdList);
                obj.infoInform = obj.systemInfo;
                obj.moblieInfo = obj.systemInfo;
                obj.weChatOfficialInfo = obj.systemInfo;
                const res = await updateInfoTemplateByIdWithTx(obj);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.error
                    });
                    this.findInfoTemplateOfPage();
                    this.dialogFormVisible = false;
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

        //启用
        async isStartByIdWithTx (id) {
            try {
                const res = await isStartByIdWithTx({infoTemplateId:id});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '切换状态成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findInfoTemplateOfPage();
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
            if(time==null || time==''){
                return '';
            }
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


