<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:10px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="优惠券批次 " v-model="ruleForm.couponBatchCode">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="批次名称 " v-model="ruleForm.couponBatchName">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="用户账户 " v-model="ruleForm.mail">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="用户手机号 " v-model="ruleForm.mobile">
        </el-input>


     </div>
     <div style="margin-bottom:10px;">
        <el-select v-model="ruleForm.couponType" placeholder="优惠券类型" style="width: 200px;margin-right:15px;">
            <el-option label="满减券" value="0">
            </el-option>
            <el-option label="兑换券" value="1">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.couponUnitStatus" placeholder="优惠券状态" style="width: 200px;margin-right:15px;">
            <el-option label="可使用" value="0">
            </el-option>
            <el-option label="已使用" value="1">
            </el-option>
            <el-option label="已冻结" value="2">
            </el-option>
            <el-option label="已过期" value="3">
            </el-option>
            <el-option label="已失效" value="4">
            </el-option>
        </el-select>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="unit编号 " v-model="ruleForm.couponUnitCode">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="订单编号 " v-model="ruleForm.orderCode">
        </el-input>
     </div>
     <div style="margin-bottom:20px;">


        <el-date-picker
            v-model="ruleForm.effectStartTime"
            type="date"
            placeholder="有效期（起）" style="width: 200px;">
        </el-date-picker>--
        <el-date-picker
            v-model="ruleForm.effectEndTime"
            type="date"
            placeholder="有效期（止)" style="width: 200px;margin-right:15px;">
        </el-date-picker>

        <el-date-picker
            v-model="ruleForm.createTime"
            type="date"
            placeholder="创建时间" style="width: 200px;">
        </el-date-picker>



        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>

        <el-button class="filter-item" style="float:right" @click="batchSet" type="primary" icon="edit" size="medium">重置为有效</el-button>
     </div>

    <el-table :key='tableKey' ref="multipleTable" :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column
        type="selection"
        width="50"
        align="center">
        </el-table-column>

        <el-table-column align="center" label="unit编号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.couponUnitCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="优惠券编号" width="150">
            <template slot-scope="scope">
                <span>{{scope.row.couponCode}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="优惠券批次" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.couponBatchCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="批次名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.couponBatchName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="用户账户" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.mail}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="用户手机号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.mobile}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="优惠券标题" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类型" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.couponType==0">满减券</span>
                <span v-else-if="scope.row.couponType==1">兑换券</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="有效起始日期" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.effectStartTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="有效终止日期" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.effectEndTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="获取方式" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.grantType==0">系统发放</span>
                <span v-else-if="scope.row.grantType==1">用户领取</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="领取方式" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.getType==0">手动/扫码领取</span>
                <span v-else-if="scope.row.getType==1">注册领取</span>
                <span v-else-if="scope.row.getType==2">unit领取</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="领取时间" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.receivedTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="使用时间" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.usedTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="已使用次数" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.usedCount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单编号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.orderCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="状态" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.couponUnitStatus==0">未使用</span>
                <span v-else-if="scope.row.couponUnitStatus==1">已使用</span>
                <span v-else-if="scope.row.couponUnitStatus==2">已冻结</span>
                <span v-else-if="scope.row.couponUnitStatus==3">已过期</span>
                <span v-else-if="scope.row.couponUnitStatus==4">已失效</span>
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

    <el-dialog title="选择有效期" :visible.sync="dialogFormVisible">
        <el-form ref="form" label-width="200px">
            <el-form-item label="有效期">
                <el-date-picker
                v-model="startEndTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
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
import {findCouponUnitOfPage,resetCouponUnitWithTx} from '../../../api/getData';
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
                grantType:'',
                isDisplay:'',
                couponBatchCode:'',
                createTime:'',
                effectStartTime:'',
                effectEndTime:'',
                title:'',
                pageNo:1,
                pageSize:10
            },
            failReason:'',
            companyList:[],
            loading:false,
            passAll:[],
            startEndTime:[],

        }
    },
    created() {
        this.findCouponUnitOfPage();
    },

    methods: {
        //获取列表
        async findCouponUnitOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                if(obj.effectStartTime!=''&&obj.effectStartTime!=null){
                    obj.effectStartTime = this.setTimestamp(obj.effectStartTime);
                }
                if(obj.effectEndTime!=''&&obj.effectEndTime!=null){
                    obj.effectEndTime = this.setTimestamp(obj.effectEndTime);
                }
                if(obj.createTime!=''&&obj.createTime!=null){
                    obj.createTime = this.setTimestamp(obj.createTime);
                }

                this.listLoading = false;
                const res = await findCouponUnitOfPage(obj);

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
            this.findCouponUnitOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCouponUnitOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                groupName:'',
                pageNo:1,
                pageSize:10
            };

            this.findCouponUnitOfPage()
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findCouponUnitOfPage()
        },

        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.id);
            })
            this.passAll = arr;
        },

        //设置为有效
        batchSet(){
            if(this.passAll.length == 0){
                this.$message({
                    type: 'error',
                    message: '请选择优惠券unit'
                });
                return;
            }
            this.startEndTime = [];
            this.dialogFormVisible = true;

        },
        saveBatchSet(){
            if(this.startEndTime.length == 0){
                this.$message({
                    type: 'error',
                    message: '请输入有效期起止时间'
                });
                return;
            }
            this.$confirm('该操作会将'+this.passAll.length+'张优惠券重置为有效，确认操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
                }).then(() => {
                    this.resetCouponUnitWithTx()
                }).catch(() => {
            })
        },

        async resetCouponUnitWithTx() {
            try {
                const obj = new Object();
                obj.couponUnitList = JSON.stringify(this.passAll);
                if(this.startEndTime[0]!=''&&this.startEndTime[0]!=null){
                    obj.effectStartTime = this.setTimestamp(this.startEndTime[0]);
                }
                if(this.startEndTime[1]!=''&&this.startEndTime[1]){
                    obj.effectEndTime = this.setTimestamp(this.startEndTime[1]);
                }
                const res = await resetCouponUnitWithTx(obj);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.data
                    });
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


