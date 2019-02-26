<template>
    <div id="site">
        <div class="page-loadmore-wrapper" style="height:100%;">
            <ul>
                <li v-for="invoice in invoiceInfos">
                    <div class="site_title" @click="selectInvoice(invoice.id,invoice.titleContent,invoice.taxpayerIdentificationCode,invoice.isFullInfo)">
                        <p class="title"><span :class="[invoice.isFullInfo==0&&invoiceForm==2?'disabled':'']">{{invoice.titleContent}}</span></p>
                        <p class="code"><span :class="[invoice.isFullInfo==0&&invoiceForm==2?'disabled':'']">{{invoice.taxpayerIdentificationCode}}</span></p>
                        <p class="isDefault"><i v-if="1 == invoice.isDefault">默认抬头</i></p>
                    </div>
                    <div class="site_icon">
                        <router-link :to="'/shop/editInvoice/'+invoice.id"><i class="icon-edit_light iconfont"></i></router-link>
                    </div>
                    <div class="hint" v-if="invoice.isFullInfo==0"  style="font-size:px(28px);height:40px;line-height:40px;">
                        <i class="hintImg"></i>
                        <span>单位信息不全,不支持开具增值税专用发票</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    import {findInvoiceOfPage} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    export default{

        data(){
            return {
                check:'',
                invoiceInfos:[],
                invoiceForm:''
            }
        },
		    components: {

        },
        watch:{

        },
        created(){
          this.invoiceForm =  this.$route.params.invoiceForm;
            this.findInvoiceOfPage();
        },
        methods:{
            //获取已有发票抬头
            async findInvoiceOfPage() {
                try {
                    const res = await findInvoiceOfPage();
                    if (res.data.code == 0) {
                        this.invoiceInfos = res.data.data.list;
                    } else {
                        console.log("暂无发票抬头");
                    }
                } catch (err) {
                     Toast(err);
                }
            },

            selectInvoice(id,titleContent,taxpayerIdentificationCode,isFullInfo){
                if(isFullInfo==0&&this.invoiceForm==2){
                  return
                }
                this.$store.dispatch("setCommonInvoiceId",id);
                this.$store.dispatch("setInvoiceType",1);

                this.$store.dispatch("setTitleContent",titleContent);
                this.$store.dispatch("setTaxpayerIdentificationCode",taxpayerIdentificationCode);

                this.$router.push({path: '/shop/orderInvoice'});
            },

        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/orderpay/invoiceList.scss";
</style>
