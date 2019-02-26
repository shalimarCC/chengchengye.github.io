<template>
    <div class="orderConfim" v-if="showState">
        <div class="orderConfim_warpper">
            <div class="order_1" v-if="isDetailStore==0" v-show="isShowAddr==true">
                <div v-if="objData.receiverInfo!=null||receiverName!=''">
                    <div class="clear receiverInfo1">
                        <p v-if="receiverName!=''">收货人：<span>{{receiverName}}</span></p>
                        <p v-else>收货人：<span>{{objData.receiverInfo.receiverName}}</span></p>
                        <p v-if="phoneNo!=''">{{phoneNo}}</p>
                        <p v-else>{{objData.receiverInfo.phoneNo}}</p>
                    </div>
                    <router-link to="/shop/orderSiteList/2">
                        <div class="clear receiverInfo2">
                            <span><i class="icon-location_light iconfont"></i>收货地址：</span>
                            <b v-if="receiverAddress!=''">{{receiverAddress}}</b>
                            <b v-else>{{objData.receiverInfo.address}}</b>
                            <i class="icon-more iconfont"></i>
                        </div>
                    </router-link>
                </div>
                <div v-else class="receiverInfo_null">
                    <router-link to="/shop/orderSiteList/2">
                        <i class="icon-location_light iconfont"></i>
                        <span>请选择收货地址</span>
                        <i class="icon-more iconfont"></i>
                    </router-link>
                </div>
            </div>

            <div class="order_2">
                <ul style="background: #fff">
                    <h5 class="storeName" v-if="objData.goodGroupList[0].merchantId!=1">{{objData.goodGroupList[0].merchantName}}</h5>
                    <h5 class="storeName" v-else>{{objData.goodGroupList[0].storeName}}</h5>
                    <li class="page-loadmore-listitem clear" v-for="item in objData.goodGroupList[0].goodsList">
                        <div class="goods_left">
                            <!-- <img v-lazy="item.puImg+'?imageMogr2/size-limit/100k!'"> -->
                            <img :src="item.puImg">
                        </div>
                        <div class="goods_right">
                            <h4><span class="operateByown" v-if="item.isOwnMerchant">自营</span>{{item.puName}}</h4>
                            <div class="goods_authority" v-if="item.saleWay==4">
                                底价预售
                            </div>
                            <div class="goods_authority membership" v-if="item.saleWay==6">
                                会员底价预售
                            </div>
                            <div class="goods_period" v-if="item.saleWay==4||item.saleWay==6" style="margin-top:10px;">预售时间{{item.preSaleDay}}天</div>
                            <p class="goods_price">
                                <!--<span><b>￥</b>{{item.price.toFixed(2)}}</span>-->
                                <!--<b>x{{item.num}}</b>-->
                            </p>
                        </div>
                    </li>
                </ul>
                <!--<div class="cell2">-->
                  <!--<span class="cell_title">运费</span>-->
                  <!--<b>&yen;{{objData.goodGroupList[0].deliveryPrice.toFixed(2)}}</b>-->
                <!--</div>-->
                <!-- <div @click="checkCoupon" class="cell" v-if="objData.couponUnitList&&objData.couponUnitList.length>0"> -->
                <div @click="checkCoupon" class="cell">
                    <span>优惠券</span>
                    <!-- <i class="iconfont icon-more"></i> -->
                    <span v-if="checkCouponTitle!=''" style="float:right;padding-right:10px;">已使用 : {{checkCouponTitle}}</span>
                    <span v-if="checkCouponTitle==''" style="float:right;padding-right:10px;">商品兑换券</span>
                </div>

                <!-- <div v-if="!isFb || (isFb&&objData.cashPay>0)">
                    <router-link to="/shop/orderInvoice"  class="cell">
                        <span class="cell_title">发票</span>
                        <b v-if="invoiceId==0">不开发票<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceType==0 && invoiceForm==0">纸质发票-个人<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceType==1 && invoiceForm==0">纸质发票-单位<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceForm==1">电子发票<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceForm==2">增值税发票<i class="iconfont icon-more"></i></b>
                    </router-link>
                </div> -->



                <div class="cell">
                    <span class="cell_title">买家留言</span>
                    <input type="text" class="cell_input" v-model="objData.goodGroupList[0].remark" placeholder="请输入对本次交易的说明">
                </div>

            </div>

            <!-- <div class="allPrice">
                <span style="float:left;color:#000;">商品合计</span>
                共{{objData.goodsAccount}}件商品 合计:
                <span>{{objData.goodsAmount.toFixed(2)}}<b>元</b></span>
            </div>
            <div class="cell2" v-if="objData.couponUnitList&&objData.couponUnitList.length>0">
                <span class="cell_title">优惠券</span>
                <b v-if="couponDiscount!=0">-&nbsp;&yen;{{this.couponDiscount.toFixed(2)}}</b>
                <b v-else>-&nbsp;&yen;0</b>
            </div>
            <div class="cell2" v-if="storeDiscount!=0 || objData.storeDiscount!=0">
                <span class="cell_title">门店优惠</span>
                <b v-if="storeDiscount!=0">-&nbsp;&yen;{{storeDiscount.toFixed(2)}}</b>
                <b v-else>-&nbsp;&yen;{{objData.storeDiscount.toFixed(2)}}</b>
            </div>--->



        </div>


        <div class="order_bottom" style="padding-left:0px;">
            <!-- <p>实付款:
                <template>
                    <span v-if="afterDiscountCashPay!=0">&yen;{{afterDiscountCashPay.toFixed(2)}}<b>元</b></span>
                    <span v-else>&yen;{{objData.orderAmount.toFixed(2)}}<b>元</b></span>
                </template>

            </p> -->
            <!-- <div @click="createOrder">提交订单</div> -->
            <div @click="confirmOrder" style="width:100%;background:#ff8546;">确认兑换</div>
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

        <!-- <mt-popup
        v-model="popupVisible"
        position="bottom" class="mint-popup-4" :closeOnClickModal="false">
            <pay-key :order-code="orderCode" v-if="popupVisible" v-on:closePopop="closePopop"></pay-key>
        </mt-popup> -->

    </div>
