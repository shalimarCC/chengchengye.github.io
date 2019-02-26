<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="活动名称" v-model="ruleForm.activityName">
            </el-input>

            <el-select v-model="ruleForm.activityStatus" placeholder="活动状态">
            <el-option
                label="报名中"
                value="0">
                </el-option>
                <el-option
                label="已截止"
                value="1">
                </el-option>
                <el-option
                label="进行中"
                value="2">
                </el-option>
                <el-option
                label="已结束"
                value="3">
                </el-option>
                <el-option
                label="筹备中"
                value="4">
                </el-option>
                <el-option
                label="已取消"
                value="6">
                </el-option>
            </el-select>

            <el-select v-model="ruleForm.companyId" placeholder="所属公司">
                <el-option
                    v-for="item in companyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" size="medium">搜索</el-button>
            <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>


            <el-button class="filter-item" @click="addActivity" style="float:right" type="primary" size="medium" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="活动名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.activityName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动开始时间" min-width="100">
            <template slot-scope="scope">
                {{setTime(scope.row.startTime)}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动结束时间" min-width="100">
           <template slot-scope="scope">
                {{setTime(scope.row.endTime)}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动地点" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.location}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="报名人数" min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.peopleCount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动状态" min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.status}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建人" min-width="60">
            <template slot-scope="scope">
                <span>{{scope.row.creatorName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属公司" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否显示" min-width="50">
            <template slot-scope="scope">
                 <el-switch
                    v-model="scope.row.visible"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="0"
                    @change="changeActivityVisible(scope.row.id)">
                </el-switch>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="400" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editActivity(scope.row.id)">编辑</el-button>
                <el-button type="primary" size="small" plain @click="previewActivity(scope.row.id,scope.row.peopleCount)">预览</el-button>
                <el-button type="success" size="small" plain @click="applyActivity(scope.row.id)">报名人员</el-button>
                <el-button type="danger" size="small" :disabled="scope.row.activityStatus==1" plain @click="cancelActivity(scope.row.id)">取消活动</el-button>
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
import { baseUrl } from '../../../config/env'
var moment = require('moment');
moment().format();
import {simpleCompanyList,activityList,changeActivityVisible,cancelActivity} from '../../../api/getData';
export default {
    data() {
        return {
            companyList:[],
            dataSource: [],
            offset: '0',
            count: null,
            tableKey: 0,
            listLoading: true,
            ruleForm:{
                pageNo:1,
                pageSize:10,
                activityName:'',
                activityStatus:''
            }
        }
    },
    created() {
        this.findActivityList();
        this.simpleCompanyList();
    },

    methods: {
        //获取列表
        async findActivityList() {
            try {
                 const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await activityList(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.actPage.totalSize;
                    this.dataSource = res.data.data.actPage.list;

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
        //获取公司列表
        async simpleCompanyList (){
            try{
                const res = await simpleCompanyList();

                if (res.data.code == 0) {
                    this.companyList = res.data.data.companyList;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch (err){
                 this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
            }
        },
        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findActivityList()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findActivityList()
        },


        //搜索
        handleFilter() {
            this.findActivityList();
        },
        //取消活动
        cancelActivity(id){
            this.$confirm('取消活动后用户将无法参加该活动，确认取消？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.cancelActivityAjax(id)
            }).catch(() => {
            });
        },
        async cancelActivityAjax(id){
            try {

                const res = await cancelActivity({id:id});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '取消成功!'
                    });
                    this.findActivityList();
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

        //预览
        previewActivity(id,peopleCount){
            //window.open(baseUrl +'/appFgj/#/detailActivity/'+id,'newwindow','height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no');
            this.$router.push("/activeDetail/"+id+"/"+peopleCount);
        },
        //重置
        resetForm() {
            this.ruleForm = {
                activityName:'',
                activityStatus:''
            };
            this.findActivityList();
        },

        //更改活动可见性
        changeActivityVisible(id){
            this.$confirm('此操作将改变活动的状态, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.changeActivityVisibleAjax(id)
            }).catch(() => {

                this.findActivityList()
            });
        },

        async changeActivityVisibleAjax(id){
            try {

                const res = await changeActivityVisible({id:id});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '成功!'
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

        //新增
        addActivity () {
            this.$router.push("/addActivity")
        },


        //编辑
        editActivity (id) {
            this.$router.push("/editActivity/"+id);
        },

        applyActivity(id){
            this.$router.push("/applyList/"+id);
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


