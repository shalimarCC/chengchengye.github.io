<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="渠道名称" v-model="ruleForm.name"></el-input>


        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="addChannel" size="medium" type="primary" icon="edit">新增</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="渠道ID" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="渠道名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="渠道短码" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.shortCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属渠道" min-width="180">
            <template slot-scope="scope">
                <span v-if="scope.row.type==0">Android</span>
                <span v-else-if="scope.row.type==1">iOS</span>
                <span v-else-if="scope.row.type==2">微信</span>
                <span v-else-if="scope.row.type==3">web</span>
                <span v-else-if="scope.row.type==4">其它</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.channelActivityName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动短码" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.channelActivityshortCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="渠道链接" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.path}}</span>
            </template>
        </el-table-column>





       <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" :disabled="scope.row.id == 1" plain @click="editChannel(scope.row.id)">编辑</el-button>
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
                <el-form-item label="渠道名称">
                    <el-input v-model="channelForm.name"></el-input>
                </el-form-item>

                <el-form-item label="所属渠道">
                    <el-select v-model="channelForm.type" placeholder="请选择类型" :disabled="this.action == 'edit'">
                        <el-option
                        label="Android"
                        :value="0">
                        </el-option>
                        <el-option
                        label="iOS"
                        :value="1">
                        </el-option>
                        <el-option
                        label="微信"
                        :value="2">
                        </el-option>
                        <el-option
                        label="web"
                        :value="3">
                        </el-option>
                        <el-option
                        label="其它"
                        :value="4">
                        </el-option>

                    </el-select>
                </el-form-item>

                <el-form-item label="渠道短码">
                    <el-input v-model="channelForm.shortCode" :disabled="this.action == 'edit'"></el-input>
                </el-form-item>

                <el-form-item label="渠道链接">
                    <el-input v-model="channelForm.path"></el-input>
                </el-form-item>

                <el-form-item label="活动短码">
                    <el-input v-model="channelForm.channelActivityshortCode" disabled></el-input>
                </el-form-item>

                <el-form-item label="活动名称">
                    <el-input v-model="channelForm.channelActivityName"></el-input>
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
import {findChannelOfPage,insertChannelWithTx,updateChannelByIdWithTx,findChannelById} from '../../../api/getData';
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
                pageNo:1,
                pageSize:10
            },
            channelForm:{
                id:'',
                name:'',
                type:'',
                shortCode:'',
                path:'',
                channelActivityName:'',
                channelActivityshortCode:'',
            },
            title:'新增渠道',
            action:'add',
        }
    },
    created() {
        this.findChannelOfPage();
    },

    methods: {
        //获取列表
        async findChannelOfPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findChannelOfPage(obj);

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
            this.findChannelOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.findChannelOfPage()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                name:'',
                pageNo:1,
                pageSize:10
            }
            this.findChannelOfPage();
        },
        //搜索
        handleFilter(){
            this.findChannelOfPage();
        },
        //新增
        addChannel(){
            this.channelForm = {
                id:'',
                name:'',
                type:'',
                shortCode:'',
                path:'',
                channelActivityName:''
            };
            this.title = '新增渠道';
            this.action = 'add';
            this.dialogFormVisible = true;
        },

        //编辑

        async editChannel(id) {
            try {
                this.action = 'edit';
                const res = await findChannelById({id:id});

                if (res.data.code == 0) {
                    this.channelForm = {
                        id:res.data.data.id,
                        name:res.data.data.name,
                        type:res.data.data.type,
                        shortCode:res.data.data.shortCode,
                        path:res.data.data.path,
                        channelActivityshortCode:res.data.data.channelActivityshortCode,
                        channelActivityName:res.data.data.channelActivityName,
                    };
                    this.title = '编辑版本';
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
        saveChannel(){
            if(this.channelForm.id == ''){
                this.insertChannelWithTx();
            }else{
                this.updateChannelByIdWithTx();
            }
        },

        //新增保存

        async insertChannelWithTx() {
            try {
                const res = await insertChannelWithTx(this.channelForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增渠道成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findChannelOfPage();
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

        //编辑保存

        async updateChannelByIdWithTx() {
            try {
                const res = await updateChannelByIdWithTx(this.channelForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改渠道成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findChannelOfPage();
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


