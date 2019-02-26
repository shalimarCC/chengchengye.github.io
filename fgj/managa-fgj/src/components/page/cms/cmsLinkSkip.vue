<template>
    <div id="contentIn">
        <!-- 跳转页面 -->
        <div style="overflow:hidden;">
            <el-form-item label="移动端页面" v-if="skipType == 4" style="margin-bottom:6px;">
                <el-select v-model="form.cmsPageMId" placeholder="跳转页面" @focus="getCmsMpage" @change="getDateToAddPage">
                    <el-option
                    v-for="(item,index) in clientTypeDate"
                    :key="item.id"
                    :label="item.pageName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="PC端页面" v-if="skipType == 4" style="margin-bottom:6px;">
                <el-select v-model="form.cmsPagePcId" placeholder="跳转页面" @focus="getCmsPcpage" @change="getDateToAddPage">
                    <el-option
                        v-for="(item,index) in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="配置参数" prop="name" v-if="skipType==1" style="margin-bottom:6px;">
                <el-select v-model="form.linkId" @change="getDateToAddPage">
                    <el-option
                        v-for="item in pageSkip"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 本地参数特殊跳转 -->
            <el-form-item label="参数1" v-if="skipType==1 && (form.linkId == 17 || form.linkId == 63)" style="margin-bottom:6px;">
                <el-select v-model="form.linkdate1"
                    filterable
                    reserve-keyword
                    placeholder="请输入关键词"
                    remote
                    @change="getDateToAddPage"
                    >
                    <el-option
                        v-for="item in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数1" v-if="skipType==1 && (form.linkId == 20 || form.linkId == 66)" style="margin-bottom:6px;">
                <el-select v-model="form.linkdate1"
                    filterable
                    reserve-keyword
                    placeholder="请输入关键词"
                    remote
                    @change="getDateToAddPage"
                    >
                    <el-option
                        v-for="item in storeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数1" v-if="skipType==1 && (form.linkId == 25 || form.linkId == 71)" style="margin-bottom:6px;">
                <el-select v-model="form.linkdate1"
                    filterable
                    reserve-keyword
                    placeholder="请输入关键词"
                    remote
                    @change="getDateToAddPage"
                    >
                    <el-option
                        v-for="item in categoryTreeList"
                        :key="item.categoryTreeId"
                        :label="item.categoryTreeName"
                        :value="item.categoryTreeId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数1" v-if="skipType==1 && (form.linkId == 53 || form.linkId == 85)" style="margin-bottom:6px;">
                <el-select v-model="form.linkdate1" @change="getDateToAddPage">
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
            <el-form-item label="配置链接" prop="name" v-else-if="skipType==2" style="margin-bottom:6px;">
                <el-input v-model="form.linkUrl" style="width:226px;" @change="getDateToAddPage"></el-input>
            </el-form-item>
            <el-form-item label="配置链接" prop="name" v-else-if="skipType==3" style="margin-bottom:6px;">
                <el-select v-model="form.linkId" @change="getDateToAddPage">
                    <el-option
                        v-for="item in urlList"
                        :key="item.externalLinkId"
                        :label="item.externalLinkName"
                        :value="item.externalLinkId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品分类" prop="name" v-else-if="skipType==4" style="margin-bottom:6px;">
                <el-select v-model="form.linkId" @change="getDateToAddPage">
                    <el-option
                        v-for="item in classifyList"
                        :key="item.standardUnitCombinationId"
                        :label="item.combinationName"
                        :value="item.standardUnitCombinationId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="配置商品" prop="name" v-else-if="skipType==5" style="margin-bottom:6px;">
                <el-select
                    v-model="form.linkId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    @change="getDateToAddPage"
                    >
                        <el-option
                        v-for="item in goodsList"
                        :key="item.standardUnitId"
                        :label="item.standardUnitName"
                        :value="item.standardUnitId">
                        </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属分页tab" v-else-if="skipType==7" style="margin-bottom:6px;">
                <el-select v-model="form.linkId" @change="getDateToAddPage">
                    <el-option
                        v-for="item in tabList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="配置参数" prop="name" v-if="skipType==8" style="margin-bottom:6px;">
                <el-select v-model="form.linkId" @change="getDateToAddPage">
                    <el-option
                        v-for="item in pageDo"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 操作配置特殊跳转 -->
            <el-form-item label="参数1" v-if="skipType==8 && (form.linkId == 1 || form.linkId == 6)">
                <el-input v-model="form.linkdate1" placeholder="关键词1" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数2" v-if="skipType==8 && (form.linkId == 1 || form.linkId == 6)">
                <el-input v-model="form.linkdate2" placeholder="关键词2" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数3" v-if="skipType==8 && (form.linkId == 1 || form.linkId == 6)">
                <el-input v-model="form.linkdate3" placeholder="关键词3" style="width:224px;" @change="getDateToAddPage"></el-input>
            </el-form-item>
            <div v-if="skipType==8">
                <el-form-item label="参数1" v-if="form.linkId == 2 || form.linkId == 3 || form.linkId == 7 || form.linkId == 8">
                    <el-select v-model="form.linkdate1"
                        filterable
                        reserve-keyword
                        placeholder="请输入商品规格"
                        remote
                        @change="getDateToAddPage"
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
                    <el-input v-model="form.linkdate2" placeholder="规格数量" style="width:224px;" @change="getDateToAddPage"></el-input>
                </el-form-item>
                <!-- <el-form-item label="参数1" v-if="form.linkId == 5 || form.linkId == 4">
                    <el-select v-model="form.linkdate1"
                        filterable
                        reserve-keyword
                        placeholder="优惠券批次名称"
                        remote
                        @change="getDateToAddPage"
                        >
                        <el-option
                            v-for="item in dataSource"
                            :key="item.id"
                            :label="item.couponBatchName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="参数1" v-if="form.linkId == 4 || form.linkId == 9">
                    <el-select v-model="form.linkdate1"
                        filterable
                        reserve-keyword
                        placeholder="优惠券批次名称"
                        remote
                        @change="getDateToAddPage"
                        >
                        <el-option
                            v-for="item in dataSource1"
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
                        @change="getDateToAddPage"
                        >
                        <el-option
                            v-for="item in dataSource2"
                            :key="item.id"
                            :label="item.couponBatchName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
        </div>
    </div>
