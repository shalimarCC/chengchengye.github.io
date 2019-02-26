<template>
    <div class="goodsList">
      <!--是否显示标题搜索栏（1-显示标题 2-隐藏标题 3-初始隐藏标题 4-显示搜索栏）-->
      <div class="head" ref="head" v-if="showTitleSearch!=2">
        <ul>
          <li>
            <div style="position:absolute" @click="routerBack">
              <i class="iconfont icon-fanhui"></i>
            </div>
          </li>
          <li class="title" v-if="showTitleSearch==1||showTitleSearch==3" :style="titleSize">
            <span>
              {{title}}
            </span>
          </li>
          <li class="search_input" v-if="showTitleSearch==4">
            <div class="search_input_input" @click="goSearch">
              <i></i>
              <input class="keyWord" type="text" v-model="goodsName" placeholder="搜索商品" list="topSearch"/>
              <i class="closeSearch" @click="goodsName=''" v-if="goodsName!=''"></i>
            </div>
          </li>
          <li>
            <router-link to="/search" v-if="showTitleSearch==1||showTitleSearch==3">
              <div class="search">
              </div>
            </router-link>
          </li>
          <li>
            <router-link to="/shop/shopCart">
              <div class="head_cart">
                <span class="cart_num" v-if="cartNum>99">99+</span>
                <span class="cart_num" v-else-if="cartNum>0&&cartNum<=99">{{cartNum}}</span>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
      <!--标题初始化隐藏-->
      <div class="head2" ref="head2" v-if="showTitleSearch==3||showTitleSearch==2">
        <ul>
          <li>
            <div class="icon" @click="routerBack">
            </div>
          </li>
          <li>
            <router-link to="/search">
              <div class="search2">
              </div>
            </router-link>
          </li>
          <li>
            <router-link to="/shop/shopCart">
              <div class="head_cart2">
                <span class="cart_num" v-if="cartNum>99">99+</span>
                <span class="cart_num" v-else-if="cartNum>0&&cartNum<=99">{{cartNum}}</span>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
      <!--<div class="content" ref="content" v-on:scroll="touchFn">-->
      <div class="content  page-loadmore-wrapper" :style="'height:'+listHeight+'px;'" ref="content" v-on:scroll="touchFn">
        <!--有banner时显示位置-->
        <!--<div class="effectTimeRange" ref="effectTimeRange" v-if="showEffectTime==1&&bannerList.length>0" :style="[bannerList.length>0&&(showTitleSearch!=2&&showTitleSearch!=3)?styleObj:'']">-->
          <!--<span>该券有效期为:{{effectTimeRange}}</span><i @click="closeTime()"></i>-->
        <!--</div>-->
        <!--轮播图-->
        <div :style="[showTitleSearch==2||showTitleSearch==3?'':styleObj]">
          <template class="banner" v-if="bannerList.length>0">
            <banner :banner-goods-data="bannerList"></banner>
          </template>
        </div>

        <!--showSortFilter-是否显示排序筛选栏（1-均显示 2-仅排序 3-仅筛选 4-均隐藏）-->
        <ul :class="[bannerList.length>0?'nav':'nav fixGoods']" v-if="showSortFilter!=4" ref="nav">
          <li v-if="showSortFilter==1||showSortFilter==2" :class="{active:goodsObj.orderByType == 1}" @click="checkSale">
            <span>销量</span>
          </li>
          <li v-if="showSortFilter==1||showSortFilter==2" class="price" :class="{active:goodsObj.orderByType == 2}" @click="checkPrice">
            <span>价格</span>
            <b class="price_top" v-if="goodsObj.orderByType == 2&&goodsObj.sortRegulation==1"></b>
            <b class="price_bottom" v-else-if="goodsObj.orderByType == 2&&goodsObj.sortRegulation==2"></b>
            <b class="price" v-else></b>
          </li>
          <li v-if="showSortFilter==1||showSortFilter==3||showSortFilter==2" class="list" :class="{active:goodsObj.orderByType == 2}" @click="checkList">
            <b class="list_check" v-if="listType"></b>
            <b class="list_check_out" v-else-if="!listType"></b>
          </li>
          <li v-if="showSortFilter==1||showSortFilter==3" class="screen" @click="checkScreen" :class="{active:goodsObj.fubiPay == 1||goodsObj.saleWay == 7||goodsObj.buyType==2}">
            <span>筛选</span>
            <b class="screen_check" v-if="goodsObj.fubiPay == 1||goodsObj.saleWay == 7||goodsObj.buyType==2"></b>
            <b class="screen_check_out" v-else></b>
          </li>
        </ul>
        <!--无banner时显示位置-->
        <!--<div class="effectTimeRange" v-if="showEffectTime==1" :style="[(showTitleSearch!=2&&showTitleSearch!=3)?'':styleObj]">-->
        <div class="effectTimeRange" v-if="showEffectTime==1" :style="[bannerList.length<0&&(showSortFilter==4)?styleObj:'']">
          <span>该券有效期为:{{effectTimeRange}}</span><i @click="closeTime()"></i>
        </div>
        <div class="goods" ref="goods_list" v-if="goodsType || goodsList.length > 0" >
        <!--<div :class="[(bannerList.length>0)?'goods':'goods fixGoods']" ref="goods_list" v-if="goodsType || goodsList.length > 0" >-->
          <ul
            class="list1"
            v-if="listType"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="goodsloading"
            infinite-scroll-distance="10">
            <li v-for="goods in goodsList" class="page-loadmore-listitem clear">
              <div class="goods_box" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId,goods.status,goods.stockNum)">
                <div class="goods_left">
                  <img v-lazy="goods.pictureUrl+'?imageMogr2/size-limit/500k!'">
                  <div class="logo logo1" v-show="goods.saleWay==4"></div>
                  <div class="logo logo2" v-show="goods.saleWay==6"></div>
                  <div v-if="goods.status==4" class="shortStock1">商品已下架</div>
                  <div v-if="goods.status!=4&&(goods.stockNum<=goods.stockWarning)&&(goods.stockNum>0)" class="shortStock1">库存紧张</div>
                  <div v-if="goods.status!=4&&(!goods.stockNum||goods.stockNum <= 0)" class="shortStock1">库存不足</div>
                </div>
                <div class="goods_right">
                  <h6><span class="operateByown" v-if="goods.isOwnMerchant">自营</span>{{goods.name}}</h6>
                  <!--showPrice-显示价格（1-隐藏 2-商品价格，显示原价 3-商品价格，隐藏原价 4-规格价格，显示原价 5-规格价格，隐藏原价 6-价格范围，显示原价 7-价格范围，隐藏原价）-->
                  <p v-if="showPrice!=1">{{goods.salePrice.toFixed(2)}} <span class="fubi">积分</span></p>
                  <del v-if="showPrice==2||showPrice==4||showPrice==6">&yen;{{goods.marketPrice.toFixed(2)}}</del>
                  <!--showCart-单品购物车（1 隐藏 2-购物车 3-立即购买）-->
                  <div class="shopCart" v-if="showCart==2&&showCart!=4">加入购物车</div>
                  <div :class="[(goods.status==4)?'disabled':'shopCart']" v-if="showCart==3" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId,goods.status,goods.stockNum)">立即购买</div>
                  <div :class="[(goods.status==4)?'disabled':'shopCart']" v-if="showCart==4" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId,goods.status,goods.stockNum)">立即兑换</div>
                </div>
              </div>
            </li>
          </ul>
          <ul
            class="list2"
            v-else
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="goodsloading"
            infinite-scroll-distance="10">
            <li v-for="goods in goodsList" class="page-loadmore-listitem clear">
              <div class="goods_box">
                <img v-lazy="goods.pictureUrl+'?imageMogr2/size-limit/500k!'"  @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId,goods.status,goods.stockNum)">
                <div class="logo logo1" v-show="goods.saleWay==4"></div>
                <div class="logo logo2" v-show="goods.saleWay==6"></div>
                <div v-if="goods.status==4" class="shortStock1">商品已下架</div>
                <div v-if="goods.status!=4&&(goods.stockNum<=goods.stockWarning)&&(goods.stockNum>0)" class="shortStock1">库存紧张</div>
                <div v-if="goods.status!=4&&(!goods.stockNum||goods.stockNum <= 0)" class="shortStock1">库存不足</div>
                <h6><span class="operateByown" v-if="goods.isOwnMerchant">自营</span>{{goods.name}}</h6>
                <div class="goods_price" v-if="showPrice==2||showPrice==4||showPrice==3||showPrice==5">
                  <p v-if="showPrice!=1">
                    {{goods.salePrice.toFixed(2)}}
                    <span class="fubi">积分</span>
                  </p>
                  <del v-if="showPrice==2||showPrice==4||showPrice==6">&yen;{{goods.marketPrice.toFixed(2)}}</del>
                </div>
                <div class="price_range" v-if="showPrice==6||showPrice==7">
                  <p v-if="showPrice!=1">
                    {{goods.salePrice.toFixed(2)}}
                    <span class="fubi">积分</span>
                  </p>
                  <del v-if="showPrice==2||showPrice==4||showPrice==6">&yen;{{goods.marketPrice.toFixed(2)}}</del>
                </div>
                <p class="shopCart" v-if="showCart==2&&showCart!=4">加入购物车</p>
                <p v-if="showCart==3" :class="[(goods.status==4)?'disabled':'shopCart']" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId,goods.status,goods.stockNum)">立即购买</p>
                <p v-if="showCart==4" :class="[(goods.status==4)?'disabled':'shopCart']" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId,goods.status,goods.stockNum)">立即兑换</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="error" v-else>
          <img src="../../../../static/assets/img/goodsList_error.png" alt="">
          <p>暂时没有商品</p>
        </div>
        <mt-popup
          :style="'top:'+popTop+'px'"
          v-model="popupVisible"
          pop-transition="popup-fade">
          <div class="pop"  @click="checkFubipay" :class="{active:goodsObj.fubiPay == 1}">
            <i :class="{'icon-round':goodsObj.fubiPay==0,'icon-roundcheckfill':goodsObj.fubiPay==1}" class="iconfont"></i>
            <span>低于积分余额</span>
          </div>
          <div class="pop"  @click="checkPresale" :class="{active:goodsObj.saleWay == 7}">
            <i :class="{'icon-round':goodsObj.saleWay==0,'icon-roundcheckfill':goodsObj.saleWay==7}" class="iconfont"></i>
            <span>预售商品</span>
          </div>
          <div class="pop"  @click="checkBuytype" :class="{active:goodsObj.buyType == 2}">
            <i :class="{'icon-round':goodsObj.buyType==0,'icon-roundcheckfill':goodsObj.buyType==2}" class="iconfont"></i>
            <span>现金购买商品</span>
          </div>
        </mt-popup>
      </div>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import banner from './banner1';
    import {
      findByCategoryTreeNodeIdOrSUC,
      findPageCfgById,
      findByKeywordOfPage,
      findCartItemSumByUserId
    } from '../../../api/getData';
    export default{
        data(){
            return {
                goodsObj:{
                    standardUnitCombinationId:'',
                    categoryTreeNodeId:'',
                    fubiPay:0,
                    orderByType:0,
                    sortRegulation:0,
                    type:1,
                    pageNo:1,
                    pageSize:10,
                    saleWay:0,
                    buyType:0,
                    pictureList:[]
                },
                cartNum:0,
                goodsName:'',
                goodsList:[],
                goodsloading:false,
                listType:true,
                popupVisible:false,
                listHeight:0,
                goodsType:true,
                categoryId:0,
                standardUnitCombinationId:'',
                shortStock:false,
                sallOut: false,
                popTop:'',
                title:'商品列表',   //标题
                showTitleSearch:1,  //是否显示标题搜索栏
                showSortFilter:1,  //是否显示排序筛选栏
                showPrice:2,  //是否显示价格
                showBanner:'', //是否显示轮播图
                showCart:1, //是否显示轮播图
                bannerList:[], //轮播图列表
                pageId:'',
                moreGoods: 0,
                effectTimeRange:'',
                showEffectTime:2,
                couponType:'',
                styleObj:{
                  marginTop: '44px'
                },
                titleSize:{
                  fontSize:''
                }
            }
        },
        components: {
          'banner': banner,
        },
        watch:{
        },
        created(){
            // this.$route.query.type
            // this.$route.query.saleWay
            // this.$route.query.buyType
            // this.$route.query.fubiPay
            // this.$route.query.orderByType
            // this.$route.query.sortRegulation
            if(this.$store.state.Cookie.mutations.fetch('fromSearch')==true){
              this.listHeight = document.body.scrollHeight;
            }else{
              this.listHeight = document.documentElement.clientHeight;
            }
            this.effectTimeRange = this.$store.state.Cookie.mutations.fetch('effectTimeRange');
            this.couponType = this.$route.params.couponType;
            if(this.couponType==1){
              this.listType = false;
              //标示从cms列表进入的商品详情，unitId不清除;
              this.$store.state.Cookie.mutations.save(true,'fromCmslist');
            }
            if(this.$route.params.id==-1){
              this.goodsObj.name = this.$store.state.searchName;
              this.goodsName = this.$store.state.searchName;
              // this.findByKeywordOfPage()
            }else{
            }
            //获取配置
            this.findPageCfgById();
            // 获取购物车数量
            this.findCartItemSumByUserId();
            this.goodsObj.type = this.$route.params.type; //标记从哪里过来的，类目或su组合（本页面可写死）
            this.pageId = this.$route.params.pageId;

            if(this.goodsObj.type == 1){
                this.goodsObj.categoryTreeNodeId = this.$route.params.id;
            }else if(this.goodsObj.type == 2){
                this.goodsObj.standardUnitCombinationId = this.$route.params.id;
            }

            if(this.$store.state.Cookie.mutations.fetch('typeID')){
              this.goodsObj.couponUnitId = this.$store.state.Cookie.mutations.fetch('typeID');
            }


        },
        mounted() {
            this.popTop = this.$refs.nav.offsetTop + 100;
            if(this.showTitleSearch==3){
              this.$refs.head.style.opacity = 0;
              this.$refs.head2.style.opacity= 1;
            }
        },
        methods:{
            loadMore(){
              this.goodsloading = true;
              if(this.goodsObj.standardUnitCombinationId==''&&this.goodsObj.categoryId==''){
                return;
              }
              if(this.$route.params.id==-1){
                this.findByKeywordOfPage();
              }else{
                this.findByCategoryTreeNodeIdOrSUC();
              }
              // Indicator.open();
            },
            touchFn(){
              if(this.showTitleSearch!=2){
                this.popTop= 340 - this.$refs.content.scrollTop;
              }else{
                this.popTop= 340 - this.$refs.content.scrollTop+44;
              }
              let offsetY=0;
              let opacity_modulu;
              if(this.$refs.content.scrollTop>50){
                offsetY = 50;
              }
              opacity_modulu = offsetY / 50;
              if(this.showTitleSearch==3){
                this.$refs.head.style.opacity = opacity_modulu;
                this.$refs.head2.style.opacity=`${1 - opacity_modulu}`;
              }
            },
            goSearch(){
              this.$store.state.Cookie.mutations.save(false,'fromSearch');
               // this.$store.state.Cookie.mutations.save(true,'fromCms');
               this.$router.push('/search');
            },
            routerBack(){
                this.$store.state.Cookie.mutations.save(false,'isShowEffectTimeRange');
                this.$store.state.Cookie.mutations.save('','typeID');
                this.$store.state.Cookie.mutations.save('','effectTimeRange');
                this.$store.dispatch("setSearchName",'');
                if(this.$store.state.Cookie.mutations.fetch('type')=='coupon_unit'){
                  this.$router.push('/coupon')
                }else{
                  this.$router.go(-1);
                }
            },

            //搜索
            search(){
              var regu = "^[ ]+$";
               var re = new RegExp(regu);
              if(this.goodsName == '' || re.test(this.goodsName)){
                return;
              }else{
                this.goodsObj.name = this.goodsName;
                this.goodsObj.pageNo = 1;
                this.goodsObj.pageSize = 20;
                this.findByKeywordOfPage();
              }
            },
            //关键词搜索
            async findByKeywordOfPage() {
              try {
                const obj = new Object();
                $.each(this.goodsObj, function (key, info) {
                  if (info !== "") {
                    obj[key] = info;
                  }
                });
                const res = await findByKeywordOfPage(obj);
                if (res.data.code == 0) {
                  // this.goodsList=[];
                  this.goodsType = true;
                  Indicator.close();
                  if(res.data.data.list.length == 0){
                    this.goodsType = false;
                    this.goodsloading = true;
                    this.moreGoods = 0;
                    this.goodsList = this.goodsList.concat(res.data.data.list);
                  }else{
                    this.goodsObj.pageNo++;
                    this.goodsList = this.goodsList.concat(res.data.data.list);
                    this.moreGoods = 1;
                  }
                  if(this.moreGoods == 1){
                    this.goodsloading = false;
                  }else{
                    this.goodsloading = true;
                  }
                } else {
                  this.goodsType = false;
                  Indicator.close();
                }
              } catch (err) {
                Toast('网络错误');
              }
            },
            async findByCategoryTreeNodeIdOrSUC() {
                try {
                    const obj = new Object();
                    $.each(this.goodsObj, function (key, info) {
                        if (info !== "") {
                            obj[key] = info;
                        }
                    });
                    const res = await findByCategoryTreeNodeIdOrSUC(obj);
                    if (res.data.code == 0) {
                        this.goodsType = true;
                        Indicator.close();
                        if(res.data.data.list.length == 0){
                            this.goodsType = false;
                            this.moreGoods = 0;
                            this.goodsloading = true;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                        }else{
                            this.goodsObj.pageNo++;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                            this.moreGoods = 1;
                        }
                        if(this.moreGoods == 1){
                          this.goodsloading = false;
                        }else{
                          this.goodsloading = true;
                        }
                    } else {
                        this.goodsType = false;
                        Indicator.close();
                    }
                } catch (err) {
                    Toast('网络错误');
                }
            },
            //获取cms配置
            async findPageCfgById() {
              try {
                const res = await findPageCfgById({pageId: this.$route.params.pageId,scope:0});
                if (res.data.code == 0) {
                  var _this = this;
                  this.title = res.data.data.pageConfig.title;
                  this.showTitleSearch = res.data.data.pageConfig.showTitleSearch;
                  this.titleSize.fontSize = res.data.data.pageConfig.titleFontSize/750*10 +'rem';
                  if(this.showTitleSearch==3){
                    this.$refs.head.style.opacity = 0;
                  }
                  $.each(res.data.data.pageInsts,function(key,info){
                    switch (info.elementId) {
                      case 1:
                        _this.showSortFilter = info.config.showSortFilter;
                        break;
                      case 2:
                        _this.showPrice = info.config.showPrice;
                        _this.showCart = info.config.showCart;
                        break;
                      case 3:
                        _this.bannerList = info.config.bannerList;
                        break;
                      case 4:
                        _this.bannerList = info.config.bannerList;
                        break;
                      case 5:
                        _this.showEffectTime = info.config.showEffectTime;
                        break;
                    }
                  });
                  if(this.showSortFilter==4){
                    this.listType = false;
                  }
                  if(this.bannerList.length>0){
                    //弹窗的定位问题
                    this.popTop = this.$refs.nav.offsetTop+250;
                    }else{
                    this.popTop = this.$refs.nav.offsetTop+100;
                  }
                  }
              } catch (err) {
                Toast('网络错误');
              }
            },
            async findCartItemSumByUserId() {
                try {
                    const res = await findCartItemSumByUserId();
                    if (res.data.code == 0) {
                      this.cartNum = res.data.data;
                      this.$store.dispatch("setShopCartNum",res.data.data);
                    } else {

                    }
                } catch (err) {
                }
            },
            //销量排序
            checkSale(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.orderByType = this.goodsObj.orderByType==1 ? 0:1;
                if(this.$route.params.id==-1){
                  this.findByKeywordOfPage();
                }else{
                  this.findByCategoryTreeNodeIdOrSUC();
                }
            },
            //价格排序
            checkPrice(){
                console.log(window.history)
                console.log(history.replaceState)
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.orderByType = this.goodsObj.orderByType==2&&this.goodsObj.sortRegulation==2 ? 0:2;
                if(this.goodsObj.sortRegulation==0){
                    this.goodsObj.sortRegulation=1
                }else if(this.goodsObj.sortRegulation==1){
                    this.goodsObj.sortRegulation=2
                }else if(this.goodsObj.sortRegulation==2){
                    this.goodsObj.sortRegulation=0
                }
                if(this.$route.params.id==-1){
                  this.findByKeywordOfPage();
                }else{
                  this.findByCategoryTreeNodeIdOrSUC();
                }
            },

            //切换显示方式
            checkList(){
                this.listType = !this.listType;
            },
            checkScreen(){
                this.popupVisible = true;
            },
            //筛选积分
            checkFubipay(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.fubiPay = this.goodsObj.fubiPay==1 ? 0:1;
                this.popupVisible = false;
                if(this.$route.params.id==-1){
                  this.findByKeywordOfPage();
                }else{
                  this.findByCategoryTreeNodeIdOrSUC();
                }
            },
            //筛选预售
            checkPresale(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.saleWay = this.goodsObj.saleWay==7 ? 0:7;
                this.popupVisible = false;
                if(this.$route.params.id==-1){
                  this.findByKeywordOfPage();
                }else{
                  this.findByCategoryTreeNodeIdOrSUC();
                }
            },
            //筛选现金购买方式
            checkBuytype(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.buyType = this.goodsObj.buyType==2 ? 0:2;
                this.popupVisible = false;
                if(this.$route.params.id==-1){
                  this.findByKeywordOfPage();
                }else{
                  this.findByCategoryTreeNodeIdOrSUC();
                }
            },
            closeTime(){
                this.showEffectTime=2;
            },
            goodsSkip(id,type,status,stockNum){
                  // if((status!=3)||(!stockNum||stockNum <= 0)){
                  //   return
                  // }
                  this.$store.state.Cookie.mutations.save('','type');
                  this.$store.state.Cookie.mutations.save(false,'fromSearch');
                  if(type==1||type==6){
                    this.$router.push('/card/'+id);
                  }else if(type==2||type==7){
                    this.$router.push('/shop/goods/'+this.couponType+'/'+id);
                  }else if(type==3||type==8){
                    this.$router.push('/shop/goods2/'+this.couponType+'/'+id);
                  }else if(type==4||type==9){
                    this.$router.push('/moreCredit/'+id);
                  }
              },
		    }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/index/cmsGoodsList.scss";
$baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
.page-loadmore-listitem {
  text-align: center;
}
.page-loadmore-wrapper{
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}
</style>
