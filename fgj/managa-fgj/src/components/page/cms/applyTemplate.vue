<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="模板名称" v-model="ruleForm.name">
        </el-input>


        <el-select v-model="ruleForm.status" placeholder="模板状态">
            <el-option
            label="启用"
            value="0">
            </el-option>
            <el-option
            label="停用"
            value="1">
            </el-option>
        </el-select>
        <el-select v-model="ruleForm.clientType" placeholder="所属客户端">
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
        </el-select>


        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="templatePage">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button class="filter-item" @click="addShopTemplate" style="float:right;" size="medium" type="primary" icon="edit">新增</el-button>
     </div>
     <div style="margin-bottom:20px;">
        <el-button :type="ruleForm.companyType==0?'success':'info'" @click="searchForm(0)">正式公司</el-button>
        <el-button :type="ruleForm.companyType==1?'success':'info'" @click="searchForm(1)">演示公司</el-button>
        <el-button :type="ruleForm.companyType==2?'success':'info'" @click="searchForm(2)">竞品公司</el-button>
     </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="模板名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.templateName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="模板状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.status==0">启用</span>
                <span v-else-if="scope.row.status==1">停用</span>
            </template>
        </el-table-column>



        <el-table-column align="center" label="所属客户端" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.clientType==1">APP</span>
                <span v-else-if="scope.row.clientType==2">微信</span>
                <span v-else-if="scope.row.clientType==3">小程序</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="Android版本号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.clientVersionA}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="iOS版本号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.clientVersionI}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="模板备注" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="350">
            <template slot-scope="scope">
                <el-button :disabled="scope.row.status==0" type="success" size="small" @click="checkTemplate(scope.row.templateId)">设为启用</el-button>
                <el-button type="primary" size="small" @click="editTemplate(scope.row.templateId)">编辑模板</el-button>
                <el-button type="primary" size="small" @click="editCategoryTree(scope.row.templateId)">预览</el-button>
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
import {templatePage,showCommodityTemplate,createEmptyTmpl,useTemplate} from '../../../api/getData';
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
                name:'',
                content:'',
                seriesType:'',
                id:'',
            },
            ruleForm:{
                templateName:'',
                type:1,
                pageNo:1,
                pageSize:10,
                clientType:'',
                status:'',
                companyType:0
            },
            failReason:'',
            treeStatus:[
                {
                    key:"一级",
                    value:1
                },
                {
                    key:"二级",
                    value:2
                },
            ],

        }
    },
    created() {
        this.templatePage();


    },

    methods: {
        //获取列表
        async templatePage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await templatePage(obj);

                if (res.data.code == 0) {
                    this.count = res.data.data.templatePage.totalSize;
                    this.dataSource = res.data.data.templatePage.list;

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
            this.templatePage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.templatePage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                templateName:'',
                type:1,
                pageNo:1,
                pageSize:10,
                clientType:'',
                status:'',
                companyType:this.ruleForm.companyType
            };

            this.templatePage()
        },

        //搜索
        searchForm(type){
            this.ruleForm.companyType = type;
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.templatePage()
        },

        checkTemplate(id){
            this.$confirm('切换后客户端将显示该模板，确认切换?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.useTemplate(id);
            }).catch(() => {
            });
        },

        //启用
        async useTemplate (id) {
            try {
                const res = await useTemplate({templateId:id});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '启用成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.templatePage();
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


        //新建空白模板
        async addShopTemplate(){
            try {
                const res = await createEmptyTmpl({type:1,companyType:this.ruleForm.companyType});

                if (res.data.code == 0) {
                    this.$router.push('/addShopTemplate/'+res.data.data.tmplId);
                    this.templatePage();
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

        //编辑
        editTemplate(id){
            this.$router.push('/addShopTemplate/'+id);
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>


