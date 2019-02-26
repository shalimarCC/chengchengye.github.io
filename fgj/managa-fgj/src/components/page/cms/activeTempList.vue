<template>
    <div id="content">
        <!-- 搜索 -->
        <div class="search">
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="模板名称" v-model="ruleForm.name">
            </el-input>
            <el-select v-model="ruleForm.status" placeholder="模板状态">
                <el-option
                    label="停用"
                    value="1">
                </el-option>
                <el-option
                    label="启用"
                    value="0">
                </el-option>
            </el-select>
            <el-select v-model="ruleForm.clientType" placeholder="所属客户端">
                <!-- 5:PC端 6:移动端 -->
                <el-option
                label="PC端"
                value="5">
                </el-option>
                <el-option
                label="移动端"
                value="6">
                </el-option>
                <el-option
                label="app"
                value="1">
                </el-option>
                <el-option
                label="微信"
                value="2">
                </el-option>
                <el-option
                label="小程序"
                value="3">
                </el-option>
                <el-option
                label="web商城"
                value="4">
                </el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="searchList">搜索</el-button>
            <el-button @click="resetList">重置</el-button>
        </div>
        <!-- 新增 -->
        <div class="mt10">
            <el-button class="addBtn filter-item" type="primary" @click="addActTemplate">新增活动页模板</el-button>
        </div>
        <!-- 列表展示 -->
        <el-table ref="multipleTable" :data="dataSource"  border fit highlight-current-row style="width: 100%;margin-top:10px;">
            <el-table-column align="center" label="模板名称" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="模板状态" width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">启用</span>
                    <span v-if="scope.row.status == 1">停用</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="模板类型" width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">商品列表页</span>
                    <span v-if="scope.row.type == 2">首页</span>
                    <span v-if="scope.row.type == 3">商城</span>
                    <span v-if="scope.row.type == 4">应用</span>
                    <span v-if="scope.row.type == 5">活动</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="客户端类型" min-width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.clientType == 1">app</span>
                    <span v-if="scope.row.clientType == 2">微信</span>
                    <span v-if="scope.row.clientType == 3">小程序</span>
                    <span v-if="scope.row.clientType == 4">web商城</span>
                    <span v-if="scope.row.clientType == 5">PC端</span>
                    <span v-if="scope.row.clientType == 6">移动端</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最低支持版本" min-width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.clientVersionARemark && scope.row.clientVersionIRemark">{{scope.row.clientVersionARemark}},{{scope.row.clientVersionIRemark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="模板备注" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" plain @click="editActTemp(scope.row.id)">编辑</el-button>
                    <el-button type="primary" size="small" plain v-if="scope.row.status == 1" @click="startUp(scope.row.id,0)">启用</el-button>
                    <el-button type="primary" size="small" plain v-if="scope.row.status == 0" @click="startUp(scope.row.id,1)">停用</el-button>
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
import {updateCmsTemplateByIdWithTx,createEmptyTmpl,findCmsTemplateOfPage,updateStatusTemp} from '../../../api/getData';
export default {
    data (){
        return {
            ruleForm:{
                name:'',
                status:'',
                clientType:'',
                pageNo:1,
                pageSize:10,
                companyType:0
            },
            dataSource:[],
            listLoading:true,
            count:null
        }
    },
    created() {
        this.findCmsTemplateOfPage();
    },
    methods: {
        //获取列表
        async findCmsTemplateOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                obj.searchType = 0;
                const res = await findCmsTemplateOfPage(obj);
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
            this.findCmsTemplateOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCmsTemplateOfPage()
        },
         //新建活动模板
        async addActTemplate(){
            this.$router.push('/addActTemp');
        },
        //搜索
        searchList(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findCmsTemplateOfPage();
        },
        //重置
        resetList(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.ruleForm.status = '';
            this.ruleForm.name = '';
            this.ruleForm.clientType = '';
            this.findCmsTemplateOfPage();
        },
        //编辑
        editActTemp(id){
            this.$router.push('/editActTemp/' + id);
        },
        async startUp(id,status){
            try{
               const res = await updateStatusTemp({id:id,status:status});
               if(res.data.code == 0){
                    this.findCmsTemplateOfPage();
                    this.$message({
                        type: 'success',
                        message: '状态修改成功'
                    });
               }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
               }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: 'cms状态更新失败，请联系管理员'
                });
            }
        }

    },
}
</script>

<style scoped>
    #content{
        padding: 10px 20px;
    }
    .search{
        margin-bottom:10px;
    }
    .search .filter-item{
        width:230px;
    }
    .addBtn{
        float:right;
    }
    .mt10{
        margin-top: 10px;
        overflow:hidden;
    }
</style>