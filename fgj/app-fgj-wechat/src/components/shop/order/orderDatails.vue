<template>
    <div class="orderDatails">
        <div class="orderConfim_warpper page-loadmore-wrapper" v-if="showState">
            <div class="order_1" v-if="isShowAddr">
                <div>
                    <div class="clear receiverInfo1">
                        <p>收货人：<span>{{objData.addressInfo.receiverName}}</span></p>
                        <p>{{objData.addressInfo.phoneNo}}</p>
                    </div>
                    <div class="clear receiverInfo2">
                        <i class="icon-location_light iconfont"></i>
                        <span>收货地址：</span><b>{{objData.addressInfo.address}}</b>
                    </div>

                </div>

            </div>

            <div class="order_2">
                <div class="order_status">
                    {{objData.orderInfo.statusStr}}
                </div>
                <div class="goodsList" v-for="itemList in objData.goodGroupList">
                  <h5 class="storeName" v-if="itemList.isOwnMerchant">{{itemList.storeName}}</h5>
                  <h5 class="storeName" v-else>{{itemList.merchantName}}</h5>
                  <ul>
                    <li class="order_goods clear" v-for="goods in itemList.goodsList">
                      <div class="goods_left">
                        <img :src="goods.puImg+'?imageMogr2/size-limit/100k!'">
                      </div>
                      <div class="goods_right">
                        <div class="title">
                          <h4><span class="operateByown" v-if="goods.isOwnMerchant">自营</span>{{goods.puName}}</h4>
                        </div>
                        <div class="goods_authority" v-if="goods.saleWay==4">
                          底价预售
                        </div>
                        <div class="goods_authority membership" v-if="goods.saleWay==6">
                          会员底价预售
                        </div>
                        <div class="goods_period" v-if="goods.saleWay==4||goods.saleWay==6">预售时间{{goods.preSellDay}}天</div>
                        <div class="goods_price" v-if="objData.orderInfo.couponType!=1">
                          <p>
                            <span>{{addZero(goods.price)}} 积分</span>
                            <b>×{{goods.num}}</b>
                          </p>
                        </div>
                        <div class="goods_price" v-else>
                          <p>
                            <span></span>
                            <b>×{{goods.num}}</b>
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="cell" v-if="objData.orderInfo.rechangePhone">
                    <span class="cell_title">充值号码： </span>
                    <b>{{objData.orderInfo.rechangePhone}}</b>
                  </div>
                  <div class="cell" v-if="objData.goodGroupList.length>1">
                    <span class="cell_title">运费： </span>
                    <b v-if="itemList.deliveryPrice">&yen; {{addZero(itemList.deliveryPrice)}}</b>
                    <b v-if="!itemList.deliveryPrice">&yen; 0.00</b>
                  </div>
                  <div class="cell" v-if="itemList.remark">
                    <span class="cell_title">买家留言：</span>
                    <b>{{itemList.remark}}</b>
                  </div>
                </div>
                <div class="order_unit" v-if="objData.orderInfo.unitExist">
                    <h4>卡密码信息</h4>
                    <ul>
                        <li v-for="info in objData.cardList">
                            <p v-if="info.cardNumber">卡号：{{info.cardNumber}}</p>
                            <p v-if="info.shortUrl">链接：{{info.shortUrl}}<span class="seeCard" @click="seeCard(info.shortUrl)">查看</span></p>
                            <p v-if="info.cardThick">卡密：{{info.cardThick}}</p>
                            <p v-if="info.endTime">有效期：{{info.endTime}}</p>
                        </li>
                    </ul>
                </div>
                <div class="order_code">
                    <p>订单编号：{{objData.orderInfo.orderCode}}</p>
                    <p>下单时间：{{objData.orderInfo.createTime}}</p>
                </div>
                <div class="order_code order_code1" v-if="objData.invoiceInfo">
                    <p v-if="objData.invoiceInfo.invoiceBaseInfo.invoiceType==0">发票类型：纸质普通发票</p>
                    <p v-if="objData.invoiceInfo.invoiceBaseInfo.invoiceType==1">发票类型：电子普通发票</p>
                    <div class="checkInvoice" v-if="objData.invoiceInfo.invoiceBaseInfo.invoiceType==1&&objData.orderInfo.orderPayStatus!=0">
                        <span @click="checkInvoice()">查看发票</span>
                    </div>
                    <p v-if="objData.invoiceInfo.invoiceBaseInfo.invoiceType==2">发票类型：增值税发票</p>
                    <p>发票抬头：{{objData.invoiceInfo.invoiceBaseInfo.title}}</p>
                    <p>发票内容：<span v-if="objData.invoiceInfo.invoiceBaseInfo.invoiceContentType==0">商品明细</span>
                        <span v-else-if="objData.invoiceInfo.invoiceBaseInfo.invoiceContentType==1">商品类别</span>
                    </p>
                    <div v-if="objData.invoiceInfo.invoiceBaseInfo.invoiceType==2">
                      <p>注册地址：{{objData.invoiceInfo.invoiceBaseInfo.registerAddr}}</p>
                      <p>注册电话：{{objData.invoiceInfo.invoiceBaseInfo.registerTel}}</p>
                      <p>开户银行：{{objData.invoiceInfo.invoiceBaseInfo.depositBank}}</p>
                      <p>银行账号：{{objData.invoiceInfo.invoiceBaseInfo.bankAccount}}</p>
                    </div>
                </div>
                <div class="order_code" v-if="objData.orderInfo.couponType!=1">
                    <p>现金支付方式：{{objData.orderInfo.payCashMethodStr}}</p>
                    <p v-if="objData.orderInfo.goodsAmount!=0">商品合计：&yen; {{objData.orderInfo.goodsAmount.toFixed(2)}}</p>
                    <p v-if="objData.orderInfo.goodsAmount==0">商品合计：&yen; 0.00</p>
                    <p v-if="objData.orderInfo.deliveryFee!=0">运费：&yen; {{objData.orderInfo.deliveryFee.toFixed(2)}}</p>
                    <p v-if="objData.orderInfo.deliveryFee==0">运费：&yen; 0.00</p>
                    <p v-if="objData.orderInfo.couponDiscount!=0">优惠券：-&yen;{{objData.orderInfo.couponDiscount.toFixed(2)}}</p>
                    <p v-if="objData.orderInfo.storeDiscount!=0">门店优惠：-&yen;{{objData.orderInfo.storeDiscount.toFixed(2)}}</p>
                </div>
                <div class="order_price" v-if="objData.orderInfo.couponType!=1">
                    <!--<p v-if="objData.orderInfo.status!=0">积分实付：&yen; {{objData.orderInfo.paidByFubi}}</p>-->
                    <p>积分实付：&yen; {{objData.orderInfo.paidByFubi.toFixed(2)}}</p>
                    <!--<p v-if="objData.orderInfo.status!=0">现金实付：&yen; {{objData.orderInfo.paidByCash}}</p>-->
                    <p>现金实付：&yen; {{objData.orderInfo.paidByCash.toFixed(2)}}</p>
                    <h4>实付合计：<span>&yen; {{objData.orderInfo.orderAmount}}</span></h4>
                </div>
                <div class="order_price" v-else>
                  <p>兑换券购买</p>
                </div>
                <div class="orderBtn">
                    <div v-if="objData.orderInfo.operateStatus == 0">
                        <mt-button size="small" plain @click.native="unfreezeSoFubi(objData.orderInfo.orderCode)" class="parm_btn">取消订单</mt-button>
                        <mt-button size="small" plain type="danger" @click.native="createOrder(objData.orderInfo.orderCode,0)" class="danger_btn">其它支付</mt-button>
                        <mt-button size="small" plain type="danger" @click.native="createOrder(objData.orderInfo.orderCode,1)" class="danger_btn">积分支付</mt-button>
                    </div>

                    <div v-if="objData.orderInfo.operateStatus == 1">
                            <mt-button size="small" plain @click.native="unfreezeSoFubi(objData.orderInfo.orderCode)" class="parm_btn">取消订单</mt-button>
                        </div>

                    <div v-if="objData.orderInfo.operateStatus == 2">
                        <mt-button size="small" plain v-if="!objData.orderInfo.unitExist" @click.native="logistics(objData.orderInfo.orderCode)" class="parm_btn">查看物流</mt-button>
                        <mt-button size="small" plain type="danger" @click.native="affirmOrderBySoId(objData.orderInfo.orderCode)" class="danger_btn">确认收货</mt-button>
                    </div>

                    <div v-if="objData.orderInfo.operateStatus == 3">
                        <mt-button size="small" plain v-if="!objData.orderInfo.unitExist" @click.native="logistics(objData.orderInfo.orderCode)" class="parm_btn">查看物流</mt-button>
                        <mt-button size="small" plain @click.native="deleteBySoId(objData.orderInfo.orderCode)" class="parm_btn">删除订单</mt-button>
                    </div>

                    <div v-if="objData.orderInfo.operateStatus == 4">
                        <mt-button size="small" plain @click.native="deleteBySoId(objData.orderInfo.orderCode)" class="parm_btn">删除订单</mt-button>
                    </div>

                    <div v-if="objData.orderInfo.operateStatus == 6">
                      <mt-button size="small" plain @click.native="deleteBySoId(objData.orderInfo.orderCode)" class="parm_btn">删除订单</mt-button>
                      <mt-button size="small" plain @click.native="checkCoupon(objData.orderInfo.exchangeCouponType)" class="parm_btn checkCoupon">查看优惠券</mt-button>
                    </div>

                    <div v-if="objData.orderInfo.operateStatus == 7">
                      <mt-button size="small" plain @click.native="unfreezeSoFubi(objData.orderInfo.orderCode)" class="parm_btn">取消订单</mt-button>
                      <mt-button size="small" plain type="danger" @click.native="createOrder(objData.orderInfo.orderCode,0)" class="danger_btn">其它支付</mt-button>
                    </div>
                </div>
            </div>
        </div>
        <mt-popup
        v-model="popupVisible"
        position="bottom" class="mint-popup-4" :closeOnClickModal="false" id="mint-popup-4">
            <pay-key :order-code="orderCode" v-if="popupVisible" v-on:closePopop="closePopop"></pay-key>
        </mt-popup>
    </div>
