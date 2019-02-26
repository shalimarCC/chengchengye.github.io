<template>
    <div id="example">
        <template v-if="active==1">
            <el-form ref="form" :model="form" label-width="200px" v-if="form.type==2||form.type==4">

                <el-form-item label="选择前台类目树" v-if="form.type==2">
                    <el-select v-model="treeForm.categoryTreeId" placeholder="选择前台类目树" @change="findByCategoryTreeIdNode">
                        <el-option
                            v-for="item in categoryTreeList"
                            :key="item.categoryTreeId"
                            :label="item.categoryTreeName"
                            :value="item.categoryTreeId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择类目" v-if="form.type==2">
                    <el-tree
                      :data="data1"
                      show-checkbox
                      node-key="categoryTreeNodeId"
                      ref="tree1"
                      highlight-current
                      empty-text="暂无数据，请先选择类目树"
                      :props="defaultProps2"
                      @check-change="getProductData"
                      v-loading.body="treeLoading">
                    </el-tree>
                </el-form-item>

                <el-form-item label="选择类目" v-if="form.type==4">
                    <el-tree
                      :data="data1"
                      show-checkbox
                      node-key="categoryTreeNodeId"
                      ref="tree1"
                      highlight-current
                      empty-text="暂无数据，请先选择类目树"
                      :props="defaultProps1"
                      @check-change="getProductData"
                      v-loading.body="treeLoading"
                      style="height:300px;overflow-y:scroll;">
                    </el-tree>
                </el-form-item>

                <el-form-item label="排序方式">
                    <el-select v-model="treeForm.sortType" placeholder="排序方式" @change="orderByType(treeForm.sortType)">
                        <el-option
                            v-for="item in sortType"
                            :key="item.value"
                            :label="item.key"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>



            </el-form>

            <div v-if="form.type==1"  style="margin-left:60px;margin-bottom:10px;">
                <el-button type="primary" size="small" @click="addGoods" style="margin-bottom:10px;"><i class="el-icon-plus"></i>选择商品</el-button>
                <!-- <el-button type="primary" size="small" style="margin-bottom:10px;"><i class="el-icon-plus"></i>选择商品</el-button> -->
                <el-table :key='tableKey' :data="goodsList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

                    <el-table-column align="center" label="商品名称" min-width="250">
                        <template slot-scope="scope">
                            <span>{{scope.row.StandardUnitName}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品ID" min-width="80">
                        <template slot-scope="scope">
                            <span>{{scope.row.standardUnitId}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品排序" min-width="80">
                        <template slot-scope="scope">
                            <el-input-number size="small" v-model="scope.row.sortValue" @change="goodsSort($event,scope.row.standardUnitCombinationSuId)"></el-input-number>
                        </template>
                    </el-table-column>


                    <el-table-column align="center" label="操作" width="350">
                        <template slot-scope="scope">
                            <el-button type="warning" plain size="small" @click="deleteStandardUnitCombinationSuWithTx(scope.row.standardUnitCombinationSuId)">移除</el-button>
                            <el-button type="primary" plain size="small" @click="seeGoods(scope.row.standardUnitId)">查看详情</el-button>
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
            </div>

            <div v-if="form.type==3"  style="margin-left:100px;margin-bottom:10px;">
                <el-form ref="dataForm" :model="dataForm" label-width="80px">
                    <el-form-item label="商品标签" style="text-align:left;">
                        <el-tag
                        :key="tag.id"
                        v-for="(tag,key) in checkLabel"
                        closable
                        @close="tagClose(key)">
                        {{tag.name}}
                        </el-tag>

                        <el-button class="button-new-tag" size="small" @click="addLabel">+ 添加标签</el-button>
                    </el-form-item>

                    <el-form-item label="排序方式" style="text-align:left;">
                        <el-select v-model="dataForm.sortType" placeholder="排序方式" @change="orderByType(dataForm.sortType)">
                            <el-option
                                v-for="item in sortType"
                                :key="item.value"
                                :label="item.key"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div style="display:inline-block;margin-bottom:20px;"><el-button class="filter-item" type="primary" icon="search" size="medium" style="margin-top: 12px;margin-left:130px;" v-if="form.type==2||form.type==4" @click='saveStandardUnitCombinationCategoryAll'>确定</el-button></div>
            <div style="display:inline-block;margin-bottom:20px;"><el-button class="filter-item" type="primary" icon="search" size="medium" style="margin-top: 12px;margin-left:130px;" v-if="form.type==3" @click='saveStandardUnitCombinationTag'>确定</el-button></div>
            <div style="display:inline-block;margin-bottom:20px;"><el-button class="filter-item" type="primary" icon="search" size="medium" style="margin-top: 12px;margin-left:50px;" v-if="form.type!=1" @click="back">取消</el-button></div>

            <el-dialog title="选择商品标签" :visible.sync="dialogFormVisible4">
                <div style="height:600px;overflow:auto;">
                    <div style="margin:15px 0;">
                        <el-input placeholder="请输入标签名称" v-model="labelForm.name">
                            <el-button slot="append" icon="el-icon-search" @click="findTagOfPage"></el-button>
                        </el-input>
                    </div>
                    <el-checkbox-group v-model="dataForm.tagList">
                        <el-table :key='tableKey' :data="labelList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

                            <el-table-column align="center" width="30">
                                <template slot-scope="scope">
                                    <el-checkbox :label="scope.row.id">1</el-checkbox>
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="标签名称" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>

                        </el-table>
                    </el-checkbox-group>
                    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                        <el-pagination
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        :current-page.sync="labelForm.pageNo"
                        :page-sizes="[10,20,30, 50]"
                        :page-size="labelForm.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="count">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer" :span="24">
                    <el-button size="medium" @click="dialogFormVisible4 = false">取 消</el-button>
                    <el-button size="medium" type="primary" @click="saveLabel">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="选择商品" :visible.sync="dialogFormVisible">
                <div style="margin-bottom:20px;">

                    <el-input @keyup.enter.native="handleFilter" style="width: 150px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="goodsForm.standardUnitName">
                    </el-input>

                    <el-select v-model="goodsForm.status" placeholder="商品状态" style="width: 150px;margin-right:15px;">
                        <el-option
                            v-for="item in goodsStatus"
                            :key="item.value"
                            :label="item.key"
                            :value="item.value">
                        </el-option>
                    </el-select>

                    <el-select v-model="goodsForm.saleWay" placeholder="销售方式" style="width: 150px;margin-right:15px;">
                        <el-option
                            v-for="item in salesMode"
                            :key="item.value"
                            :label="item.key"
                            :value="item.value">
                        </el-option>
                    </el-select>

                    <el-select v-model="goodsForm.merchantId" placeholder="运营方" style="width: 150px;margin-right:15px;">
                        <el-option
                            v-for="item in merchantList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>


                    <el-button class="filter-item" type="primary" icon="search" size="medium" @click="findBaseByConditionOfPage">搜索</el-button>
                    <el-button @click="resetForm" size="medium">重置</el-button>
                </div>
                <el-checkbox-group v-model="checkList">
                    <el-table :key='tableKey1' :data="goodsListBase" v-loading.body="listLoading1" border fit highlight-current-row style="width: 100%">
                        <el-table-column
                        align="center"
                        width="30">
                            <template slot-scope="scope">
                                <el-checkbox :label="scope.row.standardUnitId" :name="null"></el-checkbox>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="商品名称" min-width="250">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="商品价格" min-width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.salePrice}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="商品状态" min-width="80">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status==3">已上架</span>
                                <span v-else-if="scope.row.status==4">已下架</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="销售方式" min-width="80">
                            <template slot-scope="scope">
                                <span v-if="scope.row.saleWay==1">正常销售</span>
                                <span v-else-if="scope.row.saleWay==2">团购</span>
                                <span v-else-if="scope.row.saleWay==3">兑换卷</span>
                                <span v-else-if="scope.row.saleWay==4">普通预售</span>
                                <span v-else-if="scope.row.saleWay==5">会籍购买</span>
                                <span v-else-if="scope.row.saleWay==6">会籍预售</span>
                                <span v-else-if="scope.row.saleWay==7">预售</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="运营方" min-width="80">
                            <template slot-scope="scope">
                                <span v-if="scope.row.merchantId==1">自营</span>
                                <span v-if="scope.row.merchantId==2">券仓</span>
                                <span v-if="scope.row.merchantId==3">网店管家</span>
                                <span v-if="scope.row.merchantId==4">聚合数据</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button type="primary" plain size="small" @click="seeGoods(scope.row.standardUnitId)">查看详情</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-checkbox-group>
                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange4"
                    @current-change="handleCurrentChange4"
                    :current-page.sync="goodsForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="goodsForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count1">
                    </el-pagination>
                </div>
                <div slot="footer" class="dialog-footer" :span="24">
                    <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button size="medium" type="primary" @click="saveStandardUnitCombinationSuAll">确 定</el-button>
                </div>


            </el-dialog>

            <el-dialog title="查看产品" :visible.sync="dialogFormVisible1" append-to-body>
                <div>
                    <see-goods :goods-id="goodsId" v-if="dialogFormVisible1" ref="seegoods"></see-goods>
                </div>
            </el-dialog>
        </template>

        <template v-else-if="active==2">
            <img src="../../../assets/success.jpg" />
        </template>


        <!-- <el-dialog class="filter-container" id="example2" :visible.sync="productFormVisible"> -->
        <div v-if="form.type==3">
            <div style="margin-bottom:20px;">
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="productRuleForm.merchantProductSerialNumber" @keyup.native="checkSerialNumber(ruleForm.merchantProductSerialNumber)" maxlength="18"></el-input>
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="最低销售价格" v-model="productRuleForm.beginSalePrice" @keyup.native="checkBeginSalePrice(ruleForm.beginSalePrice)"></el-input>至
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;margin-left:15px;" class="filter-item" placeholder="最高销售价格" v-model="productRuleForm.endSalePrice" @keyup.native="checkEndSalePrice(ruleForm.endSalePrice)"></el-input>
                <el-select v-model="productRuleForm.status" placeholder="是否上架" style="width: 200px;margin-right:15px;">
                    <el-option label="待上架" value="1">
                    </el-option>
                    <el-option label="审核中" value="2">
                    </el-option>
                    <el-option label="已上架" value="3">
                    </el-option>
                    <el-option label="已下架" value="4">
                    </el-option>
                    <el-option label="审核未通过" value="5">
                    </el-option>
                </el-select>
                <el-select v-model="productRuleForm.merchantId" placeholder="运营方" style="width: 200px;margin-right:15px;">
                    <el-option label="自营" value="1">
                    </el-option>
                    <el-option label="券仓" value="2">
                    </el-option>
                    <el-option label="网店管家" value="3">
                    </el-option>
                    <el-option label="聚合数据" value="4">
                    </el-option>
                </el-select>
                </br>
            </div>
            <div style="margin-bottom:20px;">
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="productRuleForm.name"></el-input>
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="最低促销价格" v-model="productRuleForm.beginPromotionPrice" @keyup.native="checkBeginPromotionPrice(ruleForm.beginPromotionPrice)"></el-input>至
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;margin-left:15px;" class="filter-item" placeholder="最高促销价格" v-model="productRuleForm.endPromotionPrice" @keyup.native="checkEndPromotionPrice(ruleForm.endPromotionPrice)"></el-input>
                <el-select v-model="productRuleForm.isVisible" placeholder="商品状态" style="width: 200px;margin-right:15px;">
                    <el-option label="显示" value="0">
                    </el-option>
                    <el-option label="隐藏" value="1">
                    </el-option>
                </el-select>
            </div>

            <div style="margin-bottom:20px;">

                <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
                <el-button @click="resetProductForm" size="medium">重置</el-button>

            </div>


            <el-table :key='tableKey' :data="productData" v-loading.body="listLoading2" border fit highlight-current-row style="width: 100%" max-height="600">

                <el-table-column align="center" label="商品编号" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.merchantProductSerialNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="前端编号" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.frontSerialNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品名称" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="销售价格" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.salePrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="促销价格" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.promotionPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="市场价格" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.marketPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否上架" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==1">待上架</span>
                        <span v-else-if="scope.row.status==2">审核中</span>
                        <span v-else-if="scope.row.status==3">已上架</span>
                        <span v-else-if="scope.row.status==4">已下架</span>
                        <span v-else-if="scope.row.status==5">审核未通过</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运营方" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.merchantId==1">自营</span>
                        <span v-if="scope.row.merchantId==2">券仓</span>
                        <span v-if="scope.row.merchantId==3">网店管家</span>
                        <span v-if="scope.row.merchantId==4">聚合数据</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品显示状态" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isVisible==0">显示</span>
                        <span v-else-if="scope.row.isVisible==1">隐藏</span>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page.sync="productRuleForm.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="productRuleForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
                </el-pagination>
            </div>
        <!-- </el-dialog> -->
    </div>
  </div>

</template>



<script>
import seeGoods from '../goods/seeGoods2.vue'
import {findCategoryTreeAll,queryAllCategoryTreeNodeByType,findStandardUnitCombinationById,findByStandardUnitCombinationIdOfPage,findBaseByConditionOfPage,saveStandardUnitCombinationSuAll,deleteStandardUnitCombinationSuWithTx,sortValueByStandardUnitCombinationId,findByCategoryTreeIdNode,saveStandardUnitCombinationCategoryAll,findTagOfPage,saveStandardUnitCombinationTag,querySuByCategoryTreeNodeIds,queryMpByTagId} from '../../../api/getData';
export default {
    data() {
        return {
            form:{

            },
            treeForm:{
                standardUnitCombinationId:'',
                categoryTreeId:'',
                sortType:'',
                categoryTreeNodeIdList:''
            },
            ruleForm:{
                pageNo:1,
                pageSize:10,
                standardUnitCombinationId:'',
            },
            count:null,
            tableKey: 0,
            offset: 0,
            listLoading: true,
            goodsList:[],
            active:1,
            categoryTreeList:[],
            sortType:[
                {
                    key:"商品销量",
                    value:1
                },
                {
                    key:"更新时间",
                    value:2
                },
                {
                    key:"前端编号",
                    value:3
                },
            ],
            // orderBy:[
            //     {
            //         key:"商品销量",
            //         value:1
            //     },
            //     {
            //         key:"更新时间",
            //         value:2
            //     },
            //     {
            //         key:"前端编号",
            //         value:3
            //     },
            // ],
            data1: [],
            defaultProps1: {
              children: 'children',
              label: 'name'
            },
            defaultProps2: {
              children: 'children',
              label: 'categoryTreeNodeName'
            },
            dialogFormVisible:false,
            goodsForm:{
                standardUnitCombinationId:'',
                standardUnitName:'',
                status:'',
                saleWay:'',
                merchantId:'',
                pageNo:1,
                pageSize:10,

            },
            count1:null,
            tableKey1: 0,
            listLoading1: true,
            offset1: 0,
            goodsStatus:[
                {
                    key:"已上架",
                    value:"3"
                },
                {
                    key:"已下架",
                    value:"4"
                }
            ],
            salesMode:[
                {
                    key:"正常销售",
                    value:"1"
                },
                {
                    key:"团购",
                    value:"2"
                },
                {
                    key:"普通预售",
                    value:"4"
                },
                {
                    key:"会籍预售",
                    value:"6"
                }
            ],
            goodsListBase:[],
            checkList:[],
            dialogFormVisible1:false,
            goodsId:'',
            labelForm:{
                typeList:[1,2,3],
                // name:'',
                // type:'1',
                pageNo:1,
                pageSize:10,
                // isValid:1
            },
            labelList:[],
            checkLabel:[],
            dialogFormVisible4:false,
            dataForm:{
                tagList:[],
                sortType:''
            },
            goodsStatus:[
                {
                    key:"上架时间",
                    value:"1"
                },
                {
                    key:"商品销量",
                    value:"2"
                }
            ],
            productFormVisible:false,
            productRuleForm: {
                sortType:'',
                merchantId:'',
                merchantProductSerialNumber: "",
                name: "",
                tagIds:"",
                pageNo:"",
                beginSalePrice: "",
                endSalePrice: "",
                beginPromotionPrice: "",
                endPromotionPrice: "",
                saleWay: "",
                status: "",
                isVisible:"",
                platformId: "",
                pageNo:1,
                pageSize:10,
            },
            tagId:0,
            productData:[],
            listLoading2:false,
            offset2:0,
            treeLoading:true,
            tagList:[],
            merchantList:[
                {
                    id:1,
                    name:'自营'
                },
                {
                    id:2,
                    name:'券仓'
                },
                {
                    id:3,
                    name:'网店管家'
                },
                {
                    id:4,
                    name:'聚合数据'
                },
            ],
            // sortType2:[
            //     {
            //         key:"商品销量",
            //         value:1
            //     },
            //     {
            //         key:"更新时间",
            //         value:2
            //     },
            // ],
        }
    },
    created () {
        this.findStandardUnitCombinationById();
        this.tagId = this.$route.params.id;
        this.queryMpByTagId();
    },
    components: {
        seeGoods
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,24)

                 if(str == "/editStandardCombination"){
                    Object.assign(this.$data, this.$options.data())
                    this.findStandardUnitCombinationById();

                }

            },
        }
    },
    methods:{
        getProductData() {
            this.productRuleForm={
                sortType:'',
                merchantId:'',
                merchantProductSerialNumber: "",
                name: "",
                tagIds:"",
                beginSalePrice: "",
                endSalePrice: "",
                beginPromotionPrice: "",
                endPromotionPrice: "",
                saleWay: "",
                status: "",
                isVisible:"",
                platformId: "",
                pageNo:1,
                pageSize:10,
            },
            this.querySuByCategoryTreeNodeIds();
        },
        //排序
        orderByType(id){
           this.productRuleForm.sortType = id;
           this.querySuByCategoryTreeNodeIds();
        },
        //商品详情展示列表
        async querySuByCategoryTreeNodeIds () {
            try {
                // if(this.tagList && this.tagList.length > 0) {
                //     // this.productRuleForm.categoryTreeNodeIds=this.tagList;
                //     this.productRuleForm.tagIds=JSON.stringify(this.tagList);
                // } else {
                //     let menus = JSON.stringify(this.$refs.tree1.getCheckedKeys(true));
                //     this.productRuleForm.tagIds=menus;
                // }
                const obj = new Object();
                $.each(this.productRuleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                });
                console.log(obj);
                const res = await queryMpByTagId(obj);
                this.listLoading2 = false;
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.productData = res.data.data.list;
                    this.productFormVisible = true;
                    // this.tagList = [];
                    console.log(res.data);
                    console.log(this.productData);
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: "错误404！"
                    // message: '获取商品列表失败,请联系管理员！404'
                });

            }
        },
        async queryMpByTagId () {
            try {
                if(this.tagList && this.tagList.length > 0) {
                    // this.productRuleForm.categoryTreeNodeIds=this.tagList;
                    this.productRuleForm.tagIds=JSON.stringify(this.tagList);
                } else {
                    this.productRuleForm.tagIds=JSON.stringify([0]);
                }
                const res = await queryMpByTagId(this.productRuleForm);
                this.listLoading2 = false;
                if (res.data.code == 0) {
                    console.log(res.data);
                    this.count = res.data.data.totalSize;
                    this.productData = res.data.data.list;
                    this.productFormVisible = true;
                    //this.tagList = [];
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: err
                    // message: '获取商品列表失败,请联系管理员！404'
                });

            }
        },
        //分页
        handleSizeChange2(val) {
            this.productRuleForm.pageSize = val;
            //this.querySuByCategoryTreeNodeIds()
            this.queryMpByTagId();
        },
        handleCurrentChange2(val) {
            this.productRuleForm.pageNo = val;
            this.offset2 = (val - 1) * this.productRuleForm.pageSize;
            //this.querySuByCategoryTreeNodeIds()
            this.queryMpByTagId();
        },

        //查询属性详情
        async findStandardUnitCombinationById () {
             try {
                const res = await findStandardUnitCombinationById({standardUnitCombinationId:this.$route.params.id});

                if (res.data.code == 0) {
                    this.form = res.data.data;
                    this.ruleForm.standardUnitCombinationId = this.$route.params.id;
                    if(this.form.type == 1){
                        this.findByStandardUnitCombinationIdOfPage();
                    }else if(this.form.type == 2){
                        this.findCategoryTreeAll();
                        this.treeForm = {
                            standardUnitCombinationId:this.$route.params.id,
                            categoryTreeId:res.data.data.categoryTreeId,
                            sortType:res.data.data.sortType,
                            categoryTreeNodeIdList:res.data.data.categoryTreeNodeIdList
                        };

                        if(res.data.data.categoryTreeId!=null){
                            this.findByCategoryTreeIdNode(res.data.data.categoryTreeId)
                        }


                    }else if(this.form.type == 3){
                        this.tagList = res.data.data.tagidList;
                        this.queryMpByTagId();
                        this.dataForm.tagList = res.data.data.tagidList;
                        this.dataForm.sortType = res.data.data.sortType;
                        this.labelForm = {
                            pageNo:1,
                            pageSize:1000,
                            typeList:[1,2,3]
                        };
                        // this.labelForm.typeList = JSON.stringify(this.labelList.typeList);
                        const tags = await findTagOfPage(this.labelForm);
                        this.checkLabel = [];
                        if (tags.data.code == 0) {
                            console.log(this.dataForm.tagList);
                            console.log(tags.data);
                            for(var i=0;i<this.dataForm.tagList.length;i++){
                                for(var j=0;j<tags.data.data.list.length;j++){
                                    if(this.dataForm.tagList[i] == tags.data.data.list[j].id){
                                        this.checkLabel.push({
                                            id:tags.data.data.list[j].id,// tagidList=[29,28,27]
                                            name:tags.data.data.list[j].name// list[0]={id:29,name:"abc"}
                                        });
                                    }
                                }
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.error
                            });
                        }
                    } else if(this.form.type == 4){
                        this.queryAllCategoryTreeNodeByType();
                        this.treeForm = {
                            standardUnitCombinationId:this.$route.params.id,
                            categoryTreeId:res.data.data.categoryTreeId,
                            sortType:res.data.data.sortType,
                            categoryTreeNodeIdList:res.data.data.categoryTreeNodeIdList
                        };

                        if(res.data.data.categoryTreeId!=null){
                            this.findByCategoryTreeIdNode(res.data.data.categoryTreeId)
                        }


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
                    message: '初始化数据失败,请联系管理员！404'
                });

            }
        },
        //查询所有前台类目树
        async findCategoryTreeAll () {
            try {
                const res = await findCategoryTreeAll();

                if (res.data.code == 0) {
                    this.categoryTreeList = res.data.data;
                    this.treeLoading=false;
                    this.$refs.tree1.setCheckedKeys(this.treeForm.categoryTreeNodeIdList);
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
        //查询所有后台类目树
        async queryAllCategoryTreeNodeByType () {
            try {
                const res = await queryAllCategoryTreeNodeByType({type:1});

                if (res.data.code == 0) {
                    this.data1 = res.data.data[0].list;
                    this.treeLoading=false;
                    if(this.treeForm.categoryTreeNodeIdList) {
                        this.$refs.tree1.setCheckedKeys(this.treeForm.categoryTreeNodeIdList);
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
        async findByCategoryTreeIdNode(id){
            try {
                const res = await findByCategoryTreeIdNode({categoryTreeId:id});

                if (res.data.code == 0) {
                    this.data1 = res.data.data;
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

        //保存类目节点关联

        async saveStandardUnitCombinationCategoryAll(){

            try {
                let menus = JSON.stringify(this.$refs.tree1.getCheckedKeys(true));
                this.treeForm.categoryTreeNodeIdList = menus;
                if(this.form.type == 4) {
                    this.treeForm.categoryTreeId = 1;
                    this.treeForm.type = 4;
                }
                if(this.form.type == 2) {
                    this.treeForm.type = 2;
                }
                const res = await saveStandardUnitCombinationCategoryAll(this.treeForm);
                if (res.data.code == 0) {
                    this.productFormVisible=false;
                    this.$message({
                        type: 'success',
                        message: '保存成功'
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
        //保存标签关联

        async saveStandardUnitCombinationTag(){

            try {
                let obj = new Object();
                obj.standardUnitCombinationId = this.$route.params.id;
                obj.sortType = this.dataForm.sortType;
                obj.tagIds = JSON.stringify(this.dataForm.tagList);
                const res = await saveStandardUnitCombinationTag(obj);
                if (res.data.code == 0) {
                    this.productFormVisible=false;
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    //this.active = 2;
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
        //根据ID查询关联商品列表
        async findByStandardUnitCombinationIdOfPage () {
            try {

                const res = await findByStandardUnitCombinationIdOfPage(this.ruleForm);
                this.listLoading = false;
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.goodsList = res.data.data.list;
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
            this.findByStandardUnitCombinationIdOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findByStandardUnitCombinationIdOfPage()
        },

        //新增标签
        addLabel(){
            this.dialogFormVisible4 = true;
            this.labelForm = {
                pageNo:1,
                pageSize:10,
                typeList:[1,2,3]
                // name:'',
                // type:1,
                // isValid:1
            };
            this.findTagOfPage();
        },
        //查询所有标签
        async findTagOfPage () {
            try {
                const obj = new Object();
                this.listLoading = false;
                $.each(this.labelForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                // obj.tagList = this.dataForm.tagList;
                // obj.tagList = JSON.stringify(this.dataForm.tagList);
                const res = await findTagOfPage(obj);
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.labelList = res.data.data.list;
                    // console.log('获取');
                    // console.log(res.data.data.list);
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
                    // message: '获取数据失败,请联系管理员！404'
                    message: '获取tag失败,请联系管理员！404'
                });

            }
        },
        //选择标签确定
        async saveLabel(){
            try {

                if(this.dataForm.tagList.length == 0){
                    this.$message({
                        type: 'error',
                        message: '请选择商品标签'
                    });
                    return;
                }
                const obj = new Object();
                // obj.tagList = JSON.stringify(this.dataForm.tagList);
                // obj.tagList = this.dataForm.tagList;
                // console.log(obj.tagList);
                obj.typeList=[1,2,3];
                obj.pageSize = this.dataForm.tagList.length+10;
                obj.pageNo = 1;
                const res = await findTagOfPage(obj);
                if (res.data.code == 0) {
                    this.checkLabel=[];
                    console.log(this.dataForm.tagList);
                    for(var i=0;i<this.dataForm.tagList.length;i++){
                        for(var j=0;j<res.data.data.list.length;j++){
                            if(this.dataForm.tagList[i] == res.data.data.list[j].id){
                                this.checkLabel.push({
                                    id:res.data.data.list[j].id,// tagidList=[29,28,27]
                                    name:res.data.data.list[j].name// list[0]={id:29,name:"abc"}
                                });
                            }

                        }
                    }
                    console.log(this.checkLabel);
                    this.dialogFormVisible4 = false;
                    this.tagList = this.dataForm.tagList;
                    this.queryMpByTagId();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '获取数据失败,请联系管理员！404'
                    message: '保存tag失败,请联系管理员！404'
                });

            }
        },
        //删除已选标签
        tagClose(index){
            this.dataForm.tagList.splice(index,1);
            console.log(this.dataForm.tagList)
            this.checkLabel.splice(index,1);
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        },
        //分页
        handleSizeChange1(val) {
            this.labelForm.pageSize = val;
            this.findTagOfPage();
            //this.queryMpByTagId();
        },
        handleCurrentChange1(val) {
            this.labelForm.pageNo = val;
            this.offset = (val - 1) * this.labelForm.pageSize;
            this.findTagOfPage();
            //this.queryMpByTagId();
        },

        //设置商品排序
        async goodsSort(event,id){

            try {
                const res = await sortValueByStandardUnitCombinationId({standardUnitCombinationSuId:id,sortValue:event});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '排序成功'
                    });
                    this.findByStandardUnitCombinationIdOfPage();
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
        handleFilter() {
            this.productRuleForm.pageSize = 10;
            this.productRuleForm.pageNo = 1;
            if (parseInt(this.productRuleForm.endSalePrice)<parseInt(this.productRuleForm.beginSalePrice)) {
                alert("最高销售价格不得低于最低销售价格");
                this.productRuleForm.endSalePrice = '';
                return;
            }
            if (parseInt(this.productRuleForm.endPromotionPrice)<parseInt(this.productRuleForm.beginPromotionPrice)) {
                alert("最高促销售价格不得低于最低促销价格");
                this.productRuleForm.endPromotionPrice = '';
                return;
            }
            if (this.productRuleForm.beginSalePrice) {this.productRuleForm.beginSalePrice = parseInt(this.productRuleForm.beginSalePrice);}
            if (this.productRuleForm.endSalePrice) {this.productRuleForm.endSalePrice = parseInt(this.productRuleForm.endSalePrice);}
            if (this.productRuleForm.beginPromotionPrice) {this.productRuleForm.beginPromotionPrice = parseInt(this.productRuleForm.beginPromotionPrice);}
            if (this.productRuleForm.endPromotionPrice) {this.productRuleForm.endPromotionPrice = parseInt(this.productRuleForm.endPromotionPrice);}

            this.querySuByCategoryTreeNodeIds();

        },
        //重置
        resetForm(){
            this.goodsForm = {
                standardUnitCombinationId:this.$route.params.id,
                standardUnitName:'',
                status:'',
                saleWay:'',
                pageNo:1,
                pageSize:10,

            };
            this.dialogFormVisible = true;
            this.findBaseByConditionOfPage();
        },
        resetProductForm(){
            this.productRuleForm = {
                merchantId:'',
                merchantProductSerialNumber: "",
                name: "",
                beginSalePrice: "",
                endSalePrice: "",
                beginPromotionPrice: "",
                endPromotionPrice: "",
                saleWay: "",
                status: "",
                platformId: "",
                pageNo:1,
                pageSize:10,
            }
            this.productFormVisible=false;
            this.queryMpByTagId();
        },

        //分页
        handleSizeChange4(val) {
            this.goodsForm.pageSize = val;
            this.findBaseByConditionOfPage()
        },
        handleCurrentChange4(val) {
            this.goodsForm.pageNo = val;
            this.offset = (val - 1) * this.goodsForm.pageSize;
            this.findBaseByConditionOfPage()
        },
        //关联商品
        async saveStandardUnitCombinationSuAll () {
            try {
                const obj = new Object();
                obj.standardUnitCombinationId = this.goodsForm.standardUnitCombinationId;
                obj.standardUnitList = JSON.stringify(this.checkList);
                const res = await saveStandardUnitCombinationSuAll(obj);
                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增商品成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findByStandardUnitCombinationIdOfPage();
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

        //查看商品详情
        seeGoods(id){
            console.log(1)
            this.goodsId = id;
            this.dialogFormVisible1 = true;
        },
        //删除商品之间的关联
        async deleteStandardUnitCombinationSuWithTx (id) {
            try {
                const res = await deleteStandardUnitCombinationSuWithTx({standardUnitCombinationSuId:id});
                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '删除关联成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findByStandardUnitCombinationIdOfPage();
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
            const t = new Date(time);
            return t.getTime()
        },
        back(){
            this.$router.go(-1);
            // this.$router.push({path:"/standardCombination/"});
        },

        showtag(){
            console.log(this.dataForm.tagList);
        },

        //新增商品
        addGoods(){
            this.goodsForm = {
                standardUnitCombinationId:this.$route.params.id,
                standardUnitName:'',
                status:'',
                saleWay:'',
                pageNo:1,
                pageSize:10,

            };
            this.checkList = [];
            this.findBaseByConditionOfPage();
            this.dialogFormVisible = true;
        },

        async findBaseByConditionOfPage () {
            try {
                const obj = new Object();
                $.each(this.goodsForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await findBaseByConditionOfPage(obj);
                this.listLoading1 = false;
                if (res.data.code == 0) {
                    this.count1 = res.data.data.totalSize;
                    this.goodsListBase = res.data.data.list;
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
    padding: 5px 20px;

}
#example2 {
    padding: 5px 20px;

}
</style>


