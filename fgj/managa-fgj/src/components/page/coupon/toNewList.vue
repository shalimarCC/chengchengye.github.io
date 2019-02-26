<template>
    <div id="example">
        <!-- 搜索 -->
        <div class="search-col">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="活动标题" v-model="ruleForm.exchangeName">
            </el-input>
            <el-select v-model="ruleForm.status" placeholder="活动状态" style="width: 200px;margin-right:15px;">
                <el-option label="启用" value="1">
                </el-option>
                <el-option label="停用" value="0">
                </el-option>
            </el-select>
            <el-button class="btn-search" type="primary" icon="search" @click="searchForm">搜索</el-button>
            <el-button class="btn-search" @click="resetForm('ruleForm')">重置</el-button>
            <div class="btn-addCol">
                <router-link to="/addToNewAct">
                    <el-button class="btn-add" type="primary" icon="add" size="medium">
                        添加
                    </el-button>
                </router-link>
                <el-button type="primary" icon="update" size="medium" @click="changeActRules">
                    更新活动规则
                </el-button>
            </div>
        </div>
        <!-- 列表 -->
        <el-table :data="dataSource"  border fit height="680" highlight-current-row style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column align="center" label="活动ID" prop="id" sortable min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动排序" sortable min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.sort}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动标题" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.exchangeName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="查看旧批次" min-width="120">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" plain @click="handleForOldList(scope.row.id)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="查看新批次" min-width="120">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" plain @click="handleForNewList(scope.row.id)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.createTimeStr}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动截止日期（23:59:59）" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.endTimeStr}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动状态" min-width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">停用</span>
                    <span v-if="scope.row.status == 1">启用</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="允许兑换的Unit状态" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.unitStatus.toString()}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="已兑换次数" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.num}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="160">
                <template slot-scope="scope">
                    <el-button v-show="scope.row.status == 0" size="mini" @click="setStatus(scope.row.id,1)">
                        <span>启用</span>
                    </el-button>
                    <el-button v-show="scope.row.status == 1" size="mini" @click="setStatus(scope.row.id,0)">
                        <span>停用</span>
                    </el-button>
                    <el-button size="mini" @click="editAct(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
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
        <!-- 查看新批次 -->
        <el-dialog class="forListOut" title="查看新批次列表" :visible.sync="dialogVisible1" width="60%" center>
            <el-table :data="tableForDate" height="500" border highlight-current-row style="width: 100%">
                <el-table-column align="center" label="排序" width="50">
                    <template slot-scope="scope">
                        <span>{{scope.row.sort}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="加价要求" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.addPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="优惠券批次" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.couponBatchCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="批次名称" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.couponBatchName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="优惠券组/标题" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="领取类型" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.getType==0">手动扫码</span>
                        <span v-if="scope.row.getType==1">注册领取</span>
                        <span v-if="scope.row.getType==2">unit领取</span>
                        <span v-if="scope.row.getType==3">以旧换新</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="优惠券类型" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.couponType==0">满减券</span>
                        <span v-if="scope.row.couponType==1">兑换券</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="优惠内容" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.detail}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否前端显示" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isDisplay==0">否</span>
                        <span v-if="scope.row.isDisplay==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="可领取日期" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.receiveTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="有效周期" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.effectDays}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="有效日期" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.effectTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否可再次领用" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isRepeat==0">否</span>
                        <span v-if="scope.row.isRepeat==1">是</span>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 查看旧批次 -->
        <el-dialog class="forListOut" title="查看旧批次列表" :visible.sync="dialogVisible2" width="60%" center>
            <el-table :data="tableForDate" height="500" border highlight-current-row style="width: 100%">
                <el-table-column align="center" label="优惠券批次" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.couponBatchCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="批次名称" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.couponBatchName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="优惠券组/标题" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="领取类型" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.getType==0">手动扫码</span>
                        <span v-if="scope.row.getType==1">注册领取</span>
                        <span v-if="scope.row.getType==2">unit领取</span>
                        <span v-if="scope.row.getType==3">以旧换新</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="优惠券类型" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.couponType==0">满减券</span>
                        <span v-if="scope.row.couponType==1">兑换券</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="优惠内容" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.detail}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否前端显示" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isDisplay==0">否</span>
                        <span v-if="scope.row.isDisplay==1">是</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="可领取日期" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.receiveTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="有效周期" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.effectDays}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="有效日期" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.effectTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否可再次领用" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isRepeat==0">否</span>
                        <span v-if="scope.row.isRepeat==1">是</span>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑活动规则 -->
        <el-dialog class="forListOut" title="编辑活动规则" :visible.sync="dialogVisible3" width="700" center>
            <el-input type="textarea" v-model="activeRule" :rows="10" maxlength="2000" placeholder="仅支持文本编辑，不超过2000字">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取消</el-button>
                <el-button type="primary" @click="comfirmActRule">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env';
