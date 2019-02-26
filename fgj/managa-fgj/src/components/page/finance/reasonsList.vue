<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.type" placeholder="类别" style="width: 200px;margin-right:15px;">
            <el-option label="账户充值" value="0">
            </el-option>
            <el-option label="企业账户调整收入" :value="1">
            </el-option>
            <el-option label="企业账户调整支出" :value="11">
            </el-option>
            <el-option label="积分充值" value="7">
            </el-option>
            <el-option label="点赞积分充值" value="8">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.disabled" placeholder="有效状态" style="width: 200px;margin-right:15px;">
            <el-option label="有效" value="0">
            </el-option>
            <el-option label="失效" value="1">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="addReasons" size="medium" type="primary" icon="edit">新增</el-button>
    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="原因" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="流水类型" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.typeName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="50">
            <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="有效状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.disabled==0">有效</span>
                <span v-else-if="scope.row.disabled==1">失效</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editReasons(scope.row.id)">编辑</el-button>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="120px">
            <el-form-item label="原因">
                <el-input v-model="reasonsObj.reason" placeholder="请输入原因（20字以内）"></el-input>
            </el-form-item>

            <el-form-item label="类别">
                <el-select v-model="reasonsObj.type" placeholder="类别">
                    <el-option label="账户充值" :value="0">
                    </el-option>
                    <el-option label="企业账户调整收入" :value="1">
                    </el-option>
                    <el-option label="企业账户调整支出" :value="11">
                    </el-option>
                    <el-option label="积分充值" :value="7">
                    </el-option>
                    <el-option label="点赞积分充值" :value="8">
                    </el-option>
                </el-select>
             </el-form-item>

            <el-form-item label="所属公司">
                <el-select v-model="reasonsObj.companyIds" collapse-tags multiple :disabled="allStatus">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="allStatus">所有用户可见</el-checkbox>
            </el-form-item>

            <el-form-item label="有效状态">
                <el-radio-group v-model="reasonsObj.disabled">
                    <el-radio :label="0">有效</el-radio>
                    <el-radio :label="1">失效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveReason">确 定</el-button>
        </div>

    </el-dialog>

  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {reasons,findCompanyIdOrName,saveReason,reasonDetail} from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            dialogTitle:'新增原因',
            ruleForm:{
                type:'',
                companyId:'',
                disabled:'',
                pageNo:1,
                pageSize:10
            },
            reasonsObj:{
                id:'',
                reason:'',
                type:'',
                companyIds:[],
                disabled:'',
            },
            companyList:[],
            allStatus:false
        }
    },
    created() {
        this.reasons();
        this.findCompanyIdOrName();
    },

    methods: {
        //获取列表
        async reasons() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await reasons(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.reasonPage.totalSize;
                    this.dataSource = res.data.data.reasonPage.list;
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
        //查询所有公司
        async findCompanyIdOrName(){
            try {

                const res = await findCompanyIdOrName();

                if (res.data.code == 0) {
                    this.companyList = res.data.data;
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


        //公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.exampleForm.companyList = arr;
        },

        //新增
        addReasons(){
            this.reasonsObj = {
                id:'',
                reason:'',
                type:'',
                companyIds:[],
                disabled:'',
            };
            this.dialogTitle = "新增原因";
            this.dialogFormVisible = true;
        },
        //编辑
        async editReasons(id){
             try {

                const res = await reasonDetail({reasonId:id});

                if (res.data.code == 0) {
                    this.reasonsObj = {
                        id:id,
                        reason:res.data.data.reason.name,
                        type:res.data.data.reason.type,
                        companyIds:res.data.data.reason.companyIds,
                        disabled:res.data.data.reason.disabled,
                    };
                    if(res.data.data.reason.companyIds[0]==-1){
                        this.reasonsObj.companyIds = [];
                        this.allStatus = true;
                    }else{
                        this.allStatus = false;
                    }
                    this.dialogTitle = "编辑原因";
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
        //保存
        async saveReason(){
             try {
                let obj = JSON.parse(JSON.stringify(this.reasonsObj));
                if(this.allStatus){
                    obj.companyIds = "[-1]";
                }else{
                    obj.companyIds = JSON.stringify(this.reasonsObj.companyIds);
                }

                const res = await saveReason(obj);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.dialogFormVisible = false;
                    this.reasons();
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
            this.reasons()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.reasons()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                type:'',
                companyId:'',
                disabled:'',
                pageNo:1,
                pageSize:10
            }
            this.reasons();
        },
        //搜索
        handleFilter(){
            this.reasons();
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


