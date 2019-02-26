<template>
    <div :style="'height:'+wrapperHeight+'px'">
        <div class="head">
            <ul>
                <li>
                    <div style="float:left;position:absolute;line-height:45px;" @click="routerBack">
                        <i class="iconfont icon-fanhui"></i>
                    </div>
                </li>
                <li>
                    <div class="logo">
                        <span>扫一扫</span>
                    </div>
                </li>
            </ul>
            <div class="qrcode">
                <!-- <div class="login_div">
                    <mt-button id="scanQRCode" type="primary" @click="scanCode()">扫一扫</mt-button>
                </div> -->
                <!-- <span class="hint">将二维码/条码放入框内,即可扫码</span> -->
            </div>
        </div>
    </div>
</template>

<!--<script>-->
    <!--$(function(){  -->
        <!--// pushHistory();  -->
        <!--var bool=false;  -->
        <!--setTimeout(function(){  -->
            <!--bool=true;  -->
        <!--},1500);  -->
        <!--window.addEventListener("popstate", function(e) {  -->
            <!--if(bool){  -->
                <!--// alert("我监听到了浏览器的返回按钮事件啦");-->
                <!--window.history.go(-1);-->
            <!--} -->
        <!--}, false);  -->
    <!--});-->
<!--</script>-->

<script>
  import { baseUrl } from '../../../config/env.js'
  import CryptoJS from 'crypto-js/core';
  import MD5 from 'crypto-js/md5';
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import {mobileLogin,sendIdentifyingCode,userByUserId,weiXinLogin,userMobileLogin,weiXinLoginByWeiXinOpenId,nativeWXpaySign,getSign} from '../../../api/getData';
  import $ from 'jquery';
  export default{
        data(){
            return {
                wrapperHeight:0,
                phoneForm:{
                    mobile:'',
                    code:''
                },
                loginType:1,
                yzmShow:true,
                count:60,
                timer: null,
                openId:'',
                yzm:{
                    one:0,
                    two:0,
                    symbol:0
                },
                num:'',
                yzmNum:0,
                userType:1,
            }
        },
        created() {
            this.openId=this.$store.state.Cookie.mutations.fetch('openId');
            this.wrapperHeight = document.documentElement.clientHeight;
            this.scanCode();
            // alert("当前页面网址:"+window.location.href);
            // alert("项目前缀:"+baseUrl);
        },
        methods:{
            routerBack(){
                this.$router.go(-1);
            },

            async scanCode(){
                // alert("转义前:" + window.location.href.split('#')[0]);
                const res = await getSign({url:window.location.href.split('#')[0]});
                // alert("转义后:" + encodeURIComponent(window.location.href.split('#')[0]));

                if (res.data.code == 0) {
                        let obj = res.data.data;
                        let thtf = this;

                        wx.config({
                            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            debug: false,
                            // 必填，公众号的唯一标识
                            appId: obj.appId,
                            // 必填，生成签名的时间戳
                            timestamp: "" + obj.timestamp,
                            // 必填，生成签名的随机串
                            nonceStr: obj.nonceStr,
                            // 必填，签名
                            signature: obj.signature,
                            // 必填，需要使用的JS接口列表，所有JS接口列表
                            jsApiList: ['checkJsApi', 'scanQRCode']

                        });
                        wx.error(function (res) {
                            // alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
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
                                        // alert("扫描结果："+result);
                                        window.location.href = result;//因为我这边是扫描后有个链接，然后跳转到该页面
                                    }
                                });
                
                        }); 

                    } else {
                        MessageBox('', '调用失败').then(action => {

                        });
                    }

            },

        }
    }
</script>

<style lang="scss" scoped>
   @import "../../../style/home/scan.scss";
</style>
