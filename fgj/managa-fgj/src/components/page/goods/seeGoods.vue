<template>
    <div v-if="isShow">

        <el-form label-width="80px" style="padding:20px 20px;min-width:400px;">
            <el-form-item label="产品编号" style="text-align:left;">
                <span class="text">{{basicGoodsData.merchantProduct.productSerialNumber}}</span>
            </el-form-item>

            <el-form-item label="产品类目" style="text-align:left;">
                <span class="text">{{basicGoodsData.merchantProduct.productCategory}}</span>
            </el-form-item>

            <el-form-item label="产品名称" style="text-align:left;">
                <span class="text">{{basicGoodsData.merchantProduct.standardProductUnitName}}</span>
            </el-form-item>

        </el-form>

        <el-form label-width="80px" ref="basicGoodsData.merchantProduct" :model="basicGoodsData.merchantProduct" style="padding:0 20px;min-width:400px;">
            <el-form-item label="商品名称" style="text-align:left;" prop="name">
                <el-tooltip class="item" effect="dark" content="电子卡券名称不得超出8位字符" placement="right">
                    <el-input v-model="basicGoodsData.merchantProduct.name"></el-input>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="所属总店" style="text-align:left;">
                <el-select v-model="merchantProduct.storeId" collapse-tags disabled>
                    <el-option
                        v-for="item in storeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="primary" plain size="small" @click="findStoreAllByTreeId" disabled>配置门店</el-button>
            </el-form-item>

            <el-form-item label="搜索关键词" style="text-align:left;">
                <el-radio-group v-model="merchantProduct.isSpuKeyword">
                    <el-radio :label="1" disabled>引用产品关键词</el-radio>
                    <el-radio :label="0" disabled>自定义关键词</el-radio>
                </el-radio-group>

                <div>
                    <el-tag
                    :key="tag"
                    v-for="tag in merchantProduct.keyWordList">
                    {{tag}}
                    </el-tag>
                </div>

            </el-form-item>

            <el-form-item label="市场价格" style="text-align:left;" prop="marketPrice">
                <el-input v-model="basicGoodsData.merchantProduct.marketPrice"></el-input>
            </el-form-item>

            <el-form-item label="销售价格" style="text-align:left;" prop="salePrice">
                <el-input v-model="basicGoodsData.merchantProduct.salePrice"></el-input>
            </el-form-item>

            <el-form-item label="促销价格" style="text-align:left;" prop="promotionPrice">
                <el-input v-model="basicGoodsData.merchantProduct.promotionPrice"></el-input>
            </el-form-item>

            <el-form-item label="已售基数" style="text-align:left;" prop="soldBase">
                <el-input v-model="basicGoodsData.merchantProduct.soldBase"></el-input>
            </el-form-item>

            <el-form-item label="前端编号" style="text-align:left;" prop="frontSerialNumber ">
                <el-input v-model="basicGoodsData.merchantProduct.frontSerialNumber"></el-input>
            </el-form-item>

            <el-form-item label="购买方式" style="text-align:left;">
                <el-select v-model="merchantProduct.buyType" placeholder="购买方式" disabled>
                    <el-option
                    label="支持积分+现金购买"
                    value="1">
                    </el-option>
                    <el-option
                    label="仅支持现金支付"
                    value="2">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="销售方式" style="text-align:left;">
                <el-select v-model="merchantProduct.saleWay" placeholder="销售方式" disabled>
                    <el-option
                    label="正常销售"
                    value="1">
                    </el-option>
                    <el-option
                    label="团购"
                    value="2">
                    </el-option>
                    <el-option
                    label="普通预售"
                    value="4">
                    </el-option>
                    <el-option
                    label="会籍预售"
                    value="6">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="预售期" style="text-align:left;">
                <el-input-number controls-position="right" v-model="merchantProduct.presellPeriod" :min="0" :disabled="merchantProduct.saleWay!=4 && merchantProduct.saleWay!=6"></el-input-number>天
            </el-form-item>

            <el-form-item label="会籍关联" style="text-align:left;">
                <el-select v-model="merchantProduct.membershipIdList" collapse-tags multiple disabled>
                    <el-option
                        v-for="item in membershipIdList"
                        :key="item.id"
                        :label="item.membershipName"
                        :value="item.id"
                        :disabled="item.isUse == 0">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SU关联" style="text-align:left;" prop="soldBase">
                {{suGoodsName}}
                <el-button class="button-new-tag" size="small" @click="resetGoods" disabled>选择SU(限1个)</el-button>
            </el-form-item>
        </el-form>

       <!-- <div style="padding:20px 20px;min-width:400px;">
             <h4  style="text-align:left;">商品比价：</h4>
             <el-table
                :data="basicGoodsData.sellPlatformMerchantProdList"
                border>
                    <el-table-column
                    label="平台"
                    min-width="100"
                    width="150"
                    align="center"
                    prop="name">

                    </el-table-column>

                    <el-table-column
                    label="价格"
                    min-width="100"
                    align="center"
                    width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.salePrice"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="链接"
                    min-width="200"
                    align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.path"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
        </div> -->

        <div style="padding:20px 20px;min-width:400px;" class="skuList">
             <h4  style="text-align:left;">规格属性：</h4>
             <el-table
                :data="propertyGoodsData"
                border
                min-height="500">

                    <el-table-column
                    width="55"
                    align="center">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.checked" :disabled="scope.row.isValid==0"></el-checkbox>
                        </template>

                    </el-table-column>

                    <el-table-column
                    label="pu名称"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="规格码"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.productUnitSerialNumber}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="价格"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.salePrice}}</span>
                        </template>
                    </el-table-column>


                    <el-table-column
                    label="上传图片"
                    align="center">
                        <template slot-scope="scope">
                            <img v-if="scope.row.puPicUrl" :src="scope.row.puPicUrl" style="width:40px;height:40px;">
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="是否上下架"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status==3">已上架</span>
                            <span v-else-if="scope.row.status==4">已下架</span>
                        </template>
                    </el-table-column>
                </el-table>
        </div>

        <el-form ref="form" label-width="150px" style="padding:20px 20px;min-width:400px;">

            <el-form-item label="列表页图片" style="text-align:left;">
                <img v-if="imgGoodsData.picture" :src="imgGoodsData.picture" class="avatar" style="width:140px;height:140px;">
            </el-form-item>

            <el-form-item label="详情页轮播图" style="text-align:left;">
                <template>
                    <div class="color-list">
                        <div class="color-item" v-for="(info,key) in imgGoodsData.pictureList" :key="key">
                            <el-card style="width:140px;float:left;margin:8px;position:relative;" :body-style="{ padding: '0px' }">
                                <img :src="info" class="image" style="width:140px;height:140px;">
                                <div style="padding: 3px;position:absolute;top:0;right:5px;">

                                </div>
                            </el-card>
                        </div>
                    </div>
                </template>
            </el-form-item>
        </el-form>

        <el-form label-width="150px" style="padding:20px 20px;min-width:400px;">
            <h4  style="text-align:left;">运营平台：</h4>

            <el-form-item label="运营方" style="text-align:left;">
                <el-select v-model="merchantProduct.merchantId" placeholder="销售方式">
                    <el-option
                    label="自营"
                    value="1">
                    </el-option>
                    <el-option
                    label="券仓"
                    value="2">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所属平台" style="text-align:left;">
                <el-checkbox-group v-model="merchantProduct.clientIds">
                    <el-checkbox v-for="val in basicGoodsData.clientList" :label="val.id" :key="val.id">{{val.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="福利企业" style="text-align:left;">
                <el-checkbox-group v-model="merchantProduct.companyIds">
                    <el-checkbox v-for="val in basicGoodsData.companyList" :label="val.id" :key="val.id">{{val.companyName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="商品显示状态" style="text-align:left;">
                <el-radio-group v-model="merchantProduct.isVisible">
                    <el-radio :label="0">显示</el-radio>
                    <el-radio :label="1">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>

        </el-form>

        <el-form label-width="150px" style="padding:20px 20px;min-width:400px;">
            <h4  style="text-align:left;">物流服务：</h4>

            <el-form-item label="运费说明" style="text-align:left;">
                <el-input v-model="basicGoodsData.merchantProduct.freightExplain"></el-input>
            </el-form-item>

            <el-form-item label="发货说明" style="text-align:left;">
                <el-input v-model="basicGoodsData.merchantProduct.shipmentsExplain"></el-input>
            </el-form-item>


        </el-form>
        <div style="padding:20px 20px;min-width:400px;">
            <h4  style="text-align:left;margin-bottom:20px;">商品详情：</h4>
            <template>
                <quill-editor v-model="basicGoodsData.merchantProduct.content"
                            ref="myQuillEditor"
                            :options="editorOption">

                                <div id="toolbar" slot="toolbar">
                                    <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-underline"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-strike"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-code-block"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-header" value="1"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-header" value="2"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-indent" value="-1"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-indent" value="+1"></button></span>
                                    <span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>

                                    <span class="ql-formats"><select class="ql-size">
                                        <option value="small"></option>
                                        <option selected></option>
                                        <option value="large"></option>
                                        <option value="huge"></option>
                                    </select></span>
                                    <span class="ql-formats"><select class="ql-header">
                                        <option value="1"></option>
                                        <option value="2"></option>
                                        <option value="3"></option>
                                        <option value="4"></option>
                                        <option value="5"></option>
                                        <option value="6"></option>
                                        <option selected="selected"></option>
                                    </select></span>
                                    <span class="ql-formats"><select class="ql-color">
                                        <option selected="selected"></option>
                                        <option value="#e60000"></option>
                                        <option value="#ff9900"></option>
                                        <option value="#ffff00"></option>
                                        <option value="#008a00"></option>
                                        <option value="#0066cc"></option>
                                        <option value="#9933ff"></option>
                                        <option value="#ffffff"></option>
                                        <option value="#facccc"></option>
                                        <option value="#ffebcc"></option>
                                        <option value="#ffffcc"></option>
                                        <option value="#cce8cc"></option>
                                        <option value="#cce0f5"></option>
                                        <option value="#ebd6ff"></option>
                                        <option value="#bbbbbb"></option>
                                        <option value="#f06666"></option>
                                        <option value="#ffc266"></option>
                                        <option value="#ffff66"></option>
                                        <option value="#66b966"></option>
                                        <option value="#66a3e0"></option>
                                        <option value="#c285ff"></option>
                                        <option value="#888888"></option>
                                        <option value="#a10000"></option>
                                        <option value="#b26b00"></option>
                                        <option value="#b2b200"></option>
                                        <option value="#006100"></option>
                                        <option value="#0047b2"></option>
                                        <option value="#6b24b2"></option>
                                        <option value="#444444"></option>
                                        <option value="#5c0000"></option>
                                        <option value="#663d00"></option>
                                        <option value="#666600"></option>
                                        <option value="#003700"></option>
                                        <option value="#002966"></option>
                                        <option value="#3d1466"></option>
                                    </select></span>
                                    <span class="ql-formats"> <select class="ql-background">
                                        <option value="#000000"></option>
                                        <option value="#e60000"></option>
                                        <option value="#ff9900"></option>
                                        <option value="#ffff00"></option>
                                        <option value="#008a00"></option>
                                        <option value="#0066cc"></option>
                                        <option value="#9933ff"></option>
                                        <option selected="selected"></option>
                                        <option value="#facccc"></option>
                                        <option value="#ffebcc"></option>
                                        <option value="#ffffcc"></option>
                                        <option value="#cce8cc"></option>
                                        <option value="#cce0f5"></option>
                                        <option value="#ebd6ff"></option>
                                        <option value="#bbbbbb"></option>
                                        <option value="#f06666"></option>
                                        <option value="#ffc266"></option>
                                        <option value="#ffff66"></option>
                                        <option value="#66b966"></option>
                                        <option value="#66a3e0"></option>
                                        <option value="#c285ff"></option>
                                        <option value="#888888"></option>
                                        <option value="#a10000"></option>
                                        <option value="#b26b00"></option>
                                        <option value="#b2b200"></option>
                                        <option value="#006100"></option>
                                        <option value="#0047b2"></option>
                                        <option value="#6b24b2"></option>
                                        <option value="#444444"></option>
                                        <option value="#5c0000"></option>
                                        <option value="#663d00"></option>
                                        <option value="#666600"></option>
                                        <option value="#003700"></option>
                                        <option value="#002966"></option>
                                        <option value="#3d1466"></option>
                                    </select></span>
                                    <span class="ql-formats"><select class="ql-font">
                                        <option selected="selected"></option>
                                        <option value="serif"></option>
                                        <option value="monospace"></option>
                                    </select></span>
                                    <span class="ql-formats">
                                        <select class="ql-align">
                                        <option selected="selected"></option>
                                        <option value="center"></option>
                                        <option value="right"></option>
                                        <option value="justify"></option>
                                    </select>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" class="ql-clean"></button>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" class="ql-link"></button>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button">
                                            <svg viewBox="0 0 18 18">
                                                <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                                                <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
                                                <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
                                            </svg>
                                        </button>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" class="ql-video"></button>
                                    </span>
                                    </div>
                        </quill-editor>
            </template>
        </div>
    </div>
</template>



<script>

import sku  from './sku.vue'
import { quillEditor } from 'vue-quill-editor';
import {findMerchantProductById,merchantProductViwe,findRootStoreAll,
findAllMembership,findStoreAllByTreeId,queryStandardUnitListByBlurry} from '../../../api/getData';
export default {
    props: {
        goodsId: {
            type: Number,
            default: function () {
                return ''
            }
        },
    },
    data() {
        var number = (rule, value, callback) => {

            if (!value) {
                return callback(new Error('不能为空'));
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'));
                }else{
                    callback();
                }
            }, 1000);
        };
        return {
            options: [],
            editorOption: {
                modules: {
                    toolbar: '#toolbar'
                }
            },
            standardData:[],
            basicGoodsData:{

            },
            propertyGoodsData:{

            },
            imgGoodsData:{

            },
            particGoodsData:'',
            isShow:false,
            disabled:true,
            membershipIdList:'',
            merchantProduct:{
                saleWay:'',
                buyType:'',
                merchantId:'',
                clientIds:'',
                companyIds:'',
                isVisible:'',
                isSpuKeyword:1,
                keywordList:[],
                storeIdList:[],
                membershipIdList:[],
                storeId:'',
                presellPeriod:'',
                relevanceSuId:'',
                suGoodsName:''
            },

        }

    },

    components: {
        sku,quillEditor,
    },
    mounted (){
        this.findMerchantProductById();
        this.findRootStoreAll();
       // this.findAllMembership();
    },
    methods:{
        checkboxChange () {

            const thtf = this;
            this.standardData = [];
            $.each(this.propertyGoodsData.merchantProdAttName.attNameList,function(key,info){

                var obj = new Object();
                obj.name = info.name;
                obj.id = info.id;
                obj.list = new Array();
                $.each(info.list,function(k,i){
                    if(i.checked){
                        obj.list.push(i)
                    }
                })
                thtf.standardData.push(obj);

            })

        },

        async findMerchantProductById () {

            try {

                const res = await findMerchantProductById({merchantProductId:this.goodsId});

                if (res.data.code == 0) {
                    //组织基本信息
                    this.basicGoodsData.clientList = res.data.data.clientList;
                    this.basicGoodsData.companyList = res.data.data.companyList;
                    this.basicGoodsData.merchantProduct = res.data.data.merchantProduct;
                    this.basicGoodsData.sellPlatformMerchantProdList = res.data.data.sellPlatformMerchantProdList;



                    //组织规格
                    this.propertyGoodsData = res.data.data.productUnitList;
                    //组织商品图片
                    this.imgGoodsData.picture = res.data.data.picture;
                    this.imgGoodsData.pictureList = res.data.data.pictureList;
                    this.imgGoodsData.merchantProductId = this.$route.params.goodsId;

                    this.merchantProduct.merchantId = this.basicGoodsData.merchantProduct.merchantId.toString();
                    this.merchantProduct.saleWay = this.basicGoodsData.merchantProduct.saleWay.toString();
                    this.merchantProduct.clientIds = this.basicGoodsData.merchantProduct.clientIds;
                    this.merchantProduct.companyIds = this.basicGoodsData.merchantProduct.companyIds;
                    this.merchantProduct.isVisible = this.basicGoodsData.merchantProduct.isVisible;
                    this.merchantProduct.keywordList = this.basicGoodsData.suKeyWordList;
                    this.merchantProduct.isSpuKeyword = this.basicGoodsData.merchantProduct.isSpuKeyword;
                    this.merchantProduct.storeIdList = this.basicGoodsData.merchantProduct.storeIdList;
                    this.merchantProduct.membershipIdList = this.basicGoodsData.membershipIdList;
                    this.merchantProduct.storeId = this.basicGoodsData.merchantProduct.storeId;
                    this.merchantProduct.presellPeriod = this.basicGoodsData.merchantProduct.presellPeriod;
                    this.merchantProduct.relevanceSuId = this.basicGoodsData.merchantProduct.relevanceSuId;
                    this.merchantProduct.buyType = this.basicGoodsData.merchantProduct.buyType.toString();
                    this.suGoodsName = this.basicGoodsData.merchantProduct.relevanceSuName;
                    this.isShow = true;
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
        async merchantProductViwe (productId) {

            try {

                const res = await merchantProductViwe({productId:productId});

                if (res.data.code == 0) {
                     //组织基本信息
                    this.basicGoodsData.name = res.data.data.productVO.name;
                    this.basicGoodsData.categoryName = res.data.data.productVO.categoryName;
                    this.basicGoodsData.chineseName = res.data.data.productVO.chineseName;

                    //组织属性规格
                    this.propertyGoodsData.apecificationList = res.data.data.productVO.apecificationList;
                    this.propertyGoodsData.list = res.data.data.productVO.list;

                    //组织商品图片
                    this.imgGoodsData.url = res.data.data.productVO.url;
                    this.imgGoodsData.pictureList = res.data.data.productVO.pictureList;

                    this.isShow = true;

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
        //选择商品
        selectGoods(obj){
            this.suGoodsName = obj.name;
            this.merchantProduct.relevanceSuId = obj.id;
            this.dialogFormVisible4 = false;
        },
         //分页
        handleSizeChange1(val) {
            this.goodsForm.pageSize = val;
            this.queryStandardUnitListByBlurry()
        },
        handleCurrentChange1(val) {
            this.goodsForm.pageNo = val;
            this.offset1 = (val - 1) * this.goodsForm.pageSize;
            this.queryStandardUnitListByBlurry()
        },
        //重置
        resetGoods(){
            this.goodsForm = {
                name:'',
                pageNo:1,
                pageSize:10,

            };
            this.queryStandardUnitListByBlurry();
        },
        //搜索
        searchGoods(){
            this.goodsForm.pageNo = 1;
            this.queryStandardUnitListByBlurry();
        },
        async queryStandardUnitListByBlurry () {
            try {
                const obj = new Object();
                $.each(this.goodsForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await queryStandardUnitListByBlurry(obj);
                if (res.data.code == 0) {
                    this.count1 = res.data.data.totalSize;
                    this.goodsListBase = res.data.data.list;
                    this.dialogFormVisible4 = true;
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
        //总店选择
        storeChange(){
            this.merchantProduct.storeIdList = [];
            this.storeChildrenList = [];
        },
        //选择门店
        checkStore(){
            this.merchantProduct.storeIdList = this.$refs.tree1.getCheckedKeys(true);
            this.dialogFormVisible3 = false;
        },
        //获取会籍列表
        async findAllMembership () {
            try {
                const res = await findAllMembership();
                if (res.data.code == 0) {
                    this.membershipIdList = res.data.data;
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
        //获取总店列表
        async findRootStoreAll () {
            try {
                const res = await findRootStoreAll();
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
        findStoreAllByTreeId(){
            if(this.merchantProduct.storeId!=''){
                let thtf = this;
                $.each(this.storeList,function(key,info){
                    if(info.id == thtf.merchantProduct.storeId){
                        thtf.findStoreAllByTreeIdAjax(info.storeTreeId);
                    }
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '请选择总店'
                });
            }
        },
        //根据总店ID获取门店列表
        async findStoreAllByTreeIdAjax (storeTreeId) {
            try {
                const res = await findStoreAllByTreeId({storeTreeId:storeTreeId});
                if (res.data.code == 0) {
                    this.storeChildrenList = res.data.data;
                    this.dialogFormVisible3 = true;
                    if(this.merchantProduct.storeIdList.length != 0){
                        this.$nextTick(function () {
                            this.$refs.tree1.setCheckedKeys(this.merchantProduct.storeIdList);
                        })
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
    text-align:center;
}
.text{
    font-size:16px;
    line-height:36px;
}
.el-upload--text {
    background-color: #fff;
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    width: 68px;
    height: 28px;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow:initial;
}

</style>


