<template>
    <div class="login" :style="'height:'+wrapperHeight+'px'">
        <div class="form" v-if="loginType==1">
            <div class="cell">
                <span class="mail"></span>
                <input type="text" class="cell_input" placeholder="请输入企业邮箱" v-model="mailFrom.mail">
            </div>

            <div id="psd">
                <div class="cell">
                    <span class="psd"></span>
                    <input type="password" class="cell_input" placeholder="请输入登录密码" v-model="mailFrom.psd">
                </div>

                <div class="psd_btn" @click="checkLogin(1)">
                    <router-link to="/findPassword"><span>忘记密码？</span></router-link>
                </div>
            </div>

            <div id="yzm_img" v-if="yzmNum>=5">
                <div class="cell">
                    <span class="safety"></span>
                    <input type="number" class="cell_input" placeholder="请输入验证码" v-model="num">
                </div>

                <div class="yzm_img" @click="createYzm">
                    <ul>
                        <li :style="'background-image:url(./static/assets/img/login/'+yzm.one+'.png)'">
                        </li>
                        <li>
                            <img src="../../../../static/assets/img/login/jia.png" v-if="yzm.symbol==0" />
                            <img src="../../../../static/assets/img/login/chen.png" v-else-if="yzm.symbol==1" />
                        </li>
                        <li :style="'background-image:url(./static/assets/img/login/'+yzm.two+'.png)'">
                        </li>
                        <li>
                            <img src="../../../../static/assets/img/login/dy.png" />
                        </li>
                    </ul>
                </div>
            </div>

            <div class="login_btn" :class="{disabled:mailFrom.mail==''||mailFrom.psd==''}" @click="mainLogin">登录</div>
        </div>
        <div class="form" v-else-if="loginType==2">
            <div class="cell">
                <span class="head"></span>
                <input type="number" class="cell_input" placeholder="请输入手机号码"  maxlength="11" v-model="phoneForm.mobile">
            </div>

            <div id="yzm">
                <div class="cell">
                    <span class="yzm"></span>
                    <input type="number" class="cell_input" placeholder="请输入验证码" v-model="phoneForm.code">
                </div>

                <div class="yzm_btn" @click="sendIdentifyingCode" v-if="yzmShow">
                    <span>获取验证码</span>
                </div>
                <div class="yzm_btn disabled" v-else>
                    <span>{{count}}秒</span>
                </div>
            </div>

            <div class="login_btn" :class="{disabled:phoneForm.mobile==''||phoneForm.code==''}"  @click="codeLogin">登录</div>
        </div>

        <div class="login_bottom" v-if="couponLogin==0">
            <div class="phone_login" v-if="loginType==1" @click="checkLogin(2)">
                手机验证码登录
            </div>
            <div class="phone_login" v-else-if="loginType==2" @click="checkLogin(1)">
                邮箱登录
            </div>
            <div class="register" @click="register">
                新用户注册
            </div>
        </div>
    </div>
</template>

