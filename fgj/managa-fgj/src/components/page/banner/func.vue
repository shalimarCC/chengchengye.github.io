<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" style="float:right" disabled type="primary" size="medium" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="功能名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.functionName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="排序" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.sortValue}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" v-if="scope.row.id==2" plain size="small" @click="editActivity(scope.row.id)">编辑</el-button>
                <el-button type="primary" v-else disabled plain size="small" @click="editActivity(scope.row.id)">编辑</el-button>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="120px">

            <el-form-item label="关联类目">
                <el-tree
                :data="options"
                :props="props"
                ref="tree1"
                show-checkbox
                highlight-current
                node-key="id"></el-tree>

            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="updateBannerByIdWithTx">确 定</el-button>
        </div>

    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {findFunctionModuleOfPage,queryAllCategoryTreeNodeByType,updateFunctionModuleCategoryAllWithTx,findFunctionModuleCategoryAll} from '../../../api/getData';
export default {
    data() {
        return {
            imgForm:{
                key:'',
                token:'',
            },
            props:{
                value:'id',
                children:'children',
                label:'name'
            },
            dataSource: [],
            offset: 0,
            limit: 10,
            count: null,
            currentPage: 1,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            dialogTitle:"新增模板",
            activityName:'',
            options: [],
            categoryId:[],
            loading: false,
        }
    },
    created() {
        this.findFunctionModuleOfPage();


    },

    methods: {
        //获取列表
        async findFunctionModuleOfPage() {
            try {

                this.listLoading = false;
                const res = await findFunctionModuleOfPage({ pageNo: this.currentPage, pageSize: this.limit });

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
            this.findFunctionModuleOfPage()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.findFunctionModuleOfPage()
        },
        async queryAllCategoryTreeNodeByType (){
            try {
                const res = await queryAllCategoryTreeNodeByType();

                if (res.data.code == 0) {
                    this.options = res.data.data[0].list;
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
        editActivity (id) {
            this.queryAllCategoryTreeNodeByType();
            this.findFunctionModuleCategoryAll();
            this.dialogTitle = '修改';
            this.dialogFormVisible = true;
        },

        //根据ID查询信息
        async findFunctionModuleCategoryAll () {
            try {
                const res = await findFunctionModuleCategoryAll({functionModuleId:2});
                if (res.data.code == 0) {
                    this.$refs.tree1.setCheckedKeys(res.data.data.split(','));
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


        //保存
        async updateBannerByIdWithTx () {
            try {
                let menus = JSON.stringify(this.$refs.tree1.getCheckedKeys(true));
                const res = await updateFunctionModuleCategoryAllWithTx({functionModuleId:2,categoryTreeNodeIdList:menus});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findFunctionModuleOfPage();
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


