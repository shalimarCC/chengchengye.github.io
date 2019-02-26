<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="标签名称" v-model="ruleForm.name"></el-input>

        <el-select v-model="ruleForm.type" placeholder="标签类型" style="width: 200px;margin-right:15px;">
            <el-option label="商品标签" value="1">
            </el-option>
            <el-option label="节点标签" value="2">
            </el-option>
            <el-option label="活动标签" value="3">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.isValid" placeholder="标签状态" style="width: 200px;margin-right:15px;">
            <el-option label="停用" value="0">
            </el-option>
            <el-option label="启用" value="1">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="addVersions" size="medium" type="primary" icon="edit">新增</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="标签名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="标签类型" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.type==1">商品标签</span>
                <span v-else-if="scope.row.type==2">节点标签</span>
                <span v-else-if="scope.row.type==3">活动标签</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="标签状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isValid==0">停用</span>
                <span v-else-if="scope.row.isValid==1">启用</span>
            </template>
        </el-table-column>

       <el-table-column align="center" label="操作" width="350">
            <template slot-scope="scope">
                <el-button style="float:left" type="primary" size="small" plain @click="editVersions(scope.row.id)">编辑</el-button>
                <el-button style="float:left" type="primary" size="small" v-if="scope.row.isValid == 0" plain @click="updateTagTypeByIdWithTx(scope.row.id,1)">启用</el-button>
                <el-button style="float:left" type="primary" size="small" v-else-if="scope.row.isValid == 1" plain @click="updateTagTypeByIdWithTx(scope.row.id,0)">停用</el-button>
                <el-button style="float:left" type="primary" size="small" plain @click="clearLog(scope.row.id)">清除引用</el-button>
                <el-button style="float:left" type="primary" size="small" v-if="scope.row.type == 1" plain @click="relateGoods(scope.row.id)">关联列表</el-button>
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
        <el-form label-width="120px">
                <el-form-item label="标签名称">
                    <el-input v-model="labelForm.name"></el-input>
                </el-form-item>

                <el-form-item label="标签类型">
                    <el-select v-model="labelForm.type" placeholder="请选择类型" :disabled="labelForm.id != ''">
                        <el-option
                        label="商品标签"
                        :value="1">
                        </el-option>
                        <el-option
                        label="节点标签"
                        :value="2">
                        </el-option>
                        <el-option
                        label="活动标签"
                        :value="3">
                        </el-option>

                    </el-select>
                </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveVersions">确 定</el-button>
        </div>

    </el-dialog>



  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findTagOfPage,insertTagWithTx,findTagById,updateTagByIdWithTx,updateTagTypeByIdWithTx,tagClearRecordByTagId} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            ruleForm:{
                name:'',
                type:'',
                isValid:'',
                pageNo:1,
                pageSize:10
            },
            labelForm:{
                id:'',
                name:'',
                type:'',

            },
            title:'新增标签'

        }
    },
    created() {
        this.findTagOfPage();
    },

    methods: {
        //获取列表
        async findTagOfPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findTagOfPage(obj);

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
            this.findTagOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findTagOfPage()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                name:'',
                type:'',
                isValid:'',
                pageNo:1,
                pageSize:10
            };
            this.findTagOfPage();
        },
        //搜索
        handleFilter(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findTagOfPage();
        },
        //新增
        addVersions(){
            this.labelForm = {
                id:'',
                name:'',
                type:'',
            };
            this.title = '新增标签';
            this.dialogFormVisible = true;
        },

        //编辑

        async editVersions(id) {
            try {
                const res = await findTagById({tagId:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.labelForm = {
                        id:data.id,
                        name:data.name,
                        type:data.type,

                    }
                    this.title = '编辑标签';
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

        //保存按钮
        saveVersions(){
            if(this.labelForm.id == ''){
                this.insertTagWithTx();
            }else{
                this.updateTagByIdWithTx();
            }
        },

        //新增保存

        async insertTagWithTx() {
            try {
                const res = await insertTagWithTx(this.labelForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增标签成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findTagOfPage();
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

        //clearLog
        clearLog(id){
            this.$confirm('清除记录后，之前所有对该标签的引用都将失效，确认清除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tagClearRecordByTagId(id);
            }).catch(() => {
            });
        },
        async tagClearRecordByTagId(id) {
            try {
                const res = await tagClearRecordByTagId({tagId:id});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '清除记录成功',
                        type: 'success',
                        duration: 2000
                    });
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

        //新增保存

        async updateTagByIdWithTx() {
            try {
                const res = await updateTagByIdWithTx(this.labelForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改标签成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findTagOfPage();
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

        //启用停用

        async updateTagTypeByIdWithTx(id,isValid) {
            try {
                const res = await updateTagTypeByIdWithTx({tagId:id,isValid:isValid});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改状态成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findTagOfPage();
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
            return y + '-' + m + '-' + d
        },
        //时间转换时间戳
        setTimestamp(time) {
            const t = new Date(time);
            return t.getTime()
        },

        //查看关联列表
        relateGoods (id) {
            this.$router.push({path:'/goodsList/'+id})
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


