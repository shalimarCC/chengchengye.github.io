<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="订单编号" v-model="ruleForm.orderCode">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="所属用户" v-model="ruleForm.email">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="ruleForm.puName">
        </el-input>

        <el-date-picker
            v-model="ruleForm.startTime"
            type="date"
            placeholder="下单时间" style="width: 200px;margin-right:15px;">
        </el-date-picker>到
        <el-date-picker
            v-model="ruleForm.endTime"
            type="date"
            placeholder="下单时间" style="width: 200px;margin-right:15px;">
        </el-date-picker>

        <el-select v-model="ruleForm.orderConfirmStatus" placeholder="订单确认状态">
            <el-option
                v-for="item in orderConfirmStatus"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>
    </div>

    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.orderPayStatus" placeholder="订单支付状态">
            <el-option
                v-for="item in orderPayStatus"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.paymentType" placeholder="支付方式">
            <el-option
                v-for="item in paymentType"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>

        <el-checkbox v-model="ruleForm.showTest">显示测试数据</el-checkbox>

        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

    </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column
        type="selection"
        width="55"
        align="center">
        </el-table-column>

        <el-table-column align="center" label="订单编号">
            <template slot-scope="scope">
                <span>{{scope.row.orderCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属用户">
            <template slot-scope="scope">
                <span>{{scope.row.mail}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="买家电话">
            <template slot-scope="scope">
                <span>{{scope.row.mobile}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="下单时间">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="优惠前总额">
            <template slot-scope="scope">
                <span>{{scope.row.orderAmount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="优惠总额">
            <template slot-scope="scope">
                <span>{{scope.row.orderAmountBenefit}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="结算总额">
            <template slot-scope="scope">
                <span>{{scope.row.orderAmountPay}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单状态">
            <template slot-scope="scope">
                <span>{{scope.row.orderStatusStr}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单确认状态">
            <template slot-scope="scope">
                <span v-if="scope.row.orderConfirmStatus==0">未确认</span>
                <span v-else-if="scope.row.orderConfirmStatus==1">已确认</span>
                <span v-else-if="scope.row.orderConfirmStatus==2">已取消</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单支付状态">
            <template slot-scope="scope">
                <span v-if="scope.row.orderPayStatus==0">未支付</span>
                <span v-else-if="scope.row.orderPayStatus==1">已支付</span>
                <span v-else-if="scope.row.orderPayStatus==2">已退款</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否积分支付">
            <template slot-scope="scope">
                <span v-if="scope.row.useFubi==1">是</span>
                <span v-else>否</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="现金支付方式">
            <template slot-scope="scope">
                <span v-if="scope.row.cashPayType==1">支付宝</span>
                <span v-else-if="scope.row.cashPayType==2">微信</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="现金已付金额">
            <template slot-scope="scope">
                <span>{{scope.row.orderPaidByCash}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="积分已付金额">
            <template slot-scope="scope">
                <span>{{scope.row.orderPaidByFubi}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="orderDetail(scope.row.id)">订单详情</el-button>
                <el-button type="primary" size="small" plain @click="refundDetail(scope.row.id)">退款详情</el-button>
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

    <el-dialog title="退款详情" :visible.sync="dialogFormVisible">
        <el-form :model="refundObj" label-width="120px" style="min-width:400px;">
            <el-row :gutter="60">
                <el-col :span="8">
                    <el-form-item label="积分总支付：" style="text-align:left;">
                        <span>{{refundObj.paidByFubi}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="积分已退金额：" style="text-align:left;">
                        <span>{{refundObj.refundFubi}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="积分可退金额：" style="text-align:left;">
                        <span>{{refundObj.canRefundFubi}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="现金总支付：" style="text-align:left;">
                        <span>{{refundObj.paidByCash}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="现金已退金额：" style="text-align:left;">
                        <span>{{refundObj.refundCash}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="现金可退金额：" style="text-align:left;">
                        <span>{{refundObj.canRefundCash}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <h2>退款记录</h2>
        <el-table :data="refundObj.list" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="退款时间">
                <template slot-scope="scope">
                    <span>{{scope.row.refundTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作人">
                <template slot-scope="scope">
                    <span>{{scope.row.operator}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="现金退款金额">
                <template slot-scope="scope">
                    <span>{{scope.row.refundCash}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="积分退款金额">
                <template slot-scope="scope">
                    <span>{{scope.row.refundFubi}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="退款原因">
                <template slot-scope="scope">
                    <span>{{scope.row.reason}}</span>
                </template>
            </el-table-column>
        </el-table>

    </el-dialog>
  </div>
</template>


<script>
import {refundOrderPage,refundDetail} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                orderCode:'',
                email: "",
                startTime : "",
                puName:"",
                endTime: "",
                orderConfirmStatus: "",
                paymentType: "",
                orderPayStatus: "",
                showTest:"",
                pageNo: 1,
                pageSize: 10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            orderStatus:[],
            orderPayStatus:[
                {
                    key:"已支付",
                    value:"1"
                },
                {
                    key:"已退款",
                    value:"2"
                }
            ],
            orderConfirmStatus:[
                {
                    key:"已确认",
                    value:"1"
                },
                {
                    key:"已取消",
                    value:"2"
                }
            ],
            paymentType:[
                {
                    key:"支付宝",
                    value:"1"
                },
                {
                    key:"微信",
                    value:"2"
                },
            ],
            dialogFormVisible:false,

            refundObj : {
                canRefundFubi: '',
                refundCash: '',
                refundFubi: '',
                paidByCash: '',
                canRefundCash: '',
                list: []
            }
        }
    },
    created() {
        this.refundOrderPage();
    },

    methods: {
        //获取列表
        async refundOrderPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                if(obj.startTime!=''&&obj.startTime!=null){
                    obj.startTime = this.setTimestamp(obj.startTime);
                }
                if(obj.endTime!=''&&obj.endTime!=null){
                     obj.endTime = this.setTimestamp(obj.endTime);
                }

                this.listLoading = false;
                const res = await refundOrderPage(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.page.totalSize;
                    this.dataSource = res.data.data.page.list;

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

        //获取订单状态
        async orderStatusList() {
            try {
                const res = await orderStatusList();

                if (res.data.code == 0) {
                    this.orderStatus = res.data.data;

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
            this.refundOrderPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.refundOrderPage();
        },

        //搜索
        handleFilter() {
            this.refundOrderPage();
        },

        //重置
        resetForm(formName) {
            this.ruleForm = {
                orderCode:'',
                email: "",
                startTime : "",
                puName:"",
                endTime: "",
                orderConfirmStatus: "",
                paymentType: "",
                orderPayStatus: "",
                showTest:"",
                pageNo: 1,
                pageSize: 10
            }
            this.refundOrderPage();
        },

        //订单详情
        orderDetail (id) {
            this.$router.push( {path:'/orderDetail/'+id} );
        },

        //查询退款详情
        async refundDetail(id) {
            try {
                const res = await refundDetail({orderId:id});

                if (res.data.code == 0) {

                    this.refundObj = res.data.data;
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
            if(time == ""){
                return ""
            }else{
                const t = new Date(time);
                return t.getTime()
            }

        },

    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


