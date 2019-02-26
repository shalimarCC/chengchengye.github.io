<template>
    <div id="example">
        <template v-if="active==1">
            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="限购规则名称">
                    <el-input class="filter-item" placeholder="请输入限购规则名称" v-model="form.name" disabled></el-input>
                </el-form-item>

                <el-form-item label="限购商品">
                    <el-button class="filter-item" type="primary" @click="seeGoods" :disabled="form.limitTarget==2">{{form.standardUnitName}}</el-button>
                </el-form-item>

                <!--<el-form-item label="根据企业选择限购用户">-->
                    <!--<el-select v-model="form.companyIds" collapse-tags multiple :disabled="allStatus.length>0">-->
                        <!--<p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>-->
                        <!--<el-option-->
                            <!--v-for="item in companyList"-->
                            <!--:key="item.id"-->
                            <!--:label="item.companyName"-->
                            <!--:value="item.id">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                    <!--<el-checkbox-group v-model="allStatus">-->
                        <!--<el-checkbox :label="-1">全部正式公司可见</el-checkbox>-->
                        <!--<el-checkbox :label="-2">全部竞品公司可见</el-checkbox>-->
                        <!--<el-checkbox :label="-3">全部演示公司可见</el-checkbox>-->
                    <!--</el-checkbox-group>-->
                <!--</el-form-item>-->

                <!--<el-form-item label="商品限售数量">-->
                    <!--<el-input-number v-model="form.suLimitNum" :disabled="form.isLimit==0" :min="1"></el-input-number>-->
                    <!--<el-checkbox v-model="form.isLimit" :true-label="0" :false-label="1" disabled>不限量</el-checkbox>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="选择限购商品">-->
                    <!--<el-select v-model="form.limitTarget" placeholder="请选择商品类型" style="width: 200px;margin-right:15px;">-->
                        <!--<el-option label="单个商品" :value="1">-->
                        <!--</el-option>-->
                        <!--<el-option label="商品组" :value="2">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->

                <!--<el-form-item label="单个商品" v-if="form.limitTarget === 1">-->
                    <!--<el-tag-->
                        <!--:disable-transitions="false">-->
                        <!--已选择{{checkList.length}}个商品-->
                    <!--</el-tag>-->

                    <!--<el-button class="filter-item" type="primary" @click="addGoods">选择SU</el-button>-->
                <!--</el-form-item>-->

                <!--<el-form-item label="商品组"  v-if="form.limitTarget == 2">-->
                    <!--<el-tag-->
                        <!--closable-->
                        <!--:disable-transitions="false"-->
                        <!--@close="resetStandardUnit"-->
                        <!--v-if="checkStandardUnit.name != ''">-->
                        <!--{{checkStandardUnit.name}}-->
                    <!--</el-tag>-->
                    <!--<el-button class="filter-item" type="primary" @click="addStandardUnit">选择分组</el-button>-->
                <!--</el-form-item>-->

                <el-form-item label="限购总量">
                    <el-checkbox-group v-model="form.isLimit">
                        <el-checkbox :true-label="2" :false-label="-1"  :disabled="form.isLimit==0">限售总数量</el-checkbox>
                        <el-input class="numInput" v-if="form.isLimit==2" placeholder="请输入限购总数量" v-model="form.suLimitNum" :disabled="form.isLimit==0"></el-input>
                        <el-checkbox :true-label="0" :false-label="-1" >不限量</el-checkbox>
                        <el-checkbox :true-label="3" :false-label="-1" :disabled="form.isLimit==1">限售总金额</el-checkbox>
                        <el-input class="numInput" v-if="form.isLimit==3" placeholder="请输入限购总金额" v-model="form.suLimitAmount" :disabled="form.isLimit==0"></el-input>
                        <el-checkbox :true-label="1" :false-label="-1" >不限量</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="企业类型">
                    <el-radio-group v-model="form.companyType" disabled>
                        <el-radio :label="0" @change="getcompanyList(0)">全部正式公司可见</el-radio>
                        <el-radio :label="1" @change="getcompanyList(1)">全部竞品公司可见</el-radio>
                        <el-radio :label="2" @change="getcompanyList(2)">全部演示公司可见</el-radio>
                    </el-radio-group>
                    <p>注:指限购用户、限购企业的所属企业类型</p>
                </el-form-item>

                <el-form-item label="选择限购对象(多选)">
                    <!--<el-select v-model="form.limitUnit" multiple placeholder="请选择" :disabled="form.limitUnit.indexOf(0)>-1">-->
                    <el-select v-model="form.limitUnit" multiple placeholder="请选择" disabled>
                        <el-option
                            v-for="item in limitObjlist"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-checkbox  @change="nolimitObj" disabled> 无限购对象</el-checkbox>
                </el-form-item>
                <el-form-item label="按用户限购" v-if="form.limitUnit.indexOf(1)>-1">
                    <!--<el-select v-model="form.userCompanyIds" multiple placeholder="请选择" :disabled="form.userCompanyIds.indexOf(-1)>-1">-->
                    <el-select v-model="form.userCompanyIds" multiple placeholder="请选择" disabled>
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <!--<el-checkbox :true-label="1" :false-label="0" v-model="item.allUser" @change="userCompanyIds">全部正式公司</el-checkbox>-->
                    <el-checkbox :true-label="1" :false-label="0" v-model="item.allUser" @change="userCompanyIds" disabled>全部正式公司</el-checkbox>
                    <p class="limitType">
                        <el-checkbox-group  v-model="form.isUserLimit" disabled>
                            <el-checkbox :true-label="2" :false-label="1" disabled>单个用户限购数量</el-checkbox>
                            <el-input type="number" v-if="form.isUserLimit==2" class="numInput" placeholder="请输入限购总数量" v-model="form.userLimitNum" disabled></el-input>
                            <el-checkbox :true-label="3" :false-label="1" disabled>单个用户限购金额</el-checkbox>
                            <el-input type="number" v-if="form.isUserLimit==3" class="numInput" placeholder="请输入限购总金额" v-model="form.userMoneySum" disabled></el-input>
                            <el-checkbox :true-label="0" :false-label="1" disabled>不限量</el-checkbox>
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
                    <el-checkbox :true-label="1" :false-label="0" v-model="item.allCompany" @change="companyIds" disabled>全部正式公司</el-checkbox>
                    <p class="limitType">
                        <el-checkbox-group v-model="form.isCompanyLimit">
                            <el-checkbox :true-label="2" :false-label="1" disabled>单个企业限购数量</el-checkbox>
                            <el-input type="number" v-if="form.isCompanyLimit==2" class="numInput" placeholder="请输入限购总数量" v-model="form.companyLimitNum" disabled></el-input>
                            <el-checkbox :true-label="3" :false-label="1" disabled>单个企业限购金额</el-checkbox>
                            <el-input type="number" v-if="form.isCompanyLimit==3" class="numInput" placeholder="请输入限购总金额" v-model="form.companyMoneySum" disabled></el-input>
                            <el-checkbox :true-label="0" :false-label="1" v-model="form.isCompanyLimit" disabled>不限量</el-checkbox>
                        </el-checkbox-group>
                    </p>
                </el-form-item>
                <el-form-item label="按门店限购" v-if="form.limitUnit.indexOf(3)>-1">
                    <el-select v-model="form.storeIds" multiple placeholder="请选择" :disabled="form.storeIds.indexOf(-1)>-1">
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-checkbox :true-label="1" :false-label="0" v-model="item.allStore" @change="storeIds" disabled>全部正式公司</el-checkbox>
                    <p class="limitType">
                        <el-checkbox-group v-model="form.isStoreLimit">
                            <el-checkbox :true-label="2" :false-label="1" disabled>单个门店限购数量</el-checkbox>
                            <el-input type="number" v-if="form.isStoreLimit==2" class="numInput" placeholder="请输入限购总数量" v-model="form.storeLimitNum" disabled></el-input>
                            <el-checkbox :true-label="3" :false-label="1" disabled>单个门店限购金额</el-checkbox>
                            <el-input type="number" v-if="form.isStoreLimit==3" class="numInput" placeholder="请输入限购总金额" v-model="form.storeMoneySum" disabled></el-input>
                            <el-checkbox :true-label="0" :false-label="1"  v-model="form.isStoreLimit" disabled>不限量</el-checkbox>
                        </el-checkbox-group>
                    </p>
                </el-form-item>
                <el-form-item label="限购时间">
                    <el-select v-model="form.limitTimeType" placeholder="请选择限购时间类型" style="width: 200px;margin-right:15px;" disabled>
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
                        <el-radio-group v-model="form.periodType" disabled>
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

            <el-dialog title="商品详情" :visible.sync="dialogFormVisible" size="tiny">
                <see-goods :goods-id="form.standardUnitCombinationId" v-if="dialogFormVisible" ref="seegoods"></see-goods>
            </el-dialog>
        </template>
        <template v-else-if="active==2">
            <img src="../../../assets/success.jpg" />
        </template>

  </div>

