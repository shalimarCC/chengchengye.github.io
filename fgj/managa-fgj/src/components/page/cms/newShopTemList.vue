<template>
    <div id="example">
        <!-- 搜索 -->
        <div class="search-col">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="页面名称" v-model="ruleForm.pageName">
            </el-input>
            <el-select v-model="ruleForm.templateId" placeholder="页面模板" style="width: 200px;margin-right:15px;">
                <el-option
                v-for="item in allTemps"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <el-button class="btn-search" type="primary" icon="search" @click="searchList">搜索</el-button>
            <el-button class="btn-search" @click="resetList">重置</el-button>
            <div class="btn-addCol">
                <router-link to="/addToNewShTemp">
                    <el-button class="btn-add" type="primary" icon="add" size="medium">
                        新增商品列表
                    </el-button>
                </router-link>
            </div>
        </div>
        <!-- 列表页 -->
        <el-table :data="dataSource"  border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="页面ID" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品列表页名称" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.pageName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属模板" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.templateName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标题栏搜索栏" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.showTitleSearch}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="显示有效期" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.showEffectTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序栏筛选栏" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.showSortFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="显示价格" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.showPrice}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="单品购物车" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.showCart}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="160">
                <template slot-scope="scope">
                    <el-button size="mini" @click="editPageList(scope.row.id)" :disabled="scope.row.id < 1000" >编辑</el-button>
                    <el-button size="mini" disabled>预览</el-button>
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
import {findCmsPageOfPage,findCmsTemplateAll} from '../../../api/getData';
export default{
    data(){
        return {
            ruleForm:{
               pageName:'',
               id:'',
               pageNo:1,
               pageSize:10,
               searchType:1
            },
            dataSource:[],
            count:null,
            allTemps:[]
        }
    },
    created() {
        this.findCmsPageOfPage();
        this.findCmsTemplateAll();
    },
    methods:{
        //获取列表页模板
        async findCmsTemplateAll(){
            try {
                const res = await findCmsTemplateAll({type:1});
                if (res.data.code == 0) {
                    this.allTemps = res.data.data;
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
        async findCmsPageOfPage() {
            try {
                let obj = new Object();
                $.each(this.ruleForm,function(key,info){
                    if(info!=''){
                        obj[key]=info;
                    }
                });
                console.log(obj);
                const res = await findCmsPageOfPage(obj);
                if (res.data.code == 0) {
                    let that = this;
                    that.count = res.data.data.totalSize;
                    that.dataSource = res.data.data.list;
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
            this.findCmsPageOfPage();
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCmsPageOfPage();
        },
        //搜索
        searchList(){
            this.findCmsPageOfPage();
        },
        //重置
        resetList(){
            this.ruleForm={
               pageName:'',
               id:'',
               pageNo:1,
               pageSize:10
            };
            this.findCmsPageOfPage();
        },
        //编辑
        editPageList(id){
            this.$router.push( {path:'/editToNewShTemp/'+id} )
        }
    }
}
</script>

<style scoped>
#example{
    padding: 10px 20px;
}
.filter-item{
    width: 200px;
    margin-right:15px;
}
.search-col{
    padding-bottom: 20px;
}
.btn-addCol{
    float:right;
}
</style>