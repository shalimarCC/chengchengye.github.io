<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:10px;">

        <el-select v-model="ruleForm.operType" placeholder="操作类型" style="width: 200px;margin-right:15px;">
            <el-option label="新增" value="0">
            </el-option>
            <el-option label="修改" value="1">
            </el-option>
            <el-option label="删除" value="2">
            </el-option>
        </el-select>


        <el-date-picker
            v-model="startEndTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="操作时间"
            end-placeholder="操作时间">
        </el-date-picker>


        <el-select v-model="ruleForm.operatorId" placeholder="操作账号" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

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


        <el-table-column align="center" label="产品/商品/类目/...名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.pageName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="编号" min-width="80">
            <template slot-scope="scope">
                    <span>{{scope.row.operatorObjCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作类型" min-width="80">
            <template slot-scope="scope">

                <span v-if="scope.row.operType	==0">增加</span>
                <span v-else-if="scope.row.operType	==1">修改</span>
                <span v-else-if="scope.row.operType	==2">删除</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.oper}}</span>
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
                operatorObjId:'',
                pageNo:1,
                pageSize:10,
                type:''
            },
            logList:[],
            startEndTime:[],
            pages:[],
            opers:[],
            modules:[],
            userList:[]
        }
    },
    created() {

        this.findLogInfoOfPage();
        this.userAdminAll();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,10)

                 if(str == "/logDatail"){
                    this.findLogInfoOfPage();
                }

            },
        }
    },
    methods: {
        //获取列表
        async findLogInfoOfPage() {
            try {
                this.ruleForm.operatorObjId = this.$route.params.id;
                this.ruleForm.type = this.$route.params.type;
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

        //查询日志字典
        async findAllLogDict(){
            try {

                const res = await findAllLogDict();

                if (res.data.code == 0) {
                    this.pages = res.data.data.pages;
                    this.opers = res.data.data.opers;
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

        batchlogList(id){
            this.$router.push("/batchlogList/"+id)
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


