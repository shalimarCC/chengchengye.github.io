<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.categoryId" placeholder="会籍分类" style="margin-right:15px;">
            <el-option
            label="用户会籍"
            value="1">
            </el-option>
            <el-option
            label="企业会籍"
            value="2">
            </el-option>
        </el-select>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="会籍名称" v-model="ruleForm.membershipName"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="关联产品SKU" v-model="ruleForm.linkedSkuName"></el-input>
        <!-- <el-select v-model="ruleForm.statusCode" placeholder="启用状态">
            <el-option
            label="已启用"
            value="0">
            </el-option>
            <el-option
            label="未启用"
            value="1">
            </el-option>
        </el-select> -->
    </div>

    <div style="margin-bottom:20px;">
        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
        <el-button class="filter-item" @click="addMembership" style="float:right" type="primary" icon="edit" size="medium">添加会籍</el-button>
    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" max-height="600">

        <el-table-column align="center" label="会籍编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.membershipCode}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="会籍名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.membershipName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="会籍图标" min-width="80">
            <template slot-scope="scope">
                <span><img :src="scope.row.membershipLogImgUrl" alt="" style="width:60px;height:60px;"></span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="关联产品规格(SKU)" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.linkedSkuName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="有效期" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.validPeriodVal}}</span>
                <span v-if="scope.row.validPeriodUnit==1">年</span>
                <span v-else-if="scope.row.validPeriodUnit==2">月</span>
                <span v-else-if="scope.row.validPeriodUnit==3">日</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="会籍分类" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.categoryName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="500" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="findMembershipAuthorityByMembershipId(scope.row.id,1)">查看权限列表</el-button>
                <el-button type="primary" size="small" plain @click="editAuthority(scope.row.id)">编辑</el-button>
                <router-link :to="'/membershipUser/'+scope.row.id"><el-button type="primary" size="small" plain>查看会员列表</el-button></router-link>
                <el-button type="primary" size="small" plain @click="uploadFile(scope.row.id)">导入新会员</el-button>
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

    <el-dialog title="查看权限" :visible.sync="dialogFormVisible">
        <div style="height:600px;overflow:auto;">
            <el-table :data="authorityShow" v-loading.body="listLoading2" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="配置权限" min-width="80">
                    <template slot-scope="scope">
                        <input type="checkbox" v-if="scope.row.isStop==0" :disabled="true" :checked="true">
                        <input type="checkbox" v-if="scope.row.isStop==1" :disabled="true" :checked="false">
                        <!-- <el-checkbox v-if="scope.row.isStop==0" disabled="disabled" :checked="true" :label="scope.row.authorityId"></el-checkbox> -->
                        <!-- <el-checkbox v-else-if="scope.row.isStop==1" disabled="disabled" :checked="false" :label="scope.row.authorityId"></el-checkbox> -->
                    </template>
                </el-table-column>

                <el-table-column align="center" label="权限名称" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.authorityName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="备注" min-width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.remarks}}</span>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page.sync="authorityShow.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="authorityShow.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count2">
                </el-pagination>
            </div>
        </div>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" type="primary" @click="dialogFormVisible = false">关 闭</el-button>
        </div>
    </el-dialog>

    <el-dialog :title="action" :visible.sync="dialogFormVisible2">
        <el-form label-width="120px">
            <el-form-item label="会籍编号">
                <el-input v-model="authorityForm.membershipCode"></el-input>
            </el-form-item>
            <el-form-item label="会籍名称">
                <el-input v-model="authorityForm.membershipName"></el-input>
            </el-form-item>

            <el-form-item label="会籍图标">
                <!-- <el-upload
                    ref="upload"
                    :auto-upload="false"
                    class="upload-demo"
                    style="display: inline-block;"
                    :action="basePath"
                    :onError="uploadError"
                    :onSuccess="uploadSuccess"
                    :data="fileForm"
                    :headers="dataHeaders"
                    :beforeUpload="beforeAvatarUpload"> -->
                <el-upload
                    class="avatar-uploader"
                    :action="baseImgPath"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUploadImg"
                    :on-error="handleError"
                    :on-change="showPic"
                    :data="imgForm">
                    <img v-if="authorityForm.membershipLogImgUrl" :src="authorityForm.membershipLogImgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="会籍类型">
                <el-select v-model="authorityForm.categoryId">
                    <el-option
                        :key="1"
                        label="用户会籍"
                        :value="1">
                    </el-option>
                    <el-option
                        :key="2"
                        label="企业会籍"
                        :value="2">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="关联产品SKU">
                <el-select v-model="authorityForm.linkedSkuId">
                    <el-option
                        v-for="item in skuList"
                        :key="item.id"
                        :label="item.skuName"
                        :value="item.id"
                        :disabled="item.disabled">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="有效期">
                <el-input-number v-model="authorityForm.validPeriodVal" :min="1"></el-input-number>
                <el-select v-model="authorityForm.validPeriodUnit" style="width: 60px;">
                    <el-option
                        label="年"
                        :value="1">
                    </el-option>
                    <el-option
                        label="月"
                        :value="2">
                    </el-option>
                    <el-option
                        label="日"
                        :value="3">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="可选权限">
                <el-tag
                :key="tag.id"
                v-for="(tag,key) in checkLabel"
                closable
                @close="tagClose(key)">
                {{tag.name}}
                </el-tag>
                <el-button class="button-new-tag" size="small" @click="addAuthority">+ 配置权限</el-button>
            </el-form-item>

            <el-form-item label="备注">
                <el-input
                    type="textarea"
                    :rows="4"
                    :maxlength="500"
                    resize="none"
                    placeholder="请输入备注（500字以内）"
                    v-model="authorityForm.remarks">
                </el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible2 = false;checkLabel=[]">取 消</el-button>
            <el-button size="medium" type="primary" @click="updateMembershipAuthorityByMembershipId">确 定</el-button>
        </div>

    </el-dialog>

    <el-dialog title="选择权限" :visible.sync="dialogFormVisible3">
        <div style="height:600px;overflow:auto;">
            <el-checkbox-group v-model="checkList">
                <el-table :key='tableKey' :data="authorityData" border fit highlight-current-row style="width: 100%">

                    <el-table-column align="center" label="配置权限" min-width="80">
                        <template slot-scope="scope">
                            <el-checkbox :label="scope.row.authorityId">1</el-checkbox>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="权限名称" min-width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.authorityName}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="备注" min-width="200">
                        <template slot-scope="scope">
                            <span>{{scope.row.remarks}}</span>
                        </template>
                    </el-table-column>

                </el-table>
            </el-checkbox-group>
            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page.sync="checkForm.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="checkForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count2">
                </el-pagination>
            </div>
        </div>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible3 = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveLabel">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="新会员导入" :visible.sync="dialogFormVisible4">
        <p>提示:请导入非会员名单，若导入名单包含会员将会导入失败</p>
        <el-form label-width="120px">
            <el-form-item label="会籍类型">
                <el-select v-model="fileForm.tempType">
                    <el-option
                        :key="9"
                        label="用户会籍"
                        :value="9">
                    </el-option>
                    <el-option
                        :key="10"
                        label="企业会籍"
                        :value="10">
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
                    :data="fileForm"
                    :headers="dataHeaders"
                    :beforeUpload="beforeAvatarUpload">
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="下载模板">
                <el-button size="medium" type="primary" @click="findImportTemplateDictUrlByType">下载</el-button>
                <!-- Tip：请先选择类型 -->
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible4 = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="submitUpload">确 定</el-button>
        </div>

    </el-dialog>

    <el-dialog title="导入预览" :visible.sync="dialogFormVisible5">
        <div>
            <span>公司名称:{{sampleList.header.companyName}}</span>&nbsp;&nbsp;
            <span>模板类型:{{sampleList.header.templateType}}</span>&nbsp;&nbsp;
            <span>创建时间:{{setTime(sampleList.header.generatedTime)}}</span>&nbsp;&nbsp;
            <span>文件序号:{{sampleList.header.fileSequenceNumber}}</span>&nbsp;&nbsp;
        </div>
        <el-table :data="sampleList.list" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="表格行数" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="会籍类型" min-width="80" v-if="fileForm.tempType==9">
                <template slot-scope="scope">
                    <span>用户会籍</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="会籍类型" min-width="80" v-if="fileForm.tempType==10">
                <template slot-scope="scope">
                    <span>企业会籍</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="邮箱" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.mail}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="会籍生效日期" min-width="80">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.startTime)}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="会籍失效日期" min-width="80">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.endTime)}}</span>
                </template>
            </el-table-column>

        </el-table>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible5 = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="assureMembershipUserImport">确认导入</el-button>
        </div>
    </el-dialog>

  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseUrl } from '../../../config/env'
