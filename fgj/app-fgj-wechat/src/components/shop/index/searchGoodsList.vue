<template>
    <div class="goodsList">
      <div class="head" ref="head">
        <ul>
          <li>
            <div style="float:left;position:absolute;line-height:30px;" @click="routerBack">
              <i class="iconfont icon-fanhui"></i>
            </div>
          </li>
          <li class="search_input">
            <div class="search_input_input">
              <i></i>
              <input class="keyWord" type="text" @keyup.enter="search()" v-model="goodsName" placeholder="搜索商品" list="topSearch"/>
              <i class="closeSearch" @click="goodsName=''" v-if="goodsName!=''"></i>
            </div>
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
        <ul class="nav">
            <li :class="{active:goodsObj.orderByType == 1}" @click="checkSale">
                <span>销量</span>
            </li>
            <li class="price" :class="{active:goodsObj.orderByType == 2}" @click="checkPrice">
                <span>价格</span>
                <b class="price_top" v-if="goodsObj.orderByType == 2&&goodsObj.sortRegulation==1"></b>
                <b class="price_bottom" v-else-if="goodsObj.orderByType == 2&&goodsObj.sortRegulation==2"></b>
                <b class="price" v-else></b>
            </li>
            <li class="list" :class="{active:goodsObj.orderByType == 2}" @click="checkList">
                <b class="list_check" v-if="listType"></b>
                <b class="list_check_out" v-else-if="!listType"></b>
            </li>
            <li class="screen" @click="checkScreen" :class="{active:goodsObj.fubiPay == 1||goodsObj.saleWay == 7}">
                <span>筛选</span>
                <b class="screen_check" v-if="goodsObj.fubiPay == 1||goodsObj.saleWay == 7"></b>
                <b class="screen_check_out" v-else></b>
            </li>
        </ul>

        <div class="goods" ref="goods_list" :style="'height:'+listHeight+'px;'" v-if="goodsType || goodsList.length > 0">
            <ul
            class="list1"
            v-if="listType"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="goodsloading"
            infinite-scroll-distance="30">
                <li v-for="goods in goodsList" class="page-loadmore-listitem clear">

                   <div class="goods_box" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId)">
                        <div class="goods_left">
                            <img v-lazy="goods.pictureUrl+'?imageMogr2/size-limit/500k!'">
                            <div class="logo logo1" v-show="goods.saleWay==4"></div>
                            <div class="logo logo2" v-show="goods.saleWay==6"></div>
                        </div>
                        <div class="goods_right">
                            <h6><span class="operateByown" v-if="goods.isOwnMerchant">自营</span>{{goods.name}}</h6>
                            <p>{{goods.salePrice.toFixed(2)}} <span class="fubi">积分</span></p>
                            <del>&yen;{{goods.marketPrice.toFixed(2)}}</del>
                          <span v-if="(goods.stockNum<=goods.stockWarning)&&(goods.stockNum>0)" class="shortStock">库存紧张</span>
                          <span v-if="!goods.stockNum||goods.stockNum <= 0" class="shortStock">售完</span>
                        </div>
                    </div>
                </li>
            </ul>

            <ul
            class="list2"
            v-else
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="goodsloading"
            infinite-scroll-distance="30">
                <li v-for="goods in goodsList" class="page-loadmore-listitem clear">

                    <div class="goods_box" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId)">
                        <img v-lazy="goods.pictureUrl+'?imageMogr2/size-limit/500k!'">
                        <div class="logo logo1" v-show="goods.saleWay==4"></div>
                        <div class="logo logo2" v-show="goods.saleWay==6"></div>
                        <h6><span class="operateByown" v-if="goods.isOwnMerchant">自营</span>{{goods.name}}</h6>
                        <p>{{goods.salePrice.toFixed(2)}} <span class="fubi">积分</span></p>
                        <del>&yen;{{goods.marketPrice.toFixed(2)}}</del>
                      <span v-if="(goods.stockNum<=goods.stockWarning)&&(goods.stockNum>0)" class="shortStock">库存紧张</span>
                      <span v-if="!goods.stockNum||goods.stockNum <= 0" class="shortStock">售完</span>
                    </div>
                </li>
            </ul>
        </div>

        <div class="error" v-else>
            <img src="../../../../static/assets/img/error/search_error.png" alt="">
            <p>抱歉,没有找到相关商品</p>
        </div>

        <mt-popup
        v-model="popupVisible"
        pop-transition="popup-fade">
            <div class="pop"  @click="checkFubipay" :class="{active:goodsObj.fubiPay == 1}">
                <i :class="{'icon-round':this.goodsObj.fubiPay==0,'icon-roundcheckfill':this.goodsObj.fubiPay==1}" class="iconfont"></i>
                <span>低于余额</span>
            </div>
            <div class="pop"  @click="checkPresale" :class="{active:goodsObj.saleWay == 7}">
              <i :class="{'icon-round':goodsObj.saleWay==0,'icon-roundcheckfill':goodsObj.saleWay==7}" class="iconfont"></i>
              <span>预售</span>
            </div>
            <div class="pop"  @click="checkBuytype" :class="{active:goodsObj.buyType == 2}">
              <i :class="{'icon-round':goodsObj.buyType==0,'icon-roundcheckfill':goodsObj.buyType==2}" class="iconfont"></i>
              <span>现金购买商品</span>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    // import { findByCategoryTreeNodeIdOrSUC } from '../../../api/getData';
    import { findByKeywordOfPage } from '../../../api/getData';
    export default{
        data(){
            return {
                goodsObj:{
                    name:'',
                    fubiPay:0,
                    orderByType:0,
                    sortRegulation:0,
                    type:1,
                    pageNo:1,
                    pageSize:10,
                    saleWay:0,
                    buyType:0
                },
                goodsList:[],
                goodsloading:false,
                listType:true,
                popupVisible:false,
                listHeight:0,
                goodsType:true,
                categoryId:0,
                standardUnitCombinationId:'',
                moreGoods: 0,
                storeId:'',
                goodsName:'',
                cartNum:''
            }
        },
        watch:{
        },
        created(){
            this.storeId = this.$store.state.Cookie.mutations.fetch('storeId');
            this.goodsObj.name = this.$route.params.name;
            this.goodsObj.storeId = 1;
        },
        mounted() {
            this.listHeight = document.documentElement.clientHeight - this.$refs.goods_list.getBoundingClientRect().top;
        },
        methods:{
            loadMore(){
                this.goodsloading = true;
                this.findByKeywordOfPage();
                Indicator.open();
            },
            routerBack(){
              this.$router.go(-1);
            },
            async findByKeywordOfPage() {
                try {
                    const obj = new Object();
                    $.each(this.goodsObj, function (key, info) {
                        if (info !== "") {
                            obj[key] = info;
                        }
                    })
                    const res = await findByKeywordOfPage(obj);
                    if (res.data.code == 0) {
                        this.goodsType = true;
                        Indicator.close();
                        if(res.data.data.list.length == 0){
                            this.goodsType = false;
                            this.moreGoods = 0;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                        }else{
                            this.goodsObj.pageNo++;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                            this.moreGoods = 1;
                        }
                        if(this.moreGoods == 1){
                            this.goodsloading = false;
                        }
                    } else {
                        this.goodsType = false;
                        Indicator.close();
                    }
                } catch (err) {
                    Toast('网络错误');
                }
            },

            //销量排序
            checkSale(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.orderByType = this.goodsObj.orderByType==1 ? 0:1;
                this.findByKeywordOfPage();
            },
            //价格排序
            checkPrice(){
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
                this.findByKeywordOfPage();
            },
            //切换显示方式
            checkList(){
                this.listType = !this.listType;
            },
            checkScreen(){
                this.popupVisible = true;
            },
            checkFubipay(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.fubiPay = this.goodsObj.fubiPay==1 ? 0:1;
                this.popupVisible = false;
                this.findByKeywordOfPage();
            },
            checkPresale(){
              this.goodsList = [];
              this.goodsObj.pageNo = 1;
              this.goodsObj.saleWay = this.goodsObj.saleWay==7 ? 0:7;
              this.popupVisible = false;
              this.findByKeywordOfPage();
            },
            //筛选现金购买方式
            checkBuytype(){
              this.goodsList = [];
              this.goodsObj.pageNo = 1;
              this.goodsObj.buyType = this.goodsObj.buyType==2 ? 0:2;
              this.popupVisible = false;
              this.findByKeywordOfPage();
            },
            goodsSkip(id,type){
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
            },
        }
    }
