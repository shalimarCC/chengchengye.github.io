<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="姓名" v-model="ruleForm.name">
        </el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="手机号码 " v-model="ruleForm.mobile">
        </el-input>
        <el-select v-model="ruleForm.sex" placeholder="性别" style="width: 200px;margin-right:15px;">
            <el-option label="女" value="0">
            </el-option>
            <el-option label="男" value="1">
            </el-option>
        </el-select>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="所属公司 " v-model="ruleForm.companyName">
        </el-input></br>

        <el-date-picker
            v-model="ruleForm.startTime"
            type="date"
            placeholder="失效日期（起）" style="width: 200px;margin-top:15px;">
        </el-date-picker>至
        <el-date-picker
            v-model="ruleForm.endTime"
            type="date"
            placeholder="失效日期（止)" style="width: 200px;margin-right:15px;margin-top:15px;">
        </el-date-picker>

        <el-select v-model="ruleForm.statusCode" placeholder="账号状态" style="width: 200px;margin-right:15px;margin-top:15px;">
            <el-option label="失效" value="0">
            </el-option>
            <el-option label="有效" value="1">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium" style="margin-left:15px;margin-top:15px;">搜索</el-button>
        <el-button @click="resetForm" size="medium" style="margin-left:15px;margin-top:15px;">重置</el-button></br>
        <div style="display: inline-block;height:30px;padding-top:15px;">
            <span style="float:left;font-size:18px;line-height:30px;color:#000;text-align:left">当前会籍:{{this.membershipName}}</span>
        </div>
        <el-button class="filter-item" style="float:right;margin-left:15px;margin-top:15px;margin-bottom:15px;" @click="batchSet" type="primary" icon="edit" size="medium">延续有效期</el-button>
        <el-button class="filter-item" style="float:right;margin-left:15px;margin-top:15px;margin-bottom:15px;" @click="invalidBatchSet" type="primary" icon="edit" size="medium">设为失效</el-button>
    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column
        type="selection"
        width="50"
        align="center">
        </el-table-column>

        <el-table-column align="center" label="姓名" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="邮箱" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.mail}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="手机号码" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.mobile}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="性别" min-width="50">
            <template slot-scope="scope">
                <span v-if="scope.row.sex==0">女</span>
                <span v-else-if="scope.row.sex==1">男</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="生日" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.birthday!=''&&scope.row.birthday!=null">{{setTime(scope.row.birthday)}}</span>
            </template>
        </el-table-column>
        
        <el-table-column align="center" label="所属公司" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="会籍生效日期" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.startTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="会籍失效日期" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.endTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="会籍状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.statusCode==0">失效</span>
                <span v-else-if="scope.row.statusCode==1">有效</span>
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

    <el-dialog title="请设置新的会籍失效日期" :visible.sync="dialogFormVisible">
        <el-form ref="form" label-width="200px">
            <el-form-item label="选择日期">
                <!-- <el-date-picker
                v-model="startEndTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker> -->
                <el-date-picker
                    v-model="effectEndTime"
                    type="date"
                    placeholder="失效日期" style="width: 200px;">
                </el-date-picker>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveBatchSet">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findMembershipUserAll,stopUserMembership,findMembershipById,extendUserMembershipDate} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            ruleForm:{
                membershipId:'',
                name:'',
                mobile:'',
                sex:'',
                companyName:'',
                startTime:'',
                endTime:'',
                statusCode:'',
                pageNo:1,
                pageSize:10
            },
            passAll:'',
            effectEndTime:'',
            membershipName:'',
            dialogFormVisible:false,
        }
    },
    created() {
        this.findMembershipUserAll();
        this.findMembershipById();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){

                 let str = curVal.path;
                 str = str.substring(0,15)

                if(str == "/membershipUser"){
                    this.findMembershipUserAll();
                }else{
                    Object.assign(this.$data, this.$options.data());
                }

            },
        }
    },
    methods: {
        //获取列表
        async findMembershipById() {
            try {
                let membershipId = this.$route.params.id;
                const res = await findMembershipById({membershipId:membershipId});

                if (res.data.code == 0) {
                    this.membershipName = res.data.data.membershipName;
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
        async findMembershipUserAll() {
            try {
                this.ruleForm.membershipId = this.$route.params.id;
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                if(this.ruleForm.startTime){obj.startTime=this.setTime(this.ruleForm.startTime.getTime());}
                if(this.ruleForm.endTime){obj.endTime=this.setTime(this.ruleForm.endTime.getTime());}
                this.listLoading = false;
                const res = await findMembershipUserAll(obj);

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
            this.findMembershipUserAll()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findMembershipUserAll()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                membershipId:'',
                name:'',
                mobile:'',
                sex:'',
                companyName:'',
                startTime:'',
                endTime:'',
                statusCode:'',
                pageNo:1,
                pageSize:10
            };
            this.findMembershipUserAll();
        },
        //搜索
        handleFilter(){
            this.findMembershipUserAll();
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

        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.id);
            })
            this.passAll = arr;
        },

        //设置为失效
        invalidBatchSet(){
            if(this.passAll.length == 0){
                this.$message({
                    type: 'error',
                    message: '请选择会员'
                });
                return;
            }

            for (var i=0;i<this.passAll.length;i++) {
                for(var j=0;j<this.dataSource.length;j++){  
                    if(this.dataSource[j].id==this.passAll[i]){
                        var status=this.dataSource[j].statusCode;
                        if (status==0) {
                            this.$message({
                                type: 'error',
                                message: '选中项不可包含处于无效状态的会员，请重新选择'
                            });
                            return;
                        }
                    }
                }  
            }  
            this.$confirm('该操作会将'+this.passAll.length+'位会员设置为失效状态，确认操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
                }).then(() => {
                    this.setInvalid()
                }).catch(() => {
            })
        },
        async setInvalid() {
            try {
                this.batchData=[];
                const obj = new Object();
                // obj.type="0";
                for (var i=0;i<this.passAll.length;i++) {
                    for(var j=0;j<this.dataSource.length;j++){  
                        if(this.dataSource[j].id==this.passAll[i]){
                            this.batchData.push(this.dataSource[j].id);
                        }
                    }  
                }
                obj.membershipUserId = JSON.stringify(this.batchData);
                const res = await stopUserMembership(obj);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.data
                    });
                    this.findMembershipUserAll();

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

        //设置为有效
        batchSet(){
            if(this.passAll.length == 0){
                this.$message({
                    type: 'error',
                    message: '请选择会员'
                });
                return;
            }

            for (var i=0;i<this.passAll.length;i++) {
                for(var j=0;j<this.dataSource.length;j++){  
                    if(this.dataSource[j].id==this.passAll[i]){
                        var status=this.dataSource[j].statusCode;
                        var time2=this.dataSource[j].endTime;
                        // if (status==1) {
                        //     this.$message({
                        //         type: 'error',
                        //         message: '选中项不可包含处于有效期的会员，请重新选择'
                        //     });
                        //     return;
                        // }
                    }
                }  
            }  
            
            if (this.passAll.length == 1) {
                this.effectEndTime=time2;
            }
            this.dialogFormVisible = true;

        },
        saveBatchSet(){
            if(this.effectEndTime.length == 0){
                this.$message({
                    type: 'error',
                    message: '请输入有效期起止时间'
                });
                return;
            }
            this.$confirm('该操作会将'+this.passAll.length+'位会员的有效期延长，确认操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
                }).then(() => {
                    this.extendUserMembershipDate()
                }).catch(() => {
            })
        },
        async extendUserMembershipDate() {
            try {
                this.batchData=[];
                const obj = new Object();
                if(this.effectEndTime!=''&&this.effectEndTime){
                    var endTime = this.setTimestamp(this.effectEndTime);
                }
                for (var i=0;i<this.passAll.length;i++) {
                    for(var j=0;j<this.dataSource.length;j++){  
                        if(this.dataSource[j].id==this.passAll[i]){
                            this.batchData.push(this.dataSource[j].id);
                        }
                    }  
                }
                obj.membershipUserId = JSON.stringify(this.batchData);
                obj.endTime=this.setTime(this.effectEndTime.getTime());
                const res = await extendUserMembershipDate(obj);
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.data
                    });
                    this.dialogFormVisible = false;
                    this.findMembershipUserAll();

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


