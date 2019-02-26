<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="优惠券编号" v-model="ruleForm.couponCode">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="优惠券标题" v-model="ruleForm.title">
        </el-input>

        <el-select
            v-model="ruleForm.goodsId"
            filterable
            remote
            reserve-keyword
            placeholder="选择商品分组"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
            v-for="item in goodsCombinationList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>


     </div>

    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.couponType" placeholder="优惠券类型" style="width: 200px;margin-right:15px;">
            <el-option label="满减券" value="0">
            </el-option>
            <el-option label="兑换券" value="1">
            </el-option>
        </el-select>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="总店码" v-model="ruleForm.storeNumber">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="包含门店" v-model="ruleForm.name">
        </el-input>

        <el-checkbox v-model="ruleForm.isDelete" true-label="1" false-label="0">是否显示删除项</el-checkbox>

        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <router-link to="/addDiscount" style="float:right">
            <el-button class="filter-item" type="primary" icon="edit" size="medium">
                添加
            </el-button>
        </router-link>
     </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit height="680" highlight-current-row style="width: 100%">

        <el-table-column align="center" label="优惠券编号" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.couponCode}}</span>
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

        <el-table-column align="center" label="优惠金额" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.discountAmount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="触发金额" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.triggerAmount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属企业" min-width="80">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="findCouponCompanyOfPage(scope.row.id)">查看</el-button>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属门店" min-width="80">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="findCouponStore(scope.row.id)">查看</el-button>
            </template>
        </el-table-column>

        <el-table-column align="center" label="可使用次数" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.usageCount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="去使用跳转" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.jumpType==1">单个SU</span>
                <span v-else-if="scope.row.jumpType==2">SU组</span>
                <span v-else-if="scope.row.jumpType==3">内部链接</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="修改时间" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.updateTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="修改人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.updateUser}}</span>
            </template>
        </el-table-column>



        <el-table-column align="center" label="操作" width="300"  fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" @click="seeDiscount(scope.row.id)" size="small" plain>查看</el-button>
                <el-button type="primary" @click="editDiscount(scope.row.id)" :disabled="scope.row.isEdit==0" size="small" plain>编辑</el-button>
                <el-button type="primary" @click="grantDiscount(scope.row.id)" size="small" plain>发放</el-button>
                <el-button type="primary" @click="deleteCouponWithTx(scope.row.id)" size="small" plain>删除</el-button>
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


    <el-dialog title="关联企业" :visible.sync="dialogFormVisible2">
        <div style="height:500px;overflow:auto;">
            <el-table :data="companyData" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="企业/企业分组名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.companyName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="公司类型">
                    <template slot-scope="scope">
                        <span>730新需求</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="备注">
                    <template slot-scope="scope">
                        <span>{{scope.row.companyContent}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>

    <el-dialog title="所属门店" :visible.sync="dialogFormVisible3" size="tiny">
        <h6>当前已选择门店{{checkStoreList.length}}家</h6>
        <div style="margin:15px 0;">
            <el-input placeholder="请输入关键字" v-model="storeForm.name">
                <el-button slot="append" icon="el-icon-search" @click="findCouponStore"></el-button>
            </el-input>
        </div>
        <el-table :key='tableKey2' :data="checkStoreList" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="门店" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>

        </el-table>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible3 = false">关 闭</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import {findCouponOfPage,findStandardUnitCombinationAllByBlurry,findCouponGoodsAll,findCouponCompanyOfPage,deleteCouponWithTx,
findCouponStore} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            tableKey2:0,
            listLoading: true,
            dialogFormVisible:false,
            dialogFormVisible2:false,
            form:{

            },
            ruleForm:{
                storeNumber:'',
                couponCode:'',
                title:'',
                couponType:'',
                goodsId:'',
                name:'',
                isDelete:0,
                pageNo:1,
                pageSize:10
            },
            failReason:'',
            companyList:[],
            loading:false,
            goodsCombinationList:[],
            goodsData:[],
            companyData:[],
            companyForm:{
                id:'',
                type:0,
                pageNo:1,
                pageSize:10
            },
            count2: null,
            offset2: 0,
            storeForm:{
                couponId:'',
                name:''
            },
            count3: null,
            dialogFormVisible3:false,
            checkStoreList:[]
        }
    },
    created() {
        this.findCouponOfPage();
    },

    methods: {
        //查询已选择门店接口
        findCouponStore(id){
            this.storeForm.couponId = id;
            this.findCouponStoreajax();
        },
        async findCouponStoreajax () {
            try {
                const obj = new Object();
                $.each(this.storeForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                const res = await findCouponStore(obj);
                if (res.data.code == 0) {
                    this.checkStoreList = res.data.data;
                    this.dialogFormVisible3 = true;
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
        async findCouponOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findCouponOfPage(obj);

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
        //编辑优惠券
        editDiscount(id){
            this.$router.push('/editDiscount/'+id);
        },
        //发放优惠券
        grantDiscount(id){
            this.$router.push('/grantDiscount/'+id+'/'+1);
        },
        //查看优惠券
        seeDiscount(id){
            this.$router.push('/seeDiscount/'+id);
        },
        //删除优惠券
        deleteCouponWithTx(id){
            this.$confirm('此操作将会删除优惠券，确定操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
                }).then(() => {
                    this.deleteCouponWithTxAjax(id)
                }).catch(() => {
            })
        },
        async deleteCouponWithTxAjax (id) {
            try {
                const res = await deleteCouponWithTx({id:id});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.findCouponOfPage();
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
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                this.findStandardUnitCombinationAllByBlurry(query);
            } else {
                this.loading = false;
                this.goodsList = [];
            }
        },
        //查询所有su信息接口
        async findStandardUnitCombinationAllByBlurry (name) {
            try {
                const res = await findStandardUnitCombinationAllByBlurry({combinationName:name});
                if (res.data.code == 0) {
                    this.loading = false;
                    this.goodsCombinationList = res.data.data;
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
            this.findCouponOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCouponOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                storeNumber:'',
                couponCode:'',
                title:'',
                couponType:'',
                goodsId:'',
                ruleForm:'',
                isDelete:0,
                pageNo:1,
                pageSize:10
            };

            this.findCouponOfPage()
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findCouponOfPage()
        },

        //查询关联商品
        async findCouponGoodsAll(id){
            try {
                const res = await findCouponGoodsAll({id:id});
                if (res.data.code == 0) {
                    this.dialogFormVisible = true;
                    this.goodsData = res.data.data;
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

        //优惠卷的所属公司列表
        async findCouponCompanyOfPage(id){
            try {
                this.companyForm.id = id;
                this.companyForm.type = 0;
                const res = await findCouponCompanyOfPage(this.companyForm);
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.dialogFormVisible2 = true;
                    this.companyData = res.data.data;
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
            this.findCouponCompanyOfPage()
        },
        handleCurrentChange2(val) {
            this.companyForm.pageNo = val;
            this.offset2 = (val - 1) * this.companyForm.pageSize;
            this.findCouponCompanyOfPage()
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


