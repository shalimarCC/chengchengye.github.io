<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
         <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="名称" v-model="ruleForm.name">
        </el-input>
        </el-select>

        <el-select v-model="ruleForm.linkType" placeholder="跳转类型">
            <el-option
                v-for="item in bannerSkipList"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.belongPage" placeholder="所属页面">
            <el-option
                :key="1"
                label="商城"
                :value="1">
            </el-option>
            <el-option
                :key="2"
                label="我的体检"
                :value="2">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

    </div>
    <div style="margin-bottom:20px;">

        <el-button :type="ruleForm.companyType==0?'success':'info'" @click="checkCompany(0)">正式公司</el-button>
        <el-button :type="ruleForm.companyType==1?'success':'info'" @click="checkCompany(1)">演示公司</el-button>
        <el-button :type="ruleForm.companyType==2?'success':'info'" @click="checkCompany(2)">竞品公司</el-button>

        <el-button class="filter-item" @click="addActivity" style="float:right" type="primary" size="medium" icon="edit">添加</el-button>
     </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属页面" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.belongPage==1">商城</span>
                <span v-else-if="scope.row.belongPage==2">我的体检</span>
                <span v-else-if="scope.row.belongPage==4">web商城首页</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="跳转类型" min-width="100">
            <template slot-scope="scope">
                <span v-for="info in bannerSkipList" v-if="scope.row.linkType==info.value">{{info.key}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="排序" min-width="100">
            <template slot-scope="scope">
                 <span>{{scope.row.sort}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否显示" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.enabled==0">否</span>
                <span v-else-if="scope.row.enabled==1">是</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="info" plain size="small" @click="editActivity(scope.row.id)">编辑</el-button>

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

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="120px">
            <el-form-item label="Banner名称">
                <el-input v-model="bannerForm.name"></el-input>
            </el-form-item>

            <el-form-item label="所属公司">
                <el-select v-model="bannerForm.companyIds" collapse-tags multiple :disabled="allStatus.length>0">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox-group v-model="allStatus">
                    <el-checkbox :label="-1" v-if="ruleForm.companyType==0">全部正式公司可见</el-checkbox>
                    <el-checkbox :label="-3" v-if="ruleForm.companyType==1">全部演示公司可见</el-checkbox>
                    <el-checkbox :label="-2" v-if="ruleForm.companyType==2">全部竞品公司可见</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="所属页面">
                <el-select v-model="bannerForm.belongPage">
                    <el-option
                        :key="1"
                        label="商城"
                        :value="1">
                    </el-option>
                    <el-option
                        :key="2"
                        label="我的体检"
                        :value="2">
                    </el-option>
                    <el-option
                        :key="4"
                        label="web商城首页"
                        :value="4">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="是否显示">
                <el-radio-group v-model="bannerForm.enabled">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>

           <el-form-item label="Banner类型">
                <el-select v-model="bannerForm.linkType" @change="bannerCh" value-key="id">
                    <el-option
                        v-for="item in bannerSkipList"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="排序">
                <el-input-number v-model="bannerForm.sort"></el-input-number>
            </el-form-item>


            <el-form-item label="平台图片">
                <el-upload
                    class="avatar-uploader"
                    :action="baseImgPath"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-error="handleError"
                    :data="imgForm">
                    <img v-if="bannerForm.imgUrl" :src="bannerForm.imgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <p style="color:#f00;">web商城轮播图建议尺寸1920*500</p>
            </el-form-item>

            <el-form-item label="配置参数" prop="name" v-if="bannerForm.linkType==1">
                <el-select v-model="bannerForm.linkId" @change="pageSkipChange">
                    <el-option
                        v-for="item in pageSkip"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

             <!-- 本地参数特殊跳转 -->
            <el-form-item label="参数1" v-if="bannerForm.linkType==1 && (bannerForm.linkId == 17 || bannerForm.linkId == 63)">
                <el-select v-model="bannerForm.linkdate1"
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
            <el-form-item label="参数1" v-if="bannerForm.linkType==1 && (bannerForm.linkId == 20 || bannerForm.linkId == 66)">
                <el-select v-model="bannerForm.linkdate1"
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
            <el-form-item label="参数1" v-if="bannerForm.linkType==1 && (bannerForm.linkId == 25 || bannerForm.linkId == 71)">
                <el-select v-model="bannerForm.linkdate1"
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
            <el-form-item label="参数1" v-if="bannerForm.linkType==1 && (bannerForm.linkId == 53 || bannerForm.linkId == 85)">
                <el-select v-model="bannerForm.linkdate1">
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

            <el-form-item label="配置链接" prop="name" v-if="bannerForm.linkType==2">
                <el-input v-model="bannerForm.linkUrl"></el-input>
            </el-form-item>

            <el-form-item label="配置链接" prop="name" v-if="bannerForm.linkType==3">
                <el-select v-model="bannerForm.linkId" value-key="id">
                    <el-option
                        v-for="item in urlList"
                        :key="item.externalLinkId"
                        :label="item.externalLinkName"
                        :value="item.externalLinkId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="商品分类" prop="name" v-if="bannerForm.linkType==4">
                <el-select v-model="bannerForm.linkId">
                    <el-option
                        v-for="item in classifyList"
                        :key="item.standardUnitCombinationId"
                        :label="item.combinationName"
                        :value="item.standardUnitCombinationId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="移动端页面" prop="name" v-if="bannerForm.linkType == 4">
                <el-select v-model="bannerForm.cmsPageMId" style="width: 200px;margin-right:15px;" placeholder="跳转页面" @focus="getCmsMpage">
                    <el-option
                    v-for="(item,index) in clientTypeDate"
                    :key="item.id"
                    :label="item.pageName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="PC端页面" prop="name" v-if="bannerForm.linkType == 4">
                <el-select v-model="bannerForm.cmsPagePcId" style="width: 200px;margin-right:15px;" placeholder="跳转页面" @focus="getCmsPcpage">
                    <el-option
                        v-for="(item,index) in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="配置商品" prop="name" v-if="bannerForm.linkType==5">
                <el-select
                    v-model="bannerForm.linkId"
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

            <el-form-item label="所属分页tab" v-if="bannerForm.linkType==7">
                <el-select v-model="bannerForm.linkId">
                    <el-option
                        v-for="item in tabList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="配置参数" prop="name" v-if="bannerForm.linkType==8">
                <el-select v-model="bannerForm.linkId">
                    <el-option
                        v-for="item in pageDo"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

             <!-- 操作配置特殊跳转 -->
            <el-form-item label="参数1" v-if="bannerForm.linkType==8 && (bannerForm.linkId == 1 || bannerForm.linkId == 6)">
                <el-input v-model="bannerForm.linkdate1" placeholder="关键词1" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数2" v-if="bannerForm.linkType==8 && (bannerForm.linkId == 1 || bannerForm.linkId == 6)">
                <el-input v-model="bannerForm.linkdate2" placeholder="关键词2" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数3" v-if="bannerForm.linkType==8 && (bannerForm.linkId == 1 || bannerForm.linkId == 6)">
                <el-input v-model="bannerForm.linkdate3" placeholder="关键词3" style="width:224px;"></el-input>
            </el-form-item>
            <div v-if="bannerForm.linkType==8">
                <el-form-item label="参数1" v-if="bannerForm.linkId == 2 || bannerForm.linkId == 3 || bannerForm.linkId == 7 || bannerForm.linkId == 8">
                    <el-select v-model="bannerForm.linkdate1"
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
                <el-form-item label="参数2" v-if="bannerForm.linkId == 2 || bannerForm.linkId == 3 || bannerForm.linkId == 7 || bannerForm.linkId == 8">
                    <el-input v-model="bannerForm.linkdate2" placeholder="规格数量" style="width:224px;"></el-input>
                </el-form-item>
                <el-form-item label="参数1" v-if="bannerForm.linkId == 5 || bannerForm.linkId == 4 || bannerForm.linkId == 9 || bannerForm.linkId == 10">
                    <el-select v-model="bannerForm.linkdate1"
                        filterable
                        reserve-keyword
                        placeholder="优惠券批次名称"
                        remote
                        >
                        <el-option
                            v-for="item in couponList"
                            :key="item.id"
                            :label="item.couponBatchName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>

            <el-form-item label="备注">
                <el-input v-model="bannerForm.remark"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="updateBannerByIdWithTx">确 定</el-button>
        </div>

    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {findStoreByPlatformId,findCommodityProductUnitLimit,findCouponBatchOfPage,findCategoryTreeAll,findStoreAllInfo,findCmsLocalParamAll,queryBannerList,findCompanyIdOrName,getQiNiuToken,findStandardUnitIdAndName,localParamList,queryStandardUnitCombinationAll,
findExternalLinkAll,findByStandardUnitName,saveBanner,findBannerById,findSimplePageTabAll,findCmsPageAllByClientType} from '../../../api/getData';
export default {
    data() {
        return {
            imgForm:{
                key:'',
                token:'',
            },
            changeFlag: false,
            dataSource: [],
            offset: 0,
            limit: 10,
            count: null,
            currentPage: 1,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            dialogTitle:"新增Banner",
            activityName:'',
            clientTypeDate:[],
            bannerForm:{
                bannerId:'',
                sort:1,
                name:'',
                imgUrl:'',
                belongPage:'',
                companyIds:[],
                enabled:'',
                linkId:'',
                linkUrl:'',
                linkType:'',
                linkdate1:'',
                linkdate2:'',
                linkdate3:'',
                remark:'',
                companyType:'',
                cmsPagePcId:'',
                cmsPageMId:'',
                linkableButtonPageList:[],
                extParam:[]
            },
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
            companyList:[],
            goodsList:[],
            baseImgPath:'',
            baseImgUrl:'',
            loading: false,
            localList:[],
            urlList:[],
            classifyList:[],
            loading:false,
            allStatus:[],
            ruleForm:{
                name:'',
                linkType:'',
                belongPage:'',
                companyType:0,
                pageNo:1,
                pageSize:10
            },
            pageSkip:[],
            pageDo:[],
            couponList:[],
            categoryTreeList:[],
            storeList:[],
            puList:[]
        }
    },
    created() {
        this.queryBannerList();
        this.findCompanyIdOrName();
        this.queryStandardUnitCombinationAll();
        this.findExternalLinkAll();
        this.localParamList();
        this.findCmsPageAllByClientType();
        //this.findCmsPageAllByClientType();
       // this.findCmsPageAllByClientType2(5);
        this.findCouponBatchOfPage();
        this.findCategoryTreeAll();
        this.findStoreAllInfo();
        this.findCmsLocalParamAll();
        this.findCmsLocalParamAll2();
        this.findByStandardUnitName();
        this.findCommodityProductUnitLimit();
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
        })

    },
    watch : {
        "bannerForm.linkType":{
            handler(curVal,oldVal){
                this.linkId = '';
                this.queryBannerList();
                this.findCompanyIdOrName();
                this.queryStandardUnitCombinationAll();
                this.findExternalLinkAll();
                this.localParamList();
                this.findCmsPageAllByClientType();
            // this.findCmsPageAllByClientType();
            // this.findCmsPageAllByClientType2(5);
                this.findCouponBatchOfPage();
                this.findCategoryTreeAll();
                this.findStoreAllInfo();
                this.findCmsLocalParamAll();
                this.findCmsLocalParamAll2();
                this.findByStandardUnitName();
                this.findCommodityProductUnitLimit();
            }
        },
        // 'bannerForm.linkType'(e){
        //     if( this.changeFlag){
        //       this.urlList = {};
        //     }
        //     if( e && e.id ){
        //         this.findExternalLinkAll();
        //     }
        // }
    },
    methods: {
        getid(){
            this.bannerForm.linkableButtonPageList= [];
           console.log(this.bannerForm.cmsPagePcId);
           console.log(22)
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
        getCmsPcpage(){
            this.findCmsPageAllByClientType(5,'');
        },
        getCmsMpage(){
            this.findCmsPageAllByClientType(6,'');
        },
        //通过客户端类型查询商品页列表
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

        //获取列表
        async queryBannerList() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await queryBannerList(obj);

                if (res.data.code == 0) {
                    this.count = res.data.data.bannerPage.totalSize;
                    this.dataSource = res.data.data.bannerPage.list;

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！列表获取失败'
                });

            }
        },
         //获取优惠券批次列表
        async findCouponBatchOfPage() {
            try {
                const res = await findCouponBatchOfPage({pageNo:1,pageSize:50});
                if (res.data.code == 0) {
                    this.couponList = res.data.data.list;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！优惠券'
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
                    message: '获取数据失败,请联系管理员！类目树'
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
                    message: '获取数据失败,请联系管理员！门店'
                });

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
                    message: '获取数据失败,请联系管理员！参数配置'
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
                    message: '获取数据失败,请联系管理员！参数获取'
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
                    message: '获取数据失败,请联系管理员！参数获取'
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
                    message: '获取数据失败,请联系管理员！su信息'
                });

            }
        },
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
        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.queryBannerList()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.queryBannerList()
        },


        //重置
        resetForm(){
            this.ruleForm={
                name:'',
                linkType:'',
                belongPage:'',
                pageNo:1,
                pageSize:10
            };

            this.queryBannerList()
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.queryBannerList()
        },
        //切换公司类型
        checkCompany(type){
            this.ruleForm.companyType = type;
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findCompanyIdOrName();
            this.queryBannerList();
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
                    message: '获取数据失败,请联系管理员！外链'
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
                    message: '获取数据失败,请联系管理员！su分组'
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

        // banner类型切换
        bannerCh:function(type){
            console.log(this.localList);
            this.bannerForm.linkId = '';
            this.bannerForm.linkUrl ='';
            this.bannerForm.cmsPageMId = '';
            this.bannerForm.cmsPagePcId ='';
            this.bannerForm.linkableButtonPageList=[];
            this.bannerForm.linkdate1 ='';
            this.bannerForm.linkdate2 = '';
            this.bannerForm.linkdate3 = '';
        },
        //获取公司列表
        async findCompanyIdOrName () {
            try {
                const res = await findCompanyIdOrName({companyType:this.ruleForm.companyType});
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
                    message: '获取数据失败,请联系管理员！公司列表'
                });

            }
        },



        //新增banner
        addActivity () {
            this.bannerForm = {
                bannerId:'',
                sort:1,
                name:'',
                imgUrl:'',
                companyIds:[],
                belongPage:'',
                enabled:'',
                linkId:'',
                linkUrl:'',
                linkType:'',
                remark:'',
                bannerForm:'',
                cmsPagePcId:'',
                cmsPageMId:'',
                linkdate1:'',
                linkdate2:'',
                linkdate3:'',
                linkableButtonPageList:[],
                extParam:[],
            };

            if(this.$store.state.Cookie.mutations.fetch().platformId==2){
                this.bannerForm.companyIds = [2];
            }
            this.allStatus = [];
            this.dialogTitle = '新增Banner';
            this.findSimplePageTabAll();
            this.dialogFormVisible = true;
        },


        //编辑banner
        async editActivity (id) {
            this.findSimplePageTabAll();
            this.findBannerById(id);
            this.dialogTitle = '修改Banner';
            this.dialogFormVisible = true;

        },

        //根据banner ID查询信息
        async findBannerById (id) {
            try {
                const res = await findBannerById({bannerId:id});
                if (res.data.code == 0) {
                    let that = this;
                    that.bannerForm.bannerId = res.data.data.banner.id;
                    that.bannerForm.linkId = res.data.data.banner.linkId;
                    that.bannerForm.linkUrl = res.data.data.banner.linkUrl;
                    that.bannerForm.linkType = res.data.data.banner.linkType;
                    that.bannerForm.imgUrl = res.data.data.banner.imgUrl;
                    that.bannerForm.linkParam = res.data.data.banner.linkParam;
                    that.bannerForm.belongPage = res.data.data.banner.belongPage;
                    that.bannerForm.name = res.data.data.banner.name;
                    that.bannerForm.remark = res.data.data.banner.remark;
                    that.bannerForm.enabled = res.data.data.banner.enabled;
                    that.bannerForm.sort = res.data.data.banner.sort;
                    that.bannerForm.companyIds = res.data.data.banner.companyIds;
                    //that.bannerForm = res.data.data.banner;
                    console.log(that.bannerForm.linkableButtonPageList);
                    console.log('111');
                    if(res.data.data.banner.linkableButtonPageList && res.data.data.banner.linkableButtonPageList.length>0){
                        that.bannerForm.linkableButtonPageList = res.data.data.banner.linkableButtonPageList;
                        $.each(that.bannerForm.linkableButtonPageList,function(key,info){
                            if(info.clientType == 5){
                                that.bannerForm.cmsPagePcId= info.cmsPageId;
                            }else if(info.clientType == 6){
                                that.bannerForm.cmsPageMId= info.cmsPageId;
                            }
                        })
                    }else{
                        that.bannerForm.linkableButtonPageList = [];
                    };
                    if(res.data.data.banner.extParam && res.data.data.banner.extParam.length>0){
                        that.bannerForm.extParam = res.data.data.banner.extParam;
                        that.bannerForm.linkdate1 = that.bannerForm.extParam[2].value;
                        that.bannerForm.linkdate2 = that.bannerForm.extParam[1].value;
                        that.bannerForm.linkdate3 = that.bannerForm.extParam[0].value;
                    }
                    if(res.data.data.banner.companyIds[0] < 0){
                        that.allStatus = res.data.data.banner.companyIds;
                        that.bannerForm.companyIds = [];
                    }else{
                        that.allStatus = [];
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
                    message: '获取数据失败,请联系管理员！查询信息'
                });

            }
        },


        //保存
        async updateBannerByIdWithTx () {
            try {
                this.bannerForm.companyType = this.ruleForm.companyType;
                let obj = JSON.parse(JSON.stringify(this.bannerForm));
                if(this.allStatus.length>0){
                    obj.companyIds = JSON.stringify(this.allStatus);
                }else{
                    obj.companyIds = JSON.stringify(this.bannerForm.companyIds);
                }
                this.bannerForm.linkableButtonPageList = [
                    {
                    "cmsPageId": this.bannerForm.cmsPagePcId,
                    "clientType": 5, // 5: pc端  6:移动端
                    },
                    {
                    "cmsPageId": this.bannerForm.cmsPageMId,
                    "clientType": 6,
                    }
                ];
                obj.linkableButtonPageList = JSON.stringify(this.bannerForm.linkableButtonPageList);
                this.bannerForm.extParam = [
                    {
                        "name":"extParam1",
                        "value":this.bannerForm.linkdate1
                    },
                    {
                        "name":"extParam2",
                        "value":this.bannerForm.linkdate2
                    },
                    {
                        "name":"extParam3",
                        "value":this.bannerForm.linkdate3
                    }
                ];
                obj.extParam = JSON.stringify(this.bannerForm.extParam);
                const res = await saveBanner(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '更新Banner成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.queryBannerList();
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
        //公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.bannerForm.companyIds = arr;
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
            const t = new Date(time);
            return t.getTime()
        },


        //上传图片
        beforeAvatarUpload(file) {    //在图片提交前进行验证  轮播图
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
             console.log(this.imgForm)
            if (!isJPG&&!isPNG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
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
            this.bannerForm.imgUrl = this.baseImgUrl + response.key;
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


