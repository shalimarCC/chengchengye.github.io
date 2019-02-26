<template>
  <!--<div class="head" :style="headStyle" v-if="item.showTitleCheckBox==1">-->
  <div class="head" :style="headStyle">
    <!--返回(根据页面类型显示)-->
    <div v-if="item.type ==5" class="routeBack" @click="routerBack" :style="backStyle">
        <i class="iconfont icon-fanhui" v-if="back"></i>
        <div class="back" v-if="!back"></div>
    </div>
    <ul>
      <!--扫一扫-->
      <li @click="scanCode" style="display: none">
        <div class="scan"></div>
      </li>
      <!--图片标题与文字标题-->
      <li>
        <!--都显示-->
        <div class="logo" :style="logoStyle" v-if="item.useLogoTitle&&item.showCompanyLogo==1 && item.showPlatformLogo==1">
          <img :src="item.platformLogoImg" v-if="item.platformLogoImg" @click="linkSkip(item.platformLogoLink)"/>
          <span v-if="item.platformLogoImg&&item.companyLogoImg"></span>
          <img :src="item.companyLogoImg" v-if="item.companyLogoImg" @click="linkSkip(item.companyLogoLink)"/>
        </div>
        <!--只显示福管加总店logo-->
        <div class="logo" :style="logoStyle" v-if="item.useLogoTitle&&item.showCompanyLogo==1 && item.showPlatformLogo!=1">
          <img :src="item.companyLogoImg" @click="linkSkip(item.companyLogoLink)"/>
        </div>
        <!--只显示平台logo-->
        <div class="logo" :style="logoStyle" v-if="item.useLogoTitle&&item.showCompanyLogo!=1 && item.showPlatformLogo==1">
          <img :src="item.platformLogoImg" @click="linkSkip(item.platformLogoLink)"/>
        </div>
        <!--文字标题-->
        <div class="logo" :style="logoStyle" v-if="!item.useLogoTitle&&item.titleTypeRadio==1">
          {{item.textTitleContent}}
        </div>
        <!--图片标题-->
        <div @click="linkSkip(item.imgTitleLink)" :style="logoTitle" class="logoTitle" v-if="!item.useLogoTitle&&item.titleTypeRadio==2">
          <img :src="item.imgTitleUrl" :style="ImgTitle"/>
        </div>
      </li>
      <!--右上角第一个icon-->
      <li v-if="item.navRightUpIconCheckBox==1&&item.navRightUpIcon1Type!=1">
        <!--购物车-->
        <router-link to="/shop/shopCart" v-if="item.navRightUpIcon1Type==2">
          <div :class="[cart?'head_cart1':'head_cart2']">
            <span class="cart_num" v-if="cartNum>99">99+</span>
            <span class="cart_num" v-else-if="cartNum>0&&cartNum<=99">{{cartNum}}</span>
          </div>
        </router-link>
        <!--搜索-->
        <router-link to="/search" v-if="item.navRightUpIcon1Type==3">
          <div :class="[search?'search1':'search2']">
          </div>
        </router-link>
        <!--扫一扫-->
        <router-link to="/scan" v-if="item.navRightUpIcon1Type==4">
          <div :class="[scan?'scan1':'scan2']">
          </div>
        </router-link>
        <!--新建 Icon-->
        <div v-if="item.navRightUpIcon1Type==5" @click="linkSkip(item.navRightUpIcon1Link)">
          <div class="configIcon" :style="configiconStyle1">
          </div>
        </div>
      </li>
      <!--右上角第二个icon-->
      <li v-if="item.navRightUpIconCheckBox==1&&item.navRightUpIcon2Type!=1">
        <!--购物车-->
        <router-link to="/shop/shopCart" v-if="item.navRightUpIcon2Type==2">
          <div :class="[cart?'head_cart1':'head_cart2']">
            <span class="cart_num" v-if="cartNum>99">99+</span>
            <span class="cart_num" v-else-if="cartNum>0&&cartNum<=99">{{cartNum}}</span>
          </div>
        </router-link>
        <!--搜索-->
        <router-link to="/search" v-if="item.navRightUpIcon2Type==3">
          <div :class="[search?'search1':'search2']">
          </div>
        </router-link>
        <!--扫一扫-->
        <router-link to="/scan"  v-if="item.navRightUpIcon2Type==4">
          <div :class="[scan?'scan1':'scan2']">
          </div>
        </router-link>
        <!--新建 Icon-->
        <div v-if="item.navRightUpIcon2Type==5" @click="linkSkip(item.navRightUpIcon2Link)">
          <div class="configIcon" :style="configiconStyle2">
          </div>
        </div>
      </li>
    </ul>
  </div>

</template>

