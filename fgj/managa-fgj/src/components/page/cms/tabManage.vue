<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-button :type="ruleForm.companyId==0?'success':'info'" @click="searchForm(0)">正式公司</el-button>
        <el-button :type="ruleForm.companyId==1?'success':'info'" @click="searchForm(1)">竞品公司</el-button>
        <el-button :type="ruleForm.companyId==2?'success':'info'" @click="searchForm(2)">演示公司</el-button>

        <el-button class="filter-item" style="float:right" type="primary" icon="edit" size="medium" @click="addTab">
        新增
        </el-button>
     </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="分页tab名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.pageTabName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="分页tab备注" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.pageTabRemark}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="分页tab排序" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.pageTabSort}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="最后一次修改时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.updateTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="修改人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.updateUserName}}</span>
            </template>
        </el-table-column>



        <el-table-column align="center" label="操作" width="300"  fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" @click="findPageTabById(scope.row.id)" size="small" plain>编辑</el-button>
                <el-button type="danger" @click="delPageTabById(scope.row.id)" size="small" plain>删除</el-button>
                <el-button type="primary" size="small" @click="editCategoryTree(scope.row.id)">预览</el-button>
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

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <div style="height:500px;overflow:auto;">
            <el-form label-width="120px">
                <el-form-item label="分页tab名称">
                    <el-input v-model="tabForm.pageTabName" placeholder="分页tab名称"></el-input>
                </el-form-item>

                <el-form-item label="分页tab备注">
                    <el-input v-model="tabForm.pageTabRemark" placeholder="分页tab备注"></el-input>
                </el-form-item>

                <el-form-item label="分页tab排序">
                    <el-input-number controls-position="right" v-model="tabForm.pageTabSort" :min="1" label="分页tab排序"></el-input-number>
                </el-form-item>

            </el-form>


        </div>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="insertOrUpdatePageTabWithTx">确 定</el-button>
        </div>
    </el-dialog>


  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findPageTabOfPage,insertOrUpdatePageTabWithTx,findPageTabById,deletePageTabWithTx} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            ruleForm:{
                companyId:0,
                pageNo:1,
                pageSize:10
            },
            tabForm:{
                id:'',
                pageTabName:'',
                pageTabRemark:'',
                pageTabSort:'',
                companyId:'',
            },
            companyList:[],
            loading:false,

            title:'新增分页tab',
        }
    },
    created() {
        this.findPageTabOfPage();
        //this.findCompanyIdOrName();
    },
    watch:{

    },
    methods: {
        //删除
        delPageTabById(id){
            this.$confirm('确认要删除该分页tab', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deletePageTabWithTx(id);
            }).catch(() => {

            });
        },
        //根据ID查详情
        async deletePageTabWithTx(id){
            try {
                const res = await deletePageTabWithTx({id:id});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.findPageTabOfPage();
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
        //根据ID查详情
        async findPageTabById(id){
            try {
                const res = await findPageTabById({id:id});

                if (res.data.code == 0) {
                    this.dialogFormVisible = true;
                    this.tabForm = {
                        id:id,
                        pageTabName:res.data.data.pageTabName,
                        pageTabRemark:res.data.data.pageTabRemark,
                        pageTabSort:res.data.data.pageTabSort,
                        companyId:'',
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
        //保存分页tab
        async insertOrUpdatePageTabWithTx(){
            try {
                this.tabForm.companyId = this.ruleForm.companyId;
                const res = await insertOrUpdatePageTabWithTx(this.tabForm);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '更新成功'
                    });
                    this.findPageTabOfPage();
                    this.dialogFormVisible = false;
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
        //新增分页tab
        addTab(){
            this.dialogFormVisible = true;
            this.tabForm = {
                id:'',
                pageTabName:'',
                pageTabRemark:'',
                pageTabSort:'',
                companyId:'',
            };

        },
        //获取列表
        async findPageTabOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findPageTabOfPage(obj);

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
            this.findPageTabOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findPageTabOfPage()
        },

        //搜索
        searchForm(type){
            this.ruleForm.companyId = type;
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findPageTabOfPage()
        },

        //时间戳转换
        setTime(time) {
            if(time==null){
                return '';
            }
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


