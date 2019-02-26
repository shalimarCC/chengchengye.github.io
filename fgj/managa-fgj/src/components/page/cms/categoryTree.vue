<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="类目树名称" v-model="ruleForm.name">
        </el-input>



        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="findCategoryTreeOfPage">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button class="filter-item" @click="addCategory" style="float:right;" size="medium" type="primary" icon="edit">新增</el-button>
     </div>
     <div style="margin-bottom:20px;">
        <el-button :type="ruleForm.companyType==0?'success':'info'" @click="searchForm(0)">正式公司</el-button>
        <el-button :type="ruleForm.companyType==1?'success':'info'" @click="searchForm(1)">演示公司</el-button>
        <el-button :type="ruleForm.companyType==2?'success':'info'" @click="searchForm(2)">竞品公司</el-button>
     </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="类目树ID" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.categoryTreeId}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类目树名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.categoryTreeName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类目树类型" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.seriesType==1">一级</span>
                <span v-else-if="scope.row.seriesType==2">二级</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类目树备注" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.content}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类目树状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.startUsing==0">停用</span>
                <span v-else-if="scope.row.startUsing==1">启用</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="350">
            <template slot-scope="scope">
                <el-button v-if="scope.row.startUsing==0" type="success" size="small" plain @click="checkCategory(scope.row.categoryTreeId,1)">启用</el-button>
                <el-button v-else-if="scope.row.startUsing==1" type="warning" di size="small" plain disabled>停用</el-button>

                <el-button v-if="scope.row.seriesType==2" :disabled="scope.row.webStart==1" type="success" size="small" plain @click="checkCategory(scope.row.categoryTreeId,3)">设为Web商城类目树</el-button>
                <el-button type="primary" plain size="small" @click="editCategoryTree(scope.row.categoryTreeId)">编辑</el-button>
                <el-button type="primary" plain size="small" @click="categoryManage(scope.row.categoryTreeId)">类目管理</el-button>
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

    <el-dialog :title="tltle" :visible.sync="dialogFormVisible" size="tiny">
        <el-form ref="form" :model="form" label-width="120px">

            <el-form-item label="类目树名称" class="is-required">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="类目树备注">
                <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="form.content">
                </el-input>
            </el-form-item>

            <el-form-item label="类目树类型" style="text-align:left;" class="is-required">
                <el-select v-model="form.seriesType" placeholder="请选择" style="width: 200px;margin-right:15px;" @change="typeChange">
                    <el-option
                        v-for="item in treeStatus"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="类目树模板" style="text-align:left;" class="is-required">
                <el-select v-model="form.categoryTreeTemplateId" placeholder="请选择" style="width: 200px;margin-right:15px;">
                    <el-option
                        v-for="item in CategoryTreeList"
                        :key="item.categoryTreeTemplateId"
                        :label="item.templateName"
                        :value="item.categoryTreeTemplateId">
                    </el-option>
                </el-select>
            </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveCategoryTree">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findCategoryTreeOfPage,addCategoryTree,findByCategoryTreeId,updateCategoryTree,categoryTreeStartUsing,findCategoryTreeTemplateAll} from '../../../api/getData';
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
                categoryTreeTemplateId:'',
                companyType:''
            },
            ruleForm:{
                name:'',
                companyType:0,
                pageNo:1,
                pageSize:10
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
            CategoryTreeList:[],
            tltle:'新增类目树'

        }
    },
    created() {
        this.findCategoryTreeOfPage();


    },

    methods: {
        //获取列表
        async findCategoryTreeOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findCategoryTreeOfPage(obj);

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

        typeChange(){
            this.form.categoryTreeTemplateId = '';
            this.findCategoryTreeTemplateAll();
        },
        //获取列表
        async findCategoryTreeTemplateAll() {
            try {
                const res = await findCategoryTreeTemplateAll({templateType:this.form.seriesType});

                if (res.data.code == 0) {
                    this.CategoryTreeList = res.data.data;
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
        //搜索
        searchForm(type){
            this.ruleForm.companyType = type;
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findCategoryTreeOfPage()
        },
        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findCategoryTreeOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCategoryTreeOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                name:'',
                companyType:this.ruleForm.companyType,
                pageNo:1,
                pageSize:10
            };

            this.findCategoryTreeOfPage()
        },
        //新增弹窗
        addCategory(){
            this.form = {
                name:'',
                content:'',
                seriesType:'',
                id:'',
                categoryTreeTemplateId:'',
                companyType:this.ruleForm.companyType
            };
            this.dialogFormVisible = true;
        },

        //保存
        saveCategoryTree(){
            if(this.form.id == ''){
                this.addCategoryTree();
            }else{
                this.updateCategoryTree();
            }
        },

        //新增

        async addCategoryTree () {
            try {
                const res = await addCategoryTree(this.form);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findCategoryTreeOfPage();
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

        //修改

        async updateCategoryTree () {
            try {
                const res = await updateCategoryTree(this.form);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findCategoryTreeOfPage();
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

        //启用
        async checkCategory (id,clientType) {
            try {
                const res = await categoryTreeStartUsing({categoryTreeId:id,companyType:this.ruleForm.companyType,clientType:clientType});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '启用成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findCategoryTreeOfPage();
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

        //查看
        async editCategoryTree (id) {
            try {
                const res = await findByCategoryTreeId({categoryTreeId:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.form = {
                        name:data.categoryTreeName,
                        content:data.content,
                        seriesType:data.seriesType,
                        id:data.categoryTreeId,
                        categoryTreeTemplateId:data.categoryTreeTemplateId,
                        companyType:data.companyType
                    };
                    this.findCategoryTreeTemplateAll();
                    this.tltle = '编辑类目树';
                    this.dialogFormVisible = true;
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


        //类目管理
        categoryManage(id){
            this.$router.push('/cetegory/'+id);
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