import {findExchangeOfPage,searchExchangeOfPage,findExchangeBatchOfPage,updateRuleDescriptionByIdWithTx,findRuleDescription,updateExchangeActivityStatus} from '../../../api/getData';
export default{
    data(){
        return{
            ruleForm:{
                exchangeName:'',
                status:'',
                pageNo:1,
                pageSize:10
            },
            pageNo:1,
            pageSize:10,
            count: null,
            dataSource:[],
            // listLoading: false,
            tableForDate:[],//查看数据
            tableKey: 0,
            dialogVisible1:false,//新批次列表弹框
            dialogVisible2:false,//旧批次列表弹框
            dialogVisible3:false,  //编辑活动规则弹框
            listUnitStatus:[],
            activeRule:''
        }
    },
    created() {
        this.findExchangeOfPage();
    },
    methods:{
        //搜索
        searchForm(){
            this.searchExchangeOfPage();
        },
        //重置
        resetForm(obj){
            this.ruleForm={
                exchangeName:'',
                status:'',
                pageNo:1,
                pageSize:10
            },
            this.searchExchangeOfPage();
        },
        //分页
        handleSizeChange(val) {
            this.listUnitStatus=[];
            this.ruleForm.pageSize = val;
            this.findExchangeOfPage();
            this.searchExchangeOfPage();
        },
        handleCurrentChange(val) {
            this.listUnitStatus=[];
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findExchangeOfPage();
            this.searchExchangeOfPage();
        },
        //获取以旧换新列表
        async findExchangeOfPage() {
            try {
                const res = await findExchangeOfPage({page:this.ruleForm.pageNo,pageSize:this.ruleForm.pageSize});
                if (res.data.code == 0) {
                    let that = this;
                    that.count = res.data.data.totalSize;
                    that.dataSource = res.data.data.list;
                    $.each(that.dataSource, function (key, info) {
                        console.log(info.unitStatus);//[2,1]
                        that.listUnitStatus=[];
                        if(info.unitStatus){
                            for(var i=0;i<info.unitStatus.length;i++){
                                if(info.unitStatus[i]==0){
                                    that.listUnitStatus.push("未使用");
                                }else if(info.unitStatus[i]==1){
                                    that.listUnitStatus.push("已使用");
                                }else if(info.unitStatus[i]==2){
                                    that.listUnitStatus.push("已冻结");
                                }else if(info.unitStatus[i]==3){
                                    that.listUnitStatus.push("已过期");
                                }else if(info.unitStatus[i]==4){
                                    that.listUnitStatus.push("已失效");
                                }else{
                                    that.listUnitStatus.push("已兑换");
                                }
                            }
                        }
                        info.unitStatus = that.listUnitStatus;
                        console.log(that.listUnitStatus);
                    })
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
        //模糊查询以旧换新列表
        async searchExchangeOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                const res = await searchExchangeOfPage(obj);
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
        //查看新、旧批次列表
        async findExchangeBatchOfPage(type,id) {
            try {
                const res = await findExchangeBatchOfPage({type:type,exchangeId:id});
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.tableForDate = res.data.data.list;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取查看新旧批次数据失败,请联系管理员！404'
                });
            }
        },
        //查看新、旧
        handleForNewList(id){
            this.findExchangeBatchOfPage(1,id);
            this.dialogVisible1 = true;
        },
        handleForOldList(id){
            this.findExchangeBatchOfPage(0,id);
            this.dialogVisible2 = true;
        },
        //更新活动规则接口
        async updateRuleDescriptionByIdWithTx() {
            try {
                const res = await updateRuleDescriptionByIdWithTx({description:this.activeRule});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '更新成功'
                    });
                    this.dialogVisible3 = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取查看新旧批次数据失败,请联系管理员！404'
                });
            }
        },
        //查询活动规则
        async findRuleDescription() {
            try {
                const res = await findRuleDescription();
                if (res.data.code == 0) {
                    this.activeRule = res.data.data.description;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取查看新旧批次数据失败,请联系管理员！404'
                });
            }
        },
        //更新活动规则
        comfirmActRule(){
            this.updateRuleDescriptionByIdWithTx();
        },
        changeActRules(){
            this.dialogVisible3 = true;
            this.findRuleDescription();
        },
        //启用停用设置
        async updateExchangeActivityStatus(id,status) {
            try {
                const res = await updateExchangeActivityStatus({exchangeId:id,status:status});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                    this.findExchangeOfPage();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取查看新旧批次数据失败,请联系管理员！404'
                });
            }
        },
        setStatus(id,status){
           this.updateExchangeActivityStatus(id,status);
        },
        //编辑
        editAct(id){
           this.$router.push( {path:'/editToNewAct/'+id} )
        }
    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
.search-col{
    margin-bottom: 20px;
}
.filter-item{
    width: 200px;
    margin-right:15px;
}
.btn-search{
    width:100px;
}
.btn-addCol{
    overflow:hidden;
    text-align: right;
    padding-top: 10px;
}
.btn-add{
    width:110px;
    text-align: center;
    margin-right:10px;
}
.forListOut >>> .el-dialog__title{
    display: inline-block;
    width: 100%;
    line-height: 24px;
    font-size: 18px;
    color: #303133;
    text-align: left;
}
</style>