<template>
    <div class="editCombination">
        <el-form class="formList" label-width="120px">
            <el-form-item label="关联组名">
                {{prName}}
            </el-form-item>
            <el-form-item label="选择关联商品">
                当前已选择{{num}}项
            </el-form-item>
        </el-form>
         <!-- 列表展示 -->
        <el-checkbox-group v-model="suIds">
            <el-table :key='tableKey' :data="tableForNewDate" v-loading.fullscreen.lock="fullscreenLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="选择" width="60">
                    <template slot-scope="scope">
                        <el-checkbox :label="scope.row.suId" :checked="scope.row.checked"  @change="getCheckId(scope.row.suId,scope.row.productSerialNumber,scope.row.checked)">{{scope.row.a}}</el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属关联组名" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品编号" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.productSerialNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品销售名" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.productSaleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="购买方式" min-width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.buyType == 1">支持积分+现金购买</span>
                        <span v-if="scope.row.buyType == 2">仅支持现金支付</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="销售方式" min-width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.saleWay == 1">正常销售</span>
                        <span v-if="scope.row.saleWay == 2">正常销售</span>
                        <span v-if="scope.row.saleWay == 3">正常销售</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运营方" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.merchantName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属客户端" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.clientNames}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属总店" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.storeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="福利企业" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.companys}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="上架状态" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">待上架</span>
                        <span v-if="scope.row.status == 2">审核中</span>
                        <span v-if="scope.row.status == 3">已上架</span>
                        <span v-if="scope.row.status == 4">已下架</span>
                        <span v-if="scope.row.status == 5">审核未通过</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="显示状态" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isVisible == 0">是</span>
                        <span v-if="scope.row.isVisible == 1">否</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-checkbox-group>
        <!-- 分页 -->
        <div class="pagination-container" style="text-align: left;margin-top: 10px;">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="ruleForm.pageNo"
            :page-sizes="[5,10,20,30, 50]"
            :page-size="ruleForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
            </el-pagination>
        </div>
        <!-- 弹框提示 -->
        <el-dialog :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" width="40%">
            <p v-if="check == false">
                将要把编号为{{sucode}}的商品与现有组内其他商品同步在线库存和冻结订单记录，请再次确认是否操作？
            </p>
            <p v-if="check == true">
                将要把编号为{{sucode}}的商品与现有组内其他商品取消在线库存关联，请再次确认是否操作？
            </p>
            <div class="editBtn">
                <el-button v-if="check == false" @click="defaultCh">取 消</el-button>
                <el-button v-if="check == true" @click="defaultChFa">取 消</el-button>
                <el-button v-if="check == false" type="primary" @click="suComComfirm"  v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
                <el-button v-if="check == true" type="primary" @click="suComCancel"  v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 保存 -->
        <div class="tempBtns">
            <el-button size="medium" style="margin: 12px;" @click='saveCom'>确认</el-button>
        </div>
    </div>
</template>

<script>
import Cookie from '../../../config/mUtils'
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import { baseUrl } from '../../../config/env';
import {findSuListOfPageByMerchantId,confirmContact,cancelContact,cancelSuContact,releaseDistributedLock} from '../../../api/getData';
export default {
    data(){
        return{
            getRowKeys2(row) {
                return row.id;
            },
            prName:'',
            combinationName:'',
            suIds:[],
            num:0,
            tableForNewDate:[],
            ruleForm:{
                pageNo:1,
                pageSize:10
            },
            count:null,
            tableKey: 0,
            listLoading: true,
            dialogVisible:false,
            check:false,
            sucode:'',
            ids:'',
            fullscreenLoading:false,
            merchantId:'',
            relatedId:''
        }
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,16)
                if(str == "/editCombination"){
                    this.merchantId = this.$route.params.mid;
                    this.relatedId = this.$route.params.id;
                    this.num = 0;
                    this.findSuListOfPageByMerchantId();
                }

            },
        }
    },
    created() {
        this.merchantId = this.$route.params.mid;
        this.relatedId = this.$route.params.id;
        this.findSuListOfPageByMerchantId();
    },
    methods: {
        getCheckId(id,code,check){
            this.check = check;
            this.ids = id;
            this.sucode = code;
            this.dialogVisible = true;
        },
        //获取列表
        async findSuListOfPageByMerchantId() {
            try {
                this.listLoading = false;
                const res = await findSuListOfPageByMerchantId({merchantId:this.merchantId,id:this.relatedId,pageNo:this.ruleForm.pageNo,pageSize:this.ruleForm.pageSize});
                if (res.data.code == 0) {
                    let comSu = new Object;
                    let checkNum = new Array();
                    let that = this;
                    this.count = res.data.data.totalSize;
                    if(res.data.data.list && res.data.data.list.length>0){
                        comSu = res.data.data.list.shift();
                        this.prName = comSu.groupName;
                    }
                    this.tableForNewDate = res.data.data.list;
                    $.each(this.tableForNewDate,function(id,info){
                        if(info.checked==true){
                            checkNum.push(info.suId);
                            that.num = checkNum.length;
                        }
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
        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findSuListOfPageByMerchantId();
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findSuListOfPageByMerchantId();
        },
        //保存
        saveCom(){
            this.releaseDistributedLock();
        },
        //解锁
        async releaseDistributedLock(){
            try{
                const res = await releaseDistributedLock({id:this.relatedId});
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        message: '库存同步成功且解除封闭状态'
                    });
                    setTimeout(() => {
                        this.$router.push('/repertoryCombination');
                    }, 1000);
                }else{
                    this.$message({
                        type: 'success',
                        message: '库存同步失败且解除封闭状态失败'
                    });
                }
            }catch(err){
                this.$message({
                    type: 'success',
                    message: '库存同步操作失败，请重试'
                });
            }
        },
        //确认关联接口
        async confirmContact(){
            let obj = new Object;
            obj.id = this.$route.params.id;
            obj.suId = this.ids;
            const res = await confirmContact(obj);
            try{
               if(res.data.code == 0){
                    this.dialogVisible = false;
                    this.findSuListOfPageByMerchantId();
                    this.$message({
                        type: 'success',
                        message: '关联成功'
                    });
               }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
               }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '关联失败，请联系管理员'
                });
            }
        },
        //取消关联接口
        async cancelSuContact(){
            let obj = new Object;
            obj.id = this.$route.params.id;
            obj.suId = this.ids;
            const res = await cancelSuContact(obj);
            try{
               if(res.data.code == 0){
                    this.num = 0;
                    this.dialogVisible = false;
                    this.findSuListOfPageByMerchantId();
                    this.$message({
                        type: 'success',
                        message: '取消成功'
                    });
               }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
               }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '取消失败，请联系管理员'
                });
            }
        },
        //确认关联
        suComComfirm(){
            this.confirmContact();
        },
        //取消关联
        suComCancel(){
            this.cancelSuContact();
        },
        //取消
        defaultCh(){
            this.dialogVisible = false;
            this.suIds.pop();
        },
        defaultChFa(){
            this.dialogVisible = false;
            this.suIds.push(this.ids);
            console.log(this.ids);
        }
    },
}
</script>

<style scoped>
    .editCombination{
        padding: 10px 20px;
    }
    .formList >>> .el-form-item__label{
        text-align: left !important;
    }
    .tempBtns{
        text-align: center;
    }
    .formList >>> .el-form-item{
        margin-bottom: 0 !important;
    }
    .editBtn{
        text-align: center;
    }
</style>
