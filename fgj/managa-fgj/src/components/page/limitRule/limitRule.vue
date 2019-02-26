<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="限购规则名称" v-model="ruleForm.name">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="限购规则编号" v-model="ruleForm.serialNumber">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="ruleForm.standardUnitSerialNumber">
        </el-input>

        <el-select v-model="ruleForm.isStart" placeholder="状态" style="width: 200px;margin-right:15px;">
            <el-option label="启用中" value="1">
            </el-option>
            <el-option label="已停用" value="0">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>


            <router-link to="/addLimitRule" style="color:#fff;"><el-button class="filter-item" style="float:right" type="primary" icon="edit" size="medium">添加</el-button></router-link>

     </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border height="660" fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="限购规则名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <!--<el-table-column align="center" label="限购类型" min-width="150">-->
            <!--<template slot-scope="scope">-->
                <!--<span v-if="scope.row.type==1">个人</span>-->
                <!--<span v-else-if="scope.row.type==2">企业</span>-->
            <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column align="center" label="限购规则编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.serialNumber}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品/商品组合名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.suName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品限售总量（单期）" min-width="80">
            <template slot-scope="scope">
                <!--<span v-if="scope.row.limitType==1">按购买商品总量限购</span>
                <span v-else-if="scope.row.limitType==2">按购买商品总金额限购</span>-->
                <span>不限量</span>
            </template>
        </el-table-column>

        <!--<el-table-column align="center" label="商品编号" min-width="80">-->
            <!--<template slot-scope="scope">-->
                <!--<span>{{scope.row.standardUnitSerialNumber}}</span>-->
            <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column align="center" label="所属企业" min-width="80">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="companyListids(scope.row.companyIds)">查看</el-button>
            </template>
        </el-table-column>

        <el-table-column align="center" label="限购方式" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.limitType==1">按购买商品总量限购</span>
                <span v-else-if="scope.row.limitType==2">按购买商品总金额限购</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="限购时间" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.limitTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="已购买数量/金额" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.buySum}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="冻结数量/金额" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.frozenSum}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="剩余可购买数量/金额" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.remainSum}}</span>
            </template>
        </el-table-column>

        <!--<el-table-column align="center" label="可购买总金额" min-width="80">-->
            <!--<template slot-scope="scope">-->
                <!--<span>{{scope.row.userMoneySum}}</span>-->
            <!--</template>-->
        <!--</el-table-column>-->



        <!--<el-table-column align="center" label="已购买数量/金额" min-width="80">-->
            <!--<template slot-scope="scope">-->
                <!--<span>{{scope.row.buySum}}</span>-->
            <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.createUsername}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="修改时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.updateTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="修改人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.updateUsername}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isStart==0">停用</span>
                <span v-else-if="scope.row.isStart==1">启用</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150"  fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" @click="eidtLimitRule(scope.row.id)" size="small" plain :disabled="scope.row.record==1">编辑</el-button>
                <el-button type="success" @click="checkStatus(scope.row.id,1)" v-if="scope.row.isStart==0" size="small" plain>启用</el-button>
                <el-button type="danger" @click="checkStatus(scope.row.id,0)" v-else-if="scope.row.isStart==1" size="small" plain>停用</el-button>
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


    <el-dialog title="关联企业" :visible.sync="dialogFormVisible">
        <div style="height:500px;overflow:auto;">
            <el-table :data="companyData" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="企业/企业分组名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.companyName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        <span>{{setTime(scope.row.createTime)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="企业类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.companyType==0">正式公司</span>
                        <span v-if="scope.row.companyType==1">演示公司</span>
                        <span v-if="scope.row.companyType==2">竞品公司</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="备注">
                    <template slot-scope="scope">
                        <span>{{scope.row.companyContent}}</span>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page.sync="companyForm.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="companyForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count2">
                </el-pagination>
            </div>
        </div>
    </el-dialog>

  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findLimitRuleOfPage,findCompanyOfPage,isLimitRuleStartWithTx} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            form:{

            },
            ruleForm:{
                name:'',
                serialNumber:'',
                standardUnitSerialNumber:'',
                isStart:'',
                pageNo:1,
                pageSize:10
            },
            count2: null,
            companyData:[],
            companyForm:{
                companyIds:'',
                pageNo:1,
                pageSize:10
            }
        }
    },
    created() {
        this.findLimitRuleOfPage();
    },

    methods: {
        //获取列表
        async findLimitRuleOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findLimitRuleOfPage(obj);

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

        checkStatus(id,status){
            if(status==0){
                this.$confirm('此操作将会使限购规则失效，确定操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                    }).then(() => {
                        this.isLimitRuleStartWithTx(id,status)
                    }).catch(() => {
                })
            }else{
                this.$confirm('此操作将会启用该限购规则，确定操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                    }).then(() => {
                        this.isLimitRuleStartWithTx(id,status)
                    }).catch(() => {
                })
            }
        },


        //修改状态
        async isLimitRuleStartWithTx(id,status) {
            try {
                const res = await isLimitRuleStartWithTx({limitRuleId:id,isStart:status});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '改变状态成功'
                    });
                    this.findLimitRuleOfPage();
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
            this.findLimitRuleOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findLimitRuleOfPage()
        },

        searchForm(){
            this.ruleForm.pageNo = 1;
            this.findLimitRuleOfPage();
        },

        //编辑
        eidtLimitRule(id){
            this.$router.push('/editLimitRule/'+id);
        },
        //重置
        resetForm(){
            this.ruleForm={
                name:'',
                serialNumber:'',
                standardUnitSerialNumber:'',
                isStart:'',
                pageNo:1,
                pageSize:10
            };

            this.findLimitRuleOfPage()
        },

        companyListids(ids){
            this.companyForm.pageNo = 1;
            this.companyForm.companyIds = JSON.stringify(ids);
            this.findCompanyOfPage();
        },
         //优惠卷的所属公司列表
        async findCompanyOfPage(){
            try {
                const res = await findCompanyOfPage(this.companyForm);
                if (res.data.code == 0) {
                    this.count2 = res.data.data.totalSize;
                    this.dialogFormVisible = true;
                    this.companyData = res.data.data.list;
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
        handleSizeChange2(val) {
            this.companyForm.pageSize = val;
            this.findCompanyOfPage()
        },
        handleCurrentChange2(val) {
            this.companyForm.pageNo = val;
            this.offset2 = (val - 1) * this.companyForm.pageSize;
            this.findCompanyOfPage()
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


