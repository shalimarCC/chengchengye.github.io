<template>
    <div id="goods" v-if="goodType">
        <div>
            <div class="goods_warpper">
                <div v-show="goodsType1==1">
                    <template>
                        <banner :banner-goods-data="goodsData.pictureList" ref="banner"></banner>
                        <div class="logo logo1" v-if="goodsData.saleWay==4"></div>
                    </template>
                    <div class="logo2" v-if="goodsData.saleWay==6">{{goodsData.standardUnitMembersExplain}}</div>
                    <div id="goods_data">
                        <h4><span class="operateByown" v-if="goodsData.isOwnMerchant">自营</span>{{goodsData.standardUnitName}}</h4>
                        <p class="price" v-if="buyType==0">
                            <!--<span>{{goodsData.salePrice.toFixed(2)}} <span class="fubi">积分</span></span>-->
                            <span>{{NumLittle(goodsData.salePrice).num1+'.'}}<b style="font-size:16px">{{NumLittle(goodsData.salePrice).num2}} </b><span class="fubi">积分</span></span>
                            <del>&yen;{{goodsData.marketPrice.toFixed(2)}}</del>
                            <i>已售<b>{{goodsData.salesVolume}}</b>件</i>
                        </p>
                        <p style="line-height: 15px" >
                          <span class="saleBycash" v-if="goodsData.buyType==2">仅支持现金购买</span>
                        </p>
                    </div>

                    <div id="goods_specification">
                        <div @click="goodsSkip(goodsData.relevanceSuId,goodsData.commodityTemplateId)" class="cell" v-if="goodsData.relevanceSuId" v-show="buyType==0">
                          <span>查看同款商品</span>
                          <i class="iconfont icon-more"></i>
                        </div>
                        <div @click="checkCoupon(goodsData.standardUnitId)" class="cell" v-if="couponList.length>0" v-show="buyType==0">
                          <span>优惠券</span>
                          <ul v-if="couponList&&couponList.length>0" class="couponList">
                            <li v-for="item in couponList.slice(0,3)">满{{item.triggerAmount}}减{{item.discountAmount}}</li>
                          </ul>
                          <i class="iconfont icon-more"></i>
                        </div>
                        <div @click="putGoodsLimit" class="cell" v-if="goodsData.limitRule!=''&&goodsData.limitRule!=null" v-show="buyType" >
                            <p>
                                <span>促销</span>
                                <span class="specifica_font"><b>限购</b>{{goodsData.limitRule}}</span>
                            </p>
                            <i class="iconfont icon-more"></i>
                        </div>
                        <div @click="putGoodsSpecification" class="cell">
                            <p v-if="keyName==''">规格数量选择</p>
                            <p v-else>已选择：<b>{{keyName}}  </b>{{payNum}}件</p>
                            <i class="iconfont icon-more"></i>
                        </div>
                        <div @click="putGoodsProperty" class="cell">
                            <span>产品参数</span>
                            <i class="iconfont icon-more"></i>
                        </div>
                    </div>

                    <div id="goods_state">
                        <p class="clear"><span>运费说明</span><b>{{goodsData.freightExplain}}</b></p>
                        <p class="clear"><span>发货说明</span><b>{{goodsData.shipmentsExplain}}</b></p>
                        <p class="clear" v-if="goodsData.saleWay==6" v-show="buyType==0"><span>预售说明</span><b>{{goodsData.presellPeriod}}</b></p>
                        <p class="clear" v-if="goodsData.isOwnMerchant!=1"><span>商品运营方</span><b>{{goodsData.merchantName}}</b></p>
                        <p class="clear feedback" v-if="goodsData.isOwnMerchant==1"><span>低价保障</span><b>该商品享受低价保障</b><span  @click="rateFeedback" class="feed">反馈 </span><i class="iconfont icon-more" @click="rateFeedback"></i></p>
                    </div>
                </div>
                <div id="goods_img" v-show="goodsType1==2">
                    <div v-html="goodsData.content" id="contentGoods"></div>
                </div>
            </div>
        </div>
        <div id="goods_bottom" v-show="buyType==0">
          <div id="noGoods" v-if="goodsData.status!=3"><span>商品已经下架了</span></div>
            <div id="pay" :class="{'buy_btn_disabled':goodsData.status !=3}" @click="buy">立即购买</div>
            <div id="join_shopcat" :class="{'buy_btn_disabled':goodsData.status !=3}"  @click="joinShopcat">加入购物车</div>
        </div>
        <div id="goods_bottom" v-show="buyType==1">
          <div id="noGoods" v-if="goodsData.status!=3"><span>商品已经下架了</span></div>
            <div id="pay" :class="{'buy_btn_disabled':goodsData.status!=3}" @click="buy" style="width:100%;background:#ff8546;">立即兑换</div>
        </div>
      <!--  <mt-popup
        v-model="popupVisibleRate" class="mint-popup-5">
            <div id="rateTable">
                <h4>价格对比</h4>
                <ul>
                    <li v-for="item in goodsRateList">
                        <img :src="item.sellPlatformPictureUrl" alt="">
                        <p>{{item.sellPlatformName}}</p>
                        <span>&yen;{{item.salePrice.toFixed(2)}}</span>
                    </li>
                </ul>
                <div class="close_rate">
                    <i class="iconfont icon-close" @click="closeGoodsRate"></i>
                </div>
            </div>
        </mt-popup> -->
        <!--优惠券列表-->
        <mt-popup
        v-model="popupVisibleCoupon"
        position="bottom" class="mint-popup-4">
        <div class="popupBox">
          <div id="propertyLimit">
            <h4>优惠券</h4>
            <div v-for="(item,type) in couponList" class="couponInfo">
              <div class="couponTop">
                <div class="couponPrice" v-if="item.couponType==0&&(item.couponBatchStatus==0||item.couponBatchStatus==2)">
                  <span class="price1">{{item.discountAmount}}元</span>
                  <span class="price2">满{{item.triggerAmount}}元可用</span>
                </div>
                <div class="couponPrice noprice" v-if="item.couponType==0&&(item.couponBatchStatus==1||item.couponBatchStatus==3)">
                  <span class="price1">{{item.discountAmount}}元</span>
                  <span class="price2">满{{item.triggerAmount}}元可用</span>
                </div>
                <div class="couponLogo" v-if="item.couponType==1&&item.couponUnitStatus==0"></div>
                <div class="couponLogo noLogo" v-if="item.couponType==1&&item.couponUnitStatus!=0"></div>
                <div class="couponTime">
                  <span class="title">{{item.title}}</span>
                  <div class="soonExpire" v-if="item.isSoonExpire&&item.couponUnitStatus!=3"></div>
                  <div class="logos got" v-if="item.couponBatchStatus==1"></div>

                  <span class="time">
                    <b>{{item.effectTimeRange}}</b>
                    <div class="get" v-if="item.couponBatchStatus==0" @click="getCoupon(item.id)">立即领取</div>
                    <div class="use" v-if="item.couponBatchStatus==2" @click="useCoupon(item.goodsId,item.jumpType,item.couponUnitId,item.effectTimeRange,item.isShowEffectTimeRange,item.cmsPageId)">立即使用</div>
                    <div class="noGet" v-if="item.couponBatchStatus==3">已领完</div>
                   </span>
                  <div class="dot"></div>
                </div>
              </div>
              <div :class="[key == type?'couponDetail':'couponDetail  fixedHeight']">
                <span class="detail">{{item.detail}}</span>
                <span :class="[ key == type?'pullUp':'pulldown']" @click="showMore(type)"></span>
              </div>
            </div>
          </div>
          <div class="close">
            <i class="iconfont icon-close" @click="closeCouponLimit"></i>
          </div>
        </div>
        </mt-popup>
        <mt-popup
        v-model="popupVisibleProperty"
        position="bottom" class="mint-popup-4">
            <div class="popupBox">
                <div id="propertyTable">
                    <h4>产品参数</h4>
                    <table>
                        <tr v-for="item in goodsData.attList">
                            <th>{{item.attName}}</th>
                            <td>{{item.attValue}}</td>
                        </tr>
                    </table>
                </div>
                <div class="property_pop" @click="popupVisiblePropertyClose">
                    完成
                </div>
            </div>

        </mt-popup>

        <mt-popup
        v-model="popupVisibleLimit"
        position="bottom" class="mint-popup-4">
            <div class="popupBox">
                <div id="propertyLimit">
                    <h4>促销</h4>
                    <ul>
                        <li v-for="item in limitRuleList">
                            <b>限购</b>
                            <p>{{item}}</p>
                        </li>
                    </ul>
                </div>
                <div class="close">
                    <i class="iconfont icon-close" @click="closeGoodsLimit"></i>
                </div>
            </div>

        </mt-popup>

        <mt-popup
        v-model="popupVisibleSpecification"
        position="bottom" class="mint-popup-4">
            <specification v-on:setSkuID="setSkuID" :goods-status="goodsData.status" :buyType="parseInt(buyType)" :picridiolist="picRidioList" v-if="goodsPopup" :paynum="payNum" v-on:closeGoodsProperty="closeGoodsProperty" :goods-standard-list="goodsStandardList" :goods-type="goodsType" :radio="goodsData.radio*1" :goods-sku-list="goodsSkuList" :goods-volume="goodsData.salesVolume*1" :goods-price="goodsData.salePrice" :goods-name="goodsData.standardUnitName" :goods-img-src="goodsData.picture"></specification>
        </mt-popup>

    </div>
