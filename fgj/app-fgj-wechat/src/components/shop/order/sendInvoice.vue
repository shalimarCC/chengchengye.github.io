<template>
    <div id="site">
        <!-- <div class="page-loadmore-wrapper" style="height:100%;">
            <ul>
                <li v-for="invoice in invoiceInfos">
                    <div class="site_title">
                        <p class="title"><span>发票抬头:&nbsp;&nbsp;&nbsp;{{invoice.invoiceTitleContent}}</span></p>
                        <p class="code"><span>发票金额:&nbsp;&nbsp;&nbsp;&yen;{{invoice.invoiceValue.toFixed(2)}}</span></p>
                        <p class="code"><span>开票日期:&nbsp;&nbsp;&nbsp;{{setTime(invoice.offeredTime)}}</span></p>
                    </div>
                    
                </li>
            </ul>
        </div> -->
        <div class="top">
            <span class="hint">电子发票PDF原件,将以邮件附件方式发送至指定邮箱。</span>
        </div>
        <div class="emailForm">
            <span class="cell_title">邮箱地址</span>
            <input type="text" class="cell_input" v-model="email" placeholder="请输入接收发票的电子邮箱">
        </div>
        <div class="send_btn" :class="{disabled:email==''}"  @click="sendInvoice()">发送</div>
    </div>
</template>

<script>

    import { downloadInvoice } from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    export default{

        data(){
            return {
                email:'',
                invoiceIds:[],
            }
        },
		components: {

        },
        watch:{

        },
        created(){
            this.invoiceIds = this.$store.state.invoiceIds;
        },
        methods:{
            //发送发票
            sendInvoice(){
                if(!this.email || this.email==''){
                    Toast("邮箱不能为空,请填写邮箱");
                    return;
                }
                if(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.email)){
                    this.downloadInvoice();
                }else{
                    Toast("邮箱填写有误,请重新填写");
                }
            },
            async downloadInvoice() {
                try {
                    const res = await downloadInvoice({email:this.email,invoiceIds:this.invoiceIds});
                    if (res.data.code == 0) {
                        Toast("发送成功");
                    } else {
                        Toast("发送失败");
                    }
                } catch (err) {
                     Toast(err);
                }
            },

        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/order/sendInvoice.scss";
</style>
