<template>
    <!--<div class="swipe">-->
        <!--<div class="swiper-container">-->
            <!--<div class="swiper-wrapper">-->
                <!--<div class="swiper-slide" v-for="str in bannerGoodsData">-->
                    <!--<img v-lazy="str.imgUrl+'?imageMogr2/size-limit/300k!'" style="width:100%;height:100%;">-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="swiper-pagination swiper-pagination-white"></div>-->
        <!--</div>-->
    <!--</div>-->
  <div class="swipe1">
    <swiper ref="mySwiper">
      <swiper-slide v-for="(info,key) in bannerGoodsData" :key="key">
        <img v-lazy="info.imgUrl+'?imageMogr2/size-limit/300k!'" :key="key"  @click="linkSkip(info)" style="width:100%;height:100%;">
      </swiper-slide>
      <!--<div class="swiper-pagination swiper-pagination-white" slot="pagination"></div>-->
      <div class="swiper-pagination" slot="pagination" v-if="bannerGoodsData.length>1"></div>
    </swiper>
  </div>
</template>

<script>

  import { Indicator } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  import {
    userAssets,
    insertCouponUnitWithTx,
    saveCartItem,
  } from '../../../api/getData';
  import 'swiper/dist/css/swiper.min.css';
  export default{
        props: {
            bannerGoodsData: {
                type: Array,
                default: function () {
                    return []
                }
            },
        },
        data(){
            return {
              userAsset:'',
              swiperOption: {
                loop: true,
                speed: 600,
                // autoplay: 5000,
                autoplay: true,
                effect: 'coverflow',
                pagination: '.swiper-pagination',
                paginationClickable: true,
              }
            }
        },
        mounted() {

        },
        created(){
          this.userAssets();
        },
        methods:{
          linkSkip(obj){
            console.log(obj)
            switch (obj.linkType) {
              //本地参数
              case 1:
                if(obj.available){
                  switch (obj.linkId) {
                    case 11:
                      this.$router.push('/home');
                      break;
                    case 12:
                      Indicator.open();
                      this.$router.push('/Mall');
                      break;
                    case 13:
                      this.$router.push('/scan');
                      break;
                    case 14:
                      this.$router.push('/search');
                      break;
                    case 16:
                      this.$router.push('/shop/shopCart');
                      break;
                    case 17:
                      Indicator.open();
                      this.$router.push('/activity/'+obj.extParam1);
                      break;
                    case 20:
                      this.$router.push('/Mall');
                      break;
                    case 25:
                      this.$router.push('/shop/category');
                      break;
                    case 26:
                      this.$router.push('/Application');
                      break;
                    case 29:
                      this.$router.push('/activity');
                      break;
                    case 30:
                      this.$router.push('/detailActivity/'+obj.extParam1);
                      break;
                    case 31:
                      this.$router.push('/myActivity');
                      break;
                    case 32:
                      this.$router.push('/memorial');
                      break;
                    case 38:
                      this.$router.push('/my');
                      break;
                    case 40:
                      this.$router.push('/assets/fubiAssets/'+this.userAsset.fb.accountId);
                      break;
                    case 46:
                      this.$router.push('/msg');
                      break;
                    case 48:
                      this.$router.push('/shop/order');
                      break;
                    case 52:
                      this.$router.push('/bodyCheck');
                      break;
                    case 53:
                      this.$router.push('/coupon');
                      break;
                    case 54:
                      this.$router.push('/couponList');
                      break;
                  }
                }else{
                  Toast(obj.msg)
                }
                break;
              //  H5链接（内部）
              case 2:
                if(obj.available){
                  window.location.href = obj.linkUrl;
                }else{
                  Toast(obj.msg)
                }
                break;
              //  H5链接（外部）
              case 3:
                if(obj.available){
                  MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                  });
                }else{
                  Toast(obj.msg)
                }
                break;
              //  商品列表
              case 4:
                if(obj.available){
                  this.$router.push('/cmsGoodsList/'+obj.linkId+'/2/'+obj.cmsPageId+'/0');
                }else{
                  Toast(obj.msg)
                }
                break;
              //  商品
              case 5:
                if(obj.available){
                  if(obj.suTmplId==1||obj.suTmplId==6){
                    this.$router.push('/card/'+obj.linkId);
                  }else if(obj.suTmplId==2||obj.suTmplId==7){
                    this.$router.push('/shop/goods/0/'+obj.linkId);
                  }else if(obj.suTmplId==3||obj.suTmplId==8){
                    this.$router.push('/shop/goods2/0/'+obj.linkId);
                  }else if(obj.suTmplId==4||obj.suTmplId==9){
                    this.$router.push('/moreCredit/'+obj.linkId);
                  }
                }else{
                  Toast(obj.msg)
                }
                break;
              //  无效果
              case 6:
                if(!obj.available){  //无效果提示消息
                  Toast(obj.msg)
                }else{
                  Toast(obj.msg)
                }
                break;
              //  分页tab
              case 7:
                break;
              //  操作配置
              case 8:
                if(obj.available) {
                  switch (obj.linkId) {
                    //搜索结果页 带参数
                    case 1:
                      let extparam = '';
                      if(obj.extParam2){
                        if(obj.extParam3){
                          extparam = obj.extParam1 + ' '+ obj.extParam2 +' '+ obj.extParam3;
                        }else{
                          extparam = obj.extParam1 + ' '+ obj.extParam2;
                        }
                      }else{
                        if(obj.extParam3){
                          extparam = obj.extParam1 +' '+ obj.extParam3;
                        }else{
                          extparam = obj.extParam1;
                        }
                      }
                      this.$store.dispatch("setSearchName",extparam);
                      this.$router.push("/cmsGoodsList/-1/2/7/0");
                      break;
                    //将目标规格加入购物车
                    case 2:
                      this.saveCartItem(obj.extParam1);
                      break;
                    //确认订单
                    case 3:
                      this.$router.push('/shop/orderConfim'+'?puId='+obj.extParam1);
                      break;
                    //领取优惠券
                    case 4:
                      this.getCoupon(obj.extParam1,false);
                      break;
                    // 领取并立即使用优惠券
                    case 5:
                      this.getCoupon(obj.extParam1,true);
                      break;
                  }
                }else{
                  Toast(obj.msg)
                }
                break;
            }
          //   if(obj.linkType == 4){
          //     this.$router.push('/cmsGoodsList/'+obj.linkId+'/2/'+obj.cmsPageId+'/0');
          //     window.location.reload()
          //   }else if(obj.linkType == 5||obj.linkType == 6){
          //     this.$store.state.Cookie.mutations.save('','type');
          //     if(obj.suCompanyAvailable){
          //       if(obj.suTmplId==1){
          //         this.$router.push('/card/'+obj.linkId);
          //       }else if(obj.suTmplId==2){
          //         this.$router.push('/shop/goods/0/'+obj.linkId);
          //       }else if(obj.suTmplId==3){
          //         this.$router.push('/shop/goods2/0/'+obj.linkId);
          //       }else if(obj.suTmplId==4){
          //         this.$router.push('/moreCredit/'+obj.linkId);
          //       }else if(obj.suTmplId==6){
          //         this.$router.push('/card/'+obj.linkId);
          //       }else if(obj.suTmplId==7){
          //         this.$router.push('/shop/goods/0/'+obj.linkId);
          //       }else if(obj.suTmplId==8){
          //         this.$router.push('/shop/goods2/0/'+obj.linkId);
          //       }else if(obj.suTmplId==9){
          //         this.$router.push('/moreCredit/'+obj.linkId);
          //       }
          //     }
          //   }else if(obj.linkType == 3){
          //     MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
          //     });
          //   }else if(obj.linkType == 2){
          //     window.location.href = obj.linkUrl;
          //   }else if(obj.linkType ==1){
          //     if(obj.linkId == 5){
          //       this.$router.push('shop/category');
          //     }else{
          //       MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
          //       });
          //     }
          //   }
          },
          async userAssets() {
            try {
              const res = await userAssets();

              if (res.data.code == 0) {
                this.userAsset = res.data.data;
              } else {
                Toast(res.data.data);
              }

            } catch (err) {
              Toast(err);
            }
          },
          async getCoupon(id,type) {
            try {
              const res = await insertCouponUnitWithTx({id:id});
              if (res.data.code == 0) {
                Toast('领取成功');
                if(type){
                  var item = res.data.data;
                  var storeIds =item.storeIds;
                  if(storeIds!=null){
                    if(storeIds.indexOf(parseInt(1))!=-1){
                      Toast('领取成功');
                    }else{
                      Toast('领取成功，当前门店不支持使用该优惠券，请切换至相应门店');
                    }
                  }else{
                    Toast('领取成功，当前门店不支持使用该优惠券，请切换至相应门店');
                  }
                  this.$store.state.Cookie.mutations.save(item.couponType,'couponType');
                  this.$store.state.Cookie.mutations.save(true,'fromScan');
                  if(item.jumpType == 1){
                    if(item.commodityTemplateId==1||item.commodityTemplateId==6){
                      this.$router.push('/card/'+item.goodsId);
                    }else if(item.commodityTemplateId==2||item.commodityTemplateId==7){
                      this.$router.push('/shop/goods/'+item.couponType+'/'+item.goodsId);
                    }else if(item.commodityTemplateId==3||item.commodityTemplateId==8){
                      this.$router.push('/shop/goods2/'+item.couponType+'/'+item.goodsId);
                    }else if(item.commodityTemplateId==4||item.commodityTemplateId==9){
                      this.$router.push('/moreCredit/'+item.goodsId);
                    }
                  } else if (item.jumpType == 2){
                    this.$store.state.Cookie.mutations.save('','effectTimeRange');
                    if (item.isShowEffectTimeRange) {
                      this.$store.state.Cookie.mutations.save(item.isShowEffectTimeRange,'isShowEffectTimeRange');
                      this.$store.state.Cookie.mutations.save(item.effectTimeRange,'effectTimeRange');
                    }
                    if(item.couponType==1){
                      this.$router.push('/cmsGoodsList/'+item.goodsId+'/2/'+item.cmsPageId+'/1');
                    }else{
                      this.$router.push('/cmsGoodsList/'+item.goodsId+'/2/'+item.cmsPageId+'/0');
                    }
                  }
                }

              } else {
                if (res.data.error && res.data.error!='') {
                  Toast(res.data.error);
                }else{
                  Toast('服务异常,请稍后重试');
                }
              }
            } catch (err) {
              Toast(err);
            }
          },
          //加入购物车
          async saveCartItem(skuId,num) {
            try {
              const res = await saveCartItem({num:num,productUnitId:skuId,storeId:1});
              if (res.data.code == 0) {
                Toast('商品已经在购物车躺好了哟~');
              }else if (res.data.code == 131) {
                MessageBox('提示', '该商品已下架').then(action => {
                  this.$router.push('/home');
                });
              }else if (res.data.code == 132) {
                MessageBox('提示', '该活动已过期').then(action => {
                  this.$router.push('/home');
                });
              }else {
                Toast(res.data.error);
              }
            } catch (err) {
              Toast('服务异常，请稍后重试');
            }
          },
		   }
    }
</script>

<style lang="scss">
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    .swiper-container{
      width:100%;
      height:100%;
      background:#fff;
    }
    .swipe1{
      height: px(320px);
      color: #fff;
      font-size: 20px;
      .banner{
        height: 100%;
        width: 100%;
      }
    }
    .swiper-slide{
      background-size:cover;
    }
    .swiper-pagination-bullet {
      display: inline-block;
      width:px(16px);
      height: px(10px);
      background: #fff;
      opacity: 1;
    }
    .swiper-pagination-bullet-active{
      width:px(10px);
      height: px(10px);
      background: #ff8546;
    }
</style>
