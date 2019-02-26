<template>
  <div class="filter-container" id="example">

    <div  style="margin-bottom:10px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="ruleForm.productUnitSerialNumber">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="ruleForm.commodityProductUnitName">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="申请门店" v-model="ruleForm.afterStoreName">
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

        <el-table-column align="center" label="商品名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.commodityProductUnitName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="库存变化" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.stockChange}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作前数量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.beforeChangeValue}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作后数量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.afterChangeValue}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="申请原因" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.applyCauseName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="具体原因" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.concretenessCause}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="申请人" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.afterUserName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="申请门店" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.afterStoreName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="申请时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.afterTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作人" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.operationUserName}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作时间" min-width="100">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.operationTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="findStoreStockChangeApplyPictureAll(scope.row.id)">查看凭证</el-button>
                <el-button type="success" size="small" plain @click="updateStoreStockChangeApplyByIdWithTx(scope.row.id,1)" v-if="scope.row.isConsent==0">同意</el-button>
                <el-button type="danger" size="small" plain @click="updateStoreStockChangeApplyByIdWithTx(scope.row.id,2)" v-if="scope.row.isConsent==0">拒绝</el-button>
                <el-button type="primary" size="small" plain v-if="scope.row.isConsent!=0" v-text="scope.row.isConsent==1?'已同意':'已拒绝'"></el-button>
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

    <el-dialog title="查看凭证" :visible.sync="dialogFormVisible">
        <div>
            <img :src="src" alt="" v-for="src in imgSrcList" style="width:100%;">
        </div>
    </el-dialog>
    </div>
  </div>
</template>


<script>

import {findStoreStockChangeApplyOfPage,findStoreStockChangeApplyPictureAll,updateStoreStockChangeApplyByIdWithTx} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                productUnitSerialNumber: "",
                commodityProductUnitName: "",
                createUsername: "",
                pageNo:1,
                pageSize:10,
                createTimeFront:'',
                createTimeBack:''
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            skuGoodsList:[],
            startEndTime:[],
            dialogFormVisible:false,
            imgSrcList:[]
        }
    },
    created() {
        this.findStoreStockChangeApplyOfPage();
    },

    methods: {

        //根据门店pu库存变动id查看凭证接口
        async updateStoreStockChangeApplyByIdWithTx(id,type) {
            try {
                const res = await updateStoreStockChangeApplyByIdWithTx({id:id,isConsent:type});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '审核成功'
                    });
                    this.findStoreStockChangeApplyOfPage();
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

        //根据门店pu库存变动id查看凭证接口
        async findStoreStockChangeApplyPictureAll(id) {
            try {
                const res = await findStoreStockChangeApplyPictureAll({storeStockChangeApplyId:id});

                if (res.data.code == 0) {
                    this.dialogFormVisible = true;
                    this.imgSrcList = res.data.data;
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
        async findStoreStockChangeApplyOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findStoreStockChangeApplyOfPage(obj);

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
            this.findStoreStockChangeApplyOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findStoreStockChangeApplyOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            if(this.startEndTime[0]!='' && this.startEndTime[0]!=undefined){
                this.ruleForm.afterTimeStart =  this.setTimestamp(this.startEndTime[0]);
            }
            if(this.startEndTime[1]!='' && this.startEndTime[1]!=undefined){
                this.ruleForm.afterTimeStop =  this.setTimestamp(this.startEndTime[1]);
            }
            this.findStoreStockChangeApplyOfPage();
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
            this.findStoreStockChangeApplyOfPage();
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


