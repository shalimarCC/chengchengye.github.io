<template>
    <div id="example">
        <template v-if="active==1">
            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="限购规则名称">
                    <!--最多输入30字-->
                    <el-input class="filter-item" maxlength="30" placeholder="请输入限购规则名称" v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="选择限购商品">
                    <el-select v-model="form.limitTarget" placeholder="请选择商品类型" style="width: 200px;margin-right:15px;">
                        <el-option label="单个商品" :value="1">
                        </el-option>
                        <el-option label="商品组" :value="2">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="单个商品" v-if="form.limitTarget === 1">
                    <el-tag
                    :disable-transitions="false">
                    已选择{{checkList.length}}个商品
                    </el-tag>

                    <el-button class="filter-item" type="primary" @click="addGoods">选择SU</el-button>
                </el-form-item>

                <el-form-item label="商品组"  v-if="form.limitTarget == 2">
                    <el-tag
                    closable
                    :disable-transitions="false"
                    @close="resetStandardUnit"
                    v-if="checkStandardUnit.name != ''">
                    {{checkStandardUnit.name}}
                    </el-tag>
                    <el-button class="filter-item" type="primary" @click="addStandardUnit">选择分组</el-button>
                </el-form-item>

                <el-form-item label="限购总量">
                    <el-checkbox-group v-model="form.isLimit">
                        <el-checkbox :true-label="2" :false-label="-1"  :disabled="form.isLimit==0" @change="isLimit(2)">限售总数量</el-checkbox>
                        <el-input class="numInput" v-if="form.isLimit==2" placeholder="请输入限购总数量" v-model="form.suLimitNum" :disabled="form.isLimit==0"></el-input>
                        <el-checkbox :true-label="0" :false-label="-1" @change="isLimit(2)">不限量</el-checkbox>
                        <el-checkbox :true-label="3" :false-label="-1" :disabled="form.isLimit==1" @change="isLimit(3)">限售总金额</el-checkbox>
                        <el-input class="numInput" v-if="form.isLimit==3" placeholder="请输入限购总金额" v-model="form.suLimitAmount" :disabled="form.isLimit==0"></el-input>
                        <el-checkbox :true-label="1" :false-label="-1" @change="isLimit(3)">不限量</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="企业类型">
                    <el-radio-group v-model="form.companyType">
                        <el-radio :label="0" @change="getcompanyList(0)">全部正式公司可见</el-radio>
                        <el-radio :label="1" @change="getcompanyList(1)">全部竞品公司可见</el-radio>
                        <el-radio :label="2" @change="getcompanyList(2)">全部演示公司可见</el-radio>
                    </el-radio-group>
                    <p>注:指限购用户、限购企业的所属企业类型</p>
                </el-form-item>

                <el-form-item label="选择限购对象(多选)">
                    <el-select v-model="form.limitUnit" multiple placeholder="请选择" :disabled="form.limitUnit.indexOf(0)>-1">
                        <el-option
                            v-for="item in limitObjlist"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-checkbox  @change="nolimitObj">无限购对象</el-checkbox>
                </el-form-item>
                <el-form-item label="按用户限购" v-if="form.limitUnit.indexOf(1)>-1">
                    <el-select v-model="form.userCompanyIds" multiple placeholder="请选择" :disabled="form.userCompanyIds.indexOf(-1)>-1">
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-checkbox @change="userCompanyIds">全部正式公司</el-checkbox>
                    <p class="limitType">
                        <el-checkbox-group  v-model="form.isUserLimit">
                            <el-checkbox v-if="form.isLimit==2||form.isLimit==0" :true-label="2" :false-label="-1" :disabled="form.isUserLimit==0">单个用户限购数量</el-checkbox>
                            <el-input type="number" v-if="form.isUserLimit==2" class="numInput" placeholder="请输入限购总数量" v-model="form.userLimitNum" :disabled="form.isUserLimit==0"></el-input>
                            <el-checkbox v-if="form.isLimit==3||form.isLimit==1" :true-label="3" :false-label="-1" :disabled="form.isUserLimit==0">单个用户限购金额</el-checkbox>
                            <el-input type="number" v-if="form.isUserLimit==3" class="numInput" placeholder="请输入限购总金额" v-model="form.userMoneySum" :disabled="form.isUserLimit==0"></el-input>
                            <el-checkbox :true-label="0" :false-label="-1" >不限量</el-checkbox>
                        </el-checkbox-group>
                    </p>
                </el-form-item>
                <el-form-item label="按企业限购" v-if="form.limitUnit.indexOf(2)>-1">
                    <el-select v-model="form.companyIds" multiple placeholder="请选择" :disabled="form.companyIds.indexOf(-1)>-1">
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-checkbox @change="companyIds">全部正式公司</el-checkbox>
                    <p class="limitType">
                        <el-checkbox-group v-model="form.isCompanyLimit">
                            <el-checkbox v-if="form.isLimit==2||form.isLimit==0" :true-label="2" :false-label="-1" :disabled="form.isCompanyLimit==0">单个企业限购数量</el-checkbox>
                            <el-input type="number" v-if="form.isCompanyLimit==2" class="numInput" placeholder="请输入限购总数量" v-model="form.companyLimitNum" :disabled="form.isCompanyLimit==0"></el-input>
                            <el-checkbox v-if="form.isLimit==3||form.isLimit==1" :true-label="3" :false-label="-1" :disabled="form.isCompanyLimit==0">单个企业限购金额</el-checkbox>
                            <el-input type="number" v-if="form.isCompanyLimit==3" class="numInput" placeholder="请输入限购总金额" v-model="form.companyMoneySum" :disabled="form.isCompanyLimit==0"></el-input>
                            <el-checkbox :true-label="0" :false-label="-1" v-model="form.isCompanyLimit">不限量</el-checkbox>
                        </el-checkbox-group>
                    </p>
                </el-form-item>
                <el-form-item label="按门店限购" v-if="form.limitUnit.indexOf(3)>-1">
                    <el-select v-model="form.storeIds" multiple placeholder="请选择" :disabled="form.storeIds.indexOf(-1)>-1">
                        <el-option
                            v-for="item in storeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-checkbox @change="storeIds">全部正式公司</el-checkbox>
                    <p class="limitType">
                        <el-checkbox-group v-model="form.isStoreLimit">
                            <el-checkbox v-if="form.isLimit==2||form.isLimit==0" :true-label="2" :false-label="-1" :disabled="form.isStoreLimit==0">单个门店限购数量</el-checkbox>
                            <el-input type="number" v-if="form.isStoreLimit==2" class="numInput" placeholder="请输入限购总数量" v-model="form.storeLimitNum" :disabled="form.isStoreLimit==0"></el-input>
                            <el-checkbox v-if="form.isLimit==3||form.isLimit==1" :true-label="3" :false-label="-1" :disabled="form.isStoreLimit==0">单个门店限购金额</el-checkbox>
                            <el-input type="number" v-if="form.isStoreLimit==3" class="numInput" placeholder="请输入限购总金额" v-model="form.storeMoneySum" :disabled="form.isStoreLimit==0"></el-input>
                            <el-checkbox :true-label="0" :false-label="-1"  v-model="form.isStoreLimit">不限量</el-checkbox>
                        </el-checkbox-group>
                    </p>
                </el-form-item>
                <el-form-item label="限购时间">
                    <el-select v-model="form.limitTimeType" placeholder="请选择限购时间类型" style="width: 200px;margin-right:15px;">
                        <el-option label="按时间段限购" :value="1">
                        </el-option>
                        <el-option label="按周期限购" :value="2">
                        </el-option>
                    </el-select>
                    <div style="margin-top:10px;" v-if="form.limitTimeType==1">
                        <el-date-picker
                        v-model="startEndTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>

                    <div v-else-if="form.limitTimeType==2">
                        <el-radio-group v-model="form.periodType">
                            <el-radio :label="1">按日限购</el-radio>
                            <el-radio :label="2">按月限购（自然月）</el-radio>
                            <el-radio :label="3">按年限购</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>

            </el-form>
            <div style="position: sticky;bottom: 0;text-align:center;width:100%;">
                <el-button size="medium" style="margin: 12px;" @click='saveLimitRule'>保存</el-button>
            </div>
            <el-dialog title="选择SU" :visible.sync="dialogFormVisible" size="tiny">
                <div style="margin-bottom:20px;">

                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="goodsForm.name">
                    </el-input>

                    <el-button class="filter-item" type="primary" icon="search" size="medium" @click="searchForm">搜索</el-button>
                    <el-button @click="resetForm" size="medium">重置</el-button>
                </div>
                <el-checkbox-group v-model="checkList" :max="1">
                    <el-table :key='tableKey1' :data="goodsListBase" v-loading.body="listLoading1" border fit highlight-current-row style="width: 100%">
                        <el-table-column
                        align="center"
                        width="30">
                            <template slot-scope="scope">
                                <el-checkbox :label="scope.row.id" :name="null"></el-checkbox>
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
                                <span v-else-if="scope.row.saleWay==3">预售</span>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-checkbox-group>

                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page.sync="goodsForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="goodsForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count1">
                    </el-pagination>
                </div>


            </el-dialog>

            <el-dialog title="选择商品组合" :visible.sync="dialogFormVisible2" size="tiny">
                <div style="margin-bottom:20px;">
                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="组合名称" v-model="ruleForm.combinationName">
                    </el-input>
                    <el-button class="filter-item" type="primary" icon="search" size="medium" @click="searchForm2">搜索</el-button>
                    <el-button @click="resetForm2('ruleForm')" size="medium">重置</el-button>
                </div>
                <el-table :key='tableKey2' :data="dataSource2" v-loading.body="listLoading2" border fit highlight-current-row style="width: 100%">

                    <el-table-column align="center" label="组合名称" min-width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.combinationName}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品数量" min-width="80">
                        <template slot-scope="scope">
                            <span>{{scope.row.standardUnitSize}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="分组类型" min-width="80">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type==1">选择商品</span>
                            <span v-else-if="scope.row.type==2">关联类目树</span>
                            <span v-else-if="scope.row.type==3">关联标签</span>
                        </template>
                    </el-table-column>


                    <el-table-column align="center" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="small" @click="selectStandardUnit(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="ruleForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="ruleForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count2">
                    </el-pagination>
                </div>
            </el-dialog>
        </template>
        <template v-else-if="active==2">
            <img src="../../../assets/success.jpg" />
        </template>

  </div>

</template>
<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {
    findMerchantProductOfPage,
    findStandardUnitCombinationOfPage,
    findCompanyIdOrName,
    queryStandardUnitListByBlurry,
    getQiNiuToken,
    insertLimitRuleWithTx,
    findStoreByPlatformId
} from '../../../api/getData';
export default {
    data() {
        return {
            form:{
                name:'',
                isLimit:-1,
                suLimitNum:'',
                limitTimeType:'',
                limitOriginTime_:'',
                limitStopTime_:'',
                limitUnit:[],
                periodType:'',
                userLimitNum:'',
                userMoneySum:'',
                standardUnitId:'',
                suCombId:'',
                companyIds:[],
                isUserLimit:1,
                isStoreLimit:1,
                isCompanyLimit:1,
                userCompanyIds:[],
                storeIds:[]
            },
            active:1,
            dialogFormVisible:false,
            goodsForm:{
                name:'',
                merchantProductSerialNumber:'',
                pageNo:1,
                pageSize:10,
            },
            count1:null,
            tableKey1: 0,
            listLoading1: true,
            offset1: 0,
            goodsListBase:[],
            dataSource2: [],
            offset2: 0,
            count2: null,
            tableKey2: 0,
            listLoading2: true,
            dialogFormVisible2:false,
            ruleForm:{
                combinationName:'',
                pageNo:1,
                pageSize:10
            },
            checkGoods:{
                name:'',
                id:''
            },
            checkStandardUnit:{
                name:'',
                id:''
            },
            companyList:[],
            allStatus:[],
            baseImgPath:'',
            baseImgUrl:'',
            imgForm:{
                key:'',
                token:'',
            },
            checkList:[],
            startEndTime:[],
            limitObjlist:[
                {name:'按用户限购',id:1},
                {name:'按企业限购',id:2},
                {name:'按门店限购',id:3}
            ],
            storeList:''
        }
    },
    created () {
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        this.findCompanyIdOrName();
        this.findStoreAllInfo();
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
                 str = str.substring(0,13)
                if(str == "/addLimitRule"){
                    Object.assign(this.$data, this.$options.data());
                    this.findCompanyIdOrName();
                }

            },
        }
    },
    methods:{
        userCompanyIds(){
            this.form.userCompanyIds = this.form.userCompanyIds.indexOf(-1)>-1?[]:[-1];
        },
        companyIds(){
            this.form.companyIds = this.form.companyIds.indexOf(-1)>-1?[]:[-1];
        },
        storeIds(){
            this.form.storeIds = this.form.storeIds.indexOf(-1)>-1?[]:[-1];
        },
        nolimitObj(){
            this.form.limitUnit = this.form.limitUnit.indexOf(0)>-1?[]:[0];
        },
        isLimit(type){
              this.form.isUserLimit=type;
              this.form.isCompanyLimit=type;
              this.form.isStoreLimit=type;
        },
        //新增商品
        addGoods(){
            this.goodsForm = {
                name:'',
                merchantProductSerialNumber:'',
                pageNo:1,
                pageSize:10,

            };
            this.queryStandardUnitListByBlurry();
            this.dialogFormVisible = true;
        },
        getcompanyList(type){
            if(this.$store.state.Cookie.mutations.fetch().platformId==2){
                 this.findStoreAllInfo()
            }else{
                this.findCompanyIdOrName(type)
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
        //获取公司列表
        async findCompanyIdOrName (type) {
            try {
                const res = await findCompanyIdOrName({companyType:type});
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

        //公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.form.companyIds = arr;
        },

         //分页
        handleSizeChange1(val) {
            this.goodsForm.pageSize = val;
            this.queryStandardUnitListByBlurry()
        },
        handleCurrentChange1(val) {
            this.ruleForm.pageNo = val;
            this.offset1 = (val - 1) * this.goodsForm.pageSize;
            this.queryStandardUnitListByBlurry();
        },
        searchForm(){
            this.goodsForm.pageNo = 1;
            this.queryStandardUnitListByBlurry();
        },
        //重置
        resetForm(){
            this.goodsForm = {
                name:'',
                merchantProductSerialNumber:'',
                pageNo:1,
                pageSize:10,

            };
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
        //选择商品确定
        selectGoods(obj){
            this.checkGoods.name = obj.name;
            this.checkGoods.id = obj.id;
            this.dialogFormVisible = false;
        },

        //选择商品分组
        addStandardUnit(){
            this.ruleForm = {
                combinationName:'',
                pageNo:1,
                pageSize:10
            };
            this.findStandardUnitCombinationOfPage();
            this.dialogFormVisible2 = true;
        },

         //分页
        handleSizeChange2(val) {
            this.ruleForm.pageSize = val;
            this.findStandardUnitCombinationOfPage()
        },
        handleCurrentChange2(val) {
            this.ruleForm.pageNo = val;
            this.offset2 = (val - 1) * this.ruleForm.pageSize;
            this.findStandardUnitCombinationOfPage()
        },
        searchForm2(){
            this.ruleForm.pageNo = 1;
            this.findStandardUnitCombinationOfPage();
        },
        //重置
        resetForm2(){
            this.ruleForm = {
                combinationName:'',
                pageNo:1,
                pageSize:10

            };
            this.findStandardUnitCombinationOfPage();
        },
        async findStandardUnitCombinationOfPage () {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await findStandardUnitCombinationOfPage(obj);
                this.listLoading2 = false;
                if (res.data.code == 0) {
                    this.count2 = res.data.data.totalSize;
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
        //选择商品分组确定
        selectStandardUnit(obj){
            this.checkStandardUnit.name = obj.combinationName;
            this.form.suCombId = obj.standardUnitCombinationId;
            this.dialogFormVisible2 = false;
        },
        //重置商品组合
        resetStandardUnit(){
            this.checkStandardUnit = {
                name:'',
                id:''
            }
        },

        //保存
        saveLimitRule(){
            if(this.form.isLimit==2){//限售数量
                this.form.suLimitAmount=''
            }else if(this.form.isLimit==3){
                this.form.suLimitNum =''
            }else{
                this.form.suLimitNum =''
                this.form.suLimitAmount=''
            }
            if(this.form.isUserLimit==2){//用户限购数量
                this.form.userMoneySum=''
            }else if(this.form.isUserLimit==3){
                this.form.userLimitNum =''
            }else{
                this.form.userLimitNum =''
                this.form.userMoneySum=''
            }
            if(this.form.isCompanyLimit==2){//企业限购数量
                this.form.companyMoneySum=''
            }else if(this.form.isCompanyLimit==3){
                this.form.companyLimitNum =''
            }else{
                this.form.companyLimitNum =''
                this.form.companyMoneySum=''
            }
            if(this.form.isStoreLimit==2){//门店限购数量
                this.form.storeMoneySum=''
            }else if(this.form.isStoreLimit==3){
                this.form.storeLimitNum =''
            }else{
                this.form.storeLimitNum =''
                this.form.storeMoneySum=''
            }
            const obj = new Object();
            $.each(this.form, function (key, info) {
                if (info !== "") {
                    obj[key] = info;
                }
            })
            if(this.startEndTime[0]!='' && this.startEndTime[0]!=undefined){
                obj.limitOriginTime_ =  this.setTimestamp(this.startEndTime[0]);
            }
            if(this.startEndTime[1]!='' && this.startEndTime[1]!=undefined){
                obj.limitStopTime_ =  this.setTimestamp(this.startEndTime[1]);
            }
            if(this.allStatus.length>0){
                obj.companyIds = JSON.stringify(this.allStatus);
            }else{
                obj.companyIds = JSON.stringify(this.form.companyIds);
            }
            // obj.standardUnitId	= JSON.stringify(this.checkList);
            obj.standardUnitId	= this.checkList[0];
            obj.limitUnit = JSON.stringify(this.form.limitUnit);
            obj.userCompanyIds = JSON.stringify(this.form.userCompanyIds);
            obj.storeIds = JSON.stringify(this.form.storeIds);
            obj.companyIds = JSON.stringify(this.form.companyIds);
            console.log(obj)
            this.insertLimitRuleWithTx(obj);
        },
        async insertLimitRuleWithTx(obj){
            try {

                const res = await insertLimitRuleWithTx(obj);
                if (res.data.code == 0) {
                    this.active = 2;
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
            this.form.iconUrl = this.baseImgUrl + response.key;
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
  .numInput{
      width: 200px;
      margin-left: 30px;
  }
    .limitType{
        margin-top: 20px;
    }
</style>