</template>

<script>
            window.addEventListener('resize', function () {
				if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
					window.setTimeout(function () {
						document.activeElement.scrollIntoViewIfNeeded();
					}, 0);
				}
			})
    import Cookie from '../../../config/mUtils'
    import {orderConfirm,
      createOrder,
      userPayInfo,
      standardOrderQueryAtPayInvoke,
      standardPayCancle,
      findReceiverAddressAll,
      findCouponById,
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
                isDetailStore:'',
                isShowAddr:'',
                couponDiscount:0,
                couponList:[],
                popupVisibleCoupon:false,
                checkCouponType:'',
                checkCouponUnitId:'',
                afterDiscountCashPay:0,
                storeDiscount:0,
                checkCouponTitle:'',
                loading:false,
                siteShow:false,
                siteList:[],
                receiverName:'',
                phoneNo:'',
                receiverAddress:'',
            }
        },
        activated () {
            this.afterDiscountCashPay = 0;
            this.storeDiscount = 0;
            this.couponDiscount = 0;
            for(var i=0;i<this.couponList.length;i++){
                this.couponList[i].check = false;
            }
            this.checkCouponType = '';
            this.checkCouponUnitId = '';

            this.invoiceId = this.$store.state.invoiceId ? this.$store.state.invoiceId : 0;
            this.invoiceType = this.$store.state.invoiceType;

            this.findCouponById();

            this.userPayInfo();
            this.orderConfirm();
            this.findReceiverAddressAll();
            this.popupError = false;
            this.loading = false;
            Indicator.open();
          console.log(this.$store.state.Cookie.mutations.fetch('type')=="coupon_unit")
        },
        mounted(){
        },
        watch : {
            '$store.state.invoiceId': {
                handler(curVal,oldVal){
                    this.invoiceId = this.$store.state.invoiceId ? this.$store.state.invoiceId : 0;
                    this.invoiceType = this.$store.state.invoiceType;
                    this.invoiceForm = this.$store.state.invoiceForm;
                }
            },
            '$store.state.siteId': {
                handler(curVal,oldVal){
                    //this.orderSite();
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
                       this.orderConfirm();
                    }
                },
                deep:true
            },

        },
		components: {
            payKey
		},
        methods:{
            async orderConfirm() {
                try {
                    var obj = JSON.parse(JSON.stringify(this.$store.state.skuObj));
                    if(this.isDetailStore!=0){
                        obj.addrId = this.$store.state.Cookie.mutations.fetch('siteId');
                    }
                    const res = await orderConfirm(obj);
                    if (res.data.code == 0) {
                         Indicator.close();
                         this.objData = res.data.data;
                         this.couponList = res.data.data.couponUnitList;
                         this.isDetailStore = res.data.data.isDetailStore ? res.data.data.isDetailStore : 0;
                         this.isShowAddr = res.data.data.isShowAddr;
                         this.$store.dispatch("setInvoiceDetail",this.isDetailStore);
                         if(res.data.data.receiverInfo!=null){
                            this.form.receiveAddressId = res.data.data.receiverInfo.id;
                         }

                        if(!this.$store.state.Cookie.mutations.fetch('siteId')){
                          this.receiverName =''
                        }
                        this.showState = true;
                        if(this.objData.fubiBalance<=0 || !this.havePpwd){
                            this.isFb = false;
                        }else{
                            //this.isFb = true;
                        }
                    }else{
                        Indicator.close();
                        MessageBox('提示', res.data.error).then(action => {
                            this.$router.go(-1);
                        });
                    }
                } catch (err) {
                    Indicator.close();
                    Toast('网络错误');
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
                    var id = this.$store.state.Cookie.mutations.fetch('siteId');
                    if(id){
                      for(var i=0;i<this.siteList.length;i++){
                        if(this.siteList[i].id == id){
                          this.receiverName=this.siteList[i].goodReceiverName;
                          this.phoneNo=this.siteList[i].goodReceiverMobile;
                          this.receiverAddress=this.siteList[i].goodReceiverProvince
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
          async standardOrderQueryAtPayInvoke(orderCode) {
            try {
              const res = await standardOrderQueryAtPayInvoke({orderCode:orderCode});
              if (res.data.code == 0) {
                if(res.data.data.orderAmount==0){
                   this.foscoinAccountDeduct(orderCode)
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
                      this.$router.push('/shop/orderDatails/'+orderCode);
                    }else{
                    }
                  });
                }else if(res.data.code == 181){
                  MessageBox('', '订单已经支付成功').then(action => {
                    this.$router.push('/shop/orderDatails/'+orderCode);
                  });
                }else if(res.data.code == 182){
                  MessageBox('', '订单已取消').then(action => {
                    this.$router.push('/shop/orderDatails/'+orderCode);
                  });
                }else if(res.data.code == 183){
                  MessageBox('', '订单已退款').then(action => {
                    this.$router.push('/shop/orderDatails/'+orderCode);
                  });
                }else if(res.data.code == 184){
                  MessageBox('', '支付超时，订单已取消').then(action => {
                    this.$router.push('/shop/orderDatails/'+orderCode);
                  });
                }
              }
            } catch (err) {
              Toast('网络错误');
            }
          },
          //兑换
          async foscoinAccountDeduct(orderCode) {
            try {
              const res = await foscoinAccountDeduct({orderCode:orderCode});
              if (res.data.code == 0) {
                if(res.data.data.payStatus==0){
                   if(res.data.data.orderType==3){
                     this.$store.state.Cookie.mutations.save(orderCode,'couponOrderCode');
                     this.$router.push('/couponResult');
                   }
                }
              } else {
                MessageBox('', '取消支付失败').then(action => {
                  this.$router.push('/shop/orderDatails/'+orderCode);
                });
              }
            } catch (err) {
              Toast(err);
            }
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
                    // Toast('网络错误');
                    Toast(err);
                    this.popupError = true;
                }
            },

            checkInvoice(){
                this.invoiceCheck = !this.invoiceCheck;
            },

            //选择是否使用积分
            async checkIsFb(type){
                try {
                    const res = await userPayInfo();
                    if (res.data.code == 0) {
                        this.havePpwd = res.data.data.havePpwd;
                        if(type==0 && this.objData.fubiBalance>0){
                            if(this.havePpwd){
                                this.isFb = true;
                            }else{
                                this.$router.push('/set/payPsd1');
                            }
                        }else if(type==0 && this.objData.fubiBalance<=0){
                            Toast('余额不足');
                        }else{
                            this.isFb = false;
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

            confirmOrder(){
                if(this.loading==false){
                    this.loading=true;
                    this.createOrder();
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
                    obj.storeId = '1';
                    if(this.form.receiveAddressId==""||this.form.receiveAddressId==null){
                      obj.receiveAddressId = 0;
                    }else{
                    obj.receiveAddressId = this.form.receiveAddressId;
                    }
                    if(this.$store.state.Cookie.mutations.fetch('siteId')){
                      obj.receiveAddressId = this.$store.state.Cookie.mutations.fetch('siteId');
                    }

                    
                    obj.type = this.$store.state.skuObj.type;
                    //传jason格式的运费
                    obj.deliveryPrice={};
                    obj.remark={};
                    for(var i=0;i<this.objData.goodGroupList.length;i++){
                      obj.deliveryPrice[this.objData.goodGroupList[i].merchantId]=this.objData.goodGroupList[i].deliveryPrice;
                      obj.remark[this.objData.goodGroupList[i].merchantId]=this.objData.goodGroupList[i].remark;
                    }
                    obj.deliveryPrice = JSON.stringify(obj.deliveryPrice).toString();

                    obj.remark = JSON.stringify(obj.remark).toString();
                    obj.invoiceId = this.$store.state.invoiceId ? this.$store.state.invoiceId : 0;//发票ID不开发票传零

                    obj.useFubi = this.isFb ? 1 : 0;

                    obj.couponType = 1;
                    obj.couponUnitId = this.$store.state.Cookie.mutations.fetch('typeID');

                    const res = await createOrder(obj);
                    if (res.data.code == 0) {
                      this.$store.state.Cookie.mutations.save('','siteId');
                      this.$store.state.Cookie.mutations.save(0,'couponResult');
                      this.$store.state.Cookie.mutations.save('','type');
                      this.$store.state.Cookie.mutations.save('','buyType');
                      this.$store.state.Cookie.mutations.save('','typeID');
                      this.standardOrderQueryAtPayInvoke(res.data.data.orderCode)
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
                    }else if (res.data.code == 190) {
                      this.$store.state.Cookie.mutations.save(190,'couponResult');//失效
                      // MessageBox('提示', '兑换券已失效').then(action => {
                        this.$router.push('/couponResult');
                      // });
                    }else if(res.data.code == 191){
                      this.$store.state.Cookie.mutations.save(191,'couponResult');//库存不足
                      // MessageBox('提示', '商品库存不足').then(action => {
                        this.$router.push('/couponResult');
                      // });
                    }else{
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast(err);
                }
            },

            //放弃支付
            async standardPayCancle() {
                try {
                    const res = await standardPayCancle({orderCode:this.orderCode});

                    if (res.data.code == 0) {
                        this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                    } else {
                        MessageBox('', '取消支付失败').then(action => {
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

            useCoupon(key){
                this.afterDiscountCashPay = 0;
                this.storeDiscount = 0;
                this.couponDiscount = 0;
                for(var i=0;i<this.couponList.length;i++){
                    this.couponList[i].check = false;
                }
                this.couponList[key].check = !this.couponList[key].check;
                this.checkCouponType = this.couponList[key].couponType;
                this.checkCouponUnitId = this.couponList[key].id;
                this.couponDiscount = this.couponList[key].couponDiscount;
                this.afterDiscountCashPay = this.couponList[key].afterDiscountCashPay;
                this.storeDiscount = this.couponList[key].storeDiscount;

                this.$set(this.couponList, key, this.couponList[key]);
            },

            async findCouponById() {
                try {
                    const res = await findCouponById({id:this.$store.state.couponId});
                    if (res.data.code == 0) {
                        this.checkCouponTitle = res.data.data.title;
                    }else{
                        this.checkCouponTitle = '';
                        Indicator.close();
                        // MessageBox('提示', res.data.error).then(action => {
                        //     this.$router.go(-1);
                        // });
                        // this.popupError = true;
                    }
                } catch (err) {
                    Indicator.close();
                    // Toast('网络错误');
                    Toast(err);
                    // this.popupError = true;
                }
            },

        }
    }
</script>

<style lang="scss" scoped>
 @import "../../../style/component/orderpay/orderConfim.scss";

 .couponInfo{
    width:px(702px);
    height:px(224px);
    background:#fff;
    border-radius:px(10px);
    border: 1px solid #969696;
    margin: px(24px) px(20px);
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
        height: px(68px);
        font-size: px(26px);
        color: #323232;
        border-radius: 0 0 px(10px) px(10px);
        .detail{
            margin-left: px(26px);
            margin-top: px(22px);
            display: inline-block;
            font-size: px(22px);
            color: #969696;
        }
    }
}

.timeCheck {
    height: 100%;
    i {
        font-size: px(32px);
        line-height: px(200px);
    }
    // .checkDot {
    //     float: right;
    //     margin-right: px(24px);
    // }
    .icon-roundcheckfill {
        color: #ff8546;
    }
}

.checkDot {
    float: right;
    margin-right: px(24px);
}

// div:nth-child(1) {
//     width: 16%;
//     i {
//         font-size: px(30px);
//         display: inline-block;
//     }
//     .icon-roundcheckfill {
//         color: #97011e;
//     }
//     span {
//         display: inline-block;
//         font-size: px(28px);
//         margin-left: px(-10px);
//         margin-top: px(-10px);
//         color: #323232;
//     }
// }
 .storeName{
   color: #323232;
   font-size: px(32px);
   line-height: px(88px);
   padding-left: px(20px);
   border-bottom: 1px solid #f4f4f4;
   font-weight:600;
 }
</style>