import { baseImgPath,baseImgUrl } from '../../../config/env'
import CryptoJS from 'crypto-js/core'
import MD5 from 'crypto-js/md5'
import Cookie from '../../../config/mUtils'
import {findMembershipOfPage,findMembershipAuthorityByMembershipId,updateMembershipAuthorityByMembershipId,findMembershipById,getMembershipSkuVO,getQiNiuToken,membershipUserImport,assureMembershipUserImport,findImportTemplateDictUrlByType} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                categoryId:"",//id为1时是内部会籍
                membershipName:"",
                linkedSkuName:"",
                pageNo:1,
                pageSize:10
            },
            dataSource: [],
            offset: 0,
            count: null,
            count2: null,
            tableKey: 0,
            listLoading: true,
            goodsId:'',
            authorityShow:[],
            authorityData:[],
            listLoading2: true,
            dialogFormVisible:false,
            authorityForm:{
                membershipId:'',        //会籍ID,必选
                membershipCode:'',      //会籍code,必选
                membershipName:'',      //会籍名,必选
                membershipLogImgUrl:'', //会籍logurl,可选
                linkedSkuId:'',         //会籍关联skuid,必选
                categoryId:'',          //会籍分类id,必选
                categoryName:'',        //会籍分类名,必选
                validPeriodVal:'',      //有效期值,必选
                validPeriodUnit:'',     //有效期单位,必选
                authorityIds:'',        //会籍权限id集合,必选
                remarks:''              //会籍备注,可选
            },
            dialogFormVisible2:false,
            imgForm:{
                key:'',
                token:'',
            },
            baseImgPath:'',
            baseImgUrl:'',
            skuList:[],
            skuListU:[],
            dialogFormVisible3:false,
            checkLabel:[],
            checkList:[],
            checkForm:{
                id:'',
                pageNo:1,
                pageSize:10
            },
            dialogFormVisible4:false,
            fileForm:{
                tempType:'',
            },
            basePath:'',
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
            sampleList:{
                header:{
                    companyName:'',
                    templateType:'',
                    generatedTime:'',
                    fileSequenceNumber:'',
                },

                overView:[],
            },
            dialogFormVisible5:false,
            fileInfo:'',
            action:'',
            responseKey:'',
            authorityIds:[],
        }
    },
    created() {

        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
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
        // this.basePath = baseUrl+"/back-user-web/user/user/userImport.do";
        this.basePath = baseUrl+"/back-product-web/product/membershipUser/membershipUserImport.do";
        this.findMembershipOfPage();
        this.getMembershipSkuVO();
        const res = getQiNiuToken();
        res.then(_data => {
            if(_data.data.code == 0){

                this.imgForm.token = _data.data.data;
            }else{
                this.$message({
                    type:"error",
                    message:_data.data.error
                })
            }
        })
    },

    methods: {
        //获取会籍列表
        async findMembershipOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findMembershipOfPage(obj);

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
                    message: '获取会籍列表失败,请联系管理员！404'
                });

            }
        },

        //获取所有的会籍sku
        async getMembershipSkuVO() {
            try {
                const res = await getMembershipSkuVO();

                if (res.data.code == 0) {
                    this.skuList = res.data.data;
                    console.log(this.skuList);
                    for(var i=0;i<this.skuList.length;i++){
                        console.log(this.skuList[i].isValid);
                        if(this.skuList[i].isValid==0){
                            this.skuList[i].disabled=true;
                        }
                        console.log(this.skuList);
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取会籍sku失败,请联系管理员！404'
                });

            }
        },

        async findMembershipAuthorityByMembershipId(id,type) {
            try {
                this.listLoading2 = false;
                let memberId = '';
                if(type==1){
                    memberId = id;
                } else{
                    memberId = this.checkForm.id ? this.checkForm.id : id;
                }
                const res = await findMembershipAuthorityByMembershipId({membershipId:memberId});
                if (res.data.code == 0) {
                    this.count2 = res.data.data.totalSize;
                    this.authorityData = res.data.data.list;
                    this.authorityData.pageNo = res.data.data.pageNo;
                    this.authorityData.pageSize = res.data.data.pageSize;
                    if(this.authorityData.length > 0){this.checkForm.id=this.authorityData[0].membershipId;}
                    if(type==1){
                        this.authorityShow = res.data.data.list;
                        this.authorityShow.pageNo = res.data.data.pageNo;
                        this.authorityShow.pageSize = res.data.data.pageSize;
                        this.dialogFormVisible = true;
                    }
                    this.checkList=[];
                    for(var i=0;i<this.authorityData.length;i++){
                        if(this.authorityData[i].isStop==0){
                            this.checkList.push(this.authorityData[i].authorityId);
                        }
                    }
                    console.log(this.checkList);
                    console.log(this.authorityData);
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取权限信息失败,请联系管理员！404'
                });

            }
        },

        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findMembershipOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.findMembershipOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageSize = 10;
            this.ruleForm.pageNo = 1;
            this.findMembershipOfPage();
        },
        //重置
        resetForm(formName) {
            this.ruleForm = {
                categoryId:"",//id为1时是内部会籍
                membershipName:"",
                linkedSkuName:"",
                // statusCode:"",
                pageNo:1,
                pageSize:10
            };
            this.findMembershipOfPage();
        },

        //分页
        handleSizeChange1(val) {
            this.authorityShow.pageSize = val;
            this.findMembershipAuthorityByMembershipId(this.checkForm.id,2)
        },
        handleCurrentChange1(val) {
            this.authorityShow.pageNo = val;
            this.offset = (val - 1) * this.authorityShow.pageNo;
            this.findMembershipAuthorityByMembershipId(this.checkForm.id,2)
        },

        //编辑会籍详情
        editAuthority (id) {
            this.action='编辑详情';
            this.checkForm.id=id;
            this.findMembershipById(id);
            this.dialogFormVisible2 = true;
        },
        //根据ID会籍详情
        async findMembershipById (id) {
            try {
                const res = await findMembershipById({membershipId:id});
                if (res.data.code == 0) {
                    this.authorityForm = res.data.data;
                    this.authorityIds = JSON.stringify(res.data.data.authorityList);
                    if(this.authorityForm.authorityVOList&&this.authorityForm.authorityVOList.length>0){
                        this.checkLabel = this.authorityForm.authorityVOList;
                        for(var i=0;i<this.checkLabel.length;i++){
                            this.checkLabel[i].name = this.checkLabel[i].authorityName;
                        }
                    } else {
                        this.checkLabel=[];
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取会籍详情失败,请联系管理员！404'
                });

            }
        },
        //保存编辑内容(会籍详情)
        async updateMembershipAuthorityByMembershipId () {
            try {
                console.log(this.authorityForm);
                if(this.authorityForm.categoryId == 1) {
                    this.authorityForm.categoryName = '用户会籍';
                } else if(this.authorityForm.categoryId == 2) {
                    this.authorityForm.categoryName = '企业会籍';
                }
                this.authorityForm.authorityVOList='';
                this.authorityForm.authorityIds = (this.checkList.length == 0) ? this.authorityIds : JSON.stringify(this.checkList);
                this.authorityForm.membershipId = this.authorityForm.id;
                const res = await updateMembershipAuthorityByMembershipId(this.authorityForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '编辑成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible2 = false;
                    this.checkLabel=[];
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
            return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
        },
        //时间转换时间戳
        setTimestamp(time) {
            if(time == ""){
                return "";
            }
            const t = new Date(time);
            return t.getTime()
        },

        //新增可选权限
        addAuthority(){
            this.dialogFormVisible3 = true;
            this.checkForm.pageNo = 1;
            this.checkForm.pageSize = 10;
            this.findMembershipAuthorityByMembershipId(this.checkForm.id,2);
        },

        //删除已选权限
        tagClose(index){
            this.checkList.splice(index,1);
            console.log(this.checkList);
            this.checkLabel.splice(index,1);
            console.log(this.checkLabel);
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        },
        //分页
        handleSizeChange2(val) {
            this.checkForm.pageSize = val;
            this.findMembershipAuthorityByMembershipId(this.checkForm.id,2)
        },
        handleCurrentChange2(val) {
            this.checkForm.pageNo = val;
            this.offset = (val - 1) * this.checkForm.pageNo;
            this.findMembershipAuthorityByMembershipId(this.checkForm.id,2)
        },

        async saveLabel(){
            try {
                const res = await findMembershipAuthorityByMembershipId({membershipId:this.checkForm.id});
                if (res.data.code == 0) {
                    this.checkLabel=[];
                    for(var i=0;i<this.checkList.length;i++){
                        this.checkLabel.push({
                            id:this.checkList[i]
                        });
                    }
                    console.log(this.checkList);
                    let nameList = res.data.data.list;
                    console.log(nameList);
                    for(var i=0;i<this.checkLabel.length;i++){
                        for(var j=0;j<nameList.length;j++){
                            if(this.checkLabel[i].id==nameList[j].authorityId){
                            // if(this.checkLabel[i].id==nameList[j].id){
                                this.checkLabel[i].name = nameList[j].authorityName;
                            }
                        }
                    }
                    console.log(this.checkLabel);
                    this.dialogFormVisible3 = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '保存权限信息失败,请联系管理员！404'
                });

            }
        },

        // 上传成功后的回调
        uploadSuccess (response, file, fileList) {
            this.dialogFormVisible4 = false;
            if(response.code == 0){
                this.sampleList = response.data;
                this.dialogFormVisible5 = true;
            }else if(response.code == 169){

                this.$confirm('导入的文件中部分信息存在错误，请下载并修改后重新导入', '提示', {
                    confirmButtonText: '下载',
                    type: 'error'
                }).then(() => {

                    var f = document.createElement("form");
                    document.body.appendChild(f);
                    var i = document.createElement("input");
                    i.type = "hidden"; f.appendChild(i);
                    i.value = "5"; i.name = "price";
                    f.action = response.error; //下载的url 地址
                    f.submit();
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

        //导入
        uploadFile(id){
            this.fileForm = {
                tempType:'',
                membershipId:id
            }
            this.dialogFormVisible4 = true;
            if(this.$refs.upload!=undefined){
                this.$refs.upload.clearFiles();
            }
        },
        submitUpload() {
            this.$refs.upload.submit();
        },

        //保存
        async assureMembershipUserImport(){
            try {
                let obj = new Object();
                obj.membershipId = this.fileForm.membershipId;
                obj.fileNumber = this.sampleList.header.fileSequenceNumber;
                const res = await assureMembershipUserImport(obj);

                if(res.data.code==0){
                    this.$notify({
                        title: '成功',
                        message: '导入成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible5 = false;

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

        //添加会籍
        addMembership(){
            this.action='添加会籍';
            this.authorityForm = {
                membershipId:'',        //会籍ID,必选
                membershipCode:'',      //会籍code,必选
                membershipName:'',      //会籍名,必选
                membershipLogImgUrl:'', //会籍logurl,可选
                linkedSkuId:'',         //会籍关联skuid,必选
                categoryId:1,          //会籍分类id,必选
                categoryName:'',        //会籍分类名,必选
                validPeriodVal:'',      //有效期值,必选
                validPeriodUnit:1,     //有效期单位,必选
                authorityIds:'',        //会籍权限id集合,必选
                remarks:''              //会籍备注,可选
            };
            this.checkLabel=[];
            this.checkList=[];
            this.checkForm.id='';
            this.dialogFormVisible2 = true;
        },

        //上传图片
        beforeAvatarUploadImg(file) {    //在图片提交前进行验证  轮播图
            let curr = moment().format('YYYYMMDDHHmmss').toString();
            let prefix = moment(file.lastModified).format('HHmmss').toString();
            let key = curr+"egeo"+prefix;

            this.imgForm.key = key;
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const res = getQiNiuToken();

            res.then(_data => {
                if(_data.data.code == 0){

                    this.imgForm.token = _data.data.data;
                }else{
                    this.$message({
                        type:"error",
                        message:_data.data.error
                    })
                }
            })
            if (!isJPG&&!isPNG) {
                this.$message.error('上传图片只能是 JPG/PNG 格式!')
            }

            return isJPG||isPNG

        },
        handleError(res) {   //显示错误
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },
        handleAvatarSuccess(response){
            this.authorityForm.membershipLogImgUrl = this.baseImgUrl + response.key;
            this.responseKey=response.key;
        },
        showPic(){
            this.authorityForm.membershipLogImgUrl = this.baseImgUrl + this.responseKey;
        },

        async findImportTemplateDictUrlByType(){
            try {
                const res = await findImportTemplateDictUrlByType({type:9});

                if(res.data.code==0){
                    // this.$notify({
                    //     title: '成功',
                    //     message: '导入成功',
                    //     type: 'success',
                    //     duration: 2000
                    // });
                    var f = document.createElement("form");
                    document.body.appendChild(f);
                    var i = document.createElement("input");
                    i.type = "hidden"; f.appendChild(i);
                    i.value = "5"; i.name = "price";
                    f.action = res.data.data; //下载的url 地址
                    f.submit();

                }else{

                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取模板失败,请联系管理员！404'
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


