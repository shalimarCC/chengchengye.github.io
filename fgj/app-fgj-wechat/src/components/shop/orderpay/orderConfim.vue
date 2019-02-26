<template>
    <div class="orderConfim" v-if="showState" ref="orderConfirm">
        <div class="orderConfim_warpper">
            <div class="order_1" v-if="isDetailStore==0" v-show="isShowAddr==true">
                <div v-if="objData.receiverInfo||receiverName">
                    <div class="clear receiverInfo1">
                      <p v-if="receiverName">收货人：<span>{{receiverName}}</span></p>
                      <p v-else>收货人：<span>{{objData.receiverInfo.receiverName}}</span></p>
                      <p v-if="phoneNo">{{phoneNo}}</p>
                      <p v-else>{{objData.receiverInfo.phoneNo}}</p>
                    </div>
                    <router-link to="/shop/orderSiteList/1">
                        <div class="clear receiverInfo2">
                          <span><i class="icon-location_light iconfont"></i>收货地址：</span>
                          <b v-if="receiverAddress">{{receiverAddress}}</b>
                          <b v-else>{{objData.receiverInfo.address}}</b>
                          <i class="icon-more iconfont"></i>
                        </div>
                    </router-link>
                </div>
                <div v-else class="receiverInfo_null">
                    <router-link to="/shop/orderSiteList/1">
                        <i class="icon-location_light iconfont"></i>
                        <span>请选择收货地址</span>
                        <i class="icon-more iconfont"></i>
                    </router-link>
                </div>
            </div>

            <div class="order_2">
                <div class="goodsList" v-for="itemList in objData.goodGroupList">
                    <h5 class="storeName" v-if="itemList.merchantId!=1">{{itemList.merchantName}}</h5>
                    <h5 class="storeName" v-else>{{itemList.storeName}}</h5>
                    <ul>
                      <li class="page-loadmore-listitem clear" v-for="item in itemList.goodsList">
                        <div class="goods_left">
                          <img :src="item.puImg+'?imageMogr2/size-limit/100k!'">
                        </div>
                        <div class="goods_right">
                          <h4><span class="operateByown" v-if="item.isOwnMerchant">自营</span>{{item.puName}}</h4>
                          <div class="goods_authority" v-if="item.saleWay==4">
                            底价预售
                          </div>
                          <div class="goods_authority membership" v-if="item.saleWay==6">
                            会员底价预售
                          </div>
                          <div class="goods_period" v-if="item.saleWay==4||item.saleWay==6">预售时间{{item.preSaleDay}}天</div>
                          <span class="saleBycash" v-if="item.buyType==2">该商品仅支持现金购买</span>
                          <p class="goods_price">
                            <span>{{addZero(item.price)}}<b class="fubi">积分</b></span>
                            <b>x{{item.num}}</b>
                          </p>
                        </div>
                      </li>
                    </ul>
                    <!--选了优惠券-->
                    <!--只有一个运营方只显示总运费-->
                    <div v-if="objData.goodGroupList.length>1">
                      <div class="cell2" v-if="chooseCoupon || $store.state.useCouponId">
                        <span class="cell_title">运费</span>
                        <b v-if="itemList.couponDeliveryPrice&&itemList.couponDeliveryPrice!=0">&yen;{{itemList.couponDeliveryPrice.toFixed(2)}}</b>
                        <b v-if="itemList.couponDeliveryPrice==0">&yen;0.00</b>

                      </div>
                      <!--没选优惠券-->
                      <div class="cell2"  v-else>
                        <span class="cell_title">运费</span>
                        <b v-if="itemList.deliveryPrice&&itemList.deliveryPrice!=0">&yen;{{itemList.deliveryPrice.toFixed(2)}}</b>
                        <b v-if="itemList.deliveryPrice==0">&yen;0.00</b>
                      </div>
                    </div>

                    <div class="cell">
                      <span class="cell_title">买家留言</span>
                      <input type="text" class="cell_input" v-model="itemList.remark" placeholder="（选填）如果有其他需要请在此处说明">
                    </div>
                </div>
                <div @click="checkCoupon" class="cell" v-if="objData.couponUnitList&&objData.couponUnitList.length>0">
                    <span>优惠券</span>
                    <span v-if="checkCouponTitle==''" style="float:right;padding-left:220px;font-size:14px;">{{objData.couponUnitList.length}}张可用</span>
                    <i class="iconfont icon-more" v-if="checkCouponTitle==''"></i>
                    <span v-if="checkCouponTitle!=''" style="float:right;padding-right:10px;">已选择 : 满{{triggerAmount}}减{{couponDiscount}}</span>
                </div>

                <div v-if="!isFb || (isFb&&objData.cashPay>0)" @click="goInvoice">
                    <router-link to="/shop/orderInvoice"  class="cell" style="background: #fff">
                        <span class="cell_title">发票</span>
                        <b v-if="invoiceId==0||invoiceForm==-1">不开发票<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceType==0 && invoiceForm==0">纸质发票-个人<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceType==1 && invoiceForm==0">纸质发票-单位<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceForm==1">电子发票<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceForm==2">增值税发票<i class="iconfont icon-more"></i></b>
                    </router-link>
                </div>
                <div class="allPrice">
                  <span style="float:left;color:#000;">商品合计</span>
                  共{{objData.goodsAccount}}件商品 合计:
                  <span v-if="objData.goodsAmount!=0">{{addZero(objData.goodsAmount)}}<b>{{isFb?'积分':'元'}}</b></span>
                  <span v-if="objData.goodsAmount==0">0.00<b>{{isFb?'积分':'元'}}</b></span>
                </div>
                <div class="cell2">
                  <span class="cell_title">运费</span>
                  <b v-if="deliveryPrice">&yen;{{deliveryPrice.toFixed(2)}}</b>
                  <b v-if="deliveryPrice==0||!deliveryPrice">&yen;0.00</b>
                </div>
                <div class="cell2" v-if="objData.couponUnitList&&objData.couponUnitList.length>0&&checkCouponTitle!=''">
                  <span class="cell_title">优惠券</span>
                  <b v-if="couponDiscount!=0">-&nbsp;&yen;{{addZero(couponDiscount)}}</b>
                  <b v-else>-&nbsp;&yen;0.00</b>
                </div>
                <div class="cell2" v-if="objData.storeDiscount">
                  <span class="cell_title">门店优惠</span>
                  <b>-&nbsp;&yen;{{addZero(storeDiscount)}}</b>
                </div>
            </div>

            <div class="selectPay">
                <div class="cell_title">选择支付方式</div>
                <div class="payStatus">
                    <div v-if="showfubipay">
                      <b class="fbpay"></b>
                      <p v-if="objData.fubiBalance>0"><span>积分支付</span></p>
                      <p v-else style="color:#969696"><span>积分支付(无可用积分)</span></p>
                    </div>
                    <!--积分支付置灰-->
                    <div v-if="!showfubipay"><b class="fbpay"></b><p style="color:#969696"><span>积分支付</span></p></div>
                    <i :class="{'icon-round':!isFb,'icon-roundcheckfill':isFb}" v-if="showfubipay" @click="checkIsFb(0)" class="iconfont"></i>
                </div>
                <div class="payStatus">
                    <div><b class="otherpay"></b><p><span>其它支付</span><span>支持微信支付</span></p></div>
                    <i :class="{'icon-round':isFb,'icon-roundcheckfill':!isFb}"  @click="checkIsFb(1)" class="iconfont"></i>
                </div>
            </div>

            <div class="hint" v-if="isFb">
                <b></b>
                <p v-if="checkCouponTitle!=''">可用积分余额{{addZero(objData.fubiBalance)}},
                  可抵扣￥{{addZero(orderAmountPaidByFuBi)}},
                  抵扣后需支付{{addZero(afterDiscountCashPay)}}元</p>
                <p v-else>可用积分余额{{addZero(objData.fubiBalance)}},可抵扣￥{{addZero(orderAmountPaidByFuBi)}},抵扣后需支付￥{{addZero(objData.cashPay)}}元</p>
            </div>
        </div>


        <div class="order_bottom">
            <p>实付款:
              <!--选择优惠券-->
              <template v-if="checkCouponTitle!=''">
                <span v-if="!cashPay">{{!cashPay&&objData.cashPay==0?'':'&yen;'}} {{addZero(afterDiscountAmount)}}<b>{{!cashPay&&objData.cashPay==0?'积分':''}}</b></span>
                <span v-if="cashPay">{{!cashPay&&objData.cashPay==0?'':'&yen;'}} {{addZero(afterDiscountAmount)}}<b>{{!cashPay&&objData.cashPay==0?'积分':''}}</b></span>
              </template>
              <!--不选优惠券-->
              <template v-if="checkCouponTitle==''">
                <!--<span v-if="objData.cashPay>0">{{isFb&&(objData.cashPay==0)?'':'&yen;'}} {{addZero(objData.cashPay)}}<b>{{isFb&&(objData.cashPay==0)?'积分':''}}</b></span>-->
                <!--积分加现金-->
                <span v-if="!cashPay">{{!cashPay&&objData.cashPay==0?'':'&yen;'}} {{addZero(objData.orderAmount)}}<b>{{!cashPay&&objData.cashPay==0?'积分':''}}</b></span>
                <!--现金支付-->
                <span v-if="cashPay">{{!cashPay&&objData.cashPay==0?'':'&yen;'}} {{addZero(objData.orderAmount)}}<b>{{!cashPay&&objData.cashPay==0?'积分':''}}</b></span>
              </template>
            </p>
            <div @click="submitOrder">
                提交订单
            </div>
        </div>

        <mt-popup
            v-model="popupError"
            class="mint-popup-1"
            popup-transition="popup-fade"
            closeOnClickModal>
            <div id="popup_error">
                <div class="popup_error_title">您已经提交过一次，请勿重复提交，您可以选择支付已提交订单，或者返回首页。</div>
                <div class="popup_error_btn">
                    <div class="error_btn_home error_btn"><router-link to="/home">返回首页</router-link></div>
                    <div class="error_btn_order error_btn"><router-link to="/shop/order">查看订单</router-link></div>
                </div>
            </div>
        </mt-popup>
        <mt-popup
        v-model="popupVisible"
        position="bottom" class="mint-popup-4" :closeOnClickModal="false">
            <pay-key :order-code="orderCode" v-if="popupVisible" v-on:closePopop="closePopop"></pay-key>
        </mt-popup>
        <mt-popup
        v-model="popupVisibleCoupon"
        position="bottom" class="mint-popup-4" style="overflow-y:scroll;">
        <div class="popupBox" style="position: relative">
          <div id="propertyLimit">
            <h4>优惠券 </h4>
            <div class="couponContent">
              <div v-for="(item,key) in couponList" class="couponInfo" v-if="item.couponUnitStatus==0">
                <div class="couponTop">
                  <div class="couponPrice" v-if="item.couponType==0&&(item.couponUnitStatus==0)">
                    <span class="price1">{{item.discountAmount}}元</span>
                    <span class="price2">满{{item.triggerAmount}}元可用</span>
                  </div>
                  <div class="couponPrice noprice" v-if="item.couponType==0&&(item.couponUnitStatus!=0)">
                    <span class="price1">{{item.discountAmount}}元</span>
                    <span class="price2">满{{item.triggerAmount}}元可用</span>
                  </div>
                  <div class="couponLogo" v-if="item.couponType==1&&item.couponUnitStatus==0"></div>
                  <div class="couponLogo noLogo" v-if="item.couponType==1&&item.couponUnitStatus!=0"></div>
                  <div class="couponTime">
                    <span class="title">{{item.title}}</span>
                    <div class="soonExpire" v-if="item.isSoonExpire&&item.couponUnitStatus!=3"></div>
                    <div class="logos got" v-if="item.couponUnitStatus==3"></div>
                    <div class="logos used" v-if="item.couponUnitStatus==1"></div>
                    <span class="time">
                    {{item.effectTimeRange}}
                    <template class="timeCheck">
                        <input type="checkbox" class="mint-checkbox-input" v-model="item.check">
                        <i :class="{'icon-round':!item.check,'icon-roundcheckfill':item.check}" class="iconfont checkDot" @click="useCoupon(key)"></i>
                    </template>
                  </span>
                    <div class="dot"></div>
                  </div>
                </div>
                <div :class="[keyvalue == key?'couponDetail':'couponDetail fixedHeight']">
                  <span class="detail">{{item.detail}}</span>
                  <span :class="[keyvalue == key?'pullUp':'pulldown']" @click="showMore(key)"></span>
                </div>
              </div>
            </div>

            <div class="btn2" @click="submitCoupon">确认</div>
          </div>
          <div class="close">
            <i class="iconfont icon-close" @click="closeCouponLimit"></i>
          </div>
        </div>
      </mt-popup>
    </div>
