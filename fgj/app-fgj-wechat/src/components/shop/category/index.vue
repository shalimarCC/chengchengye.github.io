<template>
  <div id="category" class="page-loadmore-wrapper">
    <div id="category_tabbar" v-if="categoryType==1">
      <div class="category_box">
        <ul>
          <li v-for="info in categoryList" :class="{active:info.categoryTreeNodeId==checkId}" @click="checkCategory(info)">
            <span>{{info.categoryName}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div id="main" v-if="categoryType==1">
      <div class="main_top">
        <img @click="bannerClick" :src="bannerUrl" />
      </div>

      <!--<div class="main_bottom" ref="main_bottom" :style="'height:'+wrapperHeight+'px'">-->
      <div class="main_bottom" ref="main_bottom">
        <goods-list ref="goodsList" v-if="seriesType==1" :category-id="checkId" :categoryType="categoryType"></goods-list>

        <category ref="goodsList" v-else :category-id="checkId" :category-title="categoryTitle"></category>
      </div>
    </div>
    <!--顶部-->
    <div id="category_tabbar2" v-if="categoryType==2">
      <div class="category_box">
        <ul>
          <li v-for="info in categoryList" :class="{active:info.categoryTreeNodeId==checkId}" @click="checkCategory(info)">
            <span>{{info.categoryName}}</span>
          </li>
        </ul>
      </div>
      <div @click="putCategoryList" class="putCategoryList">
        <div class="icon-put"></div>
      </div>
    </div>
    <div id="main2" ref="main2" v-if="categoryType==2" :style="'height:'+wrapperHeight2+'px'">
      <div class="main_top">
        <img @click="bannerClick" :src="bannerUrl" />
      </div>

      <!--<div class="main_bottom" ref="main_bottom" :style="'height:'+wrapperHeight+'px'">-->
      <div class="main_bottom" ref="main_bottom" :style="leftgoodsHeight">
        <goods-list ref="goodsList1" v-if="seriesType==1" :category-id="checkId" :categoryType="categoryType"></goods-list>

        <category ref="goodsList" v-else :category-id="checkId" :category-title="categoryTitle"></category>
      </div>
    </div>

    <mt-popup
      v-model="categoryListVisible"
      position="top" class="mint-popup-4 popupList">
      <span class="all">全部分类</span>
      <div @click="closeCategoryList" class="putCategoryList2">
        <div class="close"></div>
      </div>
      <div class="popupUL">
        <ul>
          <li v-for="info in categoryList" :class="{active:info.categoryTreeNodeId==checkId}" @click="checkCategory(info)">
            <span>{{info.categoryName}}</span>
          </li>
        </ul>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import goodsList from './goodsList';
  import category from './category';
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import {
    findCategoryByType,
    userAssets,
    insertCouponUnitWithTx,
    saveCartItem,
    findSeedCategoryTreeNodeAll} from '../../../api/getData';
  export default{

    data(){
      return {
        categoryList:[],
        checkId:0,
        categoryObj:{},
        bannerUrl:'',
        seriesType:1,
        wrapperHeight:0,
        wrapperHeight2:0,
        categoryTitle:'',
        linkObj:{},
        categoryType: 1,
        categoryListVisible: false,
        leftgoodsHeight:{},
        userAsset:''
      }
    },
    components: {
      'goodsList':goodsList,
      'category':category
    },
    watch:{
    },
    created(){
      this.userAssets()
      this.findCategoryByType();
    },
    mounted(){
    },
    methods:{
      async findCategoryByType() {
        try {
          const res = await findCategoryByType();
          if (res.data.code == 0) {
            this.categoryList = res.data.data.categoryList;
            if(res.data.data.categoryList.length==0){
              Toast("暂未配置类目,请联系管理员进行添加");
              return;
            }
            this.checkId = this.categoryList[0].categoryTreeNodeId;
            this.seriesType = res.data.data.seriesType;
            if(this.seriesType==1&&res.data.data.categoryTreeTemplateId==3){ //顶部类目树
              this.categoryType=2;
            }
            if(this.categoryType==1){
              this.leftgoodsHeight.height = this.wrapperHeight +'px'
            }
            // console.log(this.categoryType==2)
            // console.log(this.categoryList.length)
            if(this.categoryType==2){ //顶部类目树，滑动部分包括banner
              if(this.categoryList.length>0){//有分类
                this.wrapperHeight = document.documentElement.clientHeight - 258;
                this.wrapperHeight2 = document.documentElement.clientHeight - 98;
              }else{
                this.wrapperHeight = document.documentElement.clientHeight - 138;
                this.wrapperHeight2 = document.documentElement.clientHeight - 98;
              }
            }else{
              //左侧类目树
              // if(this.categoryList.length>0){
              //   this.wrapperHeight = document.documentElement.clientHeight - 288;
              //   this.wrapperHeight2 = document.documentElement.clientHeight - 98;
              // }else{
              //   this.wrapperHeight = document.documentElement.clientHeight - 138;
              //   this.wrapperHeight2 = document.documentElement.clientHeight - 98;
              // }
            }

            this.checkCategory(this.categoryList[0]);
          } else {
            Toast(res.data.data);
          }

        } catch (err) {
          Toast('网络错误');
        }
      },
      checkCategory(obj){
        this.linkObj = obj;
        this.checkId = obj.categoryTreeNodeId;
        this.bannerUrl = obj.bannerUrl;
        this.categoryTitle = obj.categoryName;
        this.categoryListVisible = false;
      },
      bannerClick(){
        // console.log(this.linkObj.link_type)
        // if(this.linkObj.link_type == 3){
        //   MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
        //
        //   });
        // }else if(this.linkObj.link_type == 1){
        //   if(this.linkObj.link_id == 5){
        //     this.$router.push('/shop/category');
        //   }
        // }else if(this.linkObj.link_type == 2){
        //   window.location.href = this.linkObj.link_url;
        // }else if(this.linkObj.link_type == 4){
        //   this.$router.push('/shop/goodsList/'+this.linkObj.link_id+'/2');
        //   // this.$router.push('/cmsGoodsList/'+this.linkObj.link_id+'/2/'+this.linkObj.cmsPageId);
        // }else if(this.linkObj.link_type == 5){
        //   this.$router.push('/shop/goods/0/'+this.linkObj.link_id);
        // }
        console.log(this.linkObj)
        switch (this.linkObj.link_type) {
          //本地参数
          case 1:
            if(this.linkObj.available){
              switch (this.linkObj.link_id) {
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
                  this.$router.push('/activity/'+this.linkObj.extParam1);
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
              Toast(this.linkObj.msg)
            }
            break;
          //  H5链接（内部）
          case 2:
            if(this.linkObj.available){
              window.location.href = this.linkObj.link_url;
            }else{
              Toast(this.linkObj.msg)
            }
            break;
          //  H5链接（外部）
          case 3:
            if(this.linkObj.available){
              MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
              });
            }else{
              Toast(this.linkObj.msg)
            }
            break;
          //  商品列表
          case 4:
            if(this.linkObj.available){
              this.$router.push('/cmsGoodsList/'+this.linkObj.link_id+'/2/'+this.linkObj.cmsPageId+'/0');
            }else{
              Toast(this.linkObj.msg)
            }
            break;
          //  商品
          case 5:
            if(this.linkObj.available){
              if(this.linkObj.commodityTemplateId==1||this.linkObj.commodityTemplateId==6){
                this.$router.push('/card/'+this.linkObj.link_id);
              }else if(this.linkObj.commodityTemplateId==2||this.linkObj.commodityTemplateId==7){
                this.$router.push('/shop/goods/0/'+this.linkObj.link_id);
              }else if(this.linkObj.commodityTemplateId==3||this.linkObj.commodityTemplateId==8){
                this.$router.push('/shop/goods2/0/'+this.linkObj.link_id);
              }else if(this.linkObj.commodityTemplateId==4||this.linkObj.commodityTemplateId==9){
                this.$router.push('/moreCredit/'+this.linkObj.link_id);
              }
            }else{
              Toast(this.linkObj.msg)
            }
            break;
          //  无效果
          case 6:
            if(!this.linkObj.available){  //无效果提示消息
              Toast(this.linkObj.msg)
            }else{
              Toast(this.linkObj.msg)
            }
            break;
          //  分页tab
          case 7:
            break;
          //  操作配置
          case 8:
            if(this.linkObj.available) {
              switch (this.linkObj.link_id) {
                //搜索结果页 带参数
                case 1:
                  let extparam = '';
                  if(this.linkObj.extParam2){
                    if(this.linkObj.extParam3){
                      extparam = this.linkObj.extParam1 + ' '+ this.linkObj.extParam2 +' '+ this.linkObj.extParam3;
                    }else{
                      extparam = this.linkObj.extParam1 + ' '+ this.linkObj.extParam2;
                    }
                  }else{
                    if(this.linkObj.extParam3){
                      extparam = this.linkObj.extParam1 +' '+ this.linkObj.extParam3;
                    }else{
                      extparam = this.linkObj.extParam1;
                    }
                  }
                  this.$store.dispatch("setSearchName",extparam);
                  this.$router.push("/cmsGoodsList/-1/2/7/0");
                  break;
                //将目标规格加入购物车
                case 2:
                  this.saveCartItem(this.linkObj.extParam1);
                  break;
                //确认订单
                case 3:
                  this.$router.push('/shop/orderConfim'+'?puId='+this.linkObj.extParam1);
                  break;
                //领取优惠券
                case 4:
                  this.getCoupon(this.linkObj.extParam1,false);
                  break;
                // 领取并立即使用优惠券
                case 5:
                  this.getCoupon(this.linkObj.extParam1,true);
                  break;
              }
            }else{
              Toast(this.linkObj.msg)
            }
            break;
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
      //下拉框
      putCategoryList(){
        this.categoryListVisible = true;
      },
      closeCategoryList(){
        this.categoryListVisible = false;
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../style/component/category/category.scss";
</style>