</template>

<script>
    import banner from './banner';
    import specification from './specification';
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import {
      findMerchantProdetails,
      findCouponBatchGoodsOfAll,
      MerchantProdAttNameAPPById,
      skuByMerchantProductId,
      saveCartItem,
      SellPlatformMerchantProdByMerchantProdId,
      startLimitRuleByStandardUnitId,
      insertCouponUnitWithTx,
      queryCouponIsEffected
    } from '../../../api/getData';
    export default{

        data(){
            return {
                goodsData:{

                },
                goodsStandardList:[],
                goodsSkuList:{},
                popupVisibleProperty:false,
                popupVisibleSpecification:false,
                popupVisibleRate:false,
                goodsType:1,
                skuId:0,
                payNum:1,
                goodType:false,
                goodsRateList:[],
                picRidioList:[],
                keyName:'',
                goodsPopup:false,
                goodsType1:1,
                limitRuleList:[],
                popupVisibleLimit:false,
                popupVisibleCoupon:false,
                attList:[],
                couponList:'',
                buyType:0,
                commodityTemplateId:'',
                key:-1,
                addloading:false,
                minusloading:false,
            }
        },
		    components: {
			      'banner': banner,
            'specification': specification
        },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    let str = curVal.path;
                    str = str.substring(0,6)
                    if(str == "/goods"){
                        Indicator.open();
                        Object.assign(this.$data, this.$options.data());
                        this.findMerchantProdetails();
                       // this.MerchantProdAttNameAPPById();
                        this.skuByMerchantProductId();
                    }
                },
                deep:true
            },
            popupVisibleRate:{
                handler(curVal,oldVal){
                    if(curVal){
                        $(".page-loadmore-wrapper").css("overflow","hidden");
                    }else{
                        $(".page-loadmore-wrapper").css("overflow","auto");
                    }
                }
            },
            popupVisibleProperty:{
                handler(curVal,oldVal){
                    if(curVal){
                        $(".page-loadmore-wrapper").css("overflow","hidden");
                    }else{
                        $(".page-loadmore-wrapper").css("overflow","auto");
                    }
                }
            },
            popupVisibleSpecification:{
                handler(curVal,oldVal){
                    if(curVal){
                        $(".page-loadmore-wrapper").css("overflow","hidden");
                    }else{
                        $(".page-loadmore-wrapper").css("overflow","auto");
                    }
                }
            },
            "$store.state":{
                handler(curVal,oldVal){
                    this.goodsType1 = curVal.goodsType;
                },
                deep:true
            }
        },
        created(){
            this.$store.state.Cookie.mutations.save(false,'isShowEffectTimeRange');

            this.$store.state.Cookie.mutations.save('','effectTimeRange');
            this.$store.state.Cookie.mutations.save('/good','saveRouter');
            this.$store.state.Cookie.mutations.save(this.$route.params.buyType,'buyType');
            this.$store.dispatch("setGoodsType",1);
            this.buyType=this.$route.params.buyType;
            if( this.$store.state.Cookie.mutations.fetch('fromScan')!=true){
              this.$store.state.Cookie.mutations.save('','type');
            }
            if(this.$route.params.buyType==0){
              this.$store.state.Cookie.mutations.save('','typeID');
            }
            Indicator.open();
            this.findMerchantProdetails();
            this.skuByMerchantProductId();
            this.startLimitRuleByStandardUnitId();
            this.findCouponBatchGoodsOfAll()
            this.$store.dispatch("setUseCouponId",'');
        },
        methods:{
            checkCoupon(){
              this.findCouponBatchGoodsOfAll();
              this.popupVisibleCoupon=true;
            },
            //关闭优惠券信息
            closeCouponLimit(){
              this.popupVisibleCoupon = false;
            },
            //获取优惠券列表
            async findCouponBatchGoodsOfAll() {
            try {
              const res = await findCouponBatchGoodsOfAll({standardUnitId:this.$route.params.goodsId,storeId:'1'});
              if (res.data.code == 0) {
                this.couponList = res.data.data;
                Indicator.close();
              } else {
                Indicator.close();
                Toast(res.data.data);
              }
            } catch (err) {
              Indicator.close();
              Toast('网络错误');
            }
          },
            //获取商品信息
            async findMerchantProdetails() {
                try {
                    const res = await findMerchantProdetails({standardUnitId:this.$route.params.goodsId,storeId:'1'});

                    if (res.data.code == 0) {
                        this.goodsData = res.data.data;
                        this.commodityTemplateId = res.data.data.commodityTemplateId;
                        this.$store.state.Cookie.mutations.save(this.commodityTemplateId,'commodityTemplateId');
                        Indicator.close();
                        this.goodType=true;
                      this.$nextTick(() => {
                        $("#goods_img img").width("100%");
                        $("#goods_img p").css("line-height","50px");
                        $("#goods_img p").css("font-size","14px");
                        $("#goods_img").css("background","#F4F4F4");

                      })
                    } else {
                        Indicator.close();
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Indicator.close();
                     Toast('网络错误');

                }
            },
            //获取比价信息
            async startLimitRuleByStandardUnitId() {
                try {
                    const res = await startLimitRuleByStandardUnitId({standardUnitId:this.$route.params.goodsId,storeId:'1'});

                    if (res.data.code == 0) {
                        this.limitRuleList = res.data.data.limitRuleList;
                    } else {
                        Toast(res.data.data);
                    }


                } catch (err) {
                     Toast('网络错误');

                }
            },
            //获取商品规格
            // async MerchantProdAttNameAPPById() {
            //     try {
            //         const res = await MerchantProdAttNameAPPById({standardUnitId:this.$route.params.goodsId});

            //         if (res.data.code == 0) {


            //         } else {
            //             Toast(res.data.data);
            //         }

            //     } catch (err) {
            //          Toast('网络错误');

            //     }
            // },
            //获取商品SKU
            async skuByMerchantProductId() {
                try {
                    const res = await skuByMerchantProductId({standardUnitId:this.$route.params.goodsId,storeId:'1'});

                    if (res.data.code == 0) {
                        this.goodsSkuList = res.data.data.pu;
                        this.goodsStandardList = res.data.data.puAttNames;
                        this.goodsPopup = true;
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },

            //查看商品比价信息
            putGoodsLimit(){
                this.popupVisibleLimit = true;
            },

            //关闭商品比价信息
            closeGoodsLimit(){
                this.popupVisibleLimit = false;
            },
            //查看商品属性
            putGoodsProperty(){
                this.popupVisibleProperty = true;
                this.goodsType = 1;
            },

            //关闭商品属性窗口
            popupVisiblePropertyClose(){
                this.popupVisibleProperty = false;
            },
             //关闭选择规格窗口
            closeGoodsProperty(){
                this.popupVisibleSpecification = false;
            },
            //选择规格
            putGoodsSpecification(){
                this.goodsType = 1;
                this.popupVisibleSpecification = true;
            },
            setSkuID(sku){
                this.skuId = sku[0];
                this.payNum = sku[1];
                this.keyName = sku[2];
            },
            //加入购物车
            joinShopcat (){
                if(this.goodsData.status == 3){
                    this.goodsType = 2;
                    this.popupVisibleSpecification = true;
                }else{
                    return;
                }

            },
            async getCoupon(id){
              try {
                const res = await insertCouponUnitWithTx({id:id});
                if (res.data.code == 0) {
                  Toast('领取成功');
                  // this.popupVisibleCoupon=false;
                  this.findCouponBatchGoodsOfAll()
                } else {
                  Toast(res.data.data);
                }
              } catch (err) {
                Toast(err);
              }
            },
            //校验兑换券有效性
            async queryCouponIsEffected() {
              try {
                const res = await queryCouponIsEffected({couponUnitId:this.$store.state.Cookie.mutations.fetch('typeID'),suId:this.$route.params.goodsId,storeId:1,type:1});
                if (res.data.code == 0) {
                  if(this.goodsData.status == 3){
                    this.goodsType = 3;
                    this.popupVisibleSpecification = true;
                  }else{
                    return
                  }
                }else if(res.data.code ==190||res.data.code ==191||res.data.code ==131){
                  Toast(res.data.error)
                }else{
                  Toast(res.data.error)
                }
              } catch (err) {
                Toast(err)
              }
            },
            //立即购买
            buy(){
              if(this.buyType == 1){
                this.queryCouponIsEffected()
              }else{
                if(this.goodsData.status == 3){
                  this.goodsType = 3;
                  this.popupVisibleSpecification = true;
                }else{
                  return
                }
              }
            },
            goodsSkip(id,type){
              if(type==1){
                this.$router.push('/card/'+id);
              }else if(type==2){
                this.$router.push('/shop/goods/0/'+id);
                window.location.reload()
              }else if(type==3){
                this.$router.push('/shop/goods2/0/'+id);
              }else if(type==4){
                this.$router.push('/moreCredit/'+id);
              }else if(type==6){
                this.$router.push('/card/'+id);
              }else if(type==7){
                this.$router.push('/shop/goods/0/'+id);
                window.location.reload()
              }else if(type==8){
                this.$router.push('/shop/goods2/0/'+id);
              }else if(type==9){
                this.$router.push('/moreCredit/'+id);
              }

            },
            //比价反馈
            rateFeedback(){
                this.$router.push('/rateFeedback/'+this.$route.params.goodsId);
            },
            //下拉优惠券显示详情
            showMore(key){
                if(this.key ==key){
                    this.key = -1;
                }else{
                    this.key = key;
                }
            },
            useCoupon(id,jumpType,couponId,effectTimeRange,isShowEffectTimeRange,cmsPageId){
              this.$store.state.Cookie.mutations.save(couponId,'typeID');
              this.popupVisibleCoupon = false;
              if (jumpType == 2){
                this.$store.state.Cookie.mutations.save('','effectTimeRange');
                if (isShowEffectTimeRange) {
                  this.$store.state.Cookie.mutations.save(isShowEffectTimeRange,'isShowEffectTimeRange');
                  this.$store.state.Cookie.mutations.save(effectTimeRange,'effectTimeRange');
                }
                this.$router.push('/cmsGoodsList/'+id+'/2/'+cmsPageId+'/0');
                // this.$router.push('/shop/couponGoodsList/'+id+'/2/'+couponId);
              }
            },
            NumLittle(num){
              let  obj= new Object();
              num = num.toFixed(2);
              obj.num1 = parseInt(num); //整数部分
              obj.num2 = num-obj.num1;  //小数部分
              if(obj.num2==0){
                obj.num2= '00';
              }else{
                obj.num2 = obj.num2.toFixed(2)*100
              }
              return obj;
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
@import "../../../style/component/goods/index.scss";
.mint-toast.is-placemiddle{
    z-index:3000;
}
.couponInfo{
  width:px(702px);
  /*height:px(224px);*/
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
    .noGet{
      width: px(124px);
      height: px(36px);
      float: right;
      margin-right: px(26px);
      margin-top: px(-8px);
      border: 1px solid #9b9b9b;
      border-radius: px(8px);
      background:#9b9b9b;
      font-size: px(22px);
      line-height: px(36px);
      color: #fff;
      text-align: center;
      z-index:10;
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

.popupBox {
  overflow: auto;
}

</style>