</script>

<style lang="scss" scoped>
/*@import "../../../style/component/index/searchGoodsList.scss";*/
@import "../../../style/component/index/goodsList.scss";
$baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    .mint-popup{
        left:77%;
        top:20%;
        border-radius: 8px;
        .pop{
            display: flex;
            display: -webkit-flex; /* Safari */
            align-items:center;
            width:px(220px);
            height:px(100px);
            border-bottom: 1px solid #f4f4f4;
            span{
                font-size:px(24px);
                color:#323232;
            }
            i{
                margin:0 px(8px);
            }
        }
        .pop:last-child{
          border-bottom: none;
        }
        .active{
            span{
                color:#ff8546;
            }
            i{
                color:#ff8546;
            }
        }
    }
.nav{
  margin-top: px(88px);
}
.head{
  text-align:center;
  padding:0 px(20px);
  height: px(88px);
  line-height:px(88px);
  position:fixed;
  width: 100%;
  box-sizing: border-box;
  z-index:3000;
  background:#Fff;
  ul{
    height: px(88px);
    line-height:px(88px);
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content:space-between;
    background: #fff;
    li{
      display: flex;
      display: -webkit-flex; /* Safari */
      align-items:center;
    }
    li:nth-child(1){
      width:px(65px);
    }
    li:nth-child(2){
      flex-grow:2;
      justify-content:center;
    }
    li:nth-child(3){
      width:px(50px);
      justify-content:flex-end;
    }
    li:nth-child(4){
      width:px(50px);
      justify-content:flex-end;
    }
    .title{
      font-size: px(36px);
    }
  }
}
.search{
  width:px(41px);
  height:px(44px);
  background:url(../../../../static/assets/img/search@2x.png);
  background-size:cover;
  margin-right: px(20px);
  position:relative;
}
.head_cart{
  width:px(48px);
  height:px(48px);
  background:url(../../../../static/assets/img/head_cart.png);
  background-size:cover;
  position:relative;
  .cart_num{
    display:block;
    position:absolute;
    line-height:px(24px);
    text-align:center;
    width:px(36px);
    background:#f23030;
    color:#fff;
    font-size:px(18px);
    border-radius:8px;
    right: -5px;
    top: -2px;
  }
}
.search_input {
  width: px(670px);
  height: px(60px);
  margin-top: px(15px);
  margin-left: px(50px);
  right:0;
  .search_input_input {
    width: px(574px);
    height: px(60px);
    background: #f4f4f4;
    border-radius: px(10px);
    float: left;
    i {
      display: block;
      float: left;
      background-image: url('../../../../static/assets/img/search@2x.png');
      background-size: px(30px) px(30px);
      width: px(30px);
      height: px(30px);
      margin-top: px(15px);
      margin-left: px(16px);
      margin-right: px(16px);
      background-position: center center;
      background-repeat: no-repeat;
    }
    .closeSearch {
      display: block;
      float: right;
      background-image: url('../../../../static/assets/img/closeSearch@2x.png');
      background-size: px(34px) px(34px);
      width: px(34px);
      height: px(34px);
      margin-top: px(-45px);
      background-position: center center;
      background-repeat: no-repeat;
    }
    input {
      display: block;
      float: left;
      width: px(510px);
      height: px(60px);
      border: none;
      outline: none;
      font-size: px(28px);
      line-height: px(60px);
      color: #b4b4b4;
      background: #f4f4f4;
    }
    .keyWord {
      font-size: px(28px);
      color: #323232;
    }
  }
  .search_input_btn {
    height: px(60px);
    width: px(60px);
    margin-top: px(6px);
    margin-right: px(10px);
    line-height: px(60px);
    font-size: px(28px);
    color: #ff8546;
    text-align: center;
    float: right;
    cursor: pointer;
  }
}
.shortStock{
  font-size:px(18px);
  color: rgb(242,48,48);
  position: absolute;
  right: px(20px);
  bottom: px(28px)
}
</style>
