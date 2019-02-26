<template>
  <div id="cms">
    <myHead v-if="showHead" :pageConfig="pageConfig" v-on:linkSkip="linkSkip"></myHead>
    <div class="content page-loadmore-wrapper" :style="cmsStyle">
      <component :is="item.component" :element-obj="item" v-on:linkSkip="linkSkip" v-on:goodsSkip="goodsSkip" v-on:goodsMore="goodsMore" v-for="(item, index) in elementList" :key="index"></component>
      <!--<div class="noMore" v-if="showMore">没有更多了</div>-->
    </div>
  </div>
</template>

<script>
  import banner from '../newCms/banner';
  import news from '../newCms/news';
  import icon from '../newCms/icon';
  import titleBar from '../newCms/titleBar';
  import slogan from '../newCms/slogan';
  import swiper from '../newCms/swiper';
  import goods from '../newCms/goods';
  import threeBanner from '../newCms/threeBanner';
  import myHead from '../newCms/head';
  import tabbar from '../newCms/tabbar';
  import { Toast } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  import {countFit} from '@/until';
  import { baseUrl } from '../../../config/env.js'
  import {
    userAssets,
    findPageCfgById,
    insertCouponUnitWithTx,
    saveCartItem,
    insurance3rdLogin
  } from '../../../api/getData';
  export default {
    data(){
      return{
        item:{},
        pageConfig:{},
        elementList:[],
        cmsStyle:{
          background:'#fff',
          height:1220,
          paddingTop: 88
        },
        contentHeight:0,
        showHead:false,
        userAsset:'',
        pageType:2,
        linkUrl:'',
        iframeStyle:{
          width:'',
          height:''
        },
        showMore: false,
        pageId:''
      }
    },
    components: {
      'banner':banner,
      'news':news,
      'icon':icon,
      'titleBar':titleBar,
      'slogan':slogan,
      'swiper':swiper,
      'goods':goods,
      'threeBanner':threeBanner,
      'myHead':myHead,
      'tabbar':tabbar,
    },
    created(){
      this.iframeStyle.height = document.documentElement.clientHeight-44;
      if(this.$route.name=='首页'){
        this.pageType = 2;
      }else if(this.$route.name=='商城'){
        this.pageType = 3;
      }else if(this.$route.name=='应用'){
        this.pageType = 4;
      }else if(this.$route.name=='活动'){
        this.pageType = 5;
      }
      this.pageId = this.$route.params.pageId;
      this.userAssets()
      this.findPageCfgById()
    },
    methods:{
      async  findPageCfgById(){
        try{
          const res = await findPageCfgById({scope:0,pageId:this.pageId});
          if(res.data.code==0){
            Indicator.close();
            this.showHead = true;
            this.pageConfig = res.data.data.pageConfig;
            //传递页面类型
            this.pageConfig.type = this.pageType;
            //设置全背景图片
            if(this.pageConfig.backgroundImageUrl){
              this.cmsStyle.background = 'url('+this.pageConfig.backgroundImageUrl+')';
              this.cmsStyle.backgroundSize = '100% 100%';
              this.cmsStyle.backgroundRepeat = 'round';
            }
            if(this.pageConfig.titleOpacity==100){
              this.cmsStyle.paddingTop = countFit(this.pageConfig.titleHeight);
            }
            //显示指定宽高比
            if(this.pageConfig.aspectRatioCheckBox){
              this.contentHeight = this.pageConfig.aspectRatio * 750;
              this.cmsStyle.height = countFit(this.contentHeight)
            }else{
              //默认高，总高度减上下导航高度
              // if(this.pageConfig.titleOpacity==100){
              //   this.cmsStyle.height = countFit(document.documentElement.clientHeight*2-this.pageConfig.titleHeight)
              // }else{
              //   this.cmsStyle.height = countFit(document.documentElement.clientHeight*2)
              // }
            }
            let thtf = this;
            let totalHeight=0;
            $.each(res.data.data.pageInsts,function (key,info) {
              let obj = info;
              switch (info.elementId) {
                case 6:
                  obj.component = 'titleBar';
                  thtf.elementList.push(obj);
                  if(info.config6.totalHeight){
                    totalHeight+= parseInt(info.config6.totalHeight);
                  }
                  break;
                case 7:
                  obj.component = 'banner';
                  thtf.elementList.push(obj);
                  if(info.config7.totalHight){
                    totalHeight+= parseInt(info.config7.totalHight);
                  }
                  break;
                case 8:
                  obj.component = 'swiper';
                  thtf.elementList.push(obj);
                  if(info.config8.totalHeight){
                    totalHeight+= parseInt(info.config8.totalHeight);
                  }
                  break;
                case 9:
                  obj.component = 'slogan';
                  thtf.elementList.push(obj);
                  if(info.config9.totalHeight){
                    totalHeight+= parseInt(info.config9.totalHeight);
                  }
                  break;
                case 10:
                  obj.component = 'icon';
                  thtf.elementList.push(obj);
                  if(info.config10.totalHeight){
                    totalHeight+= parseInt(info.config10.totalHeight);
                  }
                  break;
                case 11:
                  obj.component = 'goods';
                  thtf.elementList.push(obj);
                  if(info.config11.totalHeight){
                    totalHeight+= parseInt(info.config11.totalHeight);
                  }
                  break;
                case 12:
                  obj.component = 'threeBanner';
                  thtf.elementList.push(obj);
                  if(info.config12.totalHeight){
                    totalHeight+= parseInt(info.config12.totalHeight);
                  }
                  break;
                case 13:
                  obj.component = 'news';
                  thtf.elementList.push(obj);
                  if(info.config13.totalHeight){
                    totalHeight+= parseInt(info.config13.totalHeight);
                  }
                  break;
              }
            })
            //超过一屏显示更多
            if(totalHeight>document.documentElement.clientHeight){
              this.showMore = true;
            }

          }
        }catch (e) {

        }
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
      async saveCartItem(skuId) {
        try {
          const res = await saveCartItem({num:1,productUnitId:skuId,storeId:1});
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
      linkSkip(arr){
        console.log(arr)
        var obj= arr[0];
        console.log(obj)
        switch (obj.linkType) {
          //本地参数
          case 1:
            if(obj.available){
              switch (obj.linkId) {
                case 11:
                  Indicator.open();
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
                  window.location.reload();
                  Indicator.close();
                  break;
                case 18:
                  MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                  });
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
                case 27:
                  MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                  });
                  break;
                case 28:
                  MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                  });
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
                case 33:
                  MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                  });
                  break;
                case 34:
                  MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                  });
                  break;
                case 35:
                  MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                  });
                  break;
                case 36||37:
                  MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                  });
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
                  if(obj.extParam1==1){//满减券
                    this.$store.state.Cookie.mutations.save(0,'navCheck');
                  }else if(obj.extParam1==2){//兑换
                    this.$store.state.Cookie.mutations.save(1,'navCheck');
                  }
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
              // this.$router.push('/insuranceOrder')
              // this.insurance3rdLogin(obj.linkId);
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
      },
      goodsSkip(arr){
        let obj = arr[0];
        if(obj.suTmplId==1||obj.suTmplId==6){
          this.$router.push('/card/'+obj.suId);
        }else if(obj.suTmplId==2||obj.suTmplId==7){
          this.$router.push('/shop/goods/0/'+obj.suId);
        }else if(obj.suTmplId==3||obj.suTmplId==8){
          this.$router.push('/shop/goods2/0/'+obj.suId);
        }else if(obj.suTmplId==4||obj.suTmplId==9){
          this.$router.push('/moreCredit/'+obj.suId);
        }
      },
      goodsMore(arr){
        this.$router.push('/cmsGoodsList/'+arr[0].sucId+'/2/'+arr[0].cmsPageId+'/0');
      }
    }
  }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  #cms{
    /*overflow:hidden;*/
    /*margin-bottom: px(110px);*/
  }
  #cms::-webkit-scrollbar{
    display: none;
  }
  .content{
    /*height:100%;*/
    /*overflow-y: auto;*/
    /*-webkit-overflow-scrolling: touch;*/
    overflow-x: hidden;
    background-attachment: fixed;
  }
  .content::-webkit-scrollbar{
    display: none;
  }
  .noMore{
    line-height: px(80px);
    /*background: #f4f4f4;*/
    font-size: px(24px);
    color: #686868;
    text-align: center;
  }

</style>
