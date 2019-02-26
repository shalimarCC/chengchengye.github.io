<template>
  <div id="category" class="page-loadmore-wrapper" style="background: #f4f4f4">
    <div id="order">
      <div v-if="couponData.length>0">
        <ul class="list1">
          <li class="page-loadmore-listitem clear" v-for="list in couponData">
            <div class="actName">
              <span class="actTitle">{{list.exchangeName}}</span>
              <span class="actTime">{{list.endTime}}</span>
            </div>
            <div v-for="(item,type) in list.couponList" class="couponInfo">
              <div class="couponTop">
                <div class="couponPrice" v-if="item.couponType==0&&(item.couponBatchStatus==1||item.couponBatchStatus==7||item.couponBatchStatus==5||item.couponBatchStatus==6)">
                  <span class="price1"><b>{{item.discountAmount}}</b>元</span>
                  <span class="price2">满{{item.triggerAmount}}元可用</span>
                </div>
                <div class="couponPrice noprice" v-if="item.couponType==0&&(item.couponBatchStatus==3||item.couponBatchStatus==4)">
                  <span class="price1"><b>{{item.discountAmount}}</b>元</span>
                  <span class="price2">满{{item.triggerAmount}}元可用</span>
                </div>
                <!--无效兑换券置灰-->
                <img :src="item.iconUrl+'?imageMogr2/size-limit/500k!'" v-if="item.iconUrl" :class="[validKey?'havaUrl InvalidCouponLogo':'havaUrl']">
                <div class="couponLogo" v-if="item.couponType==1&&(item.couponBatchStatus==1||item.couponBatchStatus==7||item.couponBatchStatus==5||item.couponBatchStatus==6)&&!item.iconUrl"></div>
                <div class="couponLogo noLogo" v-if="item.couponType==1&&(item.couponBatchStatus==3||item.couponBatchStatus==4)&&!item.iconUrl"></div>
                <!--<div class="dueSoon">即将到期</div>-->
                <div class="couponTime">
                  <span class="title">{{item.title}}</span>
                  <!--<div class="logos expired" v-if="item.couponBatchStatus==4"></div>-->
                  <div class="logos got" v-if="item.couponBatchStatus==1"></div>

                  <div class="logos addprice" v-if="item.couponBatchStatus==6">
                    <span class="changeprice">￥{{item.addPrice}}</span>
                  </div>
                  <span class="time">
                     {{item.effectTimeRange}}
                     <div class="addchange" v-if="item.couponBatchStatus==6" @click="changeCoupon(item.id,item.couponBatchId,list.exchangeId)">加价兑换</div>
                     <div class="broughtup" v-if="item.couponBatchStatus==3">已领完</div>
                     <div class="broughtup" v-if="item.couponBatchStatus==7">未开始</div>
                     <!--<div class="broughtup" v-if="item.couponBatchStatus==4">已过期</div>-->
                     <div class="get" v-if="item.couponBatchStatus==5" @click="getCoupon(item.id,item.couponBatchId,list.exchangeId,item.couponType)">立即兑换</div>
                     <!--<div class="use" v-if="item.couponBatchStatus==2&&item.usable==1" @click="goodsSkip(item.goodsId,item.commodityTemplateId,item.jumpType,item.couponType,item.id,item.effectTimeRange,item.isShowEffectTimeRange,item.cmsPageId)">立即使用</div>-->
                  </span>
                  <div class="dot"></div>
                </div>
              </div>
              <div :class="[key == type?'couponDetail':'couponDetail fixedHeight']">
                <span class="detail">{{item.detail}}</span>
                <span :class="[ key == type?'pullUp':'pulldown']" @click="showMore(type)"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="coupon_error" v-if="couponData.length<=0&&nocoupon">
        <img src="../../../../static/assets/img/error/coupon_error.png">
        <p>暂无可兑换的券，请稍后再来查看</p>
      </div>
      <mt-popup
        v-model="popupVisible"
        position="bottom" class="mint-popup-4" :closeOnClickModal="false">
        <pay-key :order-code="orderCode" v-if="popupVisible" v-on:closePopop="closePopop"></pay-key>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import {
    queryCouponIsEffected,
    checkExchangeAndCouponBatch,
    checkExchangeValid,
    findExchangeActivityByCouponUnitId,
    orderConfirm,
    exchangeRightNow,
    unfreezeSoFubi
  } from '../../../api/getData';
  export default{
    data(){
      return {
        couponData:'',
        couponList:[],
        popupVisible:false,
        couponloading: false,
        key:-1,
        validKey:0,
        type:'',
        puId:'',
        exchangeType:'',
        storeId:1,
        nocoupon:false
      }
    },
    watch:{
    },
    created(){
      this.findExchangeActivityByCouponUnitId();
    },
    mounted(){
    },
    methods:{

      //根据旧couponUnitId查询有效的活动
      async findExchangeActivityByCouponUnitId() {
        try{
          const res = await findExchangeActivityByCouponUnitId({couponUnitId:this.$route.params.couponUnitId,storeId:1});
          if (res.data.code == 0) {
            this.nocoupon = true; //避免在加载列表前显示缺省图
            this.couponData = res.data.data;
            $.each(this.couponData,function (key,info) {
              for(var i=0;i<info.couponList.length;i++){
                var storeIds = info.couponList[i].storeIds;
                if(storeIds.indexOf(1)!=-1){
                  info.couponList[i].usable = 1;
                } else {
                  info.couponList[i].usable = 0;
                }
              }
            });
            Indicator.close();
          }else if(res.data.code == 198){
            Toast(res.data.error);
            this.$router.go(-1);
          } else {
            if(res.data.error){
              Toast(res.data.error)
              // this.$router.go(-1);
            }else{
              Toast('服务异常，请稍后再试');
              // this.$router.go(-1);
            }
            Indicator.close();
          }
        }catch (e) {

        }
      },
      getCoupon(id,couponBatchId,exchangeId,couponType){
        this.checkExchangeAndCouponBatch(id,couponBatchId,exchangeId,couponType)
      },
      //兑换流程中的优惠券校验
      async checkExchangeAndCouponBatch(id,couponBatchId,exchangeId,couponType) {
        try{
          const res = await checkExchangeAndCouponBatch({exchangeCouponBatchId:couponBatchId,exchangeCouponUnitId:id,exchangeId:exchangeId,type:1});
          if(res.data.code == 0){
            if(res.data.data.exchangeType==0||res.data.data.exchangeType==4){
              var obj = new Object;
              obj.puId = res.data.data.puId;
              obj.num = res.data.data.num;
              obj.type = 0;
              obj.storeId = 1;
              this.$store.dispatch("setSkuObj",obj);
              this.$store.dispatch("setFromCoupon",true);
              this.orderConfirm()
            }else if(res.data.data.exchangeType==1){
              MessageBox({
                title: '提示',
                message: '每张券只能兑换一张新券，确定要兑换吗？',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(action => {
                if(action=='cancel'){

                }else{
                  this.exchangeRightNow(id,couponBatchId,exchangeId,couponType);
                }
              });

            }else if(res.data.data.exchangeType==2){
              this.$router.push('/shop/orderDatails/'+res.data.data.orderCode);
            }else if(res.data.data.exchangeType==3){
              var obj = new Object;
              obj.puId = res.data.data.puId;
              obj.num = res.data.data.num;
              obj.type = 0;
              obj.storeId = 1;
              this.$store.dispatch("setSkuObj",obj);
              this.$store.dispatch("setFromCoupon",true);
              this.cacelOrderAjax(res.data.data.orderCode)
            }
          }else if(res.data.code==201||res.data.code==198||res.data.code==202){
            MessageBox('提示', res.data.error).then(action => {
              this.$router.go(-1);
            });
          }else{
            if(res.data.error){
              Toast(res.data.error)
            }else{
              Toast('服务异常，请稍后再试')
            }
          }
        }catch (e) {

        }
      },
      async orderConfirm() {
        try {
          var obj = JSON.parse(JSON.stringify(this.$store.state.skuObj));
          obj.addrId = 0;
          const res = await orderConfirm(obj);
          if (res.data.code == 0) {
            Indicator.close();
            this.$router.push({path: '/shop/orderConfim'});
          }else{
            Indicator.close();
            MessageBox('提示', res.data.error).then(action => {
              window.location.reload();
            });
          }
          this.loading = false;
        } catch (err) {
          Indicator.close();
          if(res.data.error){
            Toast(res.data.error)
          }else{
            Toast('服务异常，请稍后再试')
          }
        }
      },
      //以旧换新 立即兑换
      async exchangeRightNow(id,couponBatchId,exchangeId,couponType) {
        try{
          const res = await exchangeRightNow({exchangeCouponBatchId:couponBatchId,exchangeCouponUnitId:id,exchangeId:exchangeId});
          if(res.data.code == 0){
            this.$store.state.Cookie.mutations.save(couponType,'navCheck');
            MessageBox('提示', '兑换成功').then(action => {
              this.$router.go(-1);
            })
          }else if(res.data.code==201||res.data.code==198){
            MessageBox('提示', res.data.error).then(action => {
              this.$router.go(-1);
            });
          }else{
            if(res.data.error){
              Toast(res.data.error)
            }else{
              Toast('服务异常，请稍后再试')
            }
          }
        }catch (e) {

        }
      },
      //取消订单
      async cacelOrderAjax(id) {
        try {
          const res = await unfreezeSoFubi({orderCode:id});
          if (res.data.code == 0) {
            this.orderConfirm()
          } else {
            if(res.data.error){
              Toast(res.data.error)
            }else{
              Toast('服务异常，请稍后再试')
            }
          }
        } catch (err) {
          Toast('网络错误');
        }
      },
      changeCoupon(id,couponBatchId,exchangeId){
        this.$store.state.Cookie.mutations.save(couponBatchId,'exchangeCouponBatchId');
        this.$store.state.Cookie.mutations.save(id,'exchangeCouponUnitId');
        this.$store.state.Cookie.mutations.save(exchangeId,'exchangeId');
        this.checkExchangeAndCouponBatch(id,couponBatchId,exchangeId)
      },
      goodsSkip(id,type,jumpType,couponType,couponId,effectTimeRange,isShowEffectTimeRange,cmsPageId){
        this.$store.state.Cookie.mutations.save(couponId,'typeID');
        // console.log(id,type,jumpType,couponType,couponId,effectTimeRange,isShowEffectTimeRange)
        if(jumpType == 1){
          this.type = 2;
          this.queryCouponIsEffected(id,type,jumpType,couponType,couponId,effectTimeRange,isShowEffectTimeRange,cmsPageId)
        } else if (jumpType == 2){
          this.type = 2;
          this.queryCouponIsEffected(id,type,jumpType,couponType,couponId,effectTimeRange,isShowEffectTimeRange,cmsPageId)
        }
      },
      //校验兑换券有效性
      async queryCouponIsEffected(id,type,jumpType,couponType,couponId,effectTimeRange,isShowEffectTimeRange,cmsPageId) {
        try {
          const res = await queryCouponIsEffected({couponUnitId:couponId,storeId:1,type:this.type});
          if (res.data.code == 0) {
            if(jumpType == 1){
              if(couponType==0){
                if(type==1){
                  this.$router.push('/card/'+id);
                }else if(type==2){
                  this.$router.push('/shop/goods/0/'+id);
                }else if(type==3){
                  this.$router.push('/shop/goods2/0/'+id);
                }else if(type==4){
                  this.$router.push('/moreCredit/'+id);
                }else if(type==6){
                  this.$router.push('/card/'+id);
                }else if(type==7){
                  this.$router.push('/shop/goods/0/'+id);
                }else if(type==8){
                  this.$router.push('/shop/goods2/0/'+id);
                }else if(type==9){
                  this.$router.push('/moreCredit/'+id);
                }
              }else if(couponType==1){
                if(type==1){
                  this.$router.push('/card/'+id);
                }else if(type==2){
                  this.$router.push('/shop/goods/1/'+id);
                }else if(type==3){
                  this.$router.push('/shop/goods2/1/'+id);
                }else if(type==4){
                  this.$router.push('/moreCredit/'+id);
                }else if(type==6){
                  this.$router.push('/card/'+id);
                }else if(type==7){
                  this.$router.push('/shop/goods/1/'+id);
                }else if(type==8){
                  this.$router.push('/shop/goods2/1/'+id);
                }else if(type==9){
                  this.$router.push('/moreCredit/'+id);
                }
              }
            }else if(jumpType == 2){
              this.$store.state.Cookie.mutations.save('','effectTimeRange');
              if (isShowEffectTimeRange) {
                this.$store.state.Cookie.mutations.save(isShowEffectTimeRange,'isShowEffectTimeRange');
                this.$store.state.Cookie.mutations.save(effectTimeRange,'effectTimeRange');
              }

              if(couponType==1){
                // this.$router.push('/shop/couponGoodsList1/'+id+'/2/'+couponId);
                this.$router.push('/cmsGoodsList/'+id+'/2/'+cmsPageId+'/1');
              }else{
                // this.$router.push('/shop/couponGoodsList/'+id+'/2/'+couponId);
                this.$router.push('/cmsGoodsList/'+id+'/2/'+cmsPageId+'/0');
              }
            }
          } else if(res.data.code ==190||res.data.code ==191||res.data.code ==131){
            MessageBox('提示', res.data.error).then(action => {
              window.location.reload()
            });
          } else{
            MessageBox('提示', res.data.error).then(action => {
              window.location.reload()
            });
          }
        } catch (err) {
          Toast(err)
        }
      },
      //下拉优惠券显示详情
      showMore(key){
        if(this.key ==key){
          this.key = -1;
        }else{
          this.key = key;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }

  .head.title{
    margin-left:0.2rem;
  }

  #category{
    height: 100%;
    background-color:#fff;
  }

  #order {
    height:100%;
    background: #fff;
  }

  .nav {
    background: #fff;
    display: -webkit-flex;
    /* Safari */
    display: flex;
    li {
      width: 50%;
      font-size: px(28px);
      text-align: center;
      line-height: px(88px);
      color: #646464;
      .navTab{
        display: inline-block;
        line-height: px(88px);
        border-bottom: solid 2px #ff8546;
      }
    }
    .spanLine{
      position: relative;
      top:px(25px);
      left:px(370px);
      width:px(2px);
      height:px(42px);
      background:#787878;
    }
    .active {
      // border-bottom: solid 2px #97011e;
      color: #ff8546;
    }
  }

  .page-loadmore-listitem {
    text-align: center;
  }

  .page-loadmore-listitem:first-child {
    border-top: 1px solid #f4f4f4;
  }

  .page-loadmore-wrapper {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
  }
 .actName{
   text-align: left;
   margin-left: px(20px);
   .actTitle{
     font-size:px(30px);
     font-weight: bold;
   }
   .actTime{
     font-size:px(24px);
     color: #323232;
   }
 }
  .mint-popup-4 {
    width: 100%;
    height: px(740px);
    // overflow: hidden;
    h4 {
      text-align: center;
      line-height: px(88px);
      font-size: px(32px);
    }
    ul {
      li {
        line-height: px(100px);
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f4f4f4;
        padding: 0 px(24px);
        span {
          font-size: px(28px);
          color: #323232;
        }
        .icon-round {
          color: #646464;
        }
        .icon-roundcheckfill {
          color: #ff8546;
        }
      }
    }
  }

  .title{
    margin-left: px(-60px);
  }
  .coupon_error {
    height:100%;
    background: #f4f4f4;
    text-align: center;
    img {
      width: px(310px);
      height: px(240px);
      margin-top: px(229px);
    }
    p {
      font-size: px(30px);
      color: #646464;
      margin-top: px(40px);
    }
    .getCoupon{
      width: px(280px);
      height: px(70px);
      margin-top: px(40px);
      margin-left: px(235px);
      border-radius: px(6px);
      background: #ff8546;
      font-size: px(30px);
      line-height: px(70px);
      color: #fff;
    }
  }
  .couponInfo{
    width:px(702px);
    // height:px(224px);
    background:#fff;
    border-radius:px(10px);
    margin: px(24px) px(20px);
    box-shadow: #ddd 1px 1px 10px;
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
    .dueSoon{
      position: absolute;
      bottom:px(63px);
      font-size: px(22px);
      width: px(200px);
      height: px(40px);
      line-height: px(40px);
      background: rgba(0,0,0,0.3);
      color: #fff;
    }
    .InvalidCouponLogo{
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
      _filter:none;
    }
    .noLogo{
      background-image:url(../../../../static/assets/img/invalidLogo@2x.png);
    }
    .havaUrl{
      background:#fff;
      width: px(200px);
      height: px(156px);
      border-radius: px(10px) 0 0 0;
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
        font-size: px(28px);
        display: block;
        b{
          margin-right: px(3px);
          font-size:px(40px);
        }
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
      text-align: left;
      border-radius: 0 px(10px) 0 0;
      .title{
        margin-top: px(24px);
        margin-left: px(10px);
        font-size: px(26px);
        display: block;
      }
      .time{
        margin-top: px(55px);
        margin-left: px(10px);
        font-size: px(20px);
        display: flex;
        justify-content: space-between;
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
          border-radius: px(6px);
          background:#e24167;
          font-size: px(22px);
          line-height: px(40px);
          color: #fff;
          text-align: center;
          z-index:10;
        }
        .addchange{
          width: px(124px);
          height: px(36px);
          float: right;
          margin-right: px(26px);
          margin-top: px(-8px);
          border: 1px solid #e24167;
          border-radius: px(6px);
          background:#e24167;
          font-size: px(22px);
          line-height: px(40px);
          color: #fff;
          text-align: center;
          z-index:10;
        }
        .broughtup{
          width: px(124px);
          height: px(36px);
          float: right;
          margin-right: px(26px);
          margin-top: px(-8px);
          border-radius: px(6px);
          background:#9b9b9b;
          font-size: px(22px);
          line-height: px(40px);
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
        width: px(104px);
        height: px(104px);
        top: px(10px);
        right: px(36px);
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
      .addprice{
        background-image:url(../../../../static/assets/img/addprice.png);
        background-size: 100%;
        right: px(36px);
      }
      .exchanged{
        background-image:url(../../../../static/assets/img/exchanged.png);
        background-size: 100%;
      }
      .dot{
        position: absolute;
        bottom: 0px;
        width:100%;
        height:px(4px);
        background-image:url(../../../../static/assets/img/dot@2x.png);
      }
      .changeprice{
        width: px(94px);
        display: block;
        position: absolute;
        top:px(39px);
        font-size:px(22px);
        color: #e24167;
        text-align: center;
      }
    }

    .couponDetail{
      width: px(702px);
      font-size: px(26px);
      color: #323232;
      border-radius: 0 0 px(10px) px(10px);
      text-align: left;
      .detail{
        width: px(592px);
        margin-left: px(26px);
        margin-top: px(14px);
        display: inline-block;
        font-size: px(22px);
        line-height: px(44px);
        color: #969696;
        overflow: hidden;
        text-align: left;
      }
      .pulldown{
        background-image:url(../../../../static/assets/img/cms/down@2x.png);
        background-size: 100%;
        width: px(30px);
        height: px(30px);
        position: absolute;
        right: px(50px);
        margin-top: px(20px);
      }
      .pullUp{
        background-image:url(../../../../static/assets/img/cms/up@2x.png);
        background-size: 100%;
        width: px(30px);
        height: px(30px);
        position: absolute;
        right: px(50px);
        margin-top: px(20px)
      }
    }
    .fixedHeight{
      height: px(63px);
      overflow: hidden;
    }
  }
</style>
