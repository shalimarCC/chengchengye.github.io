<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
        <el-input v-model="sclabel" placeholder="标签" style="width:300px;"></el-input>
        <el-button class="filter-item" @click="searchFirm" type="primary" icon="edit" size="medium">查询</el-button>
        <el-button class="filter-item" style="float:right" @click="addFirm" type="primary" icon="edit" size="medium">添加</el-button>
    </div>
    <el-table :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="点赞标签" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
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




    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="120px">
            <el-form-item label="标签名称">
                <el-input v-model="firmForm.name" placeholder="请输入标签名称（3字以内）" :maxlength="3"></el-input>
            </el-form-item>

            <el-form-item label="点赞排序">
                <el-input v-model="firmForm.sort"></el-input>
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
import {praiseTagList,praiseTagDetail,savePraiseTag} from '../../../api/getData';
export default {
    data() {
        return {
            sclabel:'',
            listLoading:true,
            dataSource: [],

            dialogFormVisible:false,
            dialogTitle:'新增点赞标签',
            firmForm:{
                name:'',
                id:'',
                sort:''
            }
        }
    },
    created() {
        this.findPraiseTagList();

    },

    methods: {
        //获取列表
        async findPraiseTagList() {
            try {

                this.listLoading = false;
                const res = await praiseTagList();

                if (res.data.code == 0) {
                    this.dataSource = res.data.data.tagList;
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
       searchFirm(){
          console.log('search')
       },

        //新增
        addFirm(){
            this.firmForm = {
                name:'',
                id:'',
                sort:''
            };
            this.dialogTitle = '新增点赞标签';
            this.dialogFormVisible = true;
        },

        //保存
        async updateCompanyByIdWithTx(){
            try {
                const res = await savePraiseTag(this.firmForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findPraiseTagList();
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
                const res = await praiseTagDetail({ id:id });
                this.dialogTitle = '修改点赞标签';
                this.dialogFormVisible = true;
                if (res.data.code == 0) {
                    this.firmForm = {
                        name:res.data.data.tag.name,
                        id:res.data.data.tag.id,
                        sort:res.data.data.tag.sort
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


