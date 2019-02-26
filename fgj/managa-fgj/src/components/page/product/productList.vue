<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:10px;" class="searchcol">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="产品编号" v-model="ruleForm.productSerialNumber">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="产品名称" v-model="ruleForm.name">
        </el-input>

        <el-date-picker v-model="ruleForm.beginTime" type="date" placeholder="开始时间" style="width: 200px;margin-right:15px;">
        </el-date-picker>
        <el-date-picker v-model="ruleForm.finishTime" type="date" placeholder="结束时间" style="width: 200px;margin-right:15px;">
        </el-date-picker>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="warntime" placeholder="预警期" v-model="ruleForm.precautiousStart">
        </el-input><span>至</span><el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="warntime" placeholder="预警期" v-model="ruleForm.precautiousEnd" @change="iputNum">
        </el-input>
     </div>
    <div style="margin-bottom:20px;" class="searchcol">
        <el-select v-model="ruleForm.status" placeholder="产品状态" style="width: 200px;margin-right:15px;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

        <el-button class="filter-item" @click="addProduct" style="float:right" type="primary" icon="el-icon-circle-plus">添加</el-button>
        <el-button class="filter-item" @click="updateAvailable(0)" style="float:right" type="warning" icon="el-icon-error">停用</el-button>
        <el-button class="filter-item" @click="updateAvailable(1)" style="float:right" type="success" icon="el-icon-success">启用</el-button>


     </div>




    <el-table class="listcontent" :key='tableKey' ref="multipleTable" :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column align="center" label="产品编号" min-width="180">
            <template slot-scope="scope">
                <span>{{scope.row.productSerialNumber}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="产品名称" min-width="180">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" min-width="125">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="产品类目" min-width="180">
            <template slot-scope="scope">
                <span>{{scope.row.productCategory}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="启用／停用" min-width="125">
            <template slot-scope="scope">
                <span v-if="scope.row.isAvailable==1">启用</span>
                <span v-if="scope.row.isAvailable==0">停用</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="产品状态" min-width="90">
            <template slot-scope="scope">
                <span v-if="scope.row.status==1">待审核</span>
                <span v-else-if="scope.row.status==2">审核中</span>
                <span v-else-if="scope.row.status==3">已通过</span>
                <span v-else-if="scope.row.status==4">未通过</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="预警期" min-width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.precautiousLineDays && scope.row.precautiousLineDays.length>0 && scope.row.precautiousLineDays[0]!=null">{{scope.row.precautiousLineDays[0]}}天</span>
                <span v-if="scope.row.precautiousLineDays && scope.row.precautiousLineDays.length>1">/{{scope.row.precautiousLineDays[1]}}天</span>
                <span v-if="scope.row.precautiousLineDays && scope.row.precautiousLineDays.length>2">/{{scope.row.precautiousLineDays[2]}}天</span>
            </template>
        </el-table-column>

      <el-table-column align="center" label="操作" width="350">
        <template slot-scope="scope">
            <el-button type="primary" size="small" plain @click="editProduct(scope.row.id)">编辑</el-button>
            <el-button type="primary" size="small" plain @click="seeProduct(scope.row.id)" :disabled="scope.row.spuStatus==1">查看</el-button>

            <el-button v-if="scope.row.status==1" type="primary" size="small" @click="checkProduct(scope.row.id,scope.row.status)">提交审核</el-button>
            <el-button v-else-if="scope.row.status==2" type="warning" size="small" :disabled="true">正在审核</el-button>
            <el-button v-else-if="scope.row.status==3" type="success" size="small" :disabled="true">审核通过</el-button>
            <el-button v-else-if="scope.row.status==4" type="danger" size="small" @click="checkProduct(scope.row.id,scope.row.status)">查看原因</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[5,10,20,30, 50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div>

  </div>
</template>


<script>

import {getProductList,deleteProduct,audit,updateAvailable} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                productSerialNumber:"",
                name: "",
                beginTime: "",
                finishTime:"",
                status: "",
                precautiousStart:"",
                precautiousEnd:""
            },
            dataSource: [],
            offset: 0,
            limit: 10,
            count: null,
            currentPage: 1,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible: false,
            permissData: [],
            findAll: [],
            checkList: [],
            dialogFormVisible2: false,
            userId: 0,
            userRole: [],
            options: [{
                value: 1,
                label: '待审核'
            }, {
                value: 2,
                label: '审核中'
            }, {
                value: 3,
                label: '已通过'
            }, {
                value: 4,
                label: '未通过'
            }],
            multipleSelection:[]
        }
    },
    created() {
        this.getUserList();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                let str = curVal.path;
                str = str.substring(0,8)
                if(str == "/product"){
                    Object.assign(this.$data, this.$options.data())
                    this.getUserList();
                }

　　　　　　 },
            deep:true
        }
    },
    methods: {
        iputNum(){
            if(this.ruleForm.precautiousEnd < this.ruleForm.precautiousStart){
                this.$message({
                    type: 'error',
                    message: "预警期范围输入有误，请重新输入"
                });
            }
        },
        //获取列表
        async getUserList() {
            try {

                const obj = new Object();

                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })

                obj.pageNo = this.currentPage;
                obj.pageSize = this.limit
                obj.PrecautiousLineIdStr = "6,7,8";
                const res = await getProductList(obj);

                this.listLoading = false;
                // const res = await getProductList({ pageNo: this.currentPage, pageSize: this.limit });

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
            this.limit = val;
            this.getUserList()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.getUserList()
        },

        //复选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //搜索
        async handleFilter() {

            try {
                const obj = new Object();

                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })

                obj.pageNo = this.currentPage;
                obj.pageSize = this.limit

                const res = await getProductList(obj);

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
        //重置
        resetForm(formName) {
            this.ruleForm = {
                productSerialNumber:"",
                id: "",
                name: "",
                beginTime: "",
                finishTime:"",
                status: ""
            }
            this.getUserList();
        },

        //新增产品
        addProduct () {

            this.$router.push( {path:'/product/addProduct'} )
        },


        //编辑产品
        editProduct (id) {
            this.$router.push( {path:'/product/editProduct/'+id} )
        },

        //查看产品
        seeProduct (id) {
            this.$router.push( {path:'/product/seeProduct2/'+id} )
        },

        //启用/停用
        async updateAvailable (type) {
            try {
                let arr = new Array;
                $.each(this.multipleSelection,function(key,info){
                    arr.push(info.id);
                })
                const res = await updateAvailable({ ids:JSON.stringify(arr),isAvailable:type});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message:'改变状态成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.getUserList()

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

        //提交审核
        async checkProduct (id,status){
            try {

                const res = await audit({id:id,status:status});
                if (res.data.code == 0) {
                    if(status == 4){
                        this.$notify({
                            title: '失败原因',
                            message: res.data.data,
                            type: 'warning',
                            duration: 5000
                        });
                    }else{
                        this.$notify({
                            title: '成功',
                            message: res.data.data,
                            type: 'success',
                            duration: 2000
                        });
                        this.getUserList()
                    }
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
    padding: 5px 20px;
}
.searchcol .warntime{
    width:82px !important;
}
</style>
<style>
@media screen and (max-width: 1600px) {
    .searchcol{
        margin-bottom:10px !important;
        margin-top:10px;
    }
    .searchcol .el-input{
        width:160px !important;
        margin-right:0 !important;
    }
    .searchcol .el-input__inner{
        height:36px;
        line-height:36px;
    }
    .searchcol .warntime{
        width:82px !important;
    }
    .searchcol span{
        font-size:14px;
    }
    .searchcol .el-select{
        width:160px !important;
    }
    .searchcol .el-button{
        padding:9px 20px;
    }
    .searchcol .el-input__icon{
        line-height:36px;
    }
    .listcontent td, .listcontent th{
        padding:10px 0;
    }
}
</style>


