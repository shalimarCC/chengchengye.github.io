<template>
    <div id="site">
        <div class="page-loadmore-wrapper" style="height:100%;">
            <ul>
                <li v-for="invoice in invoiceInfos">
                    <div class="site_title">
                        <p class="title"><span>发票抬头:&nbsp;&nbsp;&nbsp;{{invoice.invoiceTitleContent}}</span></p>
                        <p class="code"><span>发票金额:&nbsp;&nbsp;&nbsp;&yen;{{invoice.invoiceValue.toFixed(2)}}</span></p>
                        <p class="code"><span>开票日期:&nbsp;&nbsp;&nbsp;{{setTime(invoice.offeredTime)}}</span></p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    import {queryElecInvoice,downloadInvoice} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    export default{

        data(){
            return {
                check:'',
                invoiceInfos:[],
            }
        },
		components: {

        },
        watch:{

        },
        created(){
            this.orderCode=this.$route.params.orderCode;
            this.queryElecInvoice(this.orderCode);
        },
        methods:{
            //获取已有发票抬头
            async queryElecInvoice(orderCode) {
                try {
                    const res = await queryElecInvoice({orderCode:orderCode});
                    if (res.data.code == 0) {
                        this.invoiceInfos = res.data.data;
                        if(this.invoiceInfos&&this.invoiceInfos.length==0){
                            Toast("电子发票开具中,请耐心等待");
                            // this.invoiceInfos.push({
                            //     "invoiceTitleContent": "默认发票抬头",
                            //     "offeredTime": 1534129781000,
                            //     "id": 289,
                            //     "invoiceValue": 10
                            // });
                        }
                    } else {
                        Toast("电子发票开具中,请耐心等待");
                    }
                } catch (err) {
                     Toast(err);
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
                return y + '-' + m + '-' + d
            },

        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/order/elecInvoice.scss";
</style>