</template>

<script>
    import {orderDetail,
      unfreezeSoFubi,
      deleteBySoId,
      affirmOrderBySoId,
      cashPayCancel,
      findAwaitQueueByOrderCode,standardPayCancle,standardOrderQueryAtPayInvoke} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { payUrl } from '../../../config/env'
    import payKey from '../orderpay/payKey';
    export default{

        data(){
            return{
                objData:{
                },
                popupVisible:false,
                orderCode:'',
                showState:false,
                isShowAddr:'',
            }
        },
        created () {
           this.orderDetail();

        },
        watch : {

        },
        components: {
                payKey
        },
        methods:{
            async orderDetail() {
                try {
                    const res = await orderDetail({orderCode:this.$route.params.id,storeId:'1'});
                    if (res.data.code == 0) {
                        this.orderCode = this.$route.params.id;
                        this.objData = res.data.data;
                        if(this.objData.orderInfo.status==10&&this.objData.orderInfo.orderType==8){
                          Toast('兑换失败');
                        }
                        this.isShowAddr = res.data.data.orderInfo.isShowAddr==true ? true : false;
                        this.showState = true;
                    }else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //取消订单
            unfreezeSoFubi(id){
                MessageBox.confirm('确定要取消订单吗?').then(action => {
                    this.cacelOrderAjax(id)
                },() => {

                });
            },
            checkCoupon(type){
              this.$store.state.Cookie.mutations.save(type,'navCheck');
              this.$router.push('/coupon')
            },
            async cacelOrderAjax(id) {
                try {
                    const res = await unfreezeSoFubi({orderCode:id});
                    if (res.data.code == 0) {
                        if(this.objData.orderInfo.orderPayStatus==1 && this.objData.orderInfo.couponType!=1){
                          MessageBox.alert('已支付积分与现金将原路返还到您的账户，现金预计3个工作日内到账，请您注意查收。','').then(action => {
                            this.orderDetail();
                          });
                        } else {
                          this.orderDetail();
                        }
                        // MessageBox.alert('已支付积分与现金将原路返还到您的账户，现金预计3个工作日内到账，请您注意查收。','').then(action => {
                        //     this.orderDetail();
                        // });

                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },

            //删除订单
            deleteBySoId(id){
                MessageBox.confirm('确定要删除订单吗?').then(action => {
                    this.deleteBySoIdAjax(id)
                },() => {

                });
            },

            async cashPayCancel(id,type) {
              try {
                const res = await cashPayCancel({orderCode:id});
                if (res.data.code == 0) {
                  this.createOrder(id,type);
                } else {
                  Toast(res.data.error);
                }
              } catch (err) {
                Toast('网络错误');
              }
            },
            async deleteBySoIdAjax(id) {
                try {
                    const res = await deleteBySoId({orderCode:id});
                    if (res.data.code == 0) {
                        Toast("删除订单成功");
                        this.$router.push('/shop/order');
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
              //确认收货
            affirmOrderBySoId(id){
                MessageBox.confirm('确定执行此操作?').then(action => {
                    this.affirmOrderBySoIdAjax(id)
                },() => {

                });
            },
            async affirmOrderBySoIdAjax(id) {
                try {
                    const res = await affirmOrderBySoId({orderCode:id});
                    if (res.data.code == 0) {
                        Toast("确认收货成功");
                        this.orderDetail();
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //关闭键盘
            closePopop(){
                this.popupVisible = false;
            },
            //去支付
            async createOrder(orderCode,type) {
                try {
                    const res = await standardOrderQueryAtPayInvoke({orderCode:orderCode});
                    if (res.data.code == 0) {
                      let obj = new Object();
                      obj.needPayCash = res.data.data.needPayCash;
                      obj.orderAmount = res.data.data.orderAmount;
                      obj.fubiBalance = res.data.data.fubiBalance;
                      obj.goodsAccount = res.data.data.goodsAccount;
                      this.$store.dispatch("setOrderInfo",obj);
                        if(type == 0){ //其他支付
                            this.$store.state.Cookie.mutations.save(1,'orderType');
                            this.$router.push("/shop/pay/"+orderCode)
                        }else if(type == 1){
                          this.$store.state.Cookie.mutations.save(res.data.data.fubiBalance,'fubiPay');
                            if(res.data.data.fubiBalance>0){
                                this.orderCode = orderCode;
                                this.popupVisible = true;
                            }else{
                                Toast('无可用积分，请选择其他支付方式');
                                this.$store.state.Cookie.mutations.save(1,'orderType');
                                this.$router.push("/shop/pay/"+orderCode)
                            }
                        }

                    }else if(res.data.code == 180){
                        MessageBox({
                            title: '',
                            message: '订单正在处理中，是否继续等待？',
                            showCancelButton: true,
                            confirmButtonText: '重新支付',
                            cancelButtonText: '继续等待',
                        }).then(action => {
                            if(action=='cancel'){
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                                window.location.reload()
                            }else{
                                //走重新支付状态
                              this.cashPayCancel(this.orderCode,type)
                              // if(res.data.data.fubiBalance>0){
                              //   this.orderCode = orderCode;
                              //   this.popupVisible = true;
                              // }else{
                              //   Toast('无可用积分，请选择其他支付方式');
                              //   this.$store.state.Cookie.mutations.save(1,'orderType');
                              //   this.$router.push("/shop/pay/"+orderCode)
                              // }
                            }
                        });
                    }else if(res.data.code == 181){
                        MessageBox('', '订单已经支付成功').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                            window.location.reload()
                        });
                    }else if(res.data.code == 182){
                        MessageBox('', '订单已取消').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                            window.location.reload()
                        });
                    }else if(res.data.code == 183){
                        MessageBox('', '订单已退款').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                            window.location.reload()
                        });
                    }else if(res.data.code == 184){
                        MessageBox('', '支付超时，订单已取消').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                            window.location.reload()
                        });
                    }else if(res.data.code == 502){
                      MessageBox({
                        title: '',
                        message: res.data.error,
                        showCancelButton: true,
                        confirmButtonText: '取消',
                        cancelButtonText: '解锁',
                      }).then(action => {
                        if(action=='cancel'){
                          this.standardPayCancle(1,type);
                        }else{
                          this.$router.push('/shop/orderDatails/'+this.orderCode);
                        }
                      });
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }


            },
            //放弃支付
            async standardPayCancle(type,payType) {
                try {
                    const res = await standardPayCancle({orderCode:this.orderCode,cancelType:type});
                    if (res.data.code == 0) {
                      this.createOrder(this.orderCode,payType)
                    } else if(res.data.code == 501){
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                        window.location.reload();
                      });
                    } else {
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                        window.location.reload();
                      });
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            seeCard(url){
              this.$store.state.Cookie.mutations.save(url,'shortUrl');
              this.$router.push("/verify")
            },
            //查看物流
            logistics(id) {
                this.$router.push("/shop/logistics/"+id)
            },
            //查看发票
            checkInvoice(){
                if(this.objData.orderInfo.orderConfirmStatus!=1&&this.objData.orderInfo.orderConfirmStatus!=3){
                    Toast("订单状态有误,请在完成订单后查看电子发票");
                    return;
                }else{
                    this.$router.push('/shop/elecInvoice1/'+this.orderCode);
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
            addZero(num){
              // console.log(num%1 === 0)
              //判断是否是整数,不是整数补零
              if(num%1 === 0){
                return num.toFixed(2)
              }else{
                return num
              }
            }
        }
    }
</script>

<style lang="scss" scoped>
   @import "../../../style/component/order/orderDatails.scss";


   .goods_authority {
       width: px(120px);
       height: px(36px);
       margin: px(14px) 0px;
       background: #ff8546;
       border-radius: px(6px);
       color: #fff;
       font-size: px(24px);
       line-height: px(36px);
       text-indent: px(12px);
   }
   .membership {
       width: px(170px);
   }
   .goods_period {
       height: px(24px);
       margin-top: px(-8px);
       font-size: px(24px);
       color: #969696;
   }
   .checkInvoice{
       width: px(122px);
       height: px(32px);
       line-height: px(32px);
       margin-left: px(20px);
       background: #fff;
       border: 0.5px solid #dcdcdc;
       border-radius: px(8px);
       font-size: px(20px);
       color: #323232;
       text-align: center;
       position: absolute;
       margin-left: px(280px);
       margin-top: px(-36px);
   }
   .storeName{
     color: #323232;
     font-size: px(32px);
     line-height: px(88px);
     padding-left: px(20px);
     border-bottom: 1px solid #f4f4f4;
     font-weight:600;
   }
   .goodsList{
     margin-bottom: px(20px);
     border-bottom: px(20px) solid #f4f4f4;
   }
</style>
