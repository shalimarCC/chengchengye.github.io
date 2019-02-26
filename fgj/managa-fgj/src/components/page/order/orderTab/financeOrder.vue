<template>
    <div>
        <el-form ref="financeData" :model="financeData" label-width="120px" style="padding:20px 100px;min-width:400px;">
            <el-row :gutter="60">
                <el-col :span="8">
                    <el-form-item label="优惠前总额：" style="text-align:left;">
                        <span>&yen;{{financeData.orderAmount}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="优惠总额：" style="text-align:left;">
                        <span>&yen;{{financeData.orderPromotionDiscount}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="结算总额：" style="text-align:left;">
                        <span>&yen;{{financeData.orderAmountPay}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="支付状态：" style="text-align:left;">
                        <span v-if="financeData.orderPayStatus==0">未支付</span>
                        <span v-else-if="financeData.orderPayStatus==1">已支付</span>
                        <span v-else-if="financeData.orderPayStatus==2">已退款</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="是否积分支付：" style="text-align:left;">
                        <span v-if="financeData.useFubi==1">是</span>
                        <span v-else-if="financeData.useFubi==0">否</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="现金支付方式：" style="text-align:left;">
                        <span>{{financeData.cashPayType}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="积分支付金额：" style="text-align:left;">
                        <span>&yen;{{financeData.orderPaidByFubi}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="现金支付金额：" style="text-align:left;">
                        <span>&yen;{{financeData.orderPaidByCash}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="支付时间：" style="text-align:left;">
                        <span>{{financeData.payConfirmTime}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import {findFinanceBySoId} from '../../../../api/getData';
export default {

    data () {

        return {
            listLoading:true,
            tableKey:1,
            financeData:{}
        }
    },
    created () {
        this.findFinanceBySoId();
    },
    components: {

    },
    computed: {
    },
    methods:{
        async findFinanceBySoId (){
            try {

                const res = await findFinanceBySoId({soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.financeData = res.data.data;
                    this.listLoading = false;
                    console.log(this.financeData);
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