<script>
  import { baseUrl } from '../../../config/env.js'
  import Cookie from '../../../config/mUtils';
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  import {countFit} from "../../../until";
  import {
    findCartItemSumByUserId,
    userByUserId,
    getSign,
    qrCodeVerifyValid
  } from '../../../api/getData';
  export default{
    props:['pageConfig'],
    data(){
      return {
        cartNum:0,
        userInfo:{},
        qrObj:'',
        headStyle: {
          height: '44px',
          opacity:1
        },
        backStyle:{
          height:0,
          lineHeight:0
        },
        logoStyle:{
          marginLeft:0
        },
        configiconStyle1:{
          background:''
        },
        configiconStyle2:{
          background:''
        },
        ImgTitle:{
          height:60
        },
        logoTitle:{

        },
        item:{},
        search:false,
        scan:false,
        cart:false,
        back:false
      }
    },
    watch:{
      "$route": {
        handler(curVal,oldVal){
          this.title = curVal.name;
          this.cartNum = this.$store.state.shopCartNum;
        },
        deep:true
      },
      "$store.state.shopCartNum":{
        handler(curVal,oldVal){
          this.cartNum = this.$store.state.shopCartNum;
        },
        deep:true
      }
    },
    mounted(){
       this.item = this.pageConfig;
       if(this.item.titleOpacity>=50){ //低于透明度显示透明图片
         this.search = true;
         this.scan = true;
         this.cart = true;
         this.back = true;
       }
         //为了文字居中
        if(this.item.navRightUpIcon2Type&&this.item.navRightUpIcon1Type){
          if(this.item.navRightUpIcon2Type==1||this.item.navRightUpIcon1Type==1){ //只有一个显示
            this.logoStyle.marginLeft = countFit(80)
            this.logoTitle.marginLeft = countFit(80)
          }else if(this.item.navRightUpIcon2Type!=1&&this.item.navRightUpIcon1Type!=1){ //都显示
            this.logoStyle.marginLeft = countFit(120)
            this.logoTitle.marginLeft = countFit(120)
          }
        }

        if(!this.item.navRightUpIcon2Type&&!this.item.navRightUpIcon1Type){  //右上角均不显示
          this.logoStyle.marginLeft = countFit(0)
          this.logoTitle.marginLeft = countFit(0)
        }
        if(this.item.showTitleCheckBox==1){
          this.headStyle.height = countFit(this.item.titleHeight);        //标题栏高度
          this.headStyle.background = 'rgba(255,255,255,'+this.item.titleOpacity/100+')';            //标题栏透明度
        }

       if(this.item.titleOpacity==100){
         this.headStyle.borderBottom = '1px solid #f4f4f4'
       }
       this.headStyle.fontSize = countFit(this.item.textTitleFontSize);//标题栏字体
       //活动页显示返回键
       this.backStyle.height = countFit(this.item.titleHeight);        //返回键高度
       this.backStyle.lineHeight = countFit(this.item.titleHeight);    //返回键上下居中控制

       //配置icon背景图
       this.configiconStyle1.background = 'url('+this.item.navRightUpIcon1Url+')';
       this.configiconStyle1.backgroundSize = '100% 100%';
       this.configiconStyle2.background = 'url('+this.item.navRightUpIcon2Url+')';
       this.configiconStyle2.backgroundSize = '100% 100%';
       // //logo显示
       // if(this.item.companyLogoImg!=null&&this.item.companyLogoImg!=''){ //总店logo
       //   this.showFgj = true;
       // }
       // if(this.item.platformLogoImg!=null&&this.item.platformLogoImg!=''){ //平台logo
       //   this.showCooperator = true;
       // }
       this.ImgTitle.height = countFit(this.item.titleHeight-16);
       console.log(this.headStyle)
    },
    created (){
      this.title = this.$route.name;
      this.findCartItemSumByUserId();
    },
    methods:{
      iconSkip(obj){
        // if(obj.available){
        //   if(obj.linkType){
        //
        //   }
        //
        // }else{
        //   Toast(obj.msg)
        // }
        console.log(obj)
      },
      linkSkip(obj){
        this.$emit('linkSkip',[obj]);
      },
      //保存去购物车的路径
      saveRouter(){
        this.$store.state.Cookie.mutations.save(this.$route.path,'saveRouter');
      },
      //返回键控制跳转
      routerBack(){
        // if(this.$route.path == "/shop" || this.$route.path == "/shop/site" || this.$route.path == "/shop/order"){
        //   this.$router.go(-1);
        // }else if(/\/shop\/orderDatails/.test(this.$route.path)){
        //   this.$router.push('/shop/order');
        // }else{
        //   if(window.history.length<=1){
        //     Cookie.mutations.closeWebView();
        //   }else{
            this.$router.go(-1);
          // }
        // }
      },
      //购物车数量
      async findCartItemSumByUserId() {
        try {
          const res = await findCartItemSumByUserId();
          if (res.data.code == 0) {
            this.cartNum = res.data.data;
            this.$store.dispatch("setShopCartNum",res.data.data);
          } else {
            Toast(res.data.data);
          }

        } catch (err) {
          Toast(err);
        }
      },
      async userByUserId() {
        try {
          const res = await userByUserId({weiXinOpenId:this.$store.state.Cookie.mutations.fetch('openId')});

          if (res.data.code == 0) {
            this.userInfo = res.data.data;
          } else {
            Toast(res.data.data);
          }

        } catch (err) {
          Toast(err);
        }
      },
      //扫一扫
      async scanCode(){
        const res = await getSign({url:window.location.href.split('#')[0]});

        if (res.data.code == 0) {
          let obj = res.data.data;
          let thtf = this;

          wx.config({
            debug: false,
            appId: obj.appId,
            timestamp: "" + obj.timestamp,
            nonceStr: obj.nonceStr,
            signature: obj.signature,
            jsApiList: ['checkJsApi', 'scanQRCode']

          });
          wx.error(function (res) {
            alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
          });

          wx.ready(function () {
            wx.checkJsApi({
              jsApiList: ['scanQRCode'],
              success: function (res) {

              }
            });
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
              success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

                // 验证二维码是否属于本项目
                if(!result.includes('fgjWechat')){
                  Toast('链接不属于福管加,请重新获取');
                  return;
                }else{
                  //链接其实可以在这处理，不必跳转，目前先跳转吧
                  window.location.href = result;
                  var url = result;
                  var obj = new Object();
                  if (url.indexOf("?") != -1) {
                    var str = url.split("?")[1];
                    var strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                      obj[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    }
                  }else{
                    Toast(obj);
                    return;
                  }
                  thtf.qrObj=obj;
                  var platformId=obj["platformID"];
                  var clientId=obj["clientID"];
                  var channelId=obj["channelID"];
                  var campaignId=obj["campaignID"];
                  var type=obj["type"];
                  var typeId=obj["typeID"];
                  var branchId=obj["branchID"];
                  var rdid=obj["rdid"];

                  // thtf.qrCodeVerifyValid(platformId,clientId,channelId,campaignId,type,typeId,branchId,rdid,res.resultStr);
                }
              }
            });

          });

        } else {
          MessageBox('', '调用失败').then(action => {
          });
        }
      },
      //验证验证码是否有效
      async qrCodeVerifyValid(platformId,clientId,channelId,campaignId,type,typeId,branchId,rdid,result) {
        try {
          const res = await qrCodeVerifyValid({platformId:platformId,clientId:clientId,channelId:channelId,campaignCode:campaignId,type:type,typeId:typeId,branchId:branchId,rdid:rdid});
          if (res.data.code == 0) {
            if(res.data.data){
              window.location.href = result;
            }else{
              Toast('二维码错误或已失效,请重新获取二维码');
              return;
            }
          } else {
            Toast('二维码获取失败,请联系管理员');
            return;
          }
        } catch (err) {
          Toast(err);
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
  .head{
    background: #fff;
    padding:px(8px) px(20px);
    /*border-bottom:0.5px solid #f4f4f4;*/
    position:fixed;
    width: 100%;
    box-sizing: border-box;
    z-index:2000;
  }
  .routeBack{
    position:absolute ;
    display: flex;
    align-items: center;
  }
  .title{
    font-weight:900;
  }

  ul{
    height:100%;
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content:space-between;
    li{
      display: flex;
      display: -webkit-flex; /* Safari */
      align-items:center;
    }
    li:nth-child(1){
      width:px(100px);
    }
    li:nth-child(2){
      flex-grow:2;
      justify-content:center;
    }
    li:nth-child(3){
      width:px(50px);
      justify-content:flex-end;
      margin-right: px(10px);
    }
    li:nth-child(4){
      width:px(50px);
      justify-content:flex-end;
    }
  }

  .head_cart1{
    width:px(48px);
    height:px(48px);
    background:url(../../../../static/assets/img/icon/cart1.png);
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
  .head_cart2{
    width:px(48px);
    height:px(48px);
    background:url(../../../../static/assets/img/icon/cart2.png);
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
  .goods_title{
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content:space-between;
    span{
      /*font-size:px(26px);*/
      margin:0 px(27px);
      color:#323232;
    }
    .active{
      color:#ff8546;
      border-bottom:px(4px) solid #ff8546;
    }
  }

  .logo{
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content:center;
    align-items:center;
    width:100%;
    height:px(68px);
    /*margin-left: px(120px);*/
    img{
      width:px(180px);
      height:100%;
    }
    span{
      width:1px;
      height:px(36px);
      background:#ff8546;
    }
  }
  .logoTitle{
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content:center;
    align-items:center;
    width:100%;
    img{
      height:100%;
    }
  }
  .back{
    width:px(44px);
    height:px(44px);
    background:url(../../../../static/assets/img/icon/back2.png);
    background-size:cover;
  }
  .search1{
    width:px(44px);
    height:px(44px);
    background:url(../../../../static/assets/img/icon/search1.png);
    background-size:cover;
    position:relative;
  }
  .search2{
    width:px(44px);
    height:px(44px);
    background:url(../../../../static/assets/img/icon/search2.png);
    background-size:cover;
    position:relative;
  }
  .scan1{
    width:px(44px);
    height:px(44px);
    background:url(../../../../static/assets/img/icon/scan1.png);
    background-size:cover;
    position:relative;
  }
  .scan2{
    width:px(44px);
    height:px(44px);
    background:url(../../../../static/assets/img/icon/scan2.png);
    background-size:cover;
    position:relative;
  }
  .configIcon{
    width:px(44px);
    height:px(44px);
    background-size:cover;
    position:relative;
  }
</style>
