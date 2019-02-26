<template>
    <div style="padding:20px 100px;">
        <div style="margin-bottom:20px;">
            <el-button class="filter-item" type="primary" @click="exportSoChild" icon="edit" size="medium">导出子订单</el-button>

        </div>
        <el-table :data="branchData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="子订单编号">
                <template slot-scope="scope">
                    <span>{{scope.row.childCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="原始子订单">
                <template slot-scope="scope">
                    <span>{{scope.row.ordinaryCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="子订单创建时间">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.createTime)}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="最后一次修改人">
                <template slot-scope="scope">
                    <span>{{scope.row.lastOperatorName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="最后一次修改时间">
                <template slot-scope="scope">
                    <span>{{scope.row.orderAmountBenefit}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="原始子订单运费">
                <template slot-scope="scope">
                    <span>{{scope.row.ordinaryDeliveryFee}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="平摊运费">
                <template slot-scope="scope">
                    <span>{{scope.row.deliveryFee}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="平摊优惠券">
                <template slot-scope="scope">
                    <span>{{scope.row.couponDiscount}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="平摊门店优惠">
                <template slot-scope="scope">
                    <span>{{scope.row.storeDiscount}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="平摊运费优惠">
                <template slot-scope="scope">
                    <span>{{scope.row.deliveryFeeDiscount}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="优惠前总额">
                <template slot-scope="scope">
                    <span>{{scope.row.soChildAmount}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="优惠总额">
                <template slot-scope="scope">
                    <span>{{scope.row.discount}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="结算总额">
                <template slot-scope="scope">
                    <span>{{scope.row.amount}}</span>
                </template>
            </el-table-column>

            <!-- <el-table-column align="center" label="优惠券优惠总额">
                <template slot-scope="scope">
                    <span>{{scope.row.couponeDiscount}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="门店优惠总额">
                <template slot-scope="scope">
                    <span>{{scope.row.storeDiscount}}</span>
                </template>
            </el-table-column> -->

            <el-table-column align="center" label="履约方">
                <template slot-scope="scope">
                    <span v-if="scope.row.performingParty==1">自营</span>
                    <span v-if="scope.row.performingParty==2">券仓</span>
                    <span v-if="scope.row.performingParty==3">网店管家</span>
                    <span v-if="scope.row.performingParty==4">聚合数据</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="物流ID">
                <template slot-scope="scope">
                    <span>{{scope.row.deliveryId}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="子订单状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.deliveryStatus==0">待发货</span>
                    <span v-if="scope.row.deliveryStatus==1">分拣中</span>
                    <span v-if="scope.row.deliveryStatus==2">已发货</span>
                    <span v-if="scope.row.deliveryStatus==3">已签收</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="物流公司">
                <template slot-scope="scope">
                    <span>{{scope.row.deliveryCompanyName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="买家留言">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="售后状态">
                <template slot-scope="scope">
                    <span></span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" plain @click="findSochildById(scope.row.id)">查看详情</el-button>
                    <el-button type="warning" size="small" plain @click="puInfoForOpenOrder(scope.row.id)" disabled="disabled" v-if="scope.row.performingParty!=1&&scope.row.performingParty!=3" style="background:#f4f4f4;color:#b4b4b4;border-color:#f4f4f4;">拆单</el-button>
                    <el-button type="warning" size="small" plain @click="puInfoForOpenOrder(scope.row.id)" v-else>拆单</el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-dialog title="查看详情" :visible.sync="dialogFormVisible">
            <el-form ref="branchForm" :model="branchForm" label-width="150px" style="min-width:400px;">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="子订单编号:" style="text-align:left;">
                            <span>{{branchForm.childCode}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="原始子订单：" style="text-align:left;">
                            <span>{{branchForm.ordinaryChildCode}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="子订单创建时间：" style="text-align:left;">
                            <span>{{branchForm.createTime}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="优惠前总额：" style="text-align:left;">
                            <span>&yen;{{branchForm.orderAmount}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="优惠总额：" style="text-align:left;">
                            <span>&yen;{{branchForm.discount}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="平摊优惠券：" style="text-align:left;">
                            <span>&yen;{{branchForm.couponDiscount}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="平摊门店优惠：" style="text-align:left;">
                            <span>&yen;{{branchForm.storeDiscount}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="平摊运费优惠：" style="text-align:left;">
                            <span>&yen;{{branchForm.deliverFeeDiscount}}</span>
                        </el-form-item>
                    </el-col>


                    <el-col :span="12">
                        <el-form-item label="结算总额：" style="text-align:left;">
                            <span>&yen;{{branchForm.payAmount}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="平摊运费：" style="text-align:left;">
                            <span>&yen;{{branchForm.deliverFee}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="物流状态：" style="text-align:left;">
                            <span v-if="branchForm.deliveryStatus==0">待发货</span>
                            <span v-else-if="branchForm.deliveryStatus==1">分拣中</span>
                            <span v-else-if="branchForm.deliveryStatus==2">已发货</span>
                            <span v-else-if="branchForm.deliveryStatus==3">已签收</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="运单号：" style="text-align:left;">
                            <span>{{branchForm.deliveryCode}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="物流公司：" style="text-align:left;">
                            <span>{{branchForm.deliveryCompany}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="订单发票状态：" style="text-align:left;">
                            <span>{{branchForm.invoiceStatus}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="发票金额：" style="text-align:left;">
                            <span>&yen;{{branchForm.invoiceAmount}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="履约方：" style="text-align:left;">
                            <span>{{branchForm.performingParty}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="最后一次修改人：" style="text-align:left;">
                            <span>{{branchForm.lastOperator}}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="最后一次修改时间：" style="text-align:left;">
                            <span>{{branchForm.lastOperateTime}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>

        <el-dialog title="拆单" :visible.sync="dialogFormVisible1">
            <el-table :data="childData" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="商品编号">
                    <template slot-scope="scope">
                        <span>{{scope.row.puSn}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.puName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品规格">
                    <template slot-scope="scope">
                        <span>{{scope.row.standard}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="原先数量">
                    <template slot-scope="scope">
                        <span>{{scope.row.puCount}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="拆出数量">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.num" size="small" :min="0" :max="scope.row.puCount"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button @click="openOrder" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {findAllSOChildBySoId,findSochildById,exportSoChild,puInfoForOpenOrder,openOrder} from '../../../../api/getData';
export default {

    data () {

        return {
            branchData:[],
            listLoading:true,
            dialogFormVisible:false,
            dialogFormVisible1:false,
            branchForm:{

            },
            childData:[],
            soChildId:''
        }
    },
    created () {
        this.findAllSOChildBySoId();
    },
    components: {

    },
    computed: {
    },
    methods:{
        async findAllSOChildBySoId (){
            try {

                const res = await findAllSOChildBySoId({soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.branchData = res.data.data.list;
                    this.listLoading = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                    this.listLoading = false;
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
                this.listLoading = false;
            }
        },

        //导出
        async exportSoChild (){
            try {

                const res = await exportSoChild({orderId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    window.open(res.data.data.url);
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

        async findSochildById (id){
            try {

                const res = await findSochildById({soChildId:id});

                if (res.data.code == 0) {
                    this.branchForm = res.data.data.soChildInfo;
                    this.dialogFormVisible = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                    this.listLoading = false;
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
            }
        },

        //点击拆单

        async puInfoForOpenOrder (id){
            try {
                this.soChildId = id;
                const res = await puInfoForOpenOrder({soChildId:id});

                if (res.data.code == 0) {
                    this.dialogFormVisible1 = true;
                    this.childData = res.data.data.puList;
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
                this.listLoading = false;
            }
        },

        //拆单保存
        async openOrder (){
            try {
                let obj = new Object();
                obj.soChildId = this.soChildId;
                var arr = new Array();
                $.each(this.childData,function(key,info){
                    let obj1 = new Object();
                    obj1.itemId = info.id;
                    obj1.num = info.num;
                    arr.push(obj1);
                })
                obj.puIdArr = JSON.stringify(arr);
                const res = await openOrder(obj);

                if (res.data.code == 0) {
                    this.dialogFormVisible1 = false;
                    this.findAllSOChildBySoId();
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
                this.listLoading = false;
            }
        },

         //时间戳转换
        setTime(time) {
            if(time!=""&&time!=null){
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
            }else{
                return ''
            }

        },
    }
}

</script>


<style scoped>

</style>
