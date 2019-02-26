<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:10px;">
        <el-select v-model="ruleForm.moduleId" placeholder="功能模块" @change="findAllLogDict1" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in modules"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.pageNameId" no-data-text="请先选择功能模块" @change="findAllLogDict2" placeholder="页面名称" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in pages"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.msgId" no-data-text="请先选择页面名称" placeholder="操作" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in opers"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.operType" placeholder="操作类型" style="width: 200px;margin-right:15px;">
            <el-option label="新增" value="0">
            </el-option>
            <el-option label="修改" value="1">
            </el-option>
            <el-option label="删除" value="2">
            </el-option>
        </el-select>

    </div>

    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.operatorId" placeholder="操作账号" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

        <el-date-picker
            v-model="startEndTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="操作时间"
            end-placeholder="操作时间">
        </el-date-picker>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="输入名称或编号的关键字" v-model="ruleForm.operatorObjCode"></el-input>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>
    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="操作时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.time)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作账号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.operatorName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="IP地址" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.ip}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="功能模块" min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.module}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="页面名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.pageName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.operatorObjName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="编号" min-width="80">
            <template slot-scope="scope">
                <router-link :to="'/logDatail/'+scope.row.operatorObjId+'/'+scope.row.type">
                    <span style="color:#00f">{{scope.row.operatorObjCode}}</span>
                </router-link>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作类型" min-width="80">
            <template slot-scope="scope">

                <span v-if="scope.row.operType	==0">新增</span>
                <span v-else-if="scope.row.operType	==1">修改</span>
                <span v-else-if="scope.row.operType	==2">删除</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.oper}}</span>
            </template>
        </el-table-column>




       <el-table-column align="center" label="查看" width="150">
            <template slot-scope="scope">
                <el-button type="primary" size="small" :disabled="scope.row.operType==2" @click="logDatail(scope.row)" plain>查看详情</el-button>
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


    <el-dialog title="日志详情" :visible.sync="dialogFormVisible">
        <el-form label-width="200px" v-if="logDatailObj.operType == 0">
            <el-form-item v-for="(info,key) in logDatailObj.content" :label="key">
                {{info}}
            </el-form-item>
        </el-form>

        <el-table :key='tableKey' v-else-if="logDatailObj.operType == 1" :data="logDatailObj.content" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="名称" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.fieldName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="变更前" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.oldField}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="变更后" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.newField}}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findLogInfoOfPage,findAllLogDict,userAdminAll} from '../../../api/getData';
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
                moduleId:'',
                pageNameId:'',
                operType:'',
                msgId:'',
                operatorId:'',
                startTime:'',
                endTime:'',
                operatorObjCode:'',
                pageNo:1,
                pageSize:10
            },
            logList:[],
            startEndTime:[],
            pages:[],
            opers:[],
            modules:[],
            userList:[],
            logDatailObj:''
        }
    },
    created() {
        this.findLogInfoOfPage();
        this.findAllLogDict();
        this.userAdminAll();
    },

    methods: {
        //获取列表
        async findLogInfoOfPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findLogInfoOfPage(obj);

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
            this.findLogInfoOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findLogInfoOfPage()
        },


        //重置
        resetForm(){
            this.startEndTime = [];
            this.pages = [];
            this.opers = [];
            this.ruleForm = {
                moduleId:'',
                pageNameId:'',
                operType:'',
                msgId:'',
                operatorId:'',
                startTime:'',
                endTime:'',
                operatorObjCode:'',
                pageNo:1,
                pageSize:10
            }
            this.findLogInfoOfPage();
        },
        //搜索
        handleFilter(){
            if(this.startEndTime[0]!='' && this.startEndTime[0]!=undefined){
                this.ruleForm.startTime =  this.setTimestamp(this.startEndTime[0]);
            }
            if(this.startEndTime[1]!='' && this.startEndTime[1]!=undefined){
                this.ruleForm.endTime =  this.setTimestamp(this.startEndTime[1]);
            }
            this.findLogInfoOfPage();
        },

        //查询功能模块字典
        async findAllLogDict(){
            try {

                const res = await findAllLogDict();

                if (res.data.code == 0) {
                    this.modules = res.data.data.modules;
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

        //查询页面字典
        async findAllLogDict1(id){
            try {
                const res = await findAllLogDict({moduleId:id});

                if (res.data.code == 0) {
                    this.pages = res.data.data.pages;
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

        //查询操作字典
        async findAllLogDict2(id){
            try {

                const res = await findAllLogDict({pageId:id});

                if (res.data.code == 0) {
                    this.opers = res.data.data.opers;
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

        //查询所有管理员用户接口
        async userAdminAll(){
            try {

                const res = await userAdminAll();

                if (res.data.code == 0) {
                    this.userList = res.data.data;
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

        logDatail(data){
            this.dialogFormVisible = true;
            this.logDatailObj = data;
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
            return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s;
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


