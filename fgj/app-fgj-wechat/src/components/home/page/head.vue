<template>
    <div class="head">

            <!--<div style="float:left;position:absolute;" @click="routerBack">
                <i class="iconfont icon-fanhui"></i>
            </div>
            <span class="title">{{title}}</span>-->
            <ul>
                <li @click="scanCode">
                  <div class="scan"></div>
                </li>
                <li>
                    <div class="logo" v-if="showCooperator && showFgj">
                        <img src="../../../../static/assets/img/logo.png" />
                        <span></span>
                        <img :src="userInfo.companyLogo" />
                    </div>
                    <div class="logo" v-if="!showCooperator && showFgj">
                        <img src="../../../../static/assets/img/logo.png" />
                    </div>
                    <div class="logo" v-if="showCooperator && !showFgj">
                        <img :src="userInfo.companyLogo" />
                    </div>

                </li>
                <li>
                    <router-link to="/search">
                        <div class="search">
                        </div>
                    </router-link>
                </li>
                <li @click="saveRouter">
                    <router-link to="/shop/shopCart">
                        <div class="head_cart">
                            <span class="cart_num" v-if="cartNum>99">99+</span>
                            <span class="cart_num" v-else-if="cartNum>0&&cartNum<=99">{{cartNum}}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
    </div>

</template>

<script>
    import { baseUrl } from '../../../config/env.js'
    import Cookie from '../../../config/mUtils';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import {findCartItemSumByUserId,userByUserId,getSign,qrCodeVerifyValid} from '../../../api/getData';
    export default{
        props: {
            showCooperator: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            showFgj: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
        },
        data(){
            return {
                title:'',
                goodsType:1,
                cartNum:0,
                userInfo:{},
                qrObj:'',

            }
        },
        components: {

        },
        created (){
            this.title = this.$route.name;
            this.findCartItemSumByUserId();
            this.userByUserId();

        },
        methods:{
            //保存去购物车的路径
            saveRouter(){
              this.$store.state.Cookie.mutations.save(this.$route.path,'saveRouter');
            },
            routerBack(){
                if(this.$route.path == "/shop" || this.$route.path == "/shop/site" || this.$route.path == "/shop/order"){
                    this.$router.go(-1);
                }else if(/\/shop\/orderDatails/.test(this.$route.path)){
                    this.$router.push('/shop/order');
                }else{
                    if(window.history.length<=1){
                        Cookie.mutations.closeWebView();
                    }else{
                        this.$router.go(-1);
                    }
                }

            },

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
        },
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
        }
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }

    .head{
        padding:0 px(20px);
        border-bottom:0.5px solid #f4f4f4;
        height:px(88px);
        position:fixed;
        width: 100%;
        box-sizing: border-box;
        z-index:2000;
        background:#Fff;
        span{
            font-size:px(36px);
        }
    }
    .title{
        font-size:px(36px);
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
        }
        li:nth-child(4){
            width:px(50px);
            justify-content:flex-end;
        }
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
    .goods_title{
        display: flex;
        display: -webkit-flex; /* Safari */
        justify-content:space-between;
        span{
            font-size:px(26px);
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
    .search{
        width:px(41px);
        height:px(44px);
        background:url(../../../../static/assets/img/search@2x.png);
        background-size:cover;
        margin-right: px(20px);
        position:relative;
    }
    .scan{
        width:px(44px);
        height:px(44px);
        background:url(../../../../static/assets/img/scan@2x.png);
        background-size:cover;
        position:relative;
    }
</style>
