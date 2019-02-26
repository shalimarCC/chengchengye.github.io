<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="ruleForm.productUnitSerialNumber">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="ruleForm.name">
        </el-input>

        <el-button class="filter-item" type="primary" size="medium" icon="search" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>


     </div>




    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit height="680" highlight-current-row style="width: 100%">

        <el-table-column align="center" label="商品编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.productUnitSerialNumber}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="所属SU名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.merchantName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="在线库存" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.realStockNum}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="实体库存" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.skuRealStockNum}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="前端是否显示" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isVisible==0">是</span>
                <span v-else>否</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="是否上下架" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.status==3">是</span>
                <span v-else>否</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="是否为自营" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.merchantId==1">是</span>
                <span v-else>否</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="冻结量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.realFrozenStockNum}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="success" size="small" plain @click="addStock(scope.row.productUnitId)">进货</el-button>
                <el-button type="danger" size="small" plain @click="delStock(scope.row.productUnitId)">出货</el-button>
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

import {findCommodityProductUnitStockOfPage,addStock,comeStock} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                productUnitSerialNumber: "",
                name: "",
                pageNo:1,
                pageSize:10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            skuGoodsList:[],
            dialogFormVisible:false,
            stockTitle:'进货',
            stockType:1,
        }
    },
    created() {
        this.findCommodityProductUnitStockOfPage();
    },

    methods: {
        //获取列表
        async findCommodityProductUnitStockOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findCommodityProductUnitStockOfPage(obj);

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
            this.findCommodityProductUnitStockOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCommodityProductUnitStockOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findCommodityProductUnitStockOfPage();
        },
        //重置
        resetForm(formName) {
            this.ruleForm = {
                productUnitSerialNumber: "",
                name: "",
                pageNo:1,
                pageSize:10
            }
            this.findCommodityProductUnitStockOfPage();
        },



        //进货
       addStock (id){

            this.$prompt('请输入进货数量', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                inputErrorMessage: '格式不正确'
            }).then(({ value }) => {

                this.addStockAjax(id,value)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });

        },

        //进货请求
        async addStockAjax (id,value) {
            try {
                const res = await addStock({commodityProductUnitId:id,realStockNum:value});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '进货成功'
                    });
                    this.findCommodityProductUnitStockOfPage();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }

            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },
        //出货
        delStock (id){
            this.$prompt('请输入出货数量', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                inputErrorMessage: '格式不正确'
            }).then(({ value })=> {
                this.delStockAjax(id,value)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });

        },
        //出货请求
        async delStockAjax (id,value) {
            try {

                const res = await comeStock({commodityProductUnitId:id,realStockNum:value});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '出货成功'
                    });
                    this.findCommodityProductUnitStockOfPage();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }

            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },
    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


