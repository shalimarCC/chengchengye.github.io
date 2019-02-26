<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;width:100%;text-align:right">
        <el-button class="filter-item" @click="addProduct" type="primary" icon="edit">添加</el-button>
     </div>

    <tree-grid :columns="columns" :tree-structure="true" v-on:setTableTree="setTableTree" :data-source="dataSource"></tree-grid>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="上级菜单" prop="pId">
              <el-cascader
                :options="dataSource"
                change-on-select
                v-model="form.pids"
                :props="props"
                :disabled="form.id!=''"
              ></el-cascader>
            </el-form-item>

            <el-form-item label="类目名称" prop="name">
                <el-input v-model="form.name" placeholder="不超过6个字"  maxlength="6"></el-input>
            </el-form-item>


            <el-form-item label="类目排序" prop="listSort">
                <el-input-number controls-position="right" v-model="form.listSort" :min="1" label="类目排序"></el-input-number>
            </el-form-item>

            <el-form-item label="ICON图片" prop="listSort">
                <el-upload
                    class="avatar-uploader"
                    :action="baseImgPath"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-error="handleError"
                    :data="imgForm">
                    <img v-if="form.bannerImg" :src="form.bannerImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="跳转页面" prop="name" v-if="form.pids.length==0">
                <el-select v-model="form.linkType">
                    <el-option
                        v-for="item in pageList"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="移动端页面" v-if="form.linkType == 4 && form.pids.length==0" style="margin-bottom:6px;">
                <el-select v-model="cmsPageMId" placeholder="跳转页面" @focus="getCmsMpage" @change="getDateToAddPage">
                    <el-option
                    v-for="(item,index) in clientTypeDate"
                    :key="item.id"
                    :label="item.pageName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="PC端页面" v-if="form.linkType == 4 && form.pids.length==0" style="margin-bottom:6px;">
                <el-select v-model="cmsPagePcId" placeholder="跳转页面" @focus="getCmsPcpage" @change="getDateToAddPage">
                    <el-option
                        v-for="(item,index) in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="配置参数" prop="name" v-if="form.linkType==1&&form.pids.length==0">
                <el-select v-model="form.localParamId">
                    <el-option
                        v-for="item in pageSkip"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- 本地参数特殊跳转 -->
            <el-form-item label="参数1" v-if="form.linkType==1 && (form.localParamId == 17 || form.localParamId == 63)" style="margin-bottom:6px;">
                <el-select v-model="linkdate1"
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

            <el-form-item label="参数1" v-if="form.linkType==1 && (form.localParamId == 20 || form.localParamId == 66)" style="margin-bottom:6px;">
                <el-select v-model="linkdate1"
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

            <el-form-item label="参数1" v-if="form.linkType==1 && (form.localParamId == 25 || form.localParamId == 71)" style="margin-bottom:6px;">
                <el-select v-model="linkdate1"
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

            <el-form-item label="参数1" v-if="form.linkType==1 && (form.localParamId == 53 || form.localParamId == 85)" style="margin-bottom:6px;">
                <el-select v-model="linkdate1" @change="getDateToAddPage">
                    <el-option
                        :key="1"
                        label="满减券"
                        :value="1">
                    </el-option>
                    <el-option
                        :key="2"
                        label="兑换券"
                        :value="2">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="配置链接" prop="name" v-else-if="form.linkType==2&&form.pids.length==0">
                <el-input v-model="form.linkUrl"></el-input>
            </el-form-item>

            <el-form-item label="配置链接" prop="name" v-else-if="form.linkType==3&&form.pids.length==0">
                <el-select v-model="form.externalLinkId">
                    <el-option
                        v-for="item in urlList"
                        :key="item.externalLinkId"
                        :label="item.externalLinkName"
                        :value="item.externalLinkId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="商品分类" prop="name" v-else-if="form.linkType==4&&form.pids.length==0">
                <el-select v-model="form.standardUnitCombinationId">
                    <el-option
                        v-for="item in classifyList"
                        :key="item.standardUnitCombinationId"
                        :label="item.combinationName"
                        :value="item.standardUnitCombinationId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="配置商品" prop="name" v-else-if="form.linkType==5&&form.pids.length==0">
                <el-select
                    v-model="form.standardUnitId"
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

            <el-form-item label="配置参数" prop="name" v-if="form.linkType==8 && form.pids.length==0" style="margin-bottom:6px;">
                <el-select v-model="form.localParamId">
                    <el-option
                        v-for="item in pageDo"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                         @change="getDateToAddPage"
                        >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所属分页tab" v-else-if="form.linkType==7" style="margin-bottom:6px;">
                <el-select v-model="form.localParamId">
                    <el-option
                        v-for="item in tabList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        @change="getDateToAddPage">
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- 操作配置特殊跳转 -->
            <el-form-item label="参数1" v-if="form.linkType==8 && (form.localParamId == 1 || form.localParamId == 6)">
                <el-input v-model="linkdate1" placeholder="关键词1" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数2" v-if="form.linkType==8 && (form.localParamId == 1 || form.localParamId == 6)">
                <el-input v-model="linkdate2" placeholder="关键词2" style="width:224px;"></el-input>
            </el-form-item>
            <el-form-item label="参数3" v-if="form.linkType==8 && (form.localParamId == 1 || form.localParamId == 6)">
                <el-input v-model="linkdate3" placeholder="关键词3" style="width:224px;" @change="getDateToAddPage"></el-input>
            </el-form-item>
            <div v-if="form.linkType==8 && form.pids.length==0">
                <el-form-item label="参数1" v-if="form.localParamId == 2 || form.localParamId == 3 || form.localParamId == 7 || form.localParamId == 8">
                    <el-select v-model="linkdate1"
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
                <el-form-item label="参数2" v-if="form.localParamId == 2 || form.localParamId == 3 || form.localParamId == 7 || form.localParamId == 8">
                    <el-input v-model="linkdate2" placeholder="规格数量" style="width:224px;" @change="getDateToAddPage"></el-input>
                </el-form-item>
                <el-form-item label="参数1" v-if="form.localParamId == 4 || form.localParamId == 9">
                    <el-select v-model="linkdate1"
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
                <el-form-item label="参数1" v-if="form.localParamId == 5 || form.localParamId == 10">
                    <el-select v-model="linkdate1"
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


            <el-form-item label="类目备注">
                <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
            </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveCategory">确 定</el-button>
        </div>

    </el-dialog>

    <el-dialog title="关联方式" :visible.sync="dialogFormVisible1">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="后台类目树" name="first"></el-tab-pane>
         <!--   <el-tab-pane label="商品组合" name="second"></el-tab-pane> -->
        </el-tabs>
        <el-form ref="form" :model="dataForm" label-width="120px" v-show="activeName=='first'">
            <el-form-item label="关联类目">
                <el-tree
                    :data="data1"
                    show-checkbox
                    node-key="categoryTreeNodeId"
                    ref="tree1"
                    highlight-current
                    :props="defaultProps1">
                </el-tree>
            </el-form-item>
        </el-form>
        <!-- <el-form ref="form2" :model="productForm.tagList" label-width="120px" v-show="activeName=='商品组合'"> -->
        <el-form ref="form2" label-width="120px" v-show="activeName=='second'">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="combinationName">
            </el-input>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="medium">搜索</el-button>
            <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
            <el-form-item style="text-align:left;margin-left:-120px;">
                <el-checkbox-group v-model="tagList" @change="tagChange" class="checkCombination">
                    <el-checkbox v-for="item in combineList" :label="item.standardUnitCombinationId" :key="item.standardUnitCombinationId" ref="check1">{{item.combinationName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>



        <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible1 = false;tagList=[]">取 消</el-button>
            <el-button type="primary" @click="insertCombination">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import TreeGrid from '../../treeTable/vue/TreeGrid1.vue'
import {findStoreByPlatformId,findSimplePageTabAll,findCommodityProductUnitLimit,findCmsLocalParamAll,findCouponBatchOfPage,findCategoryTreeAll,findStoreAllInfo,findCmsPageAllByClientType,findSucTitleOfPage,findByCategoryTreeIdNode,getQiNiuToken,saveCategoryTreeNode,delByCategoryTreeNodeId,idsByCategoryId,
findByCategoryTreeNodeId,findStandardUnitCombinationByCategoryId,queryAllCategoryTreeNodeByType,queryStandardUnitCombinationAll,findByStandardUnitName,findCategoryTreeNodeId,
insertCategoryTreeNodeCategoryAllWithTx,findExternalLinkAll,localParamList,updateCategoryTreeNode,insertCtnAndSuc} from '../../../api/getData';
export default {
    data() {
        return {
            imgForm:{
                key:'',
                token:'',
            },
            linkdate1:"",
            linkdate2:"",
            linkdate3:"",
            cmsPagePcId:"",
            cmsPageMId:"",
            form: {
                categoryTreeId:"",
                name: "",
                description:"",
                pids:[],
                listSort:"",
                bannerImg:"11",
                linkType:"",
                externalLinkId:"",
                standardUnitCombinationId:"",
                standardUnitId:"",
                categoryTreeNodeId:"",
                id:"",
                localParamId:'',
                linkId:''
            },
            data1:[],
            tabList:[],
            dialogFormVisible1:false,
            defaultProps1:{
                children:'children',
                label:'name'
            },
            clientTypeDate:[],
            urlList:[],
            classifyList:[],
            goodsList:[],
            loading: false,
            rules: {
                name: [
                    { required: true, message: '请输入类目名称', trigger: 'blur' },
                    { max: 30, message: '字符长度不得超过30位', trigger: 'blur' }
                ],
                listSort: [
                    { required: true, message: '请输入类目排序',trigger: 'blur' },
                ],
                categoryLable:[
                    { required: true, message: '请输入节点标签', trigger: 'blur' }
                ],
                serialNumber: [
                    { required: true, message: '请输入类目编号',trigger: 'blur'},
                ],
            },
            dataSource: [],
            title:'新增类目',
            tableKey: 0,
            listLoading: true,
            dialogFormVisible: false,
            columns: [
                {
                text: '类目ID',
                dataIndex: 'categoryTreeNodeId'
                },
                {
                text: '类目名称',
                dataIndex: 'categoryTreeNodeName'
                },
                {
                text: '类目排序',
                dataIndex: 'listSort'
                },
                {
                text: '类目备注',
                dataIndex: 'description'
                },
            ],
            props : {
                value: 'categoryTreeNodeId',
                label: 'categoryTreeNodeName'
            },
            baseImgPath:'',
            baseImgUrl:'',
            pageList:[
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
            dataForm:{
                frontCategoryTreeNodeId:'',
                queenCategoryTreeNodeIdList:[],
                standardUnitCombinationIdList:[]
            },
            // productForm:{
                tagList:[],
            // },
            localList:[],
            combineList:[],
            activeName:'first',
            combinationName:'',
            pageDo:[],
            pageSkip:[],
            dataSource1:[],
            dataSource2:[],
            storeList:[],
            categoryTreeList:[],
            puList:[],
        }
    },
    created() {
        this.categoryTreeId = this.$route.params.id;
        this.findCmsPageAllByClientType();
        this.findByCategoryTreeIdNode();
        this.queryStandardUnitCombinationAll();
        this.findExternalLinkAll();
        this.localParamList();
        this.findCouponBatchOfPage1();
        this.findCouponBatchOfPage2();
        this.findCategoryTreeAll();
        this.findCmsLocalParamAll();
        this.findCmsLocalParamAll2();
        this.findStoreAllInfo();
        this.findCommodityProductUnitLimit();
        this.findSimplePageTabAll();
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
        "$route": {
            handler(curVal,oldVal){
                    let str = curVal.path;
                    str = str.substring(0,9)
                    if(str == "/cetegory"){
                    //Object.assign(this.$data, this.$options.data())
                    this.categoryTreeId = this.$route.params.id;
                    this.findByCategoryTreeIdNode();
                    this.queryStandardUnitCombinationAll();
                    this.findExternalLinkAll();
                    this.localParamList();
                    this.findCouponBatchOfPage1();
                    this.findCouponBatchOfPage2();
                    this.findCategoryTreeAll();
                    this.findCmsLocalParamAll();
                    this.findCmsLocalParamAll2();
                    this.findStoreAllInfo();
                    this.findCommodityProductUnitLimit();
                    this.findSimplePageTabAll();
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
                }

            },
        },
        "form.pids":{
            handler(curVal,oldVal){
                if(curVal.length!=0){
                    this.form.linkType = '';
                    this.form.standardUnitId  = '';
                    this.form.linkstandardUnitCombinationId = '';
                    this.form.externalLinkId  = '';
                    this.form.localParamId = '';
                    this.form.linkUrl  = '';
                    this.linkdate1="";
                    this.linkdate2="";
                    this.linkdate3="";
                    this.cmsPagePcId="";
                    this.cmsPageMId="";
                }
            }
        }
    },
    components: {
        TreeGrid
    },
    methods: {
        getDateToAddPage(){
           this.$forceUpdate();
        },
        //获取列表
        async findByCategoryTreeIdNode() {
            try {

                this.listLoading = false;
                const res = await findByCategoryTreeIdNode({categoryTreeId:this.$route.params.id});
                if (res.data.code == 0) {
                    this.dataSource = res.data.data;


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
            this.getUserList()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.getUserList()
        },

        //时间戳转换
        setTime(time) {
            const t = new Date(time);
            let y = t.getFullYear();
            let m = t.getMonth() + 1;
            let d = t.getDate();
            if (m < 10) {
                m = '0' + m
            }
            if (d < 10) {
                d = '0' + d
            }

            return y + '-' + m + '-' + d
        },

        //新增类目
        addProduct () {
            this.dialogFormVisible = true;
            this.form = {
                categoryTreeId:this.$route.params.id,
                name: "",
                description:"",
                pids:[],
                listSort:"",
                bannerImg:"",
                linkType:"",
                externalLinkId:"",
                standardUnitCombinationId:"",
                standardUnitId:"",
                categoryTreeNodeId:"",
                description:"",
                id:"",
                localParamId:'',
                linkId:''
            };
            this.linkdate1="";
            this.linkdate2="";
            this.linkdate3="";
            this.cmsPagePcId="";
            this.cmsPageMId="";
            this.title = '新增类目';
            this.goodsList = [];
        },
        //保存
        saveCategory(){
            if(this.form.id==""){
                this.saveCategoryTreeNode();
            }else{
                this.updateCategoryTreeNode();
            }
        },
        async saveCategoryTreeNode () {
            try {
                let cmsId = [
                     {
                        "cmsPageId":this.cmsPagePcId,
                        "clientType":5
                    },
                    {
                        "cmsPageId":this.cmsPageMId,
                        "clientType":6
                    }
                ];
                let arrexp = [
                    {
                        "name":"extParam1",
                        "value":this.linkdate1
                    },
                    {
                        "name":"extParam2",
                        "value":this.linkdate2
                    },
                    {
                        "name":"extParam3",
                        "value":this.linkdate3
                    }
                ];
                let obj  = JSON.parse(JSON.stringify(this.form));
                obj.pids = JSON.stringify(obj.pids);
                obj.linkableButtonPageList = JSON.stringify(cmsId);
                obj.extParam = JSON.stringify(arrexp);
                const res = await saveCategoryTreeNode(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: '新增',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findByCategoryTreeIdNode();
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

        async updateCategoryTreeNode () {
            try {
                let cmsId = [
                     {
                        "cmsPageId":this.cmsPagePcId,
                        "clientType":5
                    },
                    {
                        "cmsPageId":this.cmsPageMId,
                        "clientType":6
                    }
                ];
                let arrexp = [
                    {
                        "name":"extParam1",
                        "value":this.linkdate1
                    },
                    {
                        "name":"extParam2",
                        "value":this.linkdate2
                    },
                    {
                        "name":"extParam3",
                        "value":this.linkdate3
                    }
                ];
                let obj  = JSON.parse(JSON.stringify(this.form));
                obj.pids = JSON.stringify(obj.pids);
                obj.linkableButtonPageList = JSON.stringify(cmsId);
                obj.extParam = JSON.stringify(arrexp);
                const res = await updateCategoryTreeNode(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: '修改',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findByCategoryTreeIdNode();
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

        setTableTree(arr){
            const type = arr[1];
            const categoryTreeNodeId = arr[0];
            const categoryId = arr[2];
            const combineName = arr[3];
            if(type==4){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                    }).then(() => {
                        this.delByCategoryTreeNodeId(categoryTreeNodeId)
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }else if(type==2){
        //添加下级
                this.form = {
                    categoryTreeId:this.$route.params.id,
                    name: "",
                    description:"",
                    pids:[],
                    listSort:"",
                    bannerImg:"",
                    linkType:"",
                    externalLinkId:"",
                    standardUnitCombinationId:"",
                    standardUnitId:"",
                    categoryTreeNodeId:"",
                    description:"",
                    id:""
                };
                this.tableTreeAdd(categoryId);

            }else if(type==1){
                this.findByCategoryTreeNodeId(categoryTreeNodeId);
            }else if(type==3){
                this.dialogFormVisible1 = true;
                this.queryAllCategoryTreeNodeByType();
                this.findCategoryTreeNodeId(categoryTreeNodeId);
                this.findSucTitleOfPage();
                this.findStandardUnitCombinationByCategoryId(categoryTreeNodeId);
            }
        },
        //关联方式详情
        async findSucTitleOfPage () {
            try {
                const res = await findSucTitleOfPage({combinationName:this.combinationName});
                if (res.data.code == 0) {
                    this.combineList = res.data.data.list;
                    // console.log('关联方式详情');
                    // console.log(this.combineList);
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取商品组合失败,请联系管理员！404'
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
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                this.findByStandardUnitName(query);
            } else {
                this.loading = false;
                this.goodsList = [];
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
        //关联方式
        async queryAllCategoryTreeNodeByType (){
            const res = await queryAllCategoryTreeNodeByType({type:1});
            if(res.data.code==0){
                this.data1 = res.data.data[0].list;
            }else{

                this.$message({
                    type: 'error',
                    message: res.data.error
                });
            }
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
                    message: '获取数据失败,请联系管理员！客户端'
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
                    message: '获取数据失败,请联系管理员！findCmsLocalParamAll'
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
                    message: '获取数据失败,请联系管理员！findCmsLocalParamAll2'
                });

            }
        },
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
        //回显类目树
        async findCategoryTreeNodeId (categoryTreeNodeId){
            try {
                const res = await findCategoryTreeNodeId({categoryTreeNodeId:categoryTreeNodeId});
                if(res.data.code==0){
                    this.dataForm.frontCategoryTreeNodeId = categoryTreeNodeId;
                    this.dataForm.queenCategoryTreeNodeIdList = res.data.data;
                    this.$refs.tree1.setCheckedKeys(res.data.data);
                    console.log(this.dataForm.queenCategoryTreeNodeIdList);
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
        //回显商品组合
        async findStandardUnitCombinationByCategoryId (categoryTreeNodeId){
             try {
                const res = await findStandardUnitCombinationByCategoryId({categoryTreeNodeId:categoryTreeNodeId});
                if(res.data.code==0){
                    //this.dataForm.standardUnitCombinationIdList = res.data.data;
                    // console.log(res.data);
                    // console.log(res.data.data);
                    this.tagList = res.data.data;
                    // this.$refs.check1.setCheckedKeys(res.data.data);
                    //console.log(this.tagList);
                }else{

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

        //进行关联
        insertCombination(){
            // this.insertCategoryTreeNodeCategoryAllWithTx();
            this.insertCtnAndSuc();
            // frontCategoryTreeNodeId:long
            // queenCategoryTreeNodeIdList:list
            // standardUnitCombinationIdList:list
        },
        async insertCtnAndSuc(){
            try {
                let obj  = JSON.parse(JSON.stringify(this.dataForm));
                obj.queenCategoryTreeNodeIdList = JSON.stringify(this.$refs.tree1.getCheckedKeys(true));
                obj.standardUnitCombinationIdList = JSON.stringify(this.tagList);

                const res = await insertCtnAndSuc(obj);
                if(res.data.code==0){
                    this.$notify({
                        title: '关联方式',
                        message: '关联方式成功',
                        type: 'success',
                        duration: 2000
                    });
                    //this.tagList=[];
                    this.dialogFormVisible1 = false;
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

        //批量添加前台类目节点与后台类目节点关系接口（关联方式）
        async insertCategoryTreeNodeCategoryAllWithTx(){
            try {
                let obj  = JSON.parse(JSON.stringify(this.dataForm));
                obj.queenCategoryTreeNodeIdList = JSON.stringify(this.$refs.tree1.getCheckedKeys(true));

                const res = await insertCategoryTreeNodeCategoryAllWithTx(obj);
                if(res.data.code==0){
                    this.$notify({
                        title: '关联方式',
                        message: '关联方式成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible1 = false;
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
        //删除
        async delByCategoryTreeNodeId (id){
            const res = await delByCategoryTreeNodeId({categoryTreeNodeId:id});
            if(res.data.code==0){
                this.$notify({
                    title: '删除',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
                this.findByCategoryTreeIdNode();
            }else{

                this.$message({
                    type: 'error',
                    message: res.data.error
                });
            }
        },
        //新增子节点
        tableTreeAdd (id) {
            this.dialogFormVisible = true;
            const res = idsByCategoryId({categoryId:id});
            res.then(_data => {
                if(_data.data.code == 0){
                    this.title = '添加子类目';
                    this.form.pids = _data.data.data;
                }else{
                    this.selectTable.pId = [id];
                }
            })
        },
        //编辑查看信息
        async findByCategoryTreeNodeId (id) {
            try {

                const res = await findByCategoryTreeNodeId({categoryTreeNodeId:id});
                if (res.data.code == 0) {
                    this.title = '编辑类目';
                    this.form = res.data.data;
                    if(this.form.linkableButtonPageList && this.form.linkableButtonPageList.length>0){
                        this.cmsPagePcId=this.form.linkableButtonPageList[1].cmsPageId;
                        this.cmsPageMId=this.form.linkableButtonPageList[0].cmsPageId;
                    }
                    if(this.form.extParam && this.form.extParam.length>0){
                        this.linkdate1=parseInt(this.form.extParam[2].value);
                        this.linkdate2=this.form.extParam[1].value;
                        this.linkdate3=this.form.extParam[0].value;
                    }
                    if(this.form.linkType == 5){
                        this.findByStandardUnitName('',this.form.standardUnitId);
                    }
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
            this.form.bannerImg = this.baseImgUrl + response.key;
        },
        handleClick() {
            console.log(this.activeName);
        },
        tagChange() {
            console.log(this.tagList);
        },
        handleFilter() {
            this.findSucTitleOfPage();
        },
        //重置
        resetForm() {
            this.combinationName = '';
            this.findSucTitleOfPage();
            this.tagList=[];
        },

    }
}
</script>

<style scoped>
#example {
    padding: 5px 20px;
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
  .checkCombination label:nth-child(1) {
      margin-left:30px;
    }
</style>