</template>

<script>
    window.addEventListener('resize', function () {
    if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
      window.setTimeout(function () {
        document.activeElement.scrollIntoViewIfNeeded();
      }, 0);
    }
    });
    import Cookie from '../../../config/mUtils'
    import {orderConfirm,
      createOrder,
      userPayInfo,
      standardOrderQueryAtPayInvoke,
      standardPayCancle,
      findReceiverAddressAll,
      checkExchangeAndCouponBatch,
      exchangeRightNow,
      unfreezeSoFubi,
      foscoinAccountDeduct
    } from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import payKey from './payKey';
    import { payUrl } from '../../../config/env'
    export default{

        data(){
            return{
                objData:{

                },
                showState:false,
                popupVisible1:false,
                popupVisible2:false,
                popupError:false,
                isDetailStore:'',
                isShowAddr:'',
                form:{
                    receiveAddressId:'',
                    remark:'',
                    taxNo:'',
                },
                isFb:true,
                invoiceId:0,
                invoiceType:'',
                invoiceForm:'',
                popupVisible:false,
                havePpwd:'',
                orderCode:'',
                couponDiscount:0,
                couponList:[],
                popupVisibleCoupon:false,
                checkCouponType:'',
                checkCouponUnitId:'',
                checkCouponTitle:'',
                keyvalue:-1,
                afterDiscountAmount:'',
                triggerAmount:'',
                storeName:'福管加',
                deliveryPrice:0,
                remarkList:'',
                storeDiscount:'',
                chooseCoupon:false,
                siteShow:false,
                siteList:[],
                receiverName:'',
                phoneNo:'',
                receiverAddress:'',
                scrollTop:'',
                showfubipay:true,
                orderAmountPaidByFuBi:'',
                couponPuId:'',
                couponNum:'',
                cashPay:false,
                isonlyFubi:false,
              afterDiscountCashPay:""
            }
        },
        created(){
           this.findReceiverAddressAll();
        },
        activated () {
            this.afterDiscountAmount = 0;
            this.couponDiscount = 0;
            for(var i=0;i<this.couponList.length;i++){
              this.couponList[i].check = false;
            }
            this.checkCouponType = '';
            this.checkCouponUnitId = '';
            this.checkCouponTitle = '';
            this.invoiceId = this.$store.state.invoiceId;
            this.invoiceType = this.$store.state.invoiceType;
            this.invoiceForm = this.$store.state.invoiceForm;
            this.userPayInfo();
            this.orderConfirm();
            this.findReceiverAddressAll();
            this.popupError = false;
            Indicator.open();
        },
        mounted(){

        },
        watch : {
            '$store.state.invoiceId': {
                handler(curVal,oldVal){
                    this.invoiceId = this.$store.state.invoiceId;
                    this.invoiceType = this.$store.state.invoiceType;
                    this.invoiceForm = this.$store.state.invoiceForm;
                }
            },
            '$store.state.siteId': {
                handler(curVal,oldVal){
                    this.form = {
                        receiveAddressId:'',
                        remark:'',
                        taxNo:'',
                    };
                }
            },
            "$route" : {
                handler(curVal,oldVal){
                    if((/\/shop\/goods/.test(oldVal.path)&&/\/shop\/orderConfim/.test(curVal.path))||/\/shop\/shopCart/.test(oldVal.path)){
                       this.userPayInfo();
                       // this.orderConfirm();
                    }
                },
                deep:true
            },

        },
        components: {
            payKey
        },
        methods:{
            submitCoupon(){
              this.popupVisibleCoupon = false;
            },
            async orderConfirm() {
                try {
                    //扫码直接进订单页的判断
                    if(this.$store.state.Cookie.mutations.fetch('type')=='puo'||this.$route.query.puId){
                      var obj = new Object();
                      obj.puId = this.$route.query.puId||this.$store.state.Cookie.mutations.fetch('typeID');
                      obj.storeId = 1;
                      obj.num = this.$route.query.num||1;
                      obj.type = 0;
                      if(this.isDetailStore!=0){
                        // obj.addrId = this.$store.state.siteId;
                        obj.addrId = this.$store.state.mutations.fetch('siteId');
                      }
                      obj = JSON.parse(JSON.stringify(obj));
                    }else{
                      this.$store.state.Cookie.mutations.save('','typeID');
                      var obj = JSON.parse(JSON.stringify(this.$store.state.skuObj));
                      if(this.isDetailStore!=0){
                        obj.addrId = this.$store.state.mutations.fetch('siteId');
                      }
                      obj.storeId = '1';
                    }
                    var _this = this;
                    this.deliveryPrice =0;
                    const res = await orderConfirm(obj);
                    if (res.data.code == 0) {
                         this.deliveryPrice =0;
                         Indicator.close();
                         this.objData = res.data.data;
                         this.couponList = res.data.data.couponUnitList;
                         this.storeDiscount = this.$store.state.useCouponId ?'': this.objData.storeDiscount;
                          //选择发票后回显优惠券信息
                          $.each(this.couponList,function (key,info) {
                            if(_this.$store.state.useCouponId){
                              if(_this.$store.state.useCouponId == info.id){
                                  info.check = 1;
                                  _this.couponDiscount = info.couponDiscount;
                                  _this.afterDiscountAmount = info.afterDiscountAmount;
                                  _this.triggerAmount = info.triggerAmount;
                                  _this.checkCouponTitle = info.checkCouponTitle;
                                  _this.storeDiscount = info.storeDiscount;
                                  _this.checkCouponType = info.couponType;
                                  _this.checkCouponUnitId = info.id;
                                  for(var k=0;k<info.deliveryPriceList.length;k++){
                                    for(var i=0;i<_this.objData.goodGroupList.length;i++){
                                      if(_this.objData.goodGroupList[i].merchantId == info.deliveryPriceList[k].merchantId){
                                        _this.objData.goodGroupList[i].couponDeliveryPrice = info.deliveryPriceList[k].deliveryPrice;
                                        _this.orderAmountPaidByFuBi = info.orderAmountPaidByFuBi;
                                      }
                                    }
                                  }
                                  for(var i=0; i<info.deliveryPriceList.length;i++){
                                    _this.deliveryPrice += info.deliveryPriceList[i].deliveryPrice;
                                  }
                              }
                            }
                          });
                         this.deliveryPrice = this.objData.totalDeliveryPrice;
                         this.isDetailStore = res.data.data.isDetailStore ? res.data.data.isDetailStore : 0;
                         this.isShowAddr = res.data.data.isShowAddr;
                         if(res.data.data.receiverInfo){
                            this.form.receiveAddressId = res.data.data.receiverInfo.id;

                         }
                        this.showState = true;
                        if(this.objData.fubiBalance<=0){ //无积分
                          this.isFb = false;
                          this.cashPay = true;  //仅现金支付
                          this.showfubipay = false;  //积分支付置灰
                        }else {
                          //积分大于0且运费大于0，仅现金支付也可选积分支付运费；
                          if(this.objData.totalDeliveryPrice>0) {
                            this.isFb = true;
                            this.cashPay = false; //积分加现金
                            this.showfubipay = true;
                          }else{
                            if(this.objData.isPayByCashOnly==0){
                              this.cashPay = false; //积分加现金
                              this.isFb = true;
                              this.showfubipay = true;
                            }else{
                              this.cashPay = true;  //仅现金支付
                              this.isFb = false;
                              this.showfubipay = false;  //积分支付置灰
                            }
                          }
                        }
                        if(this.$store.state.Cookie.mutations.fetch('isFb')==1){
                          this.isFb = false;
                          this.cashPay = true;  //仅现金支付
                        }else{
                          if(this.objData.fubiBalance<=0){ //无积分
                            this.isFb = false;
                            this.cashPay = true;  //仅现金支付
                            this.showfubipay = false;  //积分支付置灰
                          }else {
                            //积分大于0且运费大于0，仅现金支付也可选积分支付运费；
                            if(this.objData.totalDeliveryPrice>0) {
                              this.isFb = true;
                              this.cashPay = false; //积分加现金
                              this.showfubipay = true;
                            }else{
                              if(this.objData.isPayByCashOnly==0){
                                this.cashPay = false; //积分加现金
                                this.isFb = true;
                                this.showfubipay = true;
                              }else{
                                this.cashPay = true;  //仅现金支付
                                this.isFb = false;
                                this.showfubipay = false;  //积分支付置灰
                              }
                            }
                          }
                        }
                        this.orderAmountPaidByFuBi= this.objData.orderAmountPaidByFuBi;
                        if(!this.$store.state.Cookie.mutations.fetch('siteId')){
                          this.receiverName ='';
                        }

                    }else{
                        Indicator.close();
                        MessageBox('提示', res.data.error).then(action => {
                            this.$router.go(-1);
                        });
                    }
                } catch (err) {
                    Indicator.close();
                    Toast(err);
                }
            },
            useCoupon(key){
              this.afterDiscountAmount = 0;
              this.couponDiscount = 0;
              var _this = this;
              var checkTag = 0;
              this.deliveryPrice=0;
              if(this.couponList[key].check==true){
                checkTag = 1;
              }
              for(var i=0;i<this.couponList.length;i++){
                this.couponList[i].check = false;
              }
              if(checkTag==0){
                  this.chooseCoupon = true;
                  this.couponList[key].check = !this.couponList[key].check;
                  this.checkCouponType = this.couponList[key].couponType;
                  this.checkCouponUnitId = this.couponList[key].id;
                  this.checkCouponTitle = this.couponList[key].title;
                  this.couponDiscount = this.couponList[key].couponDiscount;
                  this.afterDiscountAmount = this.couponList[key].afterDiscountAmount;
                  this.afterDiscountCashPay = this.couponList[key].afterDiscountCashPay;
                  this.triggerAmount = this.couponList[key].triggerAmount;
                  this.storeDiscount = this.couponList[key].storeDiscount;
                  this.deliveryPrice = 0;
                  //选择优惠券显示运费
                  for(var j=0;j<this.couponList[key].deliveryPriceList.length;j++){
                    for(var i=0;i<this.objData.goodGroupList.length;i++){
                      if(this.objData.goodGroupList[i].merchantId == this.couponList[key].deliveryPriceList[j].merchantId){
                        this.objData.goodGroupList[i].couponDeliveryPrice = this.couponList[key].deliveryPriceList[j].deliveryPrice;
                        this.orderAmountPaidByFuBi  = this.couponList[key].orderAmountPaidByFuBi;
                      }
                    }
                    if(this.afterDiscountAmount==0){
                      this.showfubipay = false; //0元积分置灰
                    }
                    //计算总运费
                    this.deliveryPrice += this.objData.goodGroupList[j].couponDeliveryPrice
                  }
                  this.$store.dispatch("setUseCouponId",this.checkCouponUnitId);
              }else if(checkTag==1){
                  this.chooseCoupon=false;
                  this.deliveryPrice=0;
                  this.couponList[key].check = false;
                  this.checkCouponType = '';
                  this.checkCouponUnitId = '';
                  this.checkCouponTitle = '';
                  this.couponDiscount = 0;
                  this.afterDiscountAmount = 0;
                  this.storeDiscount = this.objData.storeDiscount;
                  this.$store.dispatch("setUseCouponId",'');
                  this.orderAmountPaidByFuBi = this.objData.orderAmountPaidByFuBi;
                  $.each(this.objData.goodGroupList,function (key,info) {
                    _this.deliveryPrice +=info.deliveryPrice;
                  })
                  if(this.objData.fubiBalance>0){
                    if(this.objData.totalDeliveryPrice>0) {
                      this.showfubipay = true;
                    }else{
                      if(this.objData.isPayByCashOnly==0){
                        this.showfubipay = true;
                      }else{
                        this.showfubipay = false;  //积分支付置灰
                      }
                    }
                  }


              }
                  this.$set(this.couponList, key, this.couponList[key]);
            },
            async orderSite() {
                try {
                    var obj = JSON.parse(JSON.stringify(this.$store.state.skuObj));
                    obj.addrId = this.$store.state.Cookie.mutations.fetch('siteId');
                    const res = await orderConfirm(obj);
                    if (res.data.code == 0) {
                        this.objData.receiverInfo = res.data.data.receiverInfo;
                        this.form.receiveAddressId = res.data.data.receiverInfo.id;
                    }else{
                        Indicator.close();
                        MessageBox('提示', res.data.error).then(action => {
                            this.$router.go(-1);
                        });
                        this.popupError = true;
                    }
                } catch (err) {
                    Indicator.close();
                    Toast('网络错误');
                    this.popupError = true;
                }
            },
          //提交订单
          submitOrder(){

              // console.log(this.$store.state.fromcoupon)
            if(this.$store.state.fromcoupon){
                this.checkExchangeAndCouponBatch(this.$store.state.Cookie.mutations.fetch('exchangeCouponUnitId'),this.$store.state.Cookie.mutations.fetch('exchangeCouponBatchId'),this.$store.state.Cookie.mutations.fetch('exchangeId'))
            }else{
              this.createOrder()
            }
          },
            //兑换流程中的优惠券校验
            async checkExchangeAndCouponBatch(id,couponBatchId,exchangeId) {
              try{
                const res = await checkExchangeAndCouponBatch({exchangeCouponBatchId:couponBatchId,exchangeCouponUnitId:id,exchangeId:exchangeId,type:2});
                if(res.data.code == 0){
                  if(res.data.data.exchangeType==0||res.data.data.exchangeType==4){
                    this.couponPuId = res.data.data.puId;
                    this.couponNum = res.data.data.num;
                    this.createOrder()
                  }else if(res.data.data.exchangeType==1){
                    this.exchangeRightNow(id,couponBatchId,exchangeId);
                  }else if(res.data.data.exchangeType==2){
                    this.$router.push('/shop/orderDatails/'+res.data.data.orderCode);
                  }else if(res.data.data.exchangeType==3){  //取消订单
                    this.couponPuId = res.data.data.puId;
                    this.couponNum = res.data.data.num;
                    this.cacelOrderAjax(res.data.data.orderCode)
                  }
                }else if(res.data.code==201||res.data.code==198||res.data.code==202){
                  MessageBox('提示', res.data.error).then(action => {
                    this.$router.go(-1);
                  });
                }else{
                  Toast(res.data.error)
                }
              }catch (e) {
              }
            },
            //以旧换新 立即兑换
            async exchangeRightNow(id,couponBatchId,exchangeId) {
              try{
                const res = await exchangeRightNow({exchangeCouponBatchId:couponBatchId,exchangeCouponUnitId:id,exchangeId:exchangeId});
                if(res.data.code == 0){
                  MessageBox('提示', '兑换成功').then(action => {
                    this.$router.go(-1);
                  })
                }else if(res.data.code==201||res.data.code==198){
                  MessageBox('提示', res.data.error).then(action => {
                    this.$router.go(-1);
                  });
                }
              }catch (e) {

              }
            },
          //取消订单
          async cacelOrderAjax(id) {
            try {
              const res = await unfreezeSoFubi({orderCode:id});
              if (res.data.code == 0) {
                this.createOrder()
              } else {
                Toast(res.data.error);
              }
            } catch (err) {
              Toast('网络错误');
            }
          },
            async exchangeRightNow(id,couponBatchId,exchangeId) {
            try{
              const res = await exchangeRightNow({exchangeCouponBatchId:couponBatchId,exchangeCouponUnitId:id,exchangeId:exchangeId});
              if(res.data.code == 0){
                MessageBox('提示', '兑换成功').then(action => {
                  this.$router.go(-1);
                })
              }else if(res.data.code==201||res.data.code==198){
                MessageBox('提示', res.data.error).then(action => {
                  this.$router.go(-1);
                });
              }
            }catch (e) {

            }
          },
            async findReceiverAddressAll() {
              try {
              const res = await findReceiverAddressAll();
                if (res.data.code == 0) {
                  if(res.data.data.list.length == 0){
                    this.siteShow = false;
                  }else{
                    this.siteShow = true;
                    this.siteList = res.data.data.list;
                    // var id = this.$store.state.siteId;
                    var id = this.$store.state.Cookie.mutations.fetch('siteId');
                    if(id){
                      for(var i=0;i<this.siteList.length;i++){
                        if(this.siteList[i].id == id){
                          this.receiverName = this.siteList[i].goodReceiverName;
                          this.phoneNo = this.siteList[i].goodReceiverMobile;
                          this.receiverAddress = this.siteList[i].goodReceiverProvince
                            +this.siteList[i].goodReceiverCity
                            +this.siteList[i].goodReceiverCounty
                            +this.siteList[i].goodReceiverAddress;
                        }
                      }
                    }
                  }
                } else {

                }
            } catch (err) {
              Toast('网络错误');
            }
          },
            checkInvoice(){
                this.invoiceCheck = !this.invoiceCheck;
            },

            //选择是否使用积分
            async checkIsFb(type){
                try {
                    this.$store.state.Cookie.mutations.save(type,'isFb');
                    const res = await userPayInfo();
                    if (res.data.code == 0) {
                        this.scrollTop = this.$refs.orderConfirm.scrollTop;
                        this.$refs.orderConfirm.scrollTop = this.scrollTop + 55;
                        this.havePpwd = res.data.data.havePpwd;
                        if(type==0 && this.objData.fubiBalance>0){
                            if(this.havePpwd){ //是否设置支付密码
                                this.isFb = true;
                                this.cashPay = false; //积分加现金
                            }else{
                                this.$router.push('/set/payPsd1');
                            }
                        }else if(type==0 && this.objData.fubiBalance<=0){
                            Toast('积分余额不足');
                        }else{
                            this.isFb = false;
                            this.cashPay = true; //仅现金
                        }
                        }else  {
                            Indicator.close();
                            Toast(res.data.error);
                        }
                } catch (err) {
                        Toast('网络错误');
                        Indicator.close();
                }


            },

            //提交创建订单
            async createOrder() {
                try {

                    var obj = new Object();
                    if(this.$store.state.skuObj.type==0){
                         obj.puId = this.$store.state.skuObj.puId;
                         obj.num = this.$store.state.skuObj.num;
                    }else{
                         obj.cartItemIds = this.$store.state.skuObj.cartItemIds
                    }

                    if(this.$store.state.skuObj.phone){
                         obj.phone = this.$store.state.skuObj.phone;
                    }
                    if(this.form.receiveAddressId){
                      if(this.$store.state.Cookie.mutations.fetch('siteId')!=''){
                        obj.receiveAddressId = this.$store.state.Cookie.mutations.fetch('siteId');
                      }else{
                        obj.receiveAddressId = this.form.receiveAddressId;
                      }
                    }else{
                      if(this.$store.state.Cookie.mutations.fetch('siteId')!=''){
                        obj.receiveAddressId = this.$store.state.Cookie.mutations.fetch('siteId');
                      }else{
                        obj.receiveAddressId = 0;
                      }
                    }
                    obj.type = this.$store.state.skuObj.type;
                    if(this.$store.state.Cookie.mutations.fetch('type')=='puo') {
                      obj.puId = this.$store.state.Cookie.mutations.fetch('typeID');
                      obj.num = 1;
                      obj.type = 0;
                    }

                    //传jason格式的运费
                    obj.deliveryPrice={};
                    obj.remark={};
                    for(var i=0;i<this.objData.goodGroupList.length;i++){
                      if(this.checkCouponUnitId!=''){
                        obj.deliveryPrice[this.objData.goodGroupList[i].merchantId]=this.objData.goodGroupList[i].couponDeliveryPrice;
                      }else{
                        obj.deliveryPrice[this.objData.goodGroupList[i].merchantId]=this.objData.goodGroupList[i].deliveryPrice;
                      }

                      obj.remark[this.objData.goodGroupList[i].merchantId]=this.objData.goodGroupList[i].remark;
                    }
                    console.log(obj.deliveryPrice)
                    obj.deliveryPrice = JSON.stringify(obj.deliveryPrice).toString();

                    obj.remark = JSON.stringify(obj.remark).toString();
                    obj.invoiceId = this.isFb ? '':this.$store.state.invoiceId;

                    obj.useFubi = this.isFb ? 1 : 0;
                    obj.storeId = '1';
                    if(this.checkCouponUnitId!=''){
                      obj.couponType = this.checkCouponType;
                      obj.couponUnitId = this.checkCouponUnitId;
                    }
                    if(this.$store.state.fromcoupon){
                      obj.puId = this.couponPuId;
                      obj.num = this.couponNum;
                      obj.receiveAddressId =0;
                      obj.orderType = 8;
                      obj.exchangeCouponUnitId = this.$store.state.Cookie.mutations.fetch('exchangeCouponUnitId');
                      obj.exchangeCouponBatchId = this.$store.state.Cookie.mutations.fetch('exchangeCouponBatchId');
                      obj.exchangeId = this.$store.state.Cookie.mutations.fetch('exchangeId');
                    }
                    const res = await createOrder(obj);
                    if (res.data.code == 0) {
                        this.$store.state.Cookie.mutations.save('','isFb');
                        this.$store.dispatch("setUseCouponId",'');
                        this.orderCode = res.data.data.orderCode;
                        this.standardOrderQueryAtPayInvoke(res.data.data.orderCode);
                    }else if (res.data.code == 131) {
                        MessageBox('提示', '该商品已下架').then(action => {
                            this.$router.go(-1);
                        });
                    }else if (res.data.code == 133) {
                        MessageBox('提示', '库存不足').then(action => {
                            this.$router.go(-1);
                        });
                    }else if (res.data.code == 134) {
                        this.popupError = true;
                    }else if(res.data.code==190||res.data.code==191||res.data.code==192){
                        MessageBox('提示', res.data.error).then(action => {
                          this.$router.go(-1);
                        });
                    }else{
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            async standardOrderQueryAtPayInvoke(orderCode) {
                try {
                    const res = await standardOrderQueryAtPayInvoke({orderCode:orderCode});
                    if (res.data.code == 0) {
                      let obj = new Object();
                      obj.needPayCash = res.data.data.needPayCash;
                      obj.orderAmount = res.data.data.orderAmount;
                      obj.fubiBalance = res.data.data.fubiBalance;
                      obj.goodsAccount = res.data.data.goodsAccount;
                      this.$store.dispatch("setOrderInfo",obj);
                      // console.log(this.$store.state.orderInfo)
                      if(res.data.data.orderAmount==0){ //订单支付金额为0时特殊处理
                          this.foscoinAccountDeduct(orderCode);
                      }else{
                        if(this.isFb){
                          if(res.data.data.fubiBalance>0){
                            if(this.havePpwd){
                              this.$store.state.Cookie.mutations.save(res.data.data.fubiBalance,'fubiPay');
                              this.popupVisible = true;
                            }else{
                              this.$router.push('/set/payPsd1');
                            }
                          }else{
                            Toast('请选择支付方式');
                            return
                          }
                        }else{
                          this.$store.dispatch("setInvoiceForm",'');
                          this.$store.dispatch("setInvoiceId",'');
                          this.$store.dispatch("setInvoiceType",'');
                          this.$store.state.Cookie.mutations.save('','siteId');
                          this.$store.state.Cookie.mutations.save(1,'orderType');
                          this.$router.push('/shop/pay/'+ this.orderCode);
                        }
                      }

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
                                    this.standardPayCancle(0);
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
                        }else if(res.data.code==502){
                          MessageBox({
                            title: '',
                            message: res.data.error,
                            showCancelButton: true,
                            confirmButtonText: '取消',
                            cancelButtonText: '解锁',
                          }).then(action => {
                            if(action=='cancel'){
                              this.standardPayCancle(1);
                            }else{
                              this.$router.push('/shop/orderDatails/'+this.orderCode);
                            }
                          });
                        }else if(res.data.code==190||res.data.code==191||res.data.code==192){
                          MessageBox('', res.data.error).then(action => {
                            this.$router.go(-1);
                          });
                        }
                    }
                } catch (err) {
                    Toast('网络错误');
                }
            },
            //支付金额为0时
            async foscoinAccountDeduct(orderCode) {
              try {
                const res = await foscoinAccountDeduct({orderCode:orderCode});
                if (res.data.code == 0) {
                  if(res.data.data.payStatus==0){
                    if(res.data.data.orderType==3){
                      this.$store.state.Cookie.mutations.save(orderCode,'couponOrderCode');
                      this.$router.push('/couponResult');
                    }else{
                      this.$router.push('/shop/orderDatails/'+orderCode);
                    }
                  }else{
                    this.$router.push('/shop/pay/'+ this.orderCode);
                  }
                }else if(res.data.code ==186){ //订单状态异常
                  MessageBox('',  res.data.error).then(action => {
                    this.$router.push('/shop/orderDatails/'+orderCode);
                  });
                } else {
                  MessageBox('', '取消支付失败').then(action => {
                    this.$router.push('/shop/orderDatails/'+orderCode);
                  });
                }
              } catch (err) {
                Toast(err);
              }
            },
            //放弃支付
            async standardPayCancle(type) {
                try {
                    const res = await standardPayCancle({orderCode:this.orderCode,cancelType:type});
                    if (res.data.code == 0) {
                        this.standardOrderQueryAtPayInvoke(this.orderCode);
                        // this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                    }else if(res.data.code == 501){
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


            //关闭键盘
            closePopop(){
                this.popupVisible = false;
            },
            //判断用户是否有支付密码
            async userPayInfo(){
                try {
                    const res = await userPayInfo();
                    if (res.data.code == 0) {
                        this.havePpwd = res.data.data.havePpwd;

                    }else  {
                        Indicator.close();
                        Toast(res.data.error);
                    }
                } catch (err) {
                        Toast('网络错误');
                        Indicator.close();
                }
            },
            //选择优惠券
            checkCoupon(){
              this.popupVisibleCoupon=true;
            },
            //关闭优惠券信息
            closeCouponLimit(){
              this.popupVisibleCoupon = false;
            },

            //下拉优惠券显示详情
            showMore(key){
                if(this.keyvalue == key){
                    this.keyvalue = -1;
                }else{
                    this.keyvalue = key;
                }
            },
            goInvoice(){
              // this.$store.dispatch("setInvoiceForm",-1);
            },
            addZero(num){
              // console.log(num%1 === 0)
              //判断是否是整数,不是整数补零
              if(num%1 === 0){
                return num.toFixed(2)
              }else{
                return num
              }
            },
        }
    }
</script>

<style lang="scss" scoped>
 @import "../../../style/component/orderpay/orderConfim.scss";
 .couponInfo{
   width:px(702px);
   /*height:px(224px);*/
   background:#fff;
   border-radius:px(10px);
   border: 1px solid #969696;
   margin: px(24px) px(20px);
   position: relative;
   .couponTop{
     width:px(702px);
     height:px(156px);
   }
   .couponLogo{
     display: inline-block;
     width: px(200px);
     height: px(156px);
     background-image:url(../../../../static/assets/img/couponLogo@2x.png);
     background-size: 100%;
     border-radius: px(10px) 0 0 0;
   }
   .noLogo{
     background-image:url(../../../../static/assets/img/invalidLogo@2x.png);
   }
   .couponPrice{
     display: inline-block;
     width: px(200px);
     height: px(156px);
     background: #e24167;
     color: #fff;
     text-align: center;
     border-radius: px(10px) 0 0 0;
     .price1{
       margin-top: px(28px);
       font-size: px(30px);
       display: block;
     }
     .price2{
       margin-top: px(32px);
       font-size: px(22px);
       display: block;
     }
   }
   .noprice{
     background: #9b9b9b;
     display: inline-block;
     width: px(200px);
     height: px(156px);
     color: #fff;
     text-align: center;
     border-radius: px(10px) 0 0 0;
     .price1{
       margin-top: px(28px);
       font-size: px(30px);
       display: block;
     }
     .price2{
       margin-top: px(32px);
       font-size: px(22px);
       display: block;
     }
   }
   .couponTime{
     display: inline-block;
     position: relative;
     float: right;
     width: px(502px);
     height: px(156px);
     font-size: px(26px);
     color: #323232;
     border-radius: 0 px(10px) 0 0;
     .title{
       margin-top: px(24px);
       margin-left: px(10px);
       font-size: px(26px);
       display: block;
     }
     .time{
       margin-top: px(58px);
       margin-left: px(10px);
       font-size: px(20px);
       display: block;
       .get{
         width: px(124px);
         height: px(36px);
         float: right;
         margin-right: px(26px);
         margin-top: px(-8px);
         border: 1px solid #e24167;
         border-radius: px(8px);
         font-size: px(22px);
         line-height: px(36px);
         color: #e24167;
         text-align: center;
         z-index:10;
       }
       .use{
         width: px(124px);
         height: px(36px);
         float: right;
         margin-right: px(26px);
         margin-top: px(-8px);
         border: 1px solid #e24167;
         border-radius: px(8px);
         background:#e24167;
         font-size: px(22px);
         line-height: px(36px);
         color: #fff;
         text-align: center;
         z-index:10;
       }
     }
     .soonExpire{
       position: absolute;
       width: px(94px);
       height: px(94px);
       background-image:url(../../../../static/assets/img/soonExpire@2x.png);
       background-size: 100%;
       top: 0px;
       right: 0px;
       z-index:10;
     }
     .logos{
       position: absolute;
       width: px(94px);
       height: px(94px);
       top: px(22px);
       right: px(26px);
       z-index: 0;
     }
     .expired{
       background-image:url(../../../../static/assets/img/expired@2x.png);
       background-size: 100%;
     }
     .got{
       background-image:url(../../../../static/assets/img/got@2x.png);
       background-size: 100%;
     }
     .used{
       background-image:url(../../../../static/assets/img/used@2x.png);
       background-size: 100%;
     }
     .dot{
       position: absolute;
       bottom: 0px;
       width:100%;
       height:px(4px);
       background-image:url(../../../../static/assets/img/dot@2x.png);
     }
   }
   .couponDetail{
     width: px(702px);
     /*height: px(68px);*/
     font-size: px(26px);
     color: #323232;
     border-radius: 0 0 px(10px) px(10px);
     .detail{
       width: px(602px);
       margin-left: px(26px);
       margin-top: px(14px);
       display: inline-block;
       font-size: px(22px);
       line-height: px(44px);
       color: #969696;
       overflow: hidden;

       /*white-space: nowrap;*/

     }
     .pulldown{
       background-image:url(../../../../static/assets/img/cms/down@2x.png);
       background-size: 100%;
       width: px(30px);
       height: px(30px);
       position: absolute;
       right: px(30px);
       margin-top: px(20px);
     }
     .pullUp{

       background-image:url(../../../../static/assets/img/cms/up@2x.png);
       background-size: 100%;
       width: px(30px);
       height: px(30px);
       position: absolute;
       right: px(30px);
       margin-top: px(20px)
     }

   }
   .fixedHeight{
     height: px(63px);
     overflow: hidden;
   }
 }
 .timeCheck {
   height: 100%;
   i {
     font-size: px(32px);
     line-height: px(200px);
   }
   .icon-roundcheckfill {
     color: #ff8546;
   }
 }

 .checkDot {
   float: right;
   margin-right: px(24px);
   color: #ff8546;
 }
 .icon-round{
   color: #969696

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
    background: #fff;
  }
  .btn2{
    position: fixed;
    bottom: 0;
    background: #ff8546;
    color: #fff;
    text-align: center;
    line-height: 1.33333rem;
    width: 100%;
    /*border-radius: 5px;*/
    font-size: 0.37333rem;
    z-index: 2009;
  }
  .couponContent{
    height: px(553px);
    overflow: hidden;
    overflow-y: scroll;
  }
  .couponContent::-webkit-scrollbar{
    display: none;
  }
</style>
