<template>
    <div>
        <el-form ref="basicData" :model="basicData" label-width="120px" style="padding:20px 100px;min-width:400px;">
            <el-row :gutter="60">
                <el-col :span="8">
                    <el-form-item label="订单编号：" style="text-align:left;">
                        <span>{{basicData.orderCode}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="优惠前总额：" style="text-align:left;">
                        <span>&yen;{{basicData.soAmount}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="创建时间：" style="text-align:left;">
                        <span>{{setTime(basicData.createTime)}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="优惠总额：" style="text-align:left;">
                        <span>&yen;{{basicData.discount}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="优惠券优惠总额：" style="text-align:left;">
                        <span>&yen;{{basicData.couponDiscount}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="门店优惠总额：" style="text-align:left;">
                        <span>&yen;{{basicData.storeDiscount}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="订单状态：" style="text-align:left;">
                        <span v-if="basicData.status==0">待付款</span>
                        <span v-else-if="basicData.status==1">已付款</span>
                        <span v-else-if="basicData.status==2">已发货</span>
                        <span v-else-if="basicData.status==3">已收货</span>
                        <span v-else-if="basicData.status==4">已完成</span>
                        <span v-else-if="basicData.status==5">预退款</span>
                        <span v-else-if="basicData.status==6">已退款</span>
                        <span v-else-if="basicData.status==7">部分发货</span>
                        <span v-else-if="basicData.status==8">换货中</span>
                        <span v-else-if="basicData.status==10">已取消</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="创建平台：" style="text-align:left;">
                        <span>{{basicData.platformName}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="确认状态：" style="text-align:left;">
                        <span v-if="basicData.orderConfirmStatus==0">未确认</span>
                        <span v-else-if="basicData.orderConfirmStatus==1">已确认</span>
                        <span v-else-if="basicData.orderConfirmStatus==2">已取消</span>
                        <span v-else-if="basicData.orderConfirmStatus==3">已完成</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="结算总额：" style="text-align:left;">
                        <span>&yen;{{basicData.payAmount}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="客户端：" style="text-align:left;">
                        <span v-if="basicData.orderChannel==0">Andoird</span>
                        <span v-else-if="basicData.orderChannel==1">iOS</span>
                        <span v-else-if="basicData.orderChannel==2">微信端</span>
                        <span v-else-if="basicData.orderChannel==3">web端</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="支付状态：" style="text-align:left;">
                        <span v-if="basicData.orderPayStatus==0">未支付</span>
                        <span v-else-if="basicData.orderPayStatus==1">已支付</span>
                        <span v-else-if="basicData.orderPayStatus==2">已退款</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="现金已付金额：" style="text-align:left;">
                        <span>&yen;{{basicData.orderPaidByCash}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="买家账户：" style="text-align:left;">
                        <span>{{basicData.mail}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="支付时间：" style="text-align:left;">
                        <span>{{setTime(basicData.orderPaymentConfirmDate)}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="积分已付金额：" style="text-align:left;">
                        <span>&yen;{{basicData.orderPaidByFubi}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="买家姓名：" style="text-align:left;">
                        <span>{{basicData.userName}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="买家电话：" style="text-align:left;">
                        <span>{{basicData.mobile}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="是否积分支付：" style="text-align:left;">
                        <span v-if="basicData.useFubi==1">是</span>
                        <span v-else>否</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="自动完成日期：" style="text-align:left;">
                        <span>{{setTime(basicData.orderAutoCompleteDate)}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="现金支付方式：" style="text-align:left;">
                        <span>{{basicData.paymentType}}</span>
                    </el-form-item>
                </el-col>



                <el-col :span="8">
                    <el-form-item label="运费总额：" style="text-align:left;">
                        <span>{{basicData.orderDeliveryFee}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="订单来源：" style="text-align:left;">
                        <span v-if="basicData.orderChannel==0">andoird</span>
                        <span v-else-if="basicData.orderChannel==1">IOS</span>
                        <span v-else-if="basicData.orderChannel==2">微信端</span>
                        <span v-else-if="basicData.orderChannel==3">web端</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="订单类型：" style="text-align:left;">
                        <span v-if="basicData.saleWay==1">正常销售</span>
                        <span v-else-if="basicData.saleWay==2">团购</span>
                        <span v-else-if="basicData.saleWay==3">兑换券</span>
                        <span v-else-if="basicData.saleWay==4">普通预售</span>
                        <span v-else-if="basicData.saleWay==5">会籍购买</span>
                        <span v-else-if="basicData.saleWay==6">会籍预售</span>
                        <span v-else-if="basicData.saleWay==7">预售</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="是否零售：" style="text-align:left;">
                        <span v-if="basicData.isDetail==0">否</span>
                        <span v-else-if="basicData.isDetail==1">是</span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="所属门店：" style="text-align:left;">
                        <span>{{basicData.storeName}}</span>
                    </el-form-item>
                </el-col>

                <!-- <el-col :span="24">
                    <el-form-item label="买家留言：" style="text-align:left;">
                        <span>{{basicData.remark}}</span>
                    </el-form-item>
                </el-col> -->
            </el-row>
        </el-form>
    </div>
</template>
<script>
import {findOrderDetail} from '../../../../api/getData';
export default {

    data () {

        return {
            basicData:{

            }
        }
    },
    created () {
        this.findOrderDetail();
    },
    components: {

    },
    computed: {
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                let str = curVal.path;
                str = str.substring(0,12)
                if(str == "/orderDetail"){

                    Object.assign(this.$data, this.$options.data())
                    this.findOrderDetail();
                }

　　　　　　 },
            deep:true
        }

    },
    methods:{
        async findOrderDetail (){
            try {

                const res = await findOrderDetail({soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.basicData = res.data.data;
                    console.log(this.basicData);
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