</template>

<script>
import seeGoods from '../goods/seeGoods.vue'
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {
    findMerchantProductOfPage,
    findStandardUnitCombinationOfPage,
    indCompanyIdOrName,
    queryStandardUnitListByBlurry,
    getQiNiuToken,
    updateLimitRuleByIdWithTx,
    findLimitRuleById,
    findCompanyIdOrName
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
            item:{
              allUser:0,
              allCompany:0,
              allStore:0
            },
            active:1,
            dialogFormVisible:false,
            goodsForm:{
                standardUnitName:'',
                status:'',
                saleWay:'',
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
            companyList2:[],
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
            ]
        }
    },
    created () {
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        this.findCompanyIdOrName();
        this.findLimitRuleById();
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

    components: {
        seeGoods
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,14)

                if(str == "/editLimitRule"){
                    Object.assign(this.$data, this.$options.data());
                    this.findLimitRuleById();
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
            // this.form.companyIds =[-1];
            // this.companyList2.push({id:-1,companyName:'全部正式公司'})
            // console.log(this.companyList2.push({id:-1,companyName:'全部正式公司'}))
        },
        storeIds(){
            this.form.storeIds = this.form.storeIds.indexOf(-1)>-1?[]:[-1];
        },
        nolimitObj(){
            this.form.limitUnit = this.form.limitUnit.indexOf(0)>-1?[]:[0];
        },
        //根据ID查询信息
        async findLimitRuleById () {
            try {
                const res = await findLimitRuleById({limitRuleId:this.$route.params.id});
                if (res.data.code == 0) {
                    let obj = res.data.data;
                    console.log(res.data.data);
                    this.form = {
                        name:obj.name,
                        id:obj.id,
                        isLimit:obj.isLimit,
                        limitTarget:obj.limitTarget,
                        suLimitNum:obj.suLimitNum,
                        suLimitAmount:obj.suLimitAmount,
                        companyType:obj.companyType,
                        limitTimeType:obj.limitTimeType,
                        limitOriginTime_:obj.limitOriginTime,
                        limitStopTime_:obj.limitStopTime,
                        periodType:obj.periodType,
                        limitType:obj.limitType,
                        limitUnit:JSON.parse(obj.limitUnit),
                        userLimitNum:obj.userLimitNum,
                        userMoneySum:obj.userMoneySum,
                        storeLimitNum:obj.storeLimitNum,
                        storeMoneySum:obj.storeMoneySum,
                        companyLimitNum:obj.companyLimitNum,
                        companyMoneySum:obj.companyMoneySum,
                        standardUnitCombinationId:obj.standardUnitId||obj.suCombId,
                        standardUnitName:obj.standardUnitName,
                        companyIds:obj.companyIds,
                        userCompanyIds:obj.userCompanyIds,
                        storeIds:obj.storeIds
                    };
                    // if(obj.isLimit==0){
                    //     this.form.isLimit= obj.isLimit
                    // }else{
                    //     if(obj.suLimitNum){
                    //         this.form.isLimit=2
                    //     }
                    //     if(obj.suLimitAmount){
                    //         this.form.isLimit=3
                    //     }
                    // }
                    if(obj.isUserLimit==0){
                        this.form.isUserLimit = obj.isUserLimit
                    }else{
                        if(obj.userLimitNum){
                            this.form.isUserLimit=2
                        }else if(obj.userMoneySum){
                            this.form.isUserLimit=3
                        }
                    }
                    if(obj.isCompanyLimit==0){
                        this.form.isCompanyLimit = obj.isCompanyLimit
                    }else{
                        if(obj.companyLimitNum){
                            this.form.isCompanyLimit=2
                        }else if(obj.companyMoneySum){
                            this.form.isCompanyLimit=3
                        }
                    }
                    if(obj.isStoreLimit==0){
                        this.form.isStoreLimit = obj.isStoreLimit
                    }else{
                        if(obj.storeLimitNum){
                            this.form.isStoreLimit=2
                        }else if(obj.storeMoneySum){
                            this.form.isStoreLimit=3
                        }
                    }
                    if(obj.userCompanyIds.indexOf(-1)>-1){
                        this.item.allUser =1;
                    }
                    if(obj.companyIds.indexOf(-1)>-1){
                        this.item.allCompany =1;
                    }
                    if(obj.storeIds.indexOf(-1)>-1){
                        this.item.allStore =1;
                    }

                    if(obj.companyIds[0] < 0){
                        this.allStatus = obj.companyIds;
                        this.form.companyIds = [];
                    }else{
                        this.form.companyIds = obj.companyIds;
                    }
                    this.startEndTime = [obj.limitOriginTime,obj.limitStopTime];
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
        //新增商品
        seeGoods(){
            console.log(this.form.standardUnitCombinationId)
            this.dialogFormVisible = true;
        },
        searchForm(){
            this.goodsForm.pageNo = 1;
            this.queryStandardUnitListByBlurry();
        },
        searchForm2(){
            this.ruleForm.pageNo = 1;
            this.findStandardUnitCombinationOfPage();
        },
        getcompanyList(type){
            this.findCompanyIdOrName(type)
        },
        //获取公司列表
        async findCompanyIdOrName (type) {
            try {
                const res = await findCompanyIdOrName({companyType: type});
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
            });
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
            this.queryStandardUnitListByBlurry()
        },
        //重置
        resetForm(){
            this.goodsForm = {
                standardUnitName:'',
                status:'',
                saleWay:'',
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
        //重置
        resetForm(){
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
            this.form.standardUnitCombinationId = obj.standardUnitCombinationId;
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

            obj.standardUnitIds	= JSON.stringify(this.checkList);
            obj.limitUnit = JSON.stringify(this.form.limitUnit);
            obj.userCompanyIds = JSON.stringify(this.form.userCompanyIds);
            obj.storeIds = JSON.stringify(this.form.storeIds);
            obj.companyIds = JSON.stringify(this.form.companyIds);
            console.log(obj)
            this.updateLimitRuleByIdWithTx(obj);
        },
        async updateLimitRuleByIdWithTx(obj){
            try {

                const res = await updateLimitRuleByIdWithTx(obj);
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


