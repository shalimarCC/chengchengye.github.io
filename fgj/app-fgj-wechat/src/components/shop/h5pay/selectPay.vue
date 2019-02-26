<template>
    <div class="pay" v-if="payShow">
        <div class="time">{{time}}</div>

        <div class="pay_num">
            <!--<p v-if="(orderInfo.orderAmount-orderInfo.needPayCash>0)&&(orderInfo.needPayCash>0)">已支付{{orderInfo.fubiBalance}}积分，您还需要支付<span>&yen;{{orderInfo.needPayCash}}</span></p>-->
            <!--<p v-else>共{{orderInfo.goodsAccount}}件商品 合计: <span>&yen;{{orderInfo.orderAmount}}</span></p>-->
          <p v-if="orderType==0">已支付{{orderInfo.fubiBalance}}积分，您还需要支付<span>&yen;{{orderInfo.needPayCash}}</span></p>
          <p v-if="orderType==1">共{{orderInfo.goodsAccount}}件商品 合计: <span>&yen;{{orderInfo.orderAmount}}</span></p>
        </div>

        <div class="marg"></div>

        <div class="selectPay">
            <div class="cell_title">选择支付方式</div>
            <div class="payStatus" v-for="info in payTypeList"  v-if="info.payTypeCode==2">
                <div><b class="wechat" :style="'background-image:url('+info.logImageUrl+');'"></b><p><span>{{info.payTypeName}}</span></p></div>
                <i class="iconfont icon-roundcheckfill"></i>
            </div>
        </div>

        <div class="btn" @click="buy">
            确认支付
        </div>
    </div>
</template>

