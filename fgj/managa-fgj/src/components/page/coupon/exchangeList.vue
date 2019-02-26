<template>
    <div id="example">
        <!-- 搜索 -->
        <div class="search-col">
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="活动标题" v-model="ruleForm.exchangeName">
            </el-input>
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="旧unit编号" v-model="ruleForm.oldUnitCode">
            </el-input>
            <el-select v-model="ruleForm.oldUnitStatus" placeholder="旧unit状态" style="width: 200px;margin-right:15px;">
                <el-option label="未使用" value="0">
                </el-option>
                <el-option label="已使用" value="1">
                </el-option>
                <el-option label="已冻结" value="2">
                </el-option>
                <el-option label="已过期" value="3">
                </el-option>
                <el-option label="已失效" value="4">
                </el-option>
                <el-option label="已兑换" value="5">
                </el-option>
            </el-select>
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="旧批次编号" v-model="ruleForm.oldBatchCode">
            </el-input>
            <el-select v-model="ruleForm.oldCouponType" placeholder="旧批次优惠券类型" style="width: 200px;margin-right:15px;">
                <el-option label="满减券" value="0">
                </el-option>
                <el-option label="兑换券" value="1">
                </el-option>
            </el-select>
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="新unit编号" v-model="ruleForm.newUnitCode">
            </el-input>
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="订单编号" v-model="ruleForm.orderCode">
            </el-input>
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="旧批次名称" v-model="ruleForm.oldCouponBatchName">
            </el-input>
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="新批次名称" v-model="ruleForm.newCouponBatchName">
            </el-input>
            <el-select v-model="ruleForm.newCouponType" placeholder="新批次优惠券类型" style="width: 200px;margin-right:15px;">
                <el-option label="满减券" value="0">
                </el-option>
                <el-option label="兑换券" value="1">
                </el-option>
            </el-select>
            <el-date-picker v-model="ruleForm.startTime" type="date" placeholder="兑换时间起">
            </el-date-picker> -
            <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="兑换时间止">
            </el-date-picker>
            <el-button class="btn-search" type="primary" icon="search" @click="searchList">搜索</el-button>
            <el-button class="btn-search" @click="resetList">重置</el-button>
        </div>
        <!-- 列表 -->
        <el-table :data="dataSource"  border fit height="680" highlight-current-row style="width: 100%">
            <el-table-column align="center" label="活动标题" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.exchangeName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="旧unit编号" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.oldUnitCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="旧unit状态" min-width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.oldUnitStatus==0">未使用</span>
                    <span v-if="scope.row.oldUnitStatus==1">已使用</span>
                    <span v-if="scope.row.oldUnitStatus==2">已冻结</span>
                    <span v-if="scope.row.oldUnitStatus==3">已过期</span>
                    <span v-if="scope.row.oldUnitStatus==4">已失效</span>
                    <span v-if="scope.row.oldUnitStatus==5">已兑换</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="旧批次编号" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.oldBatchCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="旧批次名称" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.oldCouponBatchName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="旧批次优惠券标题" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.oldCouponName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="旧批次优惠券类型" min-width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.oldCouponType==0">满减券</span>
                    <span v-if="scope.row.oldCouponType==1">兑换券</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="新unit编号" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.newUnitCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="新unit状态" min-width="100">
                <template slot-scope="scope">
                    <span>未使用</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="新批次编号" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.newBatchCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="新批次名称" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.newCouponBatchName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="新批次优惠券标题" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.newCouponName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="新批次优惠券类型" min-width="150">
                <template slot-scope="scope">
                   <span v-if="scope.row.newCouponType==0">满减券</span>
                   <span v-if="scope.row.newCouponType==1">兑换券</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="用户账号" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.userMail}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="兑换时间" min-width="150">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.exchangeTime)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="订单编号" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.orderCode}}</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
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
</template>

<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env';
import {findExchangeOrderRecordOfPage,fuzzyQueryExchangeOrderRecordOfPage} from '../../../api/getData';
export default{
    data(){
        return{
            ruleForm:{
                exchangeName:'',
                oldUnitCode:'',
                oldUnitStatus:'',
                oldBatchCode:'',
                oldCouponType:'',
                newUnitCode:'',
                newBatchCode:'',
                newCouponType:'',
                startTime:'',
                endTime:'',
                orderCode:'',
                pageNo:1,
                pageSize:10,
                oldCouponBatchName:'',
                newCouponBatchName:''
            },
            dataSource:[],
            count:null
        }
    },
    created() {
        this.findExchangeOrderRecordOfPage();
    },
    methods: {
        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findExchangeOrderRecordOfPage();
            this.fuzzyQueryExchangeOrderRecordOfPage();
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findExchangeOrderRecordOfPage();
            this.fuzzyQueryExchangeOrderRecordOfPage();
        },
        //获取列表
        async findExchangeOrderRecordOfPage() {
            try {
                const res = await findExchangeOrderRecordOfPage({page:this.ruleForm.pageNo,pageSize:this.ruleForm.pageSize});
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
        //搜索接口
        async fuzzyQueryExchangeOrderRecordOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                });
                if(obj.startTime!=''&&obj.startTime!=null){
                    obj.startTime = this.setTimestamp(obj.startTime);
                }
                if(obj.endTime!=''&&obj.endTime!=null){
                     obj.endTime = this.setTimestamp(obj.endTime);
                }
                const res = await fuzzyQueryExchangeOrderRecordOfPage(obj);
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
        searchList(){
            this.fuzzyQueryExchangeOrderRecordOfPage();
        },
        //重置
        resetList(){
            this.ruleForm={
                exchangeName:'',
                oldUnitCode:'',
                oldUnitStatus:'',
                oldBatchCode:'',
                oldCouponType:'',
                newUnitCode:'',
                newBatchCode:'',
                newCouponType:'',
                startTime:'',
                endTime:'',
                orderCode:'',
                pageNo:1,
                pageSize:10
            };
            this.fuzzyQueryExchangeOrderRecordOfPage();
        },
        //时间转换时间戳
        setTimestamp(time) {
            const t = new Date(time);
            return t.getTime()
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
    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
.filter-item{
    width: 200px;
    margin-right:15px;
    margin-bottom:10px;
}
.search-col{
    padding-bottom: 20px;
}
</style>