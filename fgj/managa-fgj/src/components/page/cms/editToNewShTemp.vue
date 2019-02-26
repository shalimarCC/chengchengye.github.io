<template>
    <div id="example">
        <el-form ref="form" :model="form" label-width="120px" class="formList">
            <el-form-item label="商品列表页名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="所属列表页模板">
                <el-select v-model="form.id" placeholder="请选择所属列表页模板" @change="getByTemplate(form.id)">
                    <el-option
                    v-for="item in allTemps"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 获取模板属性类 -->
            <el-row :gutter="60">
                <el-col v-if="form.tempForm" v-for="(info,key) in form.tempForm" :key="key">
                    <el-form-item :label="info.name" v-if="info.type == 2">
                        <el-input v-model="info.value" style="width:300px;"></el-input>
                        <span>{{info.units}}</span>
                    </el-form-item>
                    <el-form-item :label="info.name" v-if="info.type == 1">
                        <el-select v-model="info.value" placeholder="请选择">
                            <el-option
                            v-for="item in info.cfgValueList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 获取模板组件类 -->
            <el-row :gutter="60">
                <el-col v-if="form.elemForm" v-for="(infos,key) in form.elemForm" :key="key">
                    <div v-if="infos.config" v-for="(info,key) in infos.config">
                        <el-form-item :label="info.name" v-if="info.type == 2">
                            <el-input v-model="info.value" style="width:300px;"></el-input>
                        </el-form-item>
                        <el-form-item :label="info.name" v-if="info.type == 1">
                            <el-select v-model="info.value" placeholder="请选择">
                                <el-option
                                v-for="item in info.cfgValueList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="info.name" class="clear" v-if="info.type == 0">
                            <el-upload
                            class="avatar-uploader"
                            :action="baseImgPath"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-error="handleError"
                            :data="imgForm">
                            <img v-if="form.imgUrl" :src="form.imgUrl">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="选择轮播图" v-if="info.type == 3">
                            <div>
                                <ul>
                                    <li style="border-top:1px dashed #ccc;padding:40px 30px;cursor:move" class="clear" v-for="(info,key) in checkBannerList" v-dragging="{ item: info, list: checkBannerList, group: 'info' }">
                                        <div style="display:inline-block;" class="clearfix">
                                            <img v-if="info.imgUrl" :src="info.imgUrl" style="width:188px;height:100px;display:inline-block;" />
                                            <div style="display:inline-block;margin:0 40px;width:175px;">
                                                <p style="line-height:30px;" v-if="info.name">{{info.name}}</p>
                                                <p style="line-height:30px;">
                                                    <el-button class="filter-item" @click="deleteBanner(key)" size="medium" type="danger">删除</el-button>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <el-button class="filter-item" @click="selectBanner" size="medium" type="primary" icon="el-icon-plus">选择轮播图</el-button>
                            </div>
                        </el-form-item>
                        <!-- 跳转类型 -->
                        <el-form-item label="跳转类型" v-if="info.type == 0">
                            <el-select v-model="form.linkType" style="width: 200px;margin-right:15px;" placeholder="跳转页面" @change="bannerCh">
                                <el-option
                                    v-for="(item,index) in bannerSkipList"
                                    v-if="index!=0||form.clientType!=4"
                                    :key="item.value"
                                    :label="item.key"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 跳转页面 -->
                        <el-form-item label="移动端页面" v-if="form.linkType == 4 && info.type == 0">
                            <el-select v-model="form.cmsPageMId" style="width: 200px;margin-right:15px;" placeholder="跳转页面" @focus="getPageDateM">
                                <el-option
                                v-for="(item,index) in clientTypeDate"
                                :key="item.id"
                                :label="item.pageName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="PC端页面" v-if="form.linkType == 4 && info.type == 0">
                            <el-select v-model="form.cmsPagePcId" style="width: 200px;margin-right:15px;" placeholder="跳转页面" @focus="getPageDatePc">
                                <el-option
                                    v-for="(item,index) in clientTypeDate"
                                    :key="item.id"
                                    :label="item.pageName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="配置参数" prop="name" v-if="form.linkType==1 && info.type == 0">
                            <el-select v-model="form.linkId" @change="pageSkipChange">
                                <el-option
                                    v-for="item in pageSkip"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 本地参数特殊跳转 -->
                        <el-form-item label="参数1" v-if="form.linkType==1 && (form.linkId == 17 || form.linkId == 63) && info.type == 0">
                            <el-select v-model="form.linkdate1"
                                filterable
                                reserve-keyword
                                placeholder="请输入关键词"
                                remote
                                >
                                <el-option
                                    v-for="item in clientTypeDate"
                                    :key="item.id"
                                    :label="item.pageName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="参数1" v-if="form.linkType==1 && (form.linkId == 20 || form.linkId == 66) && info.type == 0">
                            <el-select v-model="form.linkdate1"
                                filterable
                                reserve-keyword
                                placeholder="请输入关键词"
                                remote
                                >
                                <el-option
                                    v-for="item in storeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="参数1" v-if="form.linkType==1 && (form.linkId == 25 || form.linkId == 71) && info.type == 0">
                            <el-select v-model="form.linkdate1"
                                filterable
                                reserve-keyword
                                placeholder="请输入关键词"
                                remote
                                >
                                <el-option
                                    v-for="item in categoryTreeList"
                                    :key="item.categoryTreeId"
                                    :label="item.categoryTreeName"
                                    :value="item.categoryTreeId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="参数1" v-if="form.linkType==1 && (form.linkId == 53 || form.linkId == 85) && info.type == 0">
                            <el-select v-model="form.linkdate1">
                                <el-option
                                    :key="1"
                                    label="满减券"
                                    value="1">
                                </el-option>
                                <el-option
                                    :key="2"
                                    label="兑换券"
                                    value="2">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="配置链接" prop="name" v-else-if="form.linkType==2 && info.type == 0">
                            <el-input v-model="form.linkUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="配置链接" prop="name" v-else-if="form.linkType==3 && info.type == 0">
                            <el-select v-model="form.linkId">
                                <el-option
                                    v-for="item in urlList"
                                    :key="item.externalLinkId"
                                    :label="item.externalLinkName"
                                    :value="item.externalLinkId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="name" v-else-if="form.linkType==4 && info.type == 0">
                            <el-select v-model="form.linkId">
                                <el-option
                                    v-for="item in classifyList"
                                    :key="item.standardUnitCombinationId"
                                    :label="item.combinationName"
                                    :value="item.standardUnitCombinationId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="配置商品" prop="name" v-else-if="form.linkType==5 && info.type == 0">
                            <el-select
                                v-model="form.linkId"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="remoteMethod"
                                :loading="loading">
                                    <el-option
                                    v-for="item in goodsList"
                                    :key="item.standardUnitId"
                                    :label="item.standardUnitName"
                                    :value="item.standardUnitId">
                                    </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属分页tab" v-else-if="form.linkType==7 && info.type == 0">
                            <el-select v-model="form.linkId">
                                <el-option
                                    v-for="item in tabList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">

                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 操作配置特殊跳转 -->
                        <el-form-item label="参数1" v-if="form.linkType==8 && (form.linkId == 1 || form.linkId == 6) && info.type == 0">
                            <el-input v-model="form.linkdate1" placeholder="关键词1" style="width:224px;"></el-input>
                        </el-form-item>
                        <el-form-item label="参数2" v-if="form.linkType==8 && (form.linkId == 1 || form.linkId == 6) && info.type == 0">
                            <el-input v-model="form.linkdate2" placeholder="关键词2" style="width:224px;"></el-input>
                        </el-form-item>
                        <el-form-item label="参数3" v-if="form.linkType==8 && (form.linkId == 1 || form.linkId == 6) && info.type == 0">
                            <el-input v-model="form.linkdate3" placeholder="关键词3" style="width:224px;"></el-input>
                        </el-form-item>
                        <div v-if="form.linkType==8 && info.type == 0">
                            <el-form-item label="参数1" v-if="form.linkId == 2 || form.linkId == 3 || form.linkId == 7 || form.linkId == 8">
                                <el-select v-model="form.linkdate1"
                                    filterable
                                    reserve-keyword
                                    placeholder="请输入商品规格"
                                    remote
                                    >
                                    <el-option
                                        v-for="item in puList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="参数2" v-if="form.linkId == 2 || form.linkId == 3 || form.linkId == 7 || form.linkId == 8">
                                <el-input v-model="form.linkdate2" placeholder="规格数量" style="width:224px;"></el-input>
                            </el-form-item>
                            <el-form-item label="参数1" v-if="form.linkId == 4 || form.linkId == 9">
                                <el-select v-model="form.linkdate1"
                                    filterable
                                    reserve-keyword
                                    placeholder="优惠券批次名称"
                                    remote
                                    >
                                    <el-option
                                        v-for="item in couponList1"
                                        :key="item.id"
                                        :label="item.couponBatchName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="参数1" v-if="form.linkId == 5 || form.linkId == 10">
                                <el-select v-model="form.linkdate1"
                                    filterable
                                    reserve-keyword
                                    placeholder="优惠券批次名称"
                                    remote
                                    >
                                    <el-option
                                        v-for="item in couponList2"
                                        :key="item.id"
                                        :label="item.couponBatchName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <!-- 选择轮播图弹框 -->
        <el-dialog title="选择轮播图" :visible.sync="dialogFormVisible4" append-to-body width="800px"  top="4vh">
            <div style="height:600px;overflow:auto;">
                <div style="margin-bottom:20px;">
                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="名称" v-model="bannerForm.name">
                    </el-input>
                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="公司" v-model="bannerForm.companyName">
                    </el-input>
                    <el-select v-model="bannerForm.linkType" style="width: 200px;margin-right:15px;" placeholder="跳转页面">
                        <el-option
                            v-for="(item,index) in bannerSkipList"
                            v-if="index!=0||form.clientType!=4"
                            :key="item.value"
                            :label="item.key"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div style="margin-bottom:20px;">
                    <el-button class="filter-item" type="primary" icon="search" size="medium" @click="queryBannerList">搜索</el-button>
                    <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
                </div>
                <el-checkbox-group v-model="exampleForm.bannerIds">
                    <el-table :key='tableKey' :data="bannerList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                        <el-table-column align="center" width="30">
                            <template slot-scope="scope">
                                <el-checkbox :label="scope.row.id">1</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="名称" min-width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="跳转类型" min-width="80">
                            <template slot-scope="scope">
                                <span v-if="scope.row.linkType==1">一级</span>
                                <span v-else-if="scope.row.linkType==2">二级</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-checkbox-group>
                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="bannerForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="bannerForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" :span="24">
                <el-button size="medium" @click="dialogFormVisible4 = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="updataBanner">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 保存 -->
        <div class="tempBtns">
            <el-button size="medium" style="margin: 12px;" @click='saveTemplate'>保存</el-button>
            <el-button size="medium" style="margin: 12px;">取消</el-button>
        </div>
    </div>
