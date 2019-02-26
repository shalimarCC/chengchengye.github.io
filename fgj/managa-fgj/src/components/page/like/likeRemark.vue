<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
        <el-select v-model="ruleForm.tagId" placeholder="所属标签">
        <el-option
            v-for="item in likeLabel"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button class="filter-item" style="float:right" @click="addFirm" type="primary" icon="edit" size="medium">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="点赞评语" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.praiseWords}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属标签" min-width="100">
            <template slot-scope="scope">
                {{scope.row.tagName}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="排序" min-width="100">
            <template slot-scope="scope">
                {{scope.row.sort}}
            </template>
        </el-table-column>

       <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="info" size="small" plain @click="editLikeRemark(scope.row.id)">编辑</el-button>
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


    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="120px">
            <el-form-item label="所属标签">
                <el-select v-model="firmForm.tagId" placeholder="所属标签">
                    <el-option
                        v-for="item in likeLabel"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="点赞排序">
                <el-input-number v-model="firmForm.sort" :min="1"></el-input-number>
            </el-form-item>


            <el-form-item label="点赞评语">
                <el-input
                    type="textarea"
                    :rows="4"
                    :maxlength="60"
                    resize="none"
                    placeholder="请输入点赞评语（60字以内）"
                    v-model="firmForm.words">
                </el-input>
            </el-form-item>



        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="updateCompanyByIdWithTx" size="medium">确 定</el-button>
        </div>

    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {praiseWordsPage,praiseTagList,savePraiseWords,praiseWordsDetail} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm:{
                tagId:'',
                pageNo:1,
                pageSize:10
            },
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            dialogTitle:'新增企业',
            firmForm:{
                tagId:'',
                words:'',
                id:'',
                sort:1
            },
            likeLabel:[],
        }
    },
    created() {
        this.findPraiseWordsList();
        this.findPraiseTagList();

    },

    methods: {
        //获取列表
        async findPraiseWordsList() {
            try {

                this.listLoading = false;
                const res = await praiseWordsPage(this.ruleForm);

                if (res.data.code == 0) {

                    this.count = res.data.data.praiseWordsPage.totalSize;
                    this.dataSource = res.data.data.praiseWordsPage.list;
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
            this.findPraiseWordsList()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findPraiseWordsList()
        },

        //获取点赞标签列表
        async findPraiseTagList() {
            try {
                this.listLoading = false;
                const res = await praiseTagList();

                if (res.data.code == 0) {
                    this.likeLabel = res.data.data.tagList;
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
        resetForm() {
            this.ruleForm = {
                tagId:'',
                pageNo:1,
                pageSize:10
            },
            this.findPraiseWordsList();
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findPraiseWordsList();
        },



        //新增
        addFirm(){
            this.firmForm = {
                tagId:'',
                words:'',
                id:'',
                sort:1
            };
            this.dialogTitle = '新增点赞评语';
            this.dialogFormVisible = true;
        },

        //保存
        async updateCompanyByIdWithTx(){
            try {
                const res = await savePraiseWords(this.firmForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findPraiseWordsList();
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
        async editLikeRemark(id){
            try {
                const res = await praiseWordsDetail({ id:id });
                this.dialogTitle = '修改点赞评语';
                this.dialogFormVisible = true;
                if (res.data.code == 0) {
                    this.firmForm = {
                        tagId:res.data.data.praiseWords.tagId,
                        words:res.data.data.praiseWords.words,
                        id:res.data.data.praiseWords.id,
                        sort:res.data.data.praiseWords.sort
                    };

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


    }
}
</script>

<style scoped>
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