<script>

    import {
      standardOrderQueryAtPayInvoke,
      standardOrderQueryAtPayMethod,
      standardPayCancle,
      nativeWXpaySign,
      orderPayConfirm,
      getClientPayTypeByClientId,
      cashPayCancel
    } from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    export default{

        data(){
            return{
                orderCode:'',
                timeleft:0,
                time:'支付剩余时间：',
                orderInfo:{},
                orderList:'',
                payShow:false,
                payTypeList:[],
                orderType:0,

            }
        },
        created () {
            if(this.$store.state.Cookie.mutations.fetch('orderType')){
              this.orderType = this.$store.state.Cookie.mutations.fetch('orderType');
            }
            this.orderInfo = this.$store.state.orderInfo;
            this.orderCode = this.$route.params.orderCode;
            this.standardOrderQueryAtPayMethod();
            // this.standardOrderQueryAtPayInvoke();
            this.getClientPayTypeByClientId();
        },
        mounted(){

        },
        watch : {

        },
		components: {

		},
        methods:{

            //放弃支付
            async getClientPayTypeByClientId() {
                try {
                    const res = await getClientPayTypeByClientId();

                    if (res.data.code == 0) {
                        this.payTypeList = res.data.data;
                    } else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            async standardOrderQueryAtPayMethod() {
                try {
                    Indicator.open();
                    const res = await standardOrderQueryAtPayMethod({orderCode:this.orderCode});
                    if (res.data.code == 0) {
                        this.orderList = res.data.data;
                        this.timeleft = res.data.data.timeLeft;
                        let thtf = this;
                        this.payCountDown();
                        var timer = setInterval(function() {
                            thtf.payCountDown();
                            if (thtf.timeleft <= 0) {
                                thtf.time = '支付超时';
                                thtf.standardOrderQueryAtPayMethod();
                                clearInterval(timer);
                            } else {
                                thtf.timeleft--;
                            }
                        }, 1000);
                        this.payShow = true;
                        Indicator.close();
                    }else{
                        Indicator.close();
                        if(res.data.code == 180){
                            MessageBox({
                                title: '',
                                message: '订单正在处理中，是否继续等待？',
                                showCancelButton: true,
                                confirmButtonText: '取消支付',
                                cancelButtonText: '继续等待',
                            }).then(action => {
                                if(action=='cancel'){

                                  if(this.saleWay==5){
                                    this.$router.push('/my');
                                  }else{
                                    this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                                  }
                                }else{
                                    this.standardPayCancle();

                                }
                            });
                        }else if(res.data.code == 181){
                            MessageBox('', '订单已经支付成功').then(action => {
                              if(this.saleWay==5){
                                this.$router.push('/my');
                              }else{
                                this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                              }
                            });
                        }else if(res.data.code == 182){
                            MessageBox('', '订单已取消').then(action => {
                              if(this.saleWay==5){
                                this.$router.push('/my');
                              }else{
                                this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                              }
                            });
                        }else if(res.data.code == 183){
                            MessageBox('', '订单已退款').then(action => {
                              if(this.saleWay==5){
                                this.$router.push('/my');
                              }else{
                                this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                              }
                            });
                        }else if(res.data.code == 184){
                            MessageBox('', '支付超时，订单已取消').then(action => {
                              if(this.saleWay==5){
                                this.$router.push('/my');
                              }else{
                                this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                              }
                            });
                        }
                    }
                } catch (err) {
                    Indicator.close();
                    Toast('网络错误');
                }
            },
           async standardOrderQueryAtPayInvoke() {
            try {
              Indicator.open();
              const res = await standardOrderQueryAtPayInvoke({orderCode:this.orderCode});
              if (res.data.code == 0) {
                this.orderInfo = res.data.data;
              }else{
                Indicator.close();
              }
            } catch (err) {
              Indicator.close();
              Toast('网络错误');
            }
          },
            //放弃支付
            async standardPayCancle() {
                try {
                    const res = await standardPayCancle({orderCode:this.orderCode});

                    if (res.data.code == 0) {
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                      });
                    } else if(res.data.code == 501){
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                      });
                    } else {
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                      });
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            payCountDown() {
                if (this.timeleft <= 0) {
                    MessageBox('提示', '支付超时').then(action => {
                        this.$router.push('/home');
                    });
                }
                //分
                var min = Math.floor(this.timeleft / 60);
                //秒
                var sec = Math.floor(this.timeleft % 60);
                min = min < 10
                    ? '0' + min
                    : min;
                sec = sec < 10
                    ? '0' + sec
                    : sec;
                this.time = "支付剩余时间：" + min + "分" + sec + "秒"
            },
            //点击去支付
            async buy(){
                try {

                    Indicator.open();
                    const res = await standardOrderQueryAtPayMethod({orderCode:this.orderCode});
                    if (res.data.code == 0) {
                        this.nativeWXpaySign();
                        Indicator.close();
                    }else{
                        Indicator.close();
                        if(res.data.code == 180){
                            MessageBox({
                                title: '',
                                message: '订单正在处理中，是否继续等待？',
                                showCancelButton: true,
                                confirmButtonText: '取消支付',
                                cancelButtonText: '继续等待',
                            }).then(action => {
                                if(action=='cancel'){
                                    this.$router.push('/shop/orderDatails/'+this.orderCode);
                                }else{
                                    this.standardPayCancle();


                                }
                            });
                        }else if(res.data.code == 181){
                            MessageBox('', '订单已经支付成功').then(action => {
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            });
                        }else if(res.data.code == 182){
                            MessageBox('', '订单已取消').then(action => {
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            });
                        }else if(res.data.code == 183){
                            MessageBox('', '订单已退款').then(action => {
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            });
                        }else if(res.data.code == 184){
                            MessageBox('', '支付超时，订单已取消').then(action => {
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            });
                        }


                    }
                } catch (err) {
                    Indicator.close();
                    Toast('网络错误');
                }
            },
            async nativeWXpaySign() {
                try {
                    const res = await nativeWXpaySign({orderCode:this.orderCode,signPlatform:3});

                    if (res.data.code == 0) {
                        let obj = res.data.data;
                        let thtf = this;
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId":obj.appId,     //公众号名称，由商户传入
                                "timeStamp":obj.timestamp,         //时间戳，自1970年以来的秒数
                                "nonceStr":obj.nonstr, //随机串
                                "package":'prepay_id='+obj.prepayId,
                                "signType":"MD5",         //微信签名方式：
                                "paySign":obj.signResult //微信签名
                            },
                            function(res){
                                Indicator.open();
                                window.setTimeout(thtf.orderPayConfirm(),3000);
                            }
                        );
                    }else if(res.data.code == 501){
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                      });
                    }else if(res.data.code ==186){
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                      });
                    } else {
                        MessageBox('', '支付失败').then(action => {

                        });
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            //取消支付
            async cashPayCancel(id) {
              try {
                const res = await cashPayCancel({orderCode:id});
                if (res.data.code == 0) {

                } else {
                  Toast(res.data.error);
                }
              } catch (err) {
                Toast('网络错误');
              }
            },
            async orderPayConfirm() {
                try {
                    const res = await orderPayConfirm({orderCode:this.orderCode});

                    if (res.data.code == 0) {
                        if(res.data.data.orderInQueue){
                            MessageBox({
                                title: '',
                                message: '订单正在处理中，是否继续等待？',
                                showCancelButton: true,
                                confirmButtonText: '取消支付',
                                cancelButtonText: '继续等待',
                            }).then(action => {
                                if(action=='cancel'){
                                    Indicator.close();
                                    this.$router.push('/shop/orderDatails/'+this.orderCode);
                                }else{
                                    Indicator.close();
                                  this.cashPayCancel(this.orderCode)
                                    // this.standardPayCancle();
                                }
                            });
                        }else{
                            if(res.data.data.payStatus==1){
                                Toast('订单支付成功');
                                Indicator.close();
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            }else if(res.data.data.payStatus==0){
                                Indicator.close();
                            }else{
                                Indicator.close();
                                Toast('支付失败');
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            }
                        }
                    } else {
                        Indicator.close();
                        MessageBox('', '支付失败').then(action => {

                        });
                    }

                } catch (err) {
                    Indicator.close();
                    Toast(err);
                }
            },

        }
    }
