<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="组合名称" v-model="ruleForm.combinationName">
        </el-input>



        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="findStandardUnitCombinationOfPage">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button class="filter-item" @click="addCategory" style="float:right;" size="medium" type="primary" icon="edit">新增</el-button>
     </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="组合名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.combinationName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品数量" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.standardUnitSize}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="分组类型" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.type==1">选择商品</span>
               <!-- <span v-else-if="scope.row.type==2">关联前台类目树</span> -->
                <span v-else-if="scope.row.type==3">关联标签</span>
              <!--  <span v-else-if="scope.row.type==4">关联后台类目树</span> -->
            </template>
        </el-table-column>

        <el-table-column align="center" label="最后一次修改人" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.updateUsername}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="最后一次修改时间" min-width="150">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.updateTime)}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" plain size="small" @click="editCategoryTree(scope.row.standardUnitCombinationId)">编辑</el-button>
                <el-button type="primary" plain size="small" @click="categoryTreeGoods(scope.row.standardUnitCombinationId)">关联商品</el-button>
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

    <el-dialog title="新增分组" :visible.sync="dialogFormVisible" size="tiny">
        <el-form ref="form" :model="form" label-width="120px">

            <el-form-item label="分组名称">
                <el-input v-model="form.combinationName"></el-input>
            </el-form-item>


            <el-form-item label="分组类型" style="text-align:left;">
                <el-select v-model="form.type" placeholder="商品组合类型" :disabled="form.id!=''">
                    <el-option
                        v-for="item in treeStatus"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
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
import {findStandardUnitCombinationOfPage,insertStandardUnitCombinationWithTx,findStandardUnitCombinationById,updateStandardUnitCombinationByIdWithTx} from '../../../api/getData';
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
                id:'',
                combinationName:'',
                type:'',
            },
            ruleForm:{
                combinationName:'',
                pageNo:1,
                pageSize:10
            },
            failReason:'',
            treeStatus:[
                {
                    key:"选择商品",
                    value:1
                },
                // {
                //     key:"关联前台类目树",
                //     value:2
                // },
                {
                    key:"关联标签",
                    value:3
                },
                // {
                //     key:"关联后台类目树",
                //     value:4
                // },
            ],

        }
    },
    created() {
        this.findStandardUnitCombinationOfPage();


    },

    methods: {
        //获取列表
        async findStandardUnitCombinationOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findStandardUnitCombinationOfPage(obj);

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
            this.findStandardUnitCombinationOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findStandardUnitCombinationOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                combinationName:'',
                pageNo:1,
                pageSize:10
            };

            this.findStandardUnitCombinationOfPage()
        },
        //新增弹窗
        addCategory(){
            this.form = {
                combinationName:'',
                type:'',
                id:''
            };
            this.dialogFormVisible = true;
        },

        //保存
        saveCategoryTree(){
            if(this.form.id == ''){
                this.insertStandardUnitCombinationWithTx();
            }else{
                this.updateStandardUnitCombinationByIdWithTx();
            }
        },
        //新增

        async insertStandardUnitCombinationWithTx () {
            try {
                const res = await insertStandardUnitCombinationWithTx(this.form);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findStandardUnitCombinationOfPage();
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

        async updateStandardUnitCombinationByIdWithTx () {
            try {
                const res = await updateStandardUnitCombinationByIdWithTx(this.form);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findStandardUnitCombinationOfPage();
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
                const res = await findStandardUnitCombinationById({standardUnitCombinationId:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.form = {
                        combinationName:data.combinationName,
                        type:data.type,
                        id:data.standardUnitCombinationId,
                    };

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
        //关联商品
        categoryTreeGoods(id){
            this.$router.push("/editStandardCombination/"+id);
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