</template>

<script>
var moment = require('moment');
moment().format();
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import Cookie from '../../../config/mUtils'
import { baseImgPath,baseImgUrl } from '../../../config/env';
import {findStoreByPlatformId,findCommodityProductUnitLimit,findCmsLocalParamAll,findStoreAllInfo,findCategoryTreeAll,findCouponBatchOfPage,findCmsTemplateOfPage,findCmsPageAllByClientType,findCmsTemplateAll,updateCmsPageByIdWithTx,findByStandardUnitName,findSimplePageTabAll,findCompanyIdOrName,findExternalLinkAll,queryStandardUnitCombinationAll,localParamList,getQiNiuToken,findCfgKeyByTemplateId,queryBannerList,insertCmsPageWithTx} from '../../../api/getData';
export default{
    data(){
        return{
            form:{
                id:'',
                name:'',
                tempForm:{},
                elemForm:{},
                linkId:'',
                linkUrl:'',
                linkType:'',
                imgUrl:'',
                cmsPageMId:'',
                cmsPagePcId:'',
                linkdate1:'',
                linkdate2:'',
                linkdate3:''
            },
            couponList:[],
            couponList1:[],
            couponList2:[],
            categoryTreeList:[],
            storeList:[],
            pageDo:[],
            pageSkip:[],
            pageId:'',
            allTemps:[],
            imgForm:{
                key:'',
                token:'',
            },
            exampleForm:{
                bannerUrl:'',
                bannerIds:[]
            },
            checkBannerList:[],
            bannerList:[],
            bannerForm:[],
            dialogFormVisible4:false,
            count:null,
            listLoading: true,
            loading: false,
            tableKey:0,
            clientTypeDate:[],
            localList:[],
            urlList:[],
            goodsList:[],
            classifyList:[],
            tabList:[],
            tmplId:'',
            verifys:true,
            bannerSkipList:[
                {
                    value:1,
                    key:'本地参数'
                },
                {
                    value:2,
                    key:'H5链接（内部）'
                },
                {
                    value:3,
                    key:'H5链接（外部）'
                },
                {
                    value:4,
                    key:'商品组合'
                },
                {
                    value:5,
                    key:'单个商品'
                },
                {
                    value:6,
                    key:'无效果'
                },
                {
                    value:7,
                    key:'分页tab'
                },
                {
                    value:8,
                    key:'操作配置'
                },
            ],
            puList:[]

        }
    },
    created() {
        this.pageId = this.$route.params.id;
        this.findCmsTemplateAll();
       // this.tmplId = this.$route.params.id;
        this.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
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
        });
        this.queryStandardUnitCombinationAll();
        this.findExternalLinkAll();
        this.localParamList();
        //this.findCmsPageAllByClientType2(5);
        this.findCmsPageAllByClientType();
        this.findCfgKeyByTemplateId();
        this.findCouponBatchOfPage1();
        this.findCouponBatchOfPage2();
        this.findCategoryTreeAll();
        this.findStoreAllInfo();
        this.findCmsLocalParamAll();
        this.findCmsLocalParamAll2();
        this.findCommodityProductUnitLimit();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,16);
                if(str == "/editToNewShTemp"){
                    Object.assign(this.$data, this.$options.data());
                    this.pageId = this.$route.params.id;
                    this.findCmsTemplateAll();
                    this.queryStandardUnitCombinationAll();
                    this.findExternalLinkAll();
                    this.localParamList();
                    //this.findCmsPageAllByClientType2(5);
                    this.findCmsPageAllByClientType();
                    this.findCfgKeyByTemplateId();
                    this.findCouponBatchOfPage();
                    this.findCategoryTreeAll();
                    this.findStoreAllInfo();
                    this.findCmsLocalParamAll();
                    this.findCmsLocalParamAll2();
                    this.findCommodityProductUnitLimit();
                }

            },
        }
    },
    methods: {
        // banner类型切换
        bannerCh:function(type){
           this.form.linkId = '';
           this.form.linkUrl ='';
           this.form.cmsPageMId='';
           this.form.cmsPagePcId='';
        },
        //本地参数跳转
        pageSkipChange(val){
            console.log(val)
            if(val == 17){
                this.findCmsPageAllByClientType('',5);
            }else if(val == 18){
                this.findCmsPageAllByClientType('',5);
            }
        },
        //获取列表页模板
        async findCmsTemplateAll(){
            try {
                const res = await findCmsTemplateAll({type:1});
                if (res.data.code == 0) {
                    this.allTemps = res.data.data;
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
        //在图片提交前进行验证  轮播图
        beforeAvatarUpload(file) {
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
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }
            return isJPG||isPNG
        },
        //上传图片显示错误
        handleError(res) {
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },
        handleAvatarSuccess(response){
            this.form.imgUrl = this.baseImgUrl + response.key;
        },
        //根据ID获取组件配置
        async findCfgKeyByTemplateId(){
            try {
                const res = await findCfgKeyByTemplateId({templateId:this.form.id,pageId:this.$route.params.id});
                if (res.data.code == 0) {
                    let that = this;
                    let emebtns = new Array;
                    that.form.tempForm = res.data.data.templateConfig;
                    that.form.elemForm = res.data.data.elementConfig;
                    that.form.name = res.data.data.pageName;
                    that.form.id = res.data.data.templateId;
                    if(that.form.elemForm){
                        $.each(that.form.elemForm,function(key,info){
                            $.each(info.config,function(value,infos){
                                if(infos.type==3){
                                    if(infos.value && infos.value!=null){
                                        that.checkBannerList = infos.value;
                                        $.each(infos.value,function(id,infoss){
                                            that.exampleForm.bannerIds.push(infoss.bannerId);
                                        });
                                    }else{
                                        that.checkBannerList = [];
                                        that.exampleForm.bannerIds = [];
                                    }
                                }else if(infos.type==0){
                                    console.log(infos.value);
                                    if(infos.value && infos.value !=null){
                                        that.form.imgUrl = infos.value.imgUrl;
                                        that.form.linkType = infos.value.linkableButton.linkType;
                                        that.form.linkId = infos.value.linkableButton.linkId;
                                        that.form.linkUrl = infos.value.linkableButton.linkUrl;
                                        if(infos.value.linkableButton && infos.value.linkableButton.linkableButtonPage.length>0){
                                            $.each(infos.value.linkableButton.linkableButtonPage,function(ids,type){
                                                if(type.clientType == 6){
                                                    that.form.cmsPageMId = type.cmsPageId;
                                                }else if(type.clientType == 5){
                                                    that.form.cmsPagePcId = type.cmsPageId;
                                                }
                                            });
                                        };
                                        if(infos.value.linkableButton && infos.value.linkableButton.extParam.length>0){
                                            let extParamDate = new Array;
                                            extParamDate = infos.value.linkableButton.extParam;
                                            that.form.linkdate1 = extParamDate[2].value;
                                            that.form.linkdate2 = extParamDate[1].value;
                                            that.form.linkdate3 = extParamDate[0].value;
                                        };
                                    }else{
                                        that.form.imgUrl = '';
                                        that.form.linkType = '';
                                        that.form.linkId = '';
                                        that.form.linkUrl = '';
                                        that.form.cmsPageMId = '';
                                        that.form.cmsPagePcId = '';
                                    }

                                }
                            })
                        })
                    };
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404(空值未做判断)'
                });
            }
        },
        //列表页模板选择
        getByTemplate(id){
            this.findCfgKeyByTemplateId({templateId:id});
        },
        //删除banner
        deleteBanner(index){
            this.$confirm('删除后轮播图将不会在前端页面展示，确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.exampleForm.bannerIds.splice(index,1);
                this.checkBannerList.splice(index,1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {

            });
        },
        //选择轮播图
        selectBanner(){
            this.dialogFormVisible4 = true;
            this.queryBannerList();
            this.bannerForm = {
                pageNo:1,
                pageSize:10,
                name:'',
                companyName:'',
                linkType:''
            };
        },
        //选择轮播图确定
        async updataBanner(){
            try {
                const obj = new Object();
                obj.bannerIdList = JSON.stringify(this.exampleForm.bannerIds);
                obj.pageSize = this.exampleForm.bannerIds.length+10;
                obj.pageNo = 1;
                const res = await queryBannerList(obj);
                if (res.data.code == 0) {
                    this.checkBannerList = res.data.data.bannerPage.list;
                    this.dialogFormVisible4 = false;
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
        //查询所有轮播图
        async queryBannerList () {
            try {
                const obj = new Object();
                this.listLoading = false;
                $.each(this.bannerForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await queryBannerList(obj);
                if (res.data.code == 0) {
                    this.count = res.data.data.bannerPage.totalSize;
                    this.bannerList = res.data.data.bannerPage.list;
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
            this.bannerForm.pageSize = val;
            this.queryBannerList()
        },
        handleCurrentChange(val) {
            this.bannerForm.pageNo = val;
            this.offset = (val - 1) * this.bannerForm.pageSize;
            this.queryBannerList()
        },
        //重置
        resetForm(){
            this.bannerForm = {
                pageNo:1,
                pageSize:10,
                name:'',
                companyName:'',
                linkType:''
            };
            this.queryBannerList()
        },
        //信息校验
        verify(val, verifyScript){
            return eval(verifyScript);
        },
        //保存
        saveTemplate(){
            console.log("suc");
            let that = this;
            let arr = new Array;
            let obj = new Object();
            let arr2 = new Array;
            let arr3 = new Array;
            let bannerLists = new Object();
            let objJson = new Object();
            let saveObj = new Object();
            let bannerIds = new Array;
            $.each(that.form.tempForm,function(key,info){
                if(info.verifyRegex && info.verifyRegex!=null){
                    if(that.verify(info.value,info.verifyRegex)==false){
                        that.verifys = false;
                    }else{
                        that.verifys = true;
                    }
                };
                arr.push({
                        cfgKeyValue:info.value,
                        cfgKeyId:info.id,
                        cfgKeyType:info.type
                });
            });
            console.log(arr);
            $.each(that.form.elemForm,function(key,info){
                $.each(info.config,function(key,infos){
                    if(infos.type==3){
                        if(that.exampleForm.bannerIds){
                            for(var i=0;i<that.exampleForm.bannerIds.length;i++){
                                bannerIds.push({
                                    bannerId:that.exampleForm.bannerIds[i]
                                })
                            }
                        }
                        console.log(arr3);
                        arr2.push({
                            elementId:info.elementId,
                            elementSort:info.elementSort,
                            cfgKeyValue:bannerIds,
                            cfgKeyId:infos.id,
                            cfgKeyType:infos.type
                        });
                    }else if(infos.type==0){
                        bannerLists.imgUrl = that.form.imgUrl;
                        bannerLists.linkType = that.form.linkType;
                        bannerLists.linkId = that.form.linkId;
                        bannerLists.linkUrl = that.form.linkUrl;
                        bannerLists.linkableButtonPageList = [
                            {
                                "cmsPageId":that.form.cmsPagePcId,
                                "clientType":5
                            },
                            {
                                "cmsPageId":that.form.cmsPageMId,
                                "clientType":6
                            }
                        ];
                        bannerLists.extParam = [
                            {
                                "name":"extParam1",
                                "value":that.form.linkdate1,
                            },
                            {
                                "name":"extParam2",
                                "value":that.form.linkdate2,
                            },
                            {
                                "name":"extParam3",
                                "value":that.form.linkdate3,
                            }
                        ];
                        arr3.push(bannerLists);
                        arr2.push({
                            elementId:info.elementId,
                            elementSort:info.elementSort,
                            cfgKeyValue:arr3,
                            cfgKeyId:infos.id,
                            cfgKeyType:infos.type
                        });
                    }else{
                        arr2.push({
                            elementId:info.elementId,
                            elementSort:info.elementSort,
                            cfgKeyValue:infos.value,
                            cfgKeyId:infos.id,
                            cfgKeyType:infos.type
                        })
                    }
                })
            });
            console.log(arr2);
            objJson.pageConfig = arr;
            objJson.elementConfig = arr2;
            console.log(objJson);
            saveObj.templateId = that.form.id;
            saveObj.pageName = that.form.name;
            saveObj.id = that.pageId;
            saveObj.configJson = JSON.stringify(objJson);
            console.log(saveObj);
            if(that.form.name.length>30){
                that.$message({
                    type: 'error',
                    message: '商品列表页名不得超过30个字符'
                });
            }else if(that.verifys == false){
                that.$message({
                    type: 'error',
                    message: '汉字8字内，字母16字符内;标题字体大小请输入正整数;'
                });
            }else{
                that.updateCmsPageByIdWithTx (saveObj);
            }
        },
        //保存temp接口
        async updateCmsPageByIdWithTx (obj) {
            try {
                const res = await updateCmsPageByIdWithTx(obj);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
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
        //通过客户端类型查询商品页列表
        // async findCmsPageAllByClientType1 (clientType) {
        //     try {
        //         const res = await findCmsPageAllByClientType({clientType:clientType});
        //         if (res.data.code == 0) {
        //             this.clientTypeDate = res.data.data;
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
        //通过客户端类型查询商品页列表
        // async findCmsPageAllByClientType2 (clientType) {
        //     try {
        //         const res = await findCmsPageAllByClientType({clientType:clientType});
        //         if (res.data.code == 0) {
        //             this.clientTypeDate2 = res.data.data;
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
        //移动端页面获取
        getPageDateM(){
            this.findCmsPageAllByClientType(6,'');
        },
        //pc页面获取
        getPageDatePc(){
            this.findCmsPageAllByClientType(5,'');
        },
        //通过客户端类型查询商品页列表5:pc6:移动
        async findCmsPageAllByClientType (type,pageType) {
            try {
                const res = await findCmsPageAllByClientType({clientType:type,templateType:pageType});
                if (res.data.code == 0) {
                    this.clientTypeDate = res.data.data;
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
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                this.findByStandardUnitName(query);
            } else {
                this.loading = false;
                this.goodsList = [];
            }
        },
        //获取配置参数
        async localParamList () {
            try {
                const res = await localParamList();
                if (res.data.code == 0) {
                    this.localList = res.data.data.paramList;
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
        //查询所有外部链接接口
        async findExternalLinkAll () {
            try {
                const res = await findExternalLinkAll();
                if (res.data.code == 0) {
                    this.urlList = res.data.data;
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
        //查询所有su分组信息接口
        async queryStandardUnitCombinationAll () {
            try {
                const res = await queryStandardUnitCombinationAll();
                if (res.data.code == 0) {
                    this.classifyList = res.data.data;
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
        //查询所有su信息接口
        async findByStandardUnitName (name,id) {
            try {
                let obj = new Object();
                if(name!=''){
                    obj.standardUnitName = name;
                }else{
                    obj.standardUnitId = id;
                }
                const res = await findByStandardUnitName(obj);
                if (res.data.code == 0) {
                    this.loading = false;
                    this.goodsList = res.data.data;
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
        //获取tab列表
        async findSimplePageTabAll (id) {
            try {
                const res = await findSimplePageTabAll({templateId:id});
                if (res.data.code == 0) {
                    this.tabList = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！接口连接失败'
                });

            }
        },
        //获取配置参数
        async findCmsLocalParamAll () {
            try {
                const res = await findCmsLocalParamAll({type:1});
                if (res.data.code == 0) {
                    this.pageSkip = res.data.data;
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
        async findCmsLocalParamAll2 () {
            try {
                const res = await findCmsLocalParamAll({type:2});
                if (res.data.code == 0) {
                    this.pageDo = res.data.data;
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
        //获取门店列表
        async findStoreAllInfo () {
            try {
                const res = await findStoreByPlatformId();
                if (res.data.code == 0) {
                    this.storeList = res.data.data;
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
        //查询所有前台类目树
        async findCategoryTreeAll () {
            try {
                const res = await findCategoryTreeAll();
                if (res.data.code == 0) {
                    this.categoryTreeList = res.data.data;
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
        //获取优惠券批次列表
        async findCouponBatchOfPage1() {
            try {
                const res = await findCouponBatchOfPage({pageNo:1,pageSize:50,grantType:1,getType:0,couponRelType:0,isEffect:0});
                if (res.data.code == 0) {
                    this.couponList1 = res.data.data.list;
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
        //领取优惠券//4
        async findCouponBatchOfPage2() {
            try {
                const res = await findCouponBatchOfPage({pageNo:1,pageSize:50,grantType:1,getType:0,isEffect:0});
                if (res.data.code == 0) {
                    this.couponList1 = res.data.data.list;
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
        //查询前50条pu接口
        async findCommodityProductUnitLimit(){
            try {
                const res = await findCommodityProductUnitLimit();
                if (res.data.code == 0) {
                    this.puList = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！pu接口连接失败'
                });

            }
        },

    }
}
</script>

<style scoped>
#example{
    padding: 10px 20px;
}
.formList{
    width:700px;
    height:auto;
    margin:0 auto;
}
.fncol{
    width:200px;
    display:inline-block;
}
.tempBtns{
    text-align: center;
}
</style>
<style>
.clear .el-upload--text {
    background-color: #fff;
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    width:100%;
    width:100%;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow:initial;
}
.clear .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:100%;
    width:100%;
    }
    .clear .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
    }
    .clear .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    }
    .clear .avatar {
    width: 150px;
    height: 150px;
    display: block;
    }

.clear .avatar-uploader{
    display:inline-block;
    width:150px;
    height:150px;
}
.clear .avatar-uploader img{
    width:100%;
    height:100%;

}
.clear .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width:100%;
    height:100%;
    line-height:150px;
    text-align: center;
}
.clear .el-upload{
    width:100%;
    height:100%;
}
</style>
