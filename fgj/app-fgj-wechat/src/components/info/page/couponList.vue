<template>
    <div id="category" class="page-loadmore-wrapper">

        <div id="order">
            <div v-if="couponCenterList.length>0">
                <ul
                class="list1"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="couponloading"
                infinite-scroll-distance="30">
                    <li class="page-loadmore-listitem clear">
                        <div v-for="(item,type) in couponCenterList" class="couponInfo">
                            <div class="couponTop">
                                <div class="couponPrice" v-if="item.couponType==0&&(item.couponBatchStatus==0||item.couponBatchStatus==8)">
                                    <span class="price1"><b>{{item.discountAmount}}</b>元</span>
                                    <span class="price2">满{{item.triggerAmount}}元可用</span>
                                </div>
                                <div class="couponPrice noprice" v-if="item.couponType==0&&(item.couponBatchStatus==1||item.couponBatchStatus==3||item.couponBatchStatus==7)">
                                    <span class="price1"><b>{{item.discountAmount}}</b>元</span>
                                    <span class="price2">满{{item.triggerAmount}}元可用</span>
                                </div>
                                <img :src="item.iconUrl+'?imageMogr2/size-limit/500k!'" v-if="item.iconUrl" :class="[item.couponBatchStatus==3?'havaUrl InvalidCouponLogo':'havaUrl']">
                                <div class="couponLogo" v-if="item.couponType==1&&(item.couponBatchStatus==0||item.couponBatchStatus==2)&&!item.iconUrl"></div>
                                <div class="couponLogo noLogo" v-if="item.couponType==1&&(item.couponBatchStatus==1||item.couponBatchStatus==3)&&!item.iconUrl"></div>
                                <div class="dueSoon" v-if="item.isSoonExpire">即将到期</div>
                                <div class="couponTime">
                                    <span class="title">{{item.title}}</span>
                                    <!--<div class="soonExpire" v-if="item.isSoonExpire&&item.couponUnitStatus!=3"></div>-->

                                    <div class="out" v-if="item.couponBatchStatus==3">已领完</div>
                                  <!--已领取-->
                                    <div class="logos got" v-if="item.couponBatchStatus==1||item.couponBatchStatus==8"></div>
                                  <!--已使用-->
                                    <!--<div class="logos used" v-if="item.couponBatchStatus==1"></div>-->

                                    <!-- <span class="time" v-if="item.isShowEffectTimeRange">
                                        {{setTime(item.effectStartTime)}}-{{setTime(item.effectEndTime)}}
                                        <div class="get" v-if="item.couponBatchStatus==0" @click="getCoupon(item.couponBatchId)">立即领取</div>
                                        <div class="use" v-if="item.couponBatchStatus==2 && item.usable==1" @click="goodsSkip(item.goodsId,item.commodityTemplateId,item.jumpType,item.couponType,item.id,item.effectTimeRange)">立即使用</div>
                                    </span> -->
                                    <span class="time">
                                    <!-- <span class="time" v-if="!item.isShowEffectTimeRange"> -->
                                        {{item.effectTimeRange}}
                                        <div class="broughtup" v-if="item.couponBatchStatus==7">未开始</div>
                                        <div class="get" v-if="item.couponBatchStatus==0" @click="getCoupon(item.couponBatchId)">立即领取</div>
                                        <div class="use" v-if="(item.couponBatchStatus==2||item.couponBatchStatus==8)&&item.usable==1" @click="goodsSkip(item.goodsId,item.commodityTemplateId,item.jumpType,item.couponType,item.id,item.effectTimeRange,item.isShowEffectTimeRange,item.cmsPageId)">立即使用</div>
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
            <div class="coupon_error" v-if="couponCenterList.length<=0&&nocoupon">
                <img src="../../../../static/assets/img/error/coupon_error.png">
                <p>没有可用的优惠券</p>
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
      findCouponUnitCenterOfPage,
      insertCouponUnitWithTx,
      queryCouponIsEffected
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
                couponCenterList:[],
                navList:[
                    {
                        value:'满减券',
                        key:0
                    },
                    {
                        value:'兑换券',
                        key:1
                    }
                ],
                navCheck:'',
                popupVisible:false,
                storeId:1,
                userInfo:{},
                couponTypeId:'',
                pageNo:1,
                pageSize:20,
                couponloading: false,
                moreGoods: 0,
                key:-1,
                type:'',
                nocoupon: false
            }
        },
        watch:{
        },
        created(){
          Indicator.open();
            if(this.$store.state.Cookie.mutations.fetch('type')!='coupon'){
                this.couponTypeId ='';
            }else{
                this.couponTypeId= this.$store.state.Cookie.mutations.fetch('typeID');
            }

            if(!this.couponTypeId || this.couponTypeId==''){
                this.findCouponUnitCenterOfPage();
            } else{
                this.getCoupon(this.couponTypeId);
                this.$router.push('/home');
            }

            
        },
        mounted(){
            // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.main_bottom.getBoundingClientRect().top;
        },
        methods:{
            loadMore(){
                this.couponloading = true;
                this.findCouponUnitCenterOfPage();
                Indicator.open();
            },
            async findCouponUnitCenterOfPage() {
                try {
                    const res = await findCouponUnitCenterOfPage({storeId:this.storeId,pageNo:this.pageNo,pageSize:20});
                    if (res.data.code == 0) {
                      this.$store.state.Cookie.mutations.save('','type');
                        if(res.data.data.list.length == 0){
                           this.nocoupon = true; //避免在加载列表前显示缺省图
                            // this.goodsType = false;
                            this.couponloading = true;
                            this.moreGoods = 0;
                            this.couponCenterList = this.couponCenterList.concat(res.data.data.list);
                        }else{
                            var usableList = res.data.data.list;
                            for(var i=0;i<usableList.length;i++){
                                var storeIds = usableList[i].storeIds;
                                if(storeIds.indexOf(parseInt(this.storeId))!=-1){
                                    usableList[i].usable = 1;
                                } else {
                                    usableList[i].usable = 0;
                                }
                            }
                            this.pageNo++;
                            this.couponCenterList = this.couponCenterList.concat(usableList);
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
                }
            },
            async getCoupon(id) {
                try {
                    const res = await insertCouponUnitWithTx({id:id});
                    if (res.data.code == 0) {
                        Toast('领取成功');
                        this.pageNo = 1;
                        this.couponCenterList = [];
                        this.findCouponUnitCenterOfPage();
                    } else {
                        if (res.data.error && res.data.error!='') {
                            Toast(res.data.error);
                        }else{
                            Toast('网络错误');
                        }
                        this.findCouponUnitCenterOfPage();
                    }

                } catch (err) {
                    Toast(err);
                }
            },

            goodsSkip(id,type,jumpType,couponType,couponId,effectTimeRange,isShowEffectTimeRange,cmsPageId){
                this.$store.state.Cookie.mutations.save(couponId,'typeID');
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
                }else if(res.data.code ==190||res.data.code ==191||res.data.code ==131){
                  MessageBox('提示', res.data.error).then(action => {
                    window.location.reload()
                  });
                }else{
                  MessageBox('提示', res.data.error).then(action => {
                    window.location.reload()
                  });
                }
              } catch (err) {
                Toast(err)
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

            //下拉优惠券显示详情
            showMore(key){
                if(this.key ==key){
                  this.key = -1;
                }else{
                  this.key = key;
                }
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
    }
    .spanLine{
        position: absolute;
        top:px(110px);
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
    border-top: 1px solid #eee;
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
            border-bottom: 1px solid #dcdcdc;
            padding: 0 px(24px);
            border-bottom: 1px solid #d4d4d4;
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
    line-height: px(100px);
    color: #ff8546;
    text-align: center;
    background: #fff;
    font-size: px(32px);
    img {
        width: px(34px);
        height: px(34px);
    }
    .valid {
        position: absolute;
        width: 16px;
        height: 16px;
        background-size: 100%;
        bottom: 17px;
        left: 125px;
        background-image:url(../../../../static/assets/img/coupon_valid@2x.png);
    }
    .invalid {
        position: absolute;
        width: 16px;
        height: 16px;
        background-size: 100%;
        bottom: 17px;
        right: 125px;
        background-image:url(../../../../static/assets/img/coupon_invalid@2x.png);
    }
}

.title{
    margin-left: px(-60px);
}

.couponInfo{
    width:px(702px);
    /*height:px(224px);*/
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
            font-size: px(24px);
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
        text-align: left;
        color: #323232;
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
                line-height: px(40px);
                color: #e24167;
                text-align: center;
                z-index:10;
            }
            .use{
                width: px(124px);
                height: px(36px);
                /*float: right;*/
                position: absolute;
                right: 0;
                top: px(95px);
                margin-right: px(26px);
                margin-top: px(-8px);
                border: 1px solid #e24167;
                border-radius: px(8px);
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

        .out{
            width: px(124px);
            height: px(36px);
            float: right;
            margin-right: px(26px);
            // margin-top: px(-8px);
            margin-top: px(50px);
            border: 1px solid #9b9b9b;
            border-radius: px(8px);
            background:#9b9b9b;
            font-size: px(22px);
            line-height: px(40px);
            color: #fff;
            text-align: center;
            z-index:10;
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