</script>

<style lang="scss" scoped>
$baseWidth:750px;
@function px($val) {
    @return $val/$baseWidth*10+rem;
}


.pay{
    width:100%;
    background:#fff;
    height:100%;

    .time{
        background:#f4f4f4;
        width:100%;
        text-align:center;
        font-size:px(28px);
        color:#ff8546;
        line-height:px(70px);
    }
}

.pay_num{
    background:#Fff;
    width:100%;
    text-align:center;
    height:px(88px);
    line-height:px(88px);
    p{
        font-size:px(30px);
        color:#323232;
        span{
            color:#ff8546;
        }
    }
}

.marg{
    height:px(20px);
    background:#f4f4f4;
    width:100%;
}

.selectPay{
    margin-top:px(20px);
    background:#fff;
    .cell_title{
        padding:0 px(24px);
        font-size:px(28px);
        line-height:px(100px);
        border-bottom:1px solid #f4f4f4;
    }

    .payStatus{
        padding:0 px(24px);
        display: -ms-flexbox;
        display: flex;
        justify-content:space-between;
        align-items:center;
        height:px(100px);
        border-bottom:1px solid #f4f4f4;
        padding-right:px(32px);
        div{
            display: flex;
            align-items:center;
            font-size:px(28px);
            color:#323232;
            b{
               width:px(60px);
               height:px(60px);
               background-size:100%;
               margin-right:px(20px);
            }
            span{
                display: block;
                line-height: px(34px);
            }
            span:nth-child(2){
                font-size:px(22px);
                color:#969696;
                line-height: px(34px);
            }

        }
        .wechat{
            background-image: url(../../../../static/assets/img/wechat.png);
        }
        .otherpay{
            background-image: url(../../../../static/assets/img/otherpay.png);
        }
        .icon-roundcheckfill{
            color:#ff8546;
        }
        .icon-round{
            color:#ccc;
        }
    }
}


.btn{
    width:px(702px);
    left:50%;
    margin-left:px(-351px);
    height:px(88px);
    text-align:center;
    line-height:px(88px);
    color:#Fff;
    font-size:px(36px);
    position:fixed;
    bottom:px(30px);
    background:#ff8546;
    border-radius:px(10px);

}
</style>
