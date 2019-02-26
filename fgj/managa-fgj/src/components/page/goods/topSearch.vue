<template>
  <div class="filter-container" id="example">
     <div style="margin-bottom:10px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="热搜名称" v-model="ruleForm.name">
        </el-input>

        <el-select v-model="ruleForm.isStart" placeholder="状态" style="width: 200px;margin-right:15px;">
            <el-option label="停用" value="0">
            </el-option>
            <el-option label="启用" value="1">
            </el-option>
        </el-select>


        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

        <el-button class="filter-item" style="float:right" @click="addSearch" type="primary" icon="edit" size="medium">新增</el-button>
     </div>

    <el-table :key='tableKey' ref="multipleTable" :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="热搜名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

         <el-table-column align="center" label="热搜编号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.sortValue}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="启用状态" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.isStart==0">停用</span>
                <span v-else-if="scope.row.isStart==1">启用</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300"  fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" @click="findTopSearchById(scope.row.id)" size="small" plain>编辑</el-button>
                <el-button type="success" @click="startStopTopSearch(scope.row.id)" :disabled="startTopSearchNum>=8" v-if="scope.row.isStart==0" size="small" plain>启用</el-button>
                <el-button type="danger" @click="startStopTopSearch(scope.row.id)" v-else-if="scope.row.isStart==1" size="small" plain>停用</el-button>
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
        <el-form ref="form" label-width="100px">
            <el-form-item label="热搜名称">
                <el-input class="filter-item" placeholder="请输入热搜名称，最多8个字" maxlength="8" v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="热搜编号" v-if="title!='新增热搜'">
                <el-input-number v-model="form.sortValue"></el-input-number>
                <p style="font-size:12px;line-height:30px;color:#999;text-align:left;">Tips : 当前最大热搜编号为{{maxNum}}</p>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveSearch">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findTopSearchOfPage,insertTopSearchWithTx,updateTopSearchByIdWithTx,findTopSearchById,startStopTopSearch} from '../../../api/getData';
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
                effectEndTime:'',
                title:'',
                pageNo:1,
                pageSize:10
            },
            title:'新增热搜',
            form:{
                id:'',
                name:''
            },
            maxNum:0,
            startTopSearchNum:0,
        }
    },
    created() {
        this.findTopSearchOfPage();
    },

    methods: {
        //获取列表
        async findTopSearchOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })

                this.listLoading = false;
                const res = await findTopSearchOfPage(obj);

                if (res.data.code == 0) {
                    this.startTopSearchNum = res.data.data.startTopSearchNum;
                    this.count = res.data.data.result.totalSize;
                    this.dataSource = res.data.data.result.list;

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
            this.findTopSearchOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findTopSearchOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                groupName:'',
                pageNo:1,
                pageSize:10
            };

            this.findTopSearchOfPage()
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findTopSearchOfPage()
        },

        //新增
        addSearch(){
            this.form = {
                id:'',
                name:''
            };
            this.title = '新增热搜';
            this.dialogFormVisible = true;

        },
        //保存
        saveSearch(){
            if(this.form.id==''){
                this.insertTopSearchWithTx();
            }else{
                this.updateTopSearchByIdWithTx();
            }
        },

        //新增
        async insertTopSearchWithTx() {
            try {
                const res = await insertTopSearchWithTx(this.form);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '新增热搜成功'
                    });
                    this.findTopSearchOfPage();
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
        //根据ID查询热搜详情
        async findTopSearchById(id) {
            try {
                const res = await findTopSearchById({topSearchId:id});

                if (res.data.code == 0) {
                    this.form.id = res.data.data.topSearch.id;
                    this.form.name = res.data.data.topSearch.name;
                    this.form.sortValue = res.data.data.topSearch.sortValue;
                    this.maxNum = res.data.data.sortValueMax;
                    this.title = '编辑热搜';
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
        //编辑
        async updateTopSearchByIdWithTx() {
            try {
                const res = await updateTopSearchByIdWithTx(this.form);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: ' 修改热搜成功'
                    });
                    this.findTopSearchOfPage();
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
        //编辑
        async startStopTopSearch(id) {
            try {
                const res = await startStopTopSearch({topSearchId:id});

                if (res.data.code == 0) {
                    if(res.data.data == 0){
                        this.$message({
                            type: 'success',
                            message: '停用成功'
                        });
                    }else{
                        this.$message({
                            type: 'success',
                            message: '启用成功'
                        });
                    }

                    this.findTopSearchOfPage();
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


