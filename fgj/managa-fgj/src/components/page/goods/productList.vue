<template>
    <div>
     <div style="margin-bottom:20px;text-align:left;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="产品名称" v-model="ruleForm.name">
        </el-input>

        <el-cascader
            style="width: 200px;margin-right:15px;"
            placeholder="产品类目 "
            :options="options"
            v-model="ruleForm.categoryId"
            :props="props"
           >
        </el-cascader>


        <el-button class="filter-item" type="primary" size="medium" icon="search" @click="productByCategoryId">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>


     </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%;margin-top:30px;">
        <el-table-column align="center" label="产品编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="产品名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" min-width="80">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editProduct(scope.row.id)">选择</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10,20,30, 50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div>
    </div>
</template>


<script>

import {productByCategoryId,categoryList} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                name: "",
                categoryId:[]
            },
            dataSource: [],
            offset: 0,
            limit: 10,
            count: null,
            currentPage: 1,
            tableKey: 0,
            listLoading: true,
            props:{
                value:'id',
                children:'lists',
                label:'name'
            },
            options: [],
        }
    },
    created() {
        this.productByCategoryId();
        this.categoryList();
    },

    methods: {
        //获取列表
        async productByCategoryId() {
            try {

                this.listLoading = false;
                const obj = new Object();

                if (this.ruleForm.name !== "") {
                    obj["name"] = this.ruleForm.name;
                }

                if (this.ruleForm.categoryId.length > 0) {
                    obj["categoryId"] = this.ruleForm.categoryId[this.ruleForm.categoryId.length-1];
                }
                obj.pageNo = this.currentPage;
                obj.pageSize =  this.limit;
                const res = await productByCategoryId(obj);

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
        //获取列表
        async categoryList() {
            try {
                const res = await categoryList();

                if (res.data.code == 0) {

                    this.options = res.data.data;

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
            this.productByCategoryId()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.productByCategoryId()
        },


        //重置
        resetForm() {
            this.ruleForm = {
                name: "",
                categoryId:[]
            }
            this.productByCategoryId();
        },

        //选择产品
        editProduct (id) {
            this.$emit('toparentevent', id);
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



    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


