<template>
    <div id="pay">

        <div id="propertyTable" v-if="!loadding">
            <i class="popup_close icon-close iconfont" @click="closePopup"></i>
            <h4>请输入支付密码</h4>
            <h3>{{fubiPay}} 积分</h3>
            <div class="password">
                <ul>
                    <li v-for="i in 6">
                        <b v-if="psd.length>=i"></b>
                    </li>
                </ul>
            </div>
            <ul class="key">
                <li v-for="i in 9" @click="keyDown(i)">
                    {{i}}
                </li>
                <li class="key_null">
                </li>
                <li @click="keyDown(0)">
                    0
                </li>
                <li class="key_null del" @click="keyDel">
                    <span></span>
                </li>
            </ul>
        </div>

        <div id="payLodding" v-else>
            <mt-spinner type="double-bounce" color="#ff8546" :size="80"></mt-spinner>
        </div>
    </div>
</template>

<script>
    import { foscoinAccountDeduct,removeOrderPayLock } from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { Spinner } from 'mint-ui';
    import { payUrl } from '../../../config/env'
    import CryptoJS from 'crypto-js/core';
    import MD5 from 'crypto-js/md5';
    export default{
        props: {
            orderCode: {
                type: String,
                default: function () {
                    return ''
                }
            },

        },
        data(){
            return {
                psd:"",
                loadding:false,
                limit:2,
                fubiPay:'100'
            }
        },

        watch:{
            "$route" : {
                handler(curVal,oldVal){
                    if(/\/shop\/goods/.test(oldVal.path)){
                        this.psd = "";
                    }
                },
                deep:true
            },
        },

        mounted() {
        },
        created(){
            this.loadding = false;
            this.fubiPay = this.$store.state.Cookie.mutations.fetch('fubiPay');
        },
        methods:{
            keyDown(num){

                if(this.psd.length==5){
                    this.loadding = true
                    this.psd+=num;
                    this.verificationPaymentPassword();
                }else{
                    this.psd+=num;
                }

            },
            keyDel(){
                this.psd = this.psd.substr(0,this.psd.length-1);
            },
            async verificationPaymentPassword() {
                try {

                    const res = await foscoinAccountDeduct({paymentPassword:CryptoJS.MD5(this.psd).toString(),orderCode:this.orderCode});
                    if (res.data.code == 0) {
                        this.loadding = false;
                        this.$emit('closePopop');
                        if(res.data.data.payStatus == 0){ //仅积分支付
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                        }else if(res.data.data.payStatus==1){ //需要发起现金支付
                            this.$store.state.Cookie.mutations.save(0,'orderType');
                            this.$router.push('/shop/pay/'+this.orderCode);
                        }
                    }else if(res.data.code == 170 || res.data.code == 171) {
                        if(this.limit>0){
                            MessageBox.alert('密码输入错误，您还可以输入'+this.limit+'次','').then(action => {
                                this.psd = '';
                                this.limit--;
                                this.loadding = false;
                            });
                        }else{
                            MessageBox.alert('密码连续3次输入错误，订单支付失败','').then(action => {
                                this.$emit('closePopop');
                                this.loadding = false;
                                if(this.$router.path=="/shop/order"){
                                    window.location.reload()
                                }else{
                                    this.$router.push('/shop/order');
                                }
                            });
                        }

                    }else if(res.data.code == 501){
                      this.$emit('closePopop');
                      this.loadding = false;
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                      });
                    }else if(res.data.code==186){
                      this.$emit('closePopop');
                      this.loadding = false;
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                      });
                    }else{
                      this.$emit('closePopop');
                      this.loadding = false;
                        MessageBox('', res.data.error).then(action => {
                            this.$router.push('/shop/order');
                        });
                    }
                } catch (err) {
                        this.psd = '';
                        this.loadding = false;
                }
            },
            async removeOrderPayLock(){
              try{
                const res = await removeOrderPayLock({orderCode:this.orderCode});
                if(res.data.code==0){
                  // Toast(res.data.data);
                  this.$router.push('/shop/orderDatails/'+this.orderCode);
                  if(this.$router.path.includes("/shop/orderDatails")){
                    window.location.reload()
                  }
                }else{
                  Toast(res.data.error);
                  this.$router.push('/shop/orderDatails/'+this.orderCode);
                  if(this.$router.path.includes("/shop/orderDatails")){
                    window.location.reload()
                  }
                }
              }catch (e) {

              }
            },
            //关闭支付窗口
            closePopup(){
                MessageBox({
                    title: '确定要放弃付款',
                    message: '订单创建后会保留30分钟，请尽快支付',
                    showCancelButton: true,
                    confirmButtonText: '确认离开',
                    cancelButtonText: '继续支付',
                }).then(action => {
                    if(action=='confirm'){
                        this.$emit('closePopop');
                        this.removeOrderPayLock();
                        // if(this.$router.path=="/shop/order"){
                        //     window.location.reload()
                        // }else{
                        //     this.$router.push('/shop/order');
                        // }
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }

    #pay{
        height:100%;
        width:100%;
    }
    #propertyTable{
        position:relative;
        height:100%;
        padding:0;
        h4{
            line-height:px(88px);
            margin-left: px(20px);
            font-size: px(32px);
            text-align: left;
        }
        h3{
          font-size: px(32px);
          text-align: center;
          margin-top: px(30px);
          color: #ff8546;
        }
    }
    .password{
        width:100%;
        overflow:hidden;
        height:px(160px);
        display: -webkit-flex;
        display: flex;
        justify-content:center ;
        padding-top:px(30px);
        ul{
            width:px(480px);
            height:px(88px);
            border:1px solid #f4f4f4;
            border-radius:px(10px);
            display: -webkit-flex;
            display: flex;
            li{
                width:16.66%;
                border-right:1px solid #f4f4f4;
                display: -webkit-flex;
                display: flex;
                align-items:center;
                justify-content:center;
                b{
                    display:block;
                    width:px(20px);
                    height:px(20px);
                    background:#323232;
                    border-radius:50%;
                }
            }
        }
    }
    .mint-popup-4{
        width:100%;
        height:54%;
        overflow: auto;
        .popup_close{
            position: absolute;
            top:px(24px);
            right:px(24px);
            font-size:px(36px);
        }
        h4{
            text-align: center;
            line-height: px(88px);
            font-size:px(32px);
            border-bottom:1px solid #f4f4f4;
        }
        .key{
            width:100%;
            border-top:1px solid #f4f4f4;
            display: -webkit-flex;
            display: flex;
            flex-wrap:wrap;
            li{
                height:px(100px);
                width:33.33%;
                border-right:1px solid #f4f4f4;
                border-bottom:1px solid #f4f4f4;
                display: -webkit-flex;
                display: flex;
                align-items:center;
                justify-content:center ;
                box-sizing:border-box;
                font-size:px(36px);
                color:#646464;
            }
            li:nth-child(3n){
                border-right:none;
            }
            li:nth-child(10){
                border-bottom:none;
            }
            li:nth-child(11){
                border-bottom:none;
            }
            li:nth-child(12){
                border-bottom:none;
            }
            .key_null{
                background:#f4f4f4;
            }
            .del{
                display: -webkit-flex;
                display: flex;
                align-items:center;
                justify-content:center ;
                span{
                    display:block;
                    width:px(46px);
                    height:px(46px);
                    background:url(../../../../static/assets/img/del.png);
                    background-size:100%;
                }
            }
        }


    }

    #payLodding{
        height:100%;
        display: -ms-flexbox;
        display: flex;
        justify-content:center;
        align-items:center;
    }
</style>
