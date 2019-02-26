<template>
  <div class="filter-container" id="example">

    <div  style="margin-bottom:10px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="ruleForm.productUnitSerialNumber">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="ruleForm.commodityProductUnitName">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="操作人" v-model="ruleForm.createUsername">
        </el-input>




     </div>


    <div style="margin-bottom:20px;">

        <el-date-picker
            v-model="startEndTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="操作开始时间"
            end-placeholder="操作结束时间">
        </el-date-picker>

        <el-button class="filter-item" type="primary" size="medium" icon="search" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
    </div>



    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="商品编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.productUnitSerialNumber}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="订单编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.orderCode}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.commodityProductUnitName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="所属门店" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.storeName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="库存变化" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.stockChange}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作前数量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.preoperativeStockNum}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作后数量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.operationBackStockNum}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="冻结库存" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.operationBackRealStockNum-scope.row.preoperativeRealStockNum}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作前数量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.preoperativeRealStockNum}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作后数量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.operationBackRealStockNum}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作类型" min-width="100">
            <template slot-scope="scope">
               <!-- <span v-if="scope.row.type == 1">提交订单</span>
                <span v-if="scope.row.type == 2">支付</span>
                <span v-if="scope.row.type == 3">取消订单（未支付）</span>
                <span v-if="scope.row.type == 4">取消订单（已支付）</span>
                <span v-if="scope.row.type == 5">进货</span>
                <span v-if="scope.row.type == 6">出货</span> -->
                <span>{{scope.row.dictName}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作人" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.createUsername}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作时间" min-width="100">
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
  </div>
</template>


<script>

import {findStorePuStockRunningWaterOfPage,findStoreProductUnitOfPage} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                storeProductUnitId:"",
                productUnitSerialNumber: "",
                commodityProductUnitName: "",
                createUsername: "",
                pageNo:1,
                pageSize:10,
                createTimeFront:'',
                createTimeBack:'',
                storeId:''
            },
            dataSource: [],
           // contentSour:[],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            skuGoodsList:[],
            startEndTime:[],
            ruleForm2: {
                productUnitSerialNumber: "",
                commodityProductUnitName: "",
                storeName:"",
                pageNo:1,
                pageSize:10
            },
        }
    },
    created() {
        this.findStorePuStockRunningWaterOfPage();
       // this.findStoreProductUnitOfPage();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                Object.assign(this.$data, this.$options.data())
                this.findStorePuStockRunningWaterOfPage();
            },
        }
    },

    methods: {
        //获取列表
        async findStorePuStockRunningWaterOfPage() {
            try {
                this.ruleForm.storeProductUnitId = this.$route.params.id;
                //console.log(this.ruleForm.storeId);

                 this.ruleForm.storeId = this.$route.params.storeId;
                //this.findStoreProductUnitOfPage();
                console.log(this.contentSour);
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findStorePuStockRunningWaterOfPage(obj);
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.dataSource = res.data.data.list;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                };
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
            this.findStorePuStockRunningWaterOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findStorePuStockRunningWaterOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            if(this.startEndTime[0]!='' && this.startEndTime[0]!=undefined){
                this.ruleForm.createTimeStart =  this.setTimestamp(this.startEndTime[0]);
            }
            if(this.startEndTime[1]!='' && this.startEndTime[1]!=undefined){
                this.ruleForm.createTimeStop =  this.setTimestamp(this.startEndTime[1]);
            }
            this.findStorePuStockRunningWaterOfPage();
        },
        //重置
        resetForm(formName) {
            this.ruleForm = {
                productUnitSerialNumber: "",
                commodityProductUnitName: "",
                createUsername: "",
                pageNo:1,
                pageSize:10,
                createTimeFront:'',
                createTimeBack:''
            }
            this.startEndTime = [];
            this.findStorePuStockRunningWaterOfPage();
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

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