</template>

<script>
import {findStoreByPlatformId,findCommodityProductUnitLimit,findCouponBatchOfPage,findCategoryTreeAll,findStoreAllInfo,findCmsLocalParamAll,findSimplePageTabAll,findByStandardUnitName,findExternalLinkAll,localParamList,findCmsPageAllByClientType,queryStandardUnitCombinationAll,findCompanyIdOrName,getQiNiuToken,findCmsTemplateAll,findCfgKeyByTemplateId,queryBannerList,insertCmsPageWithTx} from '../../../api/getData';
export default {
    props:{
        skipType:'',
        skipObj:{},
        skipObjIcon1:{},
        skipObjIcon2:{}
    },

    data(){
        return {
            form:{
                linkdate1:'',
                linkdate2:'',
                linkdate3:'',
                skipType:'',
                linkUrl:'',
                linkId:'',
                cmsPagePcId:'',
                cmsPageMId:'',
                linktext1:'',
                linktext2:'',
                linktext3:''
            },
            eleSort:'',
            eleConfig:{
                elementConfig:[]
            },
            classifyList:[],//商品组合
            imgForm:{
                key:'',
                token:'',
            },
            clientTypeDate:[],
            localList:[],
            count:null,
            allStatus:[],
            allStatus1:[],
            companyIds:[],
            companyList:[],
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
                    key:'配置选项'
                },
            ],
            elementConfig:[],
            eleTempConfig:[],
            checkshow:false,
            backBannershow:false,
            backColorshow:false,
            eleId:'',
            mesBanner : false,
            sliderImg:false,
            titleshow:false,
            textTitle:false,
            imgTitle:false,
            slideBannershow:false,
            checkBannerList:[],
            bannerForm:[],
            exampleForm:{
                bannerUrl:'',
                bannerIds:[]
            },
            dialogFormVisible4:false,
            index:'',
            iconCount:'',
            urlList:[],
            goodsList:[],
            tabList:[],
            pageSkip:[],
            pageDo:[],
            skipPageType:'',
            loading:false,
            storeList:[],
            categoryTreeList:[],
            dataSource:[],
            dataSource1:[],
            dataSource2:[],
            puList:[]
        }
    },
    mounted() {
        this.$forceUpdate();
    },
    created() {
        this.$forceUpdate();
        this.findCmsPageAllByClientType('',5);
        // this.findCouponBatchOfPage();
        this.findCouponBatchOfPage1();
        this.findCouponBatchOfPage2();
        this.findCategoryTreeAll();
        this.findStoreAllInfo();
        this.localParamList();
        this.findCmsLocalParamAll();
        this.findCmsLocalParamAll2();
        this.findExternalLinkAll();
        this.queryStandardUnitCombinationAll();
        this.findByStandardUnitName();
        this.findCommodityProductUnitLimit();
        if(this.skipObj){
            this.form = this.skipObj;
        };
        if(this.skipObjIcon1){
            this.form = this.skipObjIcon1;
        };
        if(this.skipObjIcon2){
            this.form = this.skipObjIcon2;
        };
        // this.form = this.skipObj;
    },
    methods: {
        //强制刷新
        forceUp(){
            this.$forceUpdate();
        },
        //传值出去
        getDateToAddPage(val){
            console.log(val);
            this.$forceUpdate();
            this.$emit('getskipDate',this.form);
        },
        //跳转配置的改变
        skipChange(val){
           console.log(val);
           this.form.linkUrl = '';
           this.form.linkId = '';
           this.form.cmsPagePcId = '';
           this.form.cmsPageMId = '';
        },
        //本地参数跳转
        pageSkipChange(val){
            this.linkdate1 = '';
            if(val == 17 || val == 63){
                this.skipPageType = 5;
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
        //获取公司Id
        getCompanyId(companyId){
            $.each(this.elementConfig,function(key,info){
                info.companyIds.push(companyId);
            });
        },
        uploadkey(index){
            this.index = index;
            console.log(index)
        },
        //获取优惠券批次列表
        // async findCouponBatchOfPage() {
        //     try {
        //         const res = await findCouponBatchOfPage({pageNo:1,pageSize:50});
        //         if (res.data.code == 0) {
        //             this.dataSource = res.data.data.list;
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
        //领用优惠券//5
        async findCouponBatchOfPage1() {
            try {
                const res = await findCouponBatchOfPage({pageNo:1,pageSize:50,grantType:1,getType:0,couponRelType:0,isEffect:0});
                if (res.data.code == 0) {
                    this.dataSource2 = res.data.data.list;
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
                    this.dataSource1 = res.data.data.list;
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
        }
    },
}
</script>

<style scoped>

</style>