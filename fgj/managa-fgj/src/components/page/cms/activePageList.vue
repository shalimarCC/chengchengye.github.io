<template>
    <div id="content">
        <!-- 搜索 -->
        <div class="search">
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="模板名称" v-model="ruleForm.templateName">
            </el-input>
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="页面名称" v-model="ruleForm.pageName">
            </el-input>
            <el-select class="filter-item" v-model="ruleForm.templateType" placeholder="模板类型">
                <!-- 1：商品列表页 2:首页 3：商城 4：应用 5：活动 -->
                <el-option
                label="商品列表页"
                value="1">
                </el-option>
                <el-option
                label="首页"
                value="2">
                </el-option>
                <el-option
                label="商城"
                value="3">
                </el-option>
                <el-option
                label="应用"
                value="4">
                </el-option>
                <el-option
                label="活动"
                value="5">
                </el-option>
            </el-select>
            <el-select class="filter-item" v-model="ruleForm.clientType" placeholder="客户端类型">
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
            <el-select class="filter-item" v-model="ruleForm.isSingle" placeholder="是否属于独立公司">
                <el-option
                label="是"
                value="1">
                </el-option>
                <el-option
                label="否"
                value="0">
                </el-option>
            </el-select>
            <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="公司名称" v-model="ruleForm.companyName">
            </el-input>
            <el-select class="filter-item" v-model="ruleForm.pageStatus	" placeholder="页面状态">
                <el-option
                label="停用"
                value="1">
                </el-option>
                <el-option
                label="启用"
                value="0">
                </el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="findCmsPageOfPage">搜索</el-button>
            <el-button @click="resetPage">重置</el-button>
        </div>
        <!-- 三类公司 -->
        <div class="mt10">
            <el-button :type="ruleForm.companyType==0?'success':'info'" @click="searchForm(0)">正式公司</el-button>
            <el-button :type="ruleForm.companyType==1?'success':'info'" @click="searchForm(1)">演示公司</el-button>
            <el-button :type="ruleForm.companyType==2?'success':'info'" @click="searchForm(2)">竞品公司</el-button>
            <!-- 新增 -->
            <el-button class="addBtn filter-item" type="primary" @click="addActPage(ruleForm.companyType)">新增活动页页面</el-button>
        </div>
        <!-- 列表展示 -->
        <el-table ref="multipleTable" :data="dataSource"  border fit highlight-current-row style="width: 100%;margin-top:10px;">
            <el-table-column align="center" label="页面ID" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="页面名称" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.pageName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="页面状态" width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.pageStatus == 0">启用</span>
                    <span v-if="scope.row.pageStatus == 1">停用</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否属于独立公司" width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.isSingle == 0">否</span>
                    <span v-if="scope.row.isSingle == 1">是</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属模板" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.templateName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="模板类型" min-width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.templateType == 1">商品列表页</span>
                    <span v-if="scope.row.templateType == 2">首页</span>
                    <span v-if="scope.row.templateType == 3">商城</span>
                    <span v-if="scope.row.templateType == 4">应用</span>
                    <span v-if="scope.row.templateType == 5">活动</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属公司" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="客户端类型" min-width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.clientType == 1">APP</span>
                    <span v-if="scope.row.clientType == 2">微信</span>
                    <span v-if="scope.row.clientType == 3">小程序</span>
                    <span v-if="scope.row.clientType == 4">web商城</span>
                    <span v-if="scope.row.clientType == 5">PC端</span>
                    <span v-if="scope.row.clientType == 6">移动端</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最低支持版本" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.clientVersionIRemark}} {{scope.row.clientVersionARemark}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="配置状态" min-width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.cfgStatus == 1">未完成</span>
                    <span v-if="scope.row.cfgStatus == 0">完成</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最后一次更新时间" min-width="80">
                <template slot-scope="scope">
                    <!-- <span>{{scope.row.updateTime}}</span> -->
                    <span>{{setTime(scope.row.updateTime)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="最后一次更新人" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.updateUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="350">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" plain @click="editActivePage(scope.row.id)">编辑</el-button>
                    <el-button type="primary" size="small" plain v-if="scope.row.pageStatus == 1" @click="startUp(scope.row.id,0)">启用</el-button>
                    <el-button type="primary" size="small" plain v-if="scope.row.pageStatus == 0" @click="startUp(scope.row.id,1)">停用</el-button>
                    <el-button type="primary" size="small" plain>复制</el-button>
                    <el-button type="primary" size="small" plain disabled>预览</el-button>
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
import {findCmsPageOfPage,createEmptyTmpl,updateStatusPage} from '../../../api/getData';
export default {
    data (){
        return {
            ruleForm:{
                name:'',
                status:'',
                clientType:'',
                pageNo:1,
                pageSize:10,
                templateName:'',
                pageName:'',
                templateType:'',
                isSingle:'',
                companyName:'',
                pageStatus:'',
                companyType:0
            },
            dataSource:[],
            listLoading:true,
            count:null
        }
    },
    created() {
        this.findCmsPageOfPage();
    },
    methods: {
        //获取列表
        async findCmsPageOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                });
                obj.searchType = 0;
                obj.companyType = this.ruleForm.companyType;
                //this.listLoading = false;
                const res = await findCmsPageOfPage(obj);
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
        resetPage(){
            this.ruleForm={
                name:'',
                status:'',
                clientType:'',
                pageNo:1,
                pageSize:10,
                templateName:'',
                pageName:'',
                templateType:'',
                isSingle:'',
                companyName:'',
                pageStatus:'',
                companyType:this.ruleForm.companyType
            };
            this.findCmsPageOfPage();
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
        searchForm(type){
            this.ruleForm.companyType = type;
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findCmsPageOfPage();
        },
         //新建活动实例
        async addActPage(companyType){
            this.$router.push('/addActivePage/' + companyType);
        },
        //编辑活动实例
        editActivePage(id){
            this.$router.push('/editActivePage/' + id);
        },
        //启用停用设置
        async startUp(id,status){
            try{
               const res = await updateStatusPage({id:id,pageStatus:status});
               if(res.data.code == 0){
                    this.findCmsPageOfPage();
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
        },
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

    },
}
</script>

<style scoped>
    #content{
        padding: 10px 20px;
    }
    .search .filter-item{
        width:230px;
        margin-bottom:10px;
    }
    .addBtn{
        float:right;
    }
    .mt10{
        margin-top: 10px;
    }
</style>