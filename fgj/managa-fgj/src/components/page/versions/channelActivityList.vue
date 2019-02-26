<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="渠道名称" v-model="ruleForm.channelName"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="活动名称" v-model="ruleForm.name"></el-input>


        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="addChannelActivity" size="medium" type="primary" icon="edit">新增活动</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="活动ID" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动短码" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.shortCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="渠道类型" min-width="180">
            <template slot-scope="scope">
                <span v-if="scope.row.type==0">Android</span>
                <span v-else-if="scope.row.type==1">iOS</span>
                <span v-else-if="scope.row.type==2">微信端</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属渠道" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.channelName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="渠道短码" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.channelShortCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="渠道链接" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.path}}</span>
            </template>
        </el-table-column>

       <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="edit(scope.row.id,scope.row.name)">编辑</el-button>
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

                <el-form-item label="渠道类型" v-show="this.action=='add'">
                    <el-select v-model="channelForm.type">
                        <el-option
                            v-for="item in typeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="活动名称">
                    <el-input v-model="channelForm.name"></el-input>
                </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveChannel">确 定</el-button>
        </div>

    </el-dialog>



  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findChannelActivityOfPage,insertChannelActivityWithTx,updateChannelActivityByIdWithTx,findChannelAll} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            typeList:'',
            ruleForm:{
                name:'',
                channelName:'',
                pageNo:1,
                pageSize:10
            },
            channelForm:{
                id:'',
                name:'',
                type:'',
                channelId:''
            },
            title:'新增渠道活动',
            action:'add',
        }
    },
    created() {
        this.findChannelActivityOfPage();
        this.findChannelAll();
    },

    methods: {
        async findChannelAll() {
            try {

                const res = await findChannelAll();

                if (res.data.code == 0) {
                    this.typeList = res.data.data;
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
        //获取列表
        async findChannelActivityOfPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findChannelActivityOfPage(obj);

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
            this.findChannelActivityOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.findChannelActivityOfPage()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                name:'',
                channelName:'',
                pageNo:1,
                pageSize:10
            }
            this.findChannelActivityOfPage();
        },
        //搜索
        handleFilter(){
            this.findChannelActivityOfPage();
        },
        //新增
        addChannelActivity(){
            this.action='add';
            this.channelForm = {
                name:'',
                type:'',
            };
            this.title = '新增渠道活动';
            this.dialogFormVisible = true;
        },


        //编辑
        edit(id,name){
            this.action="edit";
            this.channelForm = {
                id:id,
                name:name,
            };
            this.title = '编辑渠道活动';
            this.dialogFormVisible = true;
        },
        async updateChannelActivityByIdWithTx() {
            
            try {
                const res = await updateChannelActivityByIdWithTx({id:this.channelForm.id,name:this.channelForm.name});

                if (res.data.code == 0) {
                    this.$notify({
                        title: '修改',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findChannelActivityOfPage();
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

        //保存按钮
        saveChannel(){
            if(this.action == 'add'){
                this.insertChannelActivityWithTx();
            } else if (this.action == 'edit'){
                this.updateChannelActivityByIdWithTx();
            }
        },

        //新增保存

        async insertChannelActivityWithTx() {
            try {
                this.channelForm.channelId = this.channelForm.type;
                const res = await insertChannelActivityWithTx(this.channelForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增渠道活动成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findChannelActivityOfPage();
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