<script>
  import { baseUrl } from '../../../config/env.js'
  import CryptoJS from 'crypto-js/core';
  import MD5 from 'crypto-js/md5';
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import {mobileLogin,
    sendIdentifyingCode,
    userByUserId,
    weiXinLogin,
    userMobileLogin,
    weiXinLoginByWeiXinOpenId,
    getClientCache,
    queryByStandardUnitId,
    toWeiXinLogin,
    sendCouponUnitWithTx,
    checkIsFollow
  } from '../../../api/getData';
  export default{
        data(){
            return {
                wrapperHeight:0,
                mailFrom:{
                    mail:'',
                    psd:'',
                },
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
                storeId:'',
                setOpenId:'',
                platformID:'',  //2
                clientID:'',    //2
                channelID:'',   //21
                campaignID:'',  //21-Gift-27972
                type:'',        //coupon_group
                typeID:'',      //213
                branchID:'',    //1887
                rdid:'',        //249367
                goHome:0,
                suTmpId:'',
                couponLogin:0,
                realOpenid:''
            }
        },
        created() {
            if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != 'micromessenger'){
              this.$router.push('/error');
              return
            }
            // this.$store.state.Cookie.mutations.save(7,'platformID');
            let se = window.location.search.substr(1);
            let arr = se.split("&");
            let obj = {};
            let newarr = [];
            $.each(arr, function(i, v){
                newarr = v.split("=");
                if(typeof obj[newarr[0]] === "undefined"){
                    obj[newarr[0]] = newarr[1];
                }
            });
            this.couponLogin = this.$store.state.Cookie.mutations.fetch('couponLogin');
            if(this.couponLogin ==1){
              //优惠券过来的走特殊注册流程
              this.loginType = 2;
            }
            this.openId = this.$store.state.Cookie.mutations.fetch('openId');

            if(!this.openId || this.openId==undefined || this.openId.length==0){
                this.openId = "aaa";
                this.$store.state.Cookie.mutations.save("aaa",'openId');
            }
            if(obj.code=='' || obj.code==undefined){
              if(this.isWechat()){
                this.toWeiXinLogin()
              }
            }else {
              // this.getClientCache();
              this.yzmNum = this.$store.state.Cookie.mutations.getCookie('num');
              this.openId = this.$store.state.Cookie.mutations.getCookie('openId');
              if (this.$store.state.Cookie.mutations.fetch('openId').length == 0 || this.$store.state.Cookie.mutations.fetch('openId') == 'aaa') {
                this.weiXinLogin();
                Indicator.open();
              } else {
                this.weiXinLoginByWeiXinOpenId();
                Indicator.open();
              }
              this.createYzm();
            }
            this.wrapperHeight = document.documentElement.clientHeight;
        },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    this.mailFrom={
                        mail:'',
                        psd:'',
                    };
                    this.phoneForm={
                        mobile:'',
                        code:''
                    };
                    this.loginType=1;
                },
                deep:true
            },
        },
        methods:{
            async toWeiXinLogin() {
                try {
                  const res = await toWeiXinLogin({platformId:7});
                  Indicator.close();
                  if (res.data.code == 0) {
                    window.location.href = res.data.data;
                    console.log("succeed");
                  } else{
                    console.log("fail");
                  }
                } catch (err) {
                  Indicator.close();
                  Toast(err);
                }
            },
            async checkIsFollow() {
              try {
                let se = window.location.search.substr(1);
                let arr = se.split("&");
                let obj = {};
                let newarr = [];
                $.each(arr, function(i, v){
                  newarr = v.split("=");
                  if(typeof obj[newarr[0]] === "undefined"){
                    obj[newarr[0]] = newarr[1];
                  }
                });
                const res = await checkIsFollow({openId:this.$store.state.Cookie.mutations.fetch('openId')});
                Indicator.close();
                if (res.data.code == 0) {
                  if(res.data.data){
                    if(this.$store.state.Cookie.mutations.fetch('type')=='coupon_unit'){
                      this.getCoupon(this.$store.state.Cookie.mutations.fetch('typeID'))
                    }else{

                    }
                  }else{
                    Toast({
                      message:'请关注福管加微信公众号',
                      duration:2000
                    });
                    this.$router.push('/checkFollow');
                  }
                } else{
                  if(res.data.error){
                    Toast(res.data.error)
                  }else{
                    Toast('服务异常，请稍后再试')
                  }
                }
              } catch (err) {
                Indicator.close();
                Toast(err);
              }
            },
            async getClientCache() {
              try {
                var key = navigator.userAgent.toString();

                const res = await getClientCache({key:key});

                if (res.data.code == 0) {
                  if(res.data.data&&res.data.data!=''&&res.data.data.length>0){
                    var obj = res.data.data;
                    obj = JSON.parse(obj);

                    this.platformID = obj.platformID;
                    this.clientID   = obj.clientID;
                    this.channelID  = obj.channelID;
                    this.campaignID = obj.campaignID;
                    this.type       = obj.type;
                    this.typeID     = obj.typeID;
                    this.branchID   = obj.branchID;
                    this.rdid       = obj.rdid;

                    this.$store.state.Cookie.mutations.save(this.platformID,'platformID');
                    this.$store.state.Cookie.mutations.save(this.clientID,'clientID');
                    this.$store.state.Cookie.mutations.save(this.channelID,'channelID');
                    this.$store.state.Cookie.mutations.save(this.campaignID,'campaignID');
                    this.$store.state.Cookie.mutations.save(this.type,'type');
                    this.$store.state.Cookie.mutations.save(this.typeID,'typeID');
                    this.$store.state.Cookie.mutations.save(this.branchID,'branchID');
                    this.$store.state.Cookie.mutations.save(this.rdid,'rdid');

                  } else {
                  }
                } else {
                  Toast(res.data.error);
                }

              } catch (err) {
                Toast(err);

              }
            },
            register(){
                //好像是激活那边过来的，带了参数
                this.$router.push('/register/1');
            },
            //生成验证码
            createYzm(){
                this.num = '';
                this.yzm.one = parseInt(10*Math.random());
                this.yzm.two = parseInt(10*Math.random());
                this.yzm.symbol = parseInt(2*Math.random());
            },
            //根据微信openid登录接口
            async weiXinLoginByWeiXinOpenId() {
                try {
                    const res = await weiXinLoginByWeiXinOpenId({weiXinOpenId:this.$store.state.Cookie.mutations.fetch('openId'),loginType:this.$store.state.Cookie.mutations.fetch('type'),keyMessage:this.$store.state.Cookie.mutations.fetch('typeID')});
                    if (res.data.code == 0) {
                        let thtf = this;
                        this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                        window.setTimeout(function(){
                            Indicator.close();
                          if(this.$store.state.Cookie.mutations.fetch('type')=='coupon_unit'){
                            this.checkIsFollow()
                            // this.getCoupon(this.$store.state.Cookie.mutations.fetch('typeID'))
                          }else{
                            this.$router.push('/home');
                          }
                        },1000);
                    }else{
                        Indicator.close();
                    }

                } catch (err) {
                     Indicator.close();
                     Toast('服务异常，请稍后重试！');
                }
            },

            async weiXinLogin() {
                try {
                    let se = window.location.search.substr(1);
                    let arr = se.split("&");
                    let obj = {};
                    let newarr = [];
                    $.each(arr, function(i, v){
                        newarr = v.split("=");
                        if(typeof obj[newarr[0]] === "undefined"){
                            obj[newarr[0]] = newarr[1];
                        }
                    });
                    let storeId = '1';
                    const res = await weiXinLogin({weiXinCode:obj.code,storeId:storeId,loginType:this.$store.state.Cookie.mutations.fetch('type'),keyMessage:this.$store.state.Cookie.mutations.fetch('typeID')});

                    Indicator.close();
                    if (res.data.code == 0) {
                        this.realOpenid = res.data.data.openId;
                        this.$store.state.Cookie.mutations.save(res.data.data.openId,'openId');
                        this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                        this.$store.state.Cookie.mutations.save(0,'couponLogin');
                        // this.$router.push('/home');
                        Indicator.close();
                      this.checkParams();
                    } else if(res.data.code == 185){
                        this.$store.state.Cookie.mutations.save(res.data.data.openId,'openId');
                        return;
                    } else{
                        Toast(res.data.error);
                    }

                } catch (err) {
                     Indicator.close();
                     Toast('服务异常，请稍后重试！');
                }
            },
            sendIdentifyingCode(){
                if (!this.timer && /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.phoneForm.mobile)) {
                    this.count = 60;
                    this.yzmShow = false;
                    this.sendIdentifyingCodeAjax();
                }else{
                    Toast('手机号码格式错误');
                }
            },
            async sendIdentifyingCodeAjax(){
                try {
                    const res = await sendIdentifyingCode({mobile:this.phoneForm.mobile,type:6});

                    if (res.data.code == 0) {
                        Toast(res.data.data);
                        this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= 60) {
                                this.count--;
                            } else {
                                this.yzmShow = true;
                            clearInterval(this.timer);
                                this.timer = null;
                            }
                        }, 1000)
                    } else {
                        this.yzmShow = true;
                        Toast(res.data.error);
                    }

                } catch (err) {
                    this.yzmShow = true;
                    Toast(err);
                }
            },
            //切换登录模式
            checkLogin(type){
                this.loginType = type;
                this.mailFrom = {
                    mail:'',
                    psd:'',
                };
                this.phoneForm={
                    mobile:'',
                    code:''
                };
            },
            //邮箱登录
            mainLogin(){
                if(this.yzmNum>=5){

                    let num;
                    if(this.yzm.symbol==0){
                        num = this.yzm.one + this.yzm.two;
                    }else{
                        num = this.yzm.one * this.yzm.two;
                    }
                    if(this.num != num){
                        Toast('请输入正确的验证码');
                        this.createYzm();
                        return;
                    }
                }
                var reg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
                if(this.mailFrom.mail==''||this.mailFrom.psd==''){
                    return;
                }else if(!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.mailFrom.mail)){
                    Toast('邮箱格式错误');
                    return;
                }else if(this.mailFrom.psd.match(reg)==null){
                    Toast('密码长度不少于6位，至少包含字母、数字两种类型');
                    return;
                }else{
                    let obj = new Object;
                    obj.name = this.mailFrom.mail;
                    obj.password = CryptoJS.MD5(this.mailFrom.psd).toString();
                    obj.platformId = 7;
                    if(this.$store.state.Cookie.mutations.fetch('type')){
                      obj.loginType = this.$store.state.Cookie.mutations.fetch('type');
                      obj.keyMessage = this.$store.state.Cookie.mutations.fetch('typeID');
                    }
                    Indicator.open();
                    this.mobileLogin(obj);
                }
            },
            async mobileLogin(obj) {
                try {

                    const res = await mobileLogin(obj);
                    if (res.data.code == 0) {
                        Indicator.close();
                        this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                        this.userByUserId();
                    } else {
                        if(res.data.code == 104){
                            this.$store.state.Cookie.mutations.setCookie('num',++this.yzmNum,1);
                        }
                        Indicator.close();
                        Toast(res.data.error);
                    }

                } catch (err) {
                     Indicator.close();
                     Toast('服务异常，请稍后重试！');
                }
            },
            //验证码登录
            codeLogin(){
                if(this.phoneForm.mobile==''||this.phoneForm.code==''){
                    return;
                }else if(!/(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.phoneForm.mobile)){
                    Toast('手机号码格式错误');
                    return;
                }else{
                    Indicator.open();
                    let obj = new Object;
                    obj.mobile = this.phoneForm.mobile;
                    obj.identityCode = this.phoneForm.code;
                    obj.channelName = this.$store.state.Cookie.mutations.fetch('channelID');
                    obj.campaignCode =  this.$store.state.Cookie.mutations.fetch('campaignID');
                    obj.platformId = 7;
                    obj.registerShopCode = 1;
                    this.userMobileLogin(obj);
                }
            },
            async userMobileLogin(obj) {
                try {
                    if(this.$store.state.Cookie.mutations.fetch('type')=='coupon_unit'){
                      obj.type = this.$store.state.Cookie.mutations.fetch('type');
                    }
                    if(this.$store.state.Cookie.mutations.fetch('type')){
                      obj.loginType = this.$store.state.Cookie.mutations.fetch('type');
                      obj.keyMessage = this.$store.state.Cookie.mutations.fetch('typeID');
                    }

                    const res = await userMobileLogin(obj);

                    if (res.data.code == 0) {

                        Indicator.close();
                        this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                        this.userByUserId();
                    } else {

                        Indicator.close();
                        Toast(res.data.error);
                    }

                } catch (err) {

                     Indicator.close();
                     Toast('服务异常，请稍后重试！');

                }
            },

            async userByUserId() {
                try {
                    const res = await userByUserId({weiXinOpenId:this.$store.state.Cookie.mutations.fetch('openId')});

                    if (res.data.code == 0) {
                        this.$store.state.Cookie.mutations.save(res.data.data.companyName,'companyName')
                        if(res.data.data.mobile==null){
                            this.$router.push('/buildPhoneLogin');
                        }else{
                          if(this.$store.state.Cookie.mutations.fetch('type')=='coupon_unit'){
                            this.checkIsFollow()
                          }else{
                            if(this.$store.state.Cookie.mutations.fetch('checkFollow')==1){
                              this.checkIsFollow()
                              this.$router.push('/home');
                            }else{
                              // this.$router.push('/home');
                              this.checkParams()
                            }
                          }
                        }
                    } else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                     Toast('服务异常，请稍后重试！');

                }
            },
            async queryByStandardUnitId(id) {
              try {
                const res = await queryByStandardUnitId({standardUnitId:id});
                if (res.data.code == 0) {
                  if(res.data.data.commodityTemplateId){
                    var type=res.data.data.commodityTemplateId;
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
                    }else{
                      this.$router.push('/shop/goods/0/' + id);
                    }
                  }else{
                    this.$router.push('/shop/goods/0/' + id);
                  }
                } else {
                  Toast(res.data.error);
                  this.$router.push('/home');
                }
              } catch (err) {
                Toast(err);
              }
            },

            checkParams(){
              this.type       = this.$store.state.Cookie.mutations.fetch('type')
              this.typeID     = this.$store.state.Cookie.mutations.fetch('typeID')
              this.branchID   = this.$store.state.Cookie.mutations.fetch('branchID')
              this.clientID   = this.$store.state.Cookie.mutations.fetch('clientID')
              if(this.$store.state.Cookie.mutations.fetch('type')=='coupon_unit'){
                  this.checkIsFollow();
              }else{
                  if (this.clientID != 2) {
                    Toast('此二维码需在APP打开,请先下载APP');
                    return;
                  } else if (!this.type) {
                    Toast('二维码已失效,请重新获取二维码');
                    return;
                  } else if (this.type == "su") {
                    Indicator.close();
                    if (!this.typeID) {
                      Toast('商品信息缺失,请重新获取二维码');
                      return;
                    } else {
                      this.queryByStandardUnitId(this.typeID);
                    }
                  } else if (this.type == "coupon" || this.type == "coupon_group") {
                    Indicator.close();
                    if (!this.typeID) {
                      Toast('优惠券信息缺失,请重新获取二维码');
                      return;
                    } else {
                      if (!this.branchID) {
                        Toast('门店信息缺失,请重新获取二维码');
                        return;
                      } else {
                        this.$store.state.Cookie.mutations.save(this.branchID, 'storeId');
                        this.$store.state.Cookie.mutations.save(this.typeID, 'typeID');
                        this.$router.push('/couponList');
                      }
                    }
                  } else if(this.type == "puo" || this.type == "puc"){
                    Indicator.close();
                    if(!this.typeID){
                      Toast('商品购买或加入购物车所需信息缺失,请重新获取二维码');
                      return;
                    } else {
                      if(!this.branchID){
                        Toast('门店信息缺失,请重新获取二维码');
                        return;
                      } else {
                        this.$store.state.Cookie.mutations.save(this.branchID,'storeId');
                        // puo确认订单,puc加入购物车
                        if(this.type == "puo"){
                          this.$store.state.Cookie.mutations.save(this.typeID,'typeID');
                          this.$router.push('/shop/orderConfim');
                        }else if(this.type == "puc"){
                          this.$store.state.Cookie.mutations.save(this.typeID,'typeID');
                          this.$router.push('/shop/shopCart');
                        }
                      }
                    }
                  } else if (this.type == "main_store") {
                    Indicator.close();
                    if (!this.typeID) {
                      Toast('总店信息缺失,请重新获取二维码');
                      return;
                    } else {
                      this.$store.state.Cookie.mutations.save(this.typeID,'typeID');
                      this.$router.push('/home');
                    }
                  } else if (this.type == "branch") {
                    Indicator.close();
                    if (!this.branchID) {
                      Toast('门店信息缺失,请重新获取二维码');
                      return;
                    } else {
                      this.$store.state.Cookie.mutations.save(this.typeID,'typeID');
                      this.$router.push('/home');
                      }
                  }else if(this.type == 'coupon_unit'){
                    this.checkIsFollow();
                    // this.getCoupon(this.$store.state.Cookie.mutations.fetch('typeID'))
                  } else {
                    if(this.$store.state.Cookie.mutations.fetch('checkFollow')==1){
                      this.checkIsFollow();
                      this.$router.push('/home');
                    }else{
                      this.$router.push('/home');
                    }
                  }
                // } else {
                //   if(this.$store.state.Cookie.mutations.fetch('checkFollow')==1){
                //     this.checkIsFollow()
                //     this.$router.push('/home');
                //   }else{
                //     this.$router.push('/home');
                //   }
                // }
            }
          },
            //领取优惠券
            async getCoupon(id) {
              try {
                const res = await sendCouponUnitWithTx({typeId:id,storeId:1});
                if (res.data.code == 0) {
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
                    // this.$router.push('/cmsGoodsList/'+id+'/2/'+item.cmsPageId);
                    if(item.couponType==1){
                      // this.$router.push('/shop/couponGoodsList1/'+id+'/2/'+couponId);
                      this.$router.push('/cmsGoodsList/'+item.goodsId+'/2/'+item.cmsPageId+'/1');
                    }else{
                      // this.$router.push('/shop/couponGoodsList/'+id+'/2/'+couponId);
                      this.$router.push('/cmsGoodsList/'+item.goodsId+'/2/'+item.cmsPageId+'/0');
                    }
                  }
                }else if(res.data.code == 194){
                  Toast(res.data.error);
                  this.$router.push('/home');
                }else{
                  Toast(res.data.error);
                  this.$router.push('/home');
                }

              } catch (err) {
                Toast(err);
              }
            },
            //判断是否是微信
            isWechat(){
              let ua = window.navigator.userAgent.toLowerCase();
              return ua.match(/MicroMessenger/i) == 'micromessenger';
            }
		   }
    }
</script>

<style lang="scss" scoped>
   @import "../../../style/home/login.scss";
</style>
