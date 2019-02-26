<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="限购规则编号" v-model="ruleForm.limitRuleSerialNumber">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="ruleForm.standardUnitSerialNumber">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="用户账户" v-model="ruleForm.createUsername">
        </el-input>

     </div>

     <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="限购规则名称" v-model="ruleForm.limitRuleName">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="用户手机号" v-model="ruleForm.createUserMobile">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="订单编号" v-model="ruleForm.orderCode">
        </el-input>

        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
     </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="限购规则名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.limitRuleName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="限购规则编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.limitRuleSerialNumber}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.standardUnitSerialNumber}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品PU编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.productUnitSerialNumber}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="用户账户" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.createUsername}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="用户手机号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.createUserMobile}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.orderCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="限购方式" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.limitType==1">按购买商品总量限购</span>
                <span v-else-if="scope.row.limitType==2">按购买商品总金额限购</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="购买总量" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.buySum}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="购买总金额" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.buyMoneySum}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="购买时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
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
</template>


<script>
var moment = require('moment');
moment().format();
import {findLimitRuleRecordOfPage} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            form:{

            },
            ruleForm:{
                limitRuleSerialNumber:'',
                limitRuleName:'',
                standardUnitSerialNumber:'',
                createUsername:'',
                createUserMobile:'',
                orderCode:'',
                pageNo:1,
                pageSize:10
            },
            companyData:[],
            companyForm:{
                companyIds:'',
                pageNo:1,
                pageSize:10
            },
        }
    },
    created() {
        this.findLimitRuleRecordOfPage();
    },

    methods: {
        //获取列表
        async findLimitRuleRecordOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findLimitRuleRecordOfPage(obj);

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



        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findLimitRuleRecordOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findLimitRuleRecordOfPage()
        },

        searchForm(){
            this.ruleForm.pageNo = 1;
            this.findLimitRuleRecordOfPage();
        },

        //重置
        resetForm(){
            this.ruleForm={
                name:'',
                serialNumber:'',
                standardUnitSerialNumber:'',
                isStart:'',
                pageNo:1,
                pageSize:10
            };
            this.findLimitRuleRecordOfPage();
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




    }
}
</script>

<style>
#example {
    padding: 10px 20px;
}
</style>


