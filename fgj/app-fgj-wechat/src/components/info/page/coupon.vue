<template>
    <div id="category" class="page-loadmore-wrapper" style="background: #f4f4f4">

        <div id="order">
            <ul class="nav" ref="wrapper">
                <div class="spanLine"></div>
              <li v-for="nav in navList" @click="navClick(nav.key)" :class="{'active':navCheck==nav.key}"><span :class="{'navTab':navCheck==nav.key}">{{nav.value}}</span></li>
            </ul>
            <div v-if="couponList.length>0" style="margin-bottom: 55px">
                <ul
                class="list1"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="couponloading"
                infinite-scroll-distance="30">
                    <li class="page-loadmore-listitem clear">
                        <div v-for="(item,type) in couponList" class="couponInfo">
                            <div class="couponTop">
                                <div class="couponPrice" v-if="item.couponType==0&&item.couponUnitStatus==0">
                                    <span class="price1"><b>{{item.discountAmount}}</b>元</span>
                                    <span class="price2">满{{item.triggerAmount}}元可用</span>
                                </div>
                                <div class="couponPrice noprice" v-if="item.couponType==0&&item.couponUnitStatus!=0">
                                    <span class="price1"><b>{{item.discountAmount}}</b>元</span>
                                    <span class="price2">满{{item.triggerAmount}}元可用</span>
                                </div>
                              <!--无效兑换券置灰-->
                               <img :src="item.iconUrl+'?imageMogr2/size-limit/500k!'" v-if="item.iconUrl" :class="[validKey?'havaUrl InvalidCouponLogo':'havaUrl']">
                               <div class="couponLogo" v-if="item.couponType==1&&item.couponUnitStatus==0&&!item.iconUrl"></div>
                               <div class="couponLogo noLogo" v-if="item.couponType==1&&item.couponUnitStatus!=0&&!item.iconUrl"></div>
                               <div class="dueSoon" v-if="item.isSoonExpire&&item.couponUnitStatus!=3">即将到期</div>
                                <div class="couponTime">
                                    <span class="title">{{item.title}}</span>
                                    <!--<div class="soonExpire" v-if="item.isSoonExpire&&item.couponUnitStatus!=3"></div>-->
                                    <div class="logos expired" v-if="item.couponUnitStatus==3"></div>
                                    <div class="logos used" v-if="item.couponUnitStatus==1"></div>
                                    <div class="logos exchanged" v-if="item.couponUnitStatus==5"></div>

                                    <div class="oldFornew" @click="checkExchangeValid(item.exchangeIdList,item.id)" v-if="validKey!=1" v-show="item.isShowExchange==1">以旧换新</div>
                                    <div class="oldFornew1" @click="checkExchangeValid(item.exchangeIdList,item.id)" v-if="validKey==1" v-show="item.isShowExchange==1">以旧换新</div>
                                    <span class="time">
                                    <!-- <span class="time" v-if="!item.isShowEffectTimeRange"> -->
                                        {{item.effectTimeRange}}
                                        <div class="use" v-if="item.couponUnitStatus==0&&item.usable==1" @click="goodsSkip(item.goodsId,item.commodityTemplateId,item.jumpType,item.couponType,item.id,item.effectTimeRange,item.isShowEffectTimeRange,item.cmsPageId)">立即使用</div>
                                    </span>
                                    <div class="dot"></div>
                                </div>
                            </div>
                            <!-- <div class="couponDetail">
                                <span class="detail">{{item.detail}}</span>
                            </div> -->
                            <div :class="[key == type?'couponDetail':'couponDetail fixedHeight']">
                                <span class="detail">{{item.detail}}</span>
                                <span :class="[ key == type?'pullUp':'pulldown']" @click="showMore(type)"></span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="coupon_error" v-if="couponList.length<=0&&nocoupon">
                <img src="../../../../static/assets/img/error/coupon_error.png">
                <p>{{words}}</p>
                <div class="getCoupon">
                    <router-link to="/couponList">
                        <div style="color:#fff;">去领券中心</div>
                    </router-link>
                </div>
            </div>
            <div class="couponType">
                <div class="valid" v-if="couponUnitStatus==1"></div>
                <span v-if="couponUnitStatus==0" @click="statusClick(1)">查看失效券</span>
                <span v-if="couponUnitStatus==1" @click="statusClick(0)">查看有效券</span>
                <div class="invalid" v-if="couponUnitStatus==0"></div>
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
      findCouponUnitByUserOfPage,
      queryCouponIsEffected,
      findExchangeActivityByCouponUnitId,
      checkExchangeValid
    } from '../../../api/getData';
    export default{

        data(){
            return {
                checkId:0,
                seriesType:1,
                wrapperHeight:0,
                couponType:0,
                couponUnitStatus:0,
                couponList:[],
                words:'没有可用的优惠券',
                navList:[
                    {
                        value:'优惠券',
                        key:0
                    },
                    {
                        value:'兑换券',
                        key:1
                    }
                ],
                navKey:'0',
                navCheck:'',
                popupVisible:false,
                pageNo:1,
                pageSize:20,
                couponloading: false,
                moreGoods: 0,
                key:-1,
                validKey:0,
                type:'',
                nocoupon:false,
                storeId:1
            }
        },
        watch:{
        },
        created(){
            Indicator.open();
            this.navCheck = this.$store.state.Cookie.mutations.fetch('navCheck');
            if(this.$store.state.Cookie.mutations.fetch('type')=="coupon_unit"){
              // if(this.$store.state.Cookie.mutations.fetch('couponType')==''){
              //   this.navCheck =0
              // }else{
                this.navCheck = this.$store.state.Cookie.mutations.fetch('couponType')
              // }
            }
            this.findCouponUnitByUserOfPage();
        },
        mounted(){
            // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.main_bottom.getBoundingClientRect().top;
        },
        methods:{
            loadMore(){
                this.couponloading = true;
                // console.log('sdfd')
                this.findCouponUnitByUserOfPage();
                Indicator.open();
            },
            navClick(key){
                this.navKey = key=='0'?'0':'1';
                this.words = key ==1?'没有可用的兑换券':'没有可用的优惠券';
                this.navCheck = key;
                //记录从优惠券跳转去商品页时是优惠券还是兑换券
                this.$store.state.Cookie.mutations.save(this.navCheck,'navCheck');
                this.$store.state.Cookie.mutations.save(this.navKey,'couponType');
                this.couponType = key;
                this.couponList = [];
                this.pageNo = 1;
                this.loading = true;
                this.findCouponUnitByUserOfPage();

            },
            statusClick(key){
              this.validKey = key;
                if(this.navCheck =='0'){
                  this.words = key ==1?'没有失效的优惠券':'没有可用的优惠券';
                }else{
                  this.words = key ==1?'没有失效的兑换券':'没有可用的兑换券';
                }
                this.couponUnitStatus = key;
                this.couponType =key;
                this.couponList = [];
                this.pageNo = 1;
                this.loading = true;
                this.findCouponUnitByUserOfPage();
            },
            async findCouponUnitByUserOfPage() {
                try {
                  // if(this.$store.state.Cookie.mutations.fetch('navCheck')){

                  // }
                  if(this.$store.state.Cookie.mutations.fetch('type')=="coupon_unit"){
                    if(this.$store.state.Cookie.mutations.fetch('couponType')==''){
                      this.couponType = 0;
                    }else{
                      this.couponType = this.$store.state.Cookie.mutations.fetch('couponType')
                    }
                  }else{
                    if(this.$store.state.Cookie.mutations.fetch('navCheck')==''){
                      this.couponType =0;
                    }else{
                      this.couponType = this.$store.state.Cookie.mutations.fetch('navCheck');
                    }
                  }
                  const res = await findCouponUnitByUserOfPage({couponType:this.couponType,couponUnitStatus:this.couponUnitStatus,storeId:1,pageNo:this.pageNo,pageSize:20});

                    if (res.data.code == 0) {
                        if(res.data.data.list.length == 0){
                            this.nocoupon = true; //避免在加载列表前显示缺省图
                            // this.goodsType = false;
                            this.couponloading = true;
                            this.moreGoods = 0;
                            this.couponList = this.couponList.concat(res.data.data.list);
                        }else{
                            var usableList = res.data.data.list;
                            for(var i=0;i<usableList.length;i++){
                              var storeIds = usableList[i].storeIds;
                              console.log()
                              if(storeIds.indexOf(parseInt(this.storeId))!=-1){
                                usableList[i].usable = 1;
                              } else {
                                usableList[i].usable = 0;
                              }
                            }
                            this.pageNo++;
                            // this.couponList = this.couponList.concat(res.data.data.list);
                            this.couponList = this.couponList.concat(usableList);
                            this.moreGoods = 1;
                        }
                        if(this.moreGoods == 1){
                            this.couponloading = false;
                        }
                        Indicator.close();
                    } else {
                        Toast(res.data.data);
                        Indicator.close();
                    }
                } catch (err) {
                    Toast('网络错误');
                    Indicator.close();
                }
            },
            //根据旧couponUnitId查询有效的活动
            async findExchangeActivityByCouponUnitId(id,couponUnitId) {
              try{
                const res = await findExchangeActivityByCouponUnitId({couponUnitId:couponUnitId,storeId:1});
                if (res.data.code == 0) {
                  Indicator.close();
                  this.$router.push('/oldFornew/'+id+'/'+couponUnitId)
                }else if(res.data.code == 198){
                  Toast(res.data.error);
                  window.location.reload();
                } else {
                  Toast(res.data.data);
                  Indicator.close();
                }
              }catch (e) {

              }
            },
          //根据旧couponUnitId查询有效的活动
          async checkExchangeValid(id,couponUnitId) {
            try{
              const res = await checkExchangeValid({couponUnitId:couponUnitId,storeId:1});
              if (res.data.code == 0) {
                Indicator.close();
                this.$router.push('/oldFornew/'+id+'/'+couponUnitId)
              }else if(res.data.code == 198){
                Toast(res.data.error);
                window.location.reload();
              } else {
                Toast(res.data.data);
                Indicator.close();
              }
            }catch (e) {
            }
          },
            goodsSkip(id,type,jumpType,couponType,couponId,effectTimeRange,isShowEffectTimeRange,cmsPageId){
                this.$store.state.Cookie.mutations.save(couponId,'typeID');
                this.$store.state.Cookie.mutations.save('','type');
                console.log(id,type,jumpType,couponType,couponId,effectTimeRange,isShowEffectTimeRange)
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
                    this.$store.state.Cookie.mutations.save(false,'fromCmslist');
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
                      this.$store.state.Cookie.mutations.save(effectTimeRange,'effectTimeRange');
                      this.$store.state.Cookie.mutations.save(isShowEffectTimeRange,'isShowEffectTimeRange');
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
$baseWidth:750px;
@function px($val) {
    @return $val/$baseWidth*10+rem;
}

.head.title{
    margin-left:0.2rem;
}

#category{
    height: 100%;
    background-color:#f4f4f4;
}

#order {
    background: #f4f4f4;
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

.coupon_error {
    // background: #fff;
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

.mint-popup-4 {
    width: 100%;
    height: px(710px);
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

.couponType{
    width: 100%;
    height: px(100px);
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    /*line-height: px(100px);*/
    color: #ff8546;
    text-align: center;
    background: #fff;
    font-size: px(32px);
    z-index: 99999;
    img {
        width: px(34px);
        height: px(34px);
    }
    .valid {
        /*position: absolute;*/
        width: 16px;
        height: 16px;
        background-size: 100%;
        margin-right: px(5px);
        /*bottom: 17px;*/
        /*left: 125px;*/
        background-image:url(../../../../static/assets/img/coupon_valid@2x.png);
    }
    .invalid {
        /*position: absolute;*/
        width: 16px;
        height: 16px;
        background-size: 100%;
        margin-left: px(5px);
        /*bottom: 17px;*/
        /*right: 125px;*/
        background-image:url(../../../../static/assets/img/coupon_invalid@2x.png);
    }
}

.title{
    margin-left: px(-60px);
}

.couponInfo{
    width:px(702px);
    // height:px(224px);
    background:#fff;
    border-radius:px(10px);
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
        }
        .oldFornew{
          position: absolute;
          top: 0px;
          right: 0px;
          width: px(124px);
          height: px(36px);
          font-size: px(22px);
          line-height: px(40px);
          color: #e24167;
          text-align: center;
          border: 1px solid #e24167;
          border-radius: px(6px);
          float: right;
          margin-right: px(26px);
          margin-top: px(28px);
        }
        .oldFornew1{
          position: absolute;
          top: px(88px);
          right: 0px;
          width: px(124px);
          height: px(36px);
          font-size: px(22px);
          line-height: px(40px);
          color: #fff;
          text-align: center;
          background: #e24167;
          border-radius: px(6px);
          float: right;
          margin-right: px(26px);
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
        .exchanged{
            background-image:url(../../../../static/assets/img/exchanged.png);
            background-size: 100%;
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
