<template>
    <div>
        <div class="head">
            <!-- <div style="float:left;position:absolute;" @click="routerBack"> -->
            <div style="float:left;position:absolute;">
                <i class="iconfont icon-fanhui"  @click="routerBack"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import { baseUrl } from '../../../config/env.js'
    import Cookie from '../../../config/mUtils'
    import myHead from '../page/head';
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import {
      getWeiXinOpenIdByWeiXinCode,
      saveClientCache,
      qrCodeVerifyValid,
      toWeiXinLogin,
      queryByStandardUnitId,
      sendCouponUnitWithTx,
      insertCouponUnitWithTx
    } from '../../../api/getData';
    export default{

        data(){
            return {
                elementList:[],
                showFgj:false,
                showCooperator:false,
                platformID:'',  //2
                clientID:'',    //2
                channelID:'',   //21
                campaignID:'',  //21-Gift-27972
                type:'',        //coupon_group
                typeID:'',      //213
                branchID:'',    //1887
                rdid:'',        //249367
            }
        },
		    components: {
            'myHead':myHead,
        },
        watch:{

        },
        created(){
            // alert(window.location.href.includes('fgjWechat'))
            // if(!window.location.href.includes('fgjWechat')){
            //   Toast('链接不属于福管加，请重新获取');
            //   return
            // }
            this.openId = this.$store.state.Cookie.mutations.fetch('openId');
            if(!this.openId || this.openId==undefined || this.openId.length==0){
              this.openId = "aaa";
              this.$store.state.Cookie.mutations.save("aaa",'openId');
            }
            this.platformID = this.$route.query.platformID;
            this.clientID = this.$route.query.clientID;
            this.channelID = this.$route.query.channelID;
            this.campaignID = this.$route.query.campaignID;
            this.type = this.$route.query.type;
            this.typeID = this.$route.query.typeID;
            this.branchID = this.$route.query.branchID;
            this.rdid = this.$route.query.rdid;
            this.userInfo = this.$store.state.Cookie.mutations.fetch('userInfo');

            this.$store.state.Cookie.mutations.save(0,'couponLogin');
            this.qrCodeVerifyValid(this.platformID,this.clientID,this.channelID,this.campaignID,this.type,this.typeID,this.branchID,this.rdid);
        },
        methods:{
            async qrCodeVerifyValid(platformID,clientID,channelID,campaignID,type,typeID,branchID,rdid) {
                try {
                    const res = await qrCodeVerifyValid({platformId:platformID,clientId:clientID,channelId:channelID,campaignCode:campaignID,type:type,typeId:typeID,rdid:rdid,branchId:branchID,});
                    if (res.data.code == 0) {
                        if(res.data.data){
                            this.saveClientCache();
                            //从优惠券来的
                            if(this.userInfo.length==0&&this.type=='coupon_unit'){
                              this.$store.state.Cookie.mutations.save(this.$route.query.type,'type');
                              this.$store.state.Cookie.mutations.save(this.$route.query.typeID,'typeID');
                              this.$store.state.Cookie.mutations.save(this.channelID,'channelID');
                              this.$store.state.Cookie.mutations.save(this.campaignID,'campaignID');
                              this.$store.state.Cookie.mutations.save(1,'couponLogin');
                              this.$router.push('/login');
                              return
                            }
                            this.$store.state.Cookie.mutations.save(this.platformID,'platformID');
                            this.$store.state.Cookie.mutations.save(this.clientID,'clientID');
                            this.$store.state.Cookie.mutations.save(this.channelID,'channelID');
                            this.$store.state.Cookie.mutations.save(this.campaignID,'campaignID');
                            this.$store.state.Cookie.mutations.save(this.type,'type');
                            this.$store.state.Cookie.mutations.save(this.typeID,'typeID');
                            this.$store.state.Cookie.mutations.save(this.branchID,'branchID');
                            this.$store.state.Cookie.mutations.save(this.rdid,'rdid');
                            this.checkPlatform();
                        }else{
                            Toast('二维码错误或已失效,请重新获取二维码');
                            if(this.type=='coupon_unit'){
                              this.$router.push('/home');
                            }else{
                              return;
                            }
                        }
                    } else {
                      this.$store.state.Cookie.mutations.save(1,'checkFollow');
                        Toast('二维码错误或已失效,请重新获取二维码');
                        if(this.type=='coupon_unit'){//从微信扫失效码，跳转首页。（这里有个坑，在其他地方扫失效码也会跳首页）
                          if(this.userInfo.length==0){
                            this.$router.push('/login');
                          }else{
                            this.$router.push('/home');
                          }
                        }else{
                          return;
                        }
                    }
                } catch (err) {
                    Toast(err)
                }
            },

            async saveClientCache() {
                try {
                    var obj = new Object;
                    obj.platformID = this.platformID;
                    obj.clientID = this.clientID;
                    obj.channelID = this.channelID;
                    obj.campaignID = this.campaignID;
                    obj.type = this.type;
                    obj.typeID = this.typeID;
                    obj.branchID = this.branchID;
                    obj.rdid = this.rdid;

                    obj = JSON.stringify(obj);

                    var key = navigator.userAgent.toString();

                    const res = await saveClientCache({key:key,value:obj});

                    if (res.data.code == 0) {
                        
                    } else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                     Toast(err);

                }
            },
            routerBack(){
                this.$router.push('/home')
            },
            checkPlatform(){
                if(this.clientID!=2){
                    Toast({
                      message:'此二维码需在APP打开,请先下载APP',
                      duration:2000
                    });
                    this.$router.push('/home');
                    // return;
                }
                let thtf = this;
                window.setTimeout(function(){
                    Indicator.open();
                    thtf.routerGo();
                    Indicator.close();
                },1000);
            },
            routerGo(){
                if(!this.type){
                    Toast('二维码已失效,请重新获取二维码');
                    return;
                }else if(this.type == "su"){
                    Indicator.close();
                    if(!this.typeID){
                        Toast('商品信息缺失,请重新获取二维码');
                        return;
                    }else{
                      this.queryByStandardUnitId(this.typeID);
                    }
                }else if(this.type == "coupon" || this.type == "coupon_group"){
                  Indicator.close();
                  if (!this.typeID) {
                    Toast('优惠券信息缺失,请重新获取二维码');
                    return;
                  } else {
                    if (!this.branchID) {
                      Toast('门店信息缺失,请重新获取二维码');
                      return;
                    } else {
                      this.$store.state.Cookie.mutations.save(this.typeID, 'typeID');
                      this.getCoupon_grooup(this.typeID)
                    }
                  }
                }else if(this.type == 'puc'||this.type == 'puo'){
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
                }else if(this.type == "main_store"){
                  Indicator.close();
                  if(!this.typeID){
                    Toast('总店信息缺失,请重新获取二维码');
                    return;
                  } else {
                      this.$router.push('/home');
                  }
                }else if(this.type == "branch"){
                  Indicator.close();
                  if(!this.branchID){
                    Toast('门店信息缺失,请重新获取二维码');
                    return;
                  } else {
                    this.$router.push('/home');
                  }
                }
            },
            async getCoupon_grooup(id) {
              try {
                const res = await insertCouponUnitWithTx({id:id});

                if (res.data.code == 0) {
                  Indicator.close();
                  // if(res.data.data.couponBatchStatus==2){
                    Toast('领取成功');
                    this.$router.push('/couponList');
                  // }else if(res.data.data.couponBatchStatus==3){
                  //   Toast('来晚了~优惠券已领完');
                  //   this.$router.push('/home');
                  // }else{
                  //   this.$router.push('/home');
                  // }
                } else if(res.data.code == 194){
                  Indicator.close();
                  Toast(res.data.error);
                  this.$router.push('/home');
                }else{
                  Indicator.close();
                  Toast(res.data.error);
                  this.$router.push('/home');
                }
              } catch (err) {
                Indicator.close();
                Toast(err);
              }
            },
            //领取优惠券
            async getCoupon(id) {
              try {
                const res = await sendCouponUnitWithTx({typeId:id,storeId:1});
                if (res.data.code == 0) {
                  var item = res.data.data;
                  var storeIds = item.storeIds;
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
                    if(item.couponType==0){
                      if(item.commodityTemplateId==1){
                        this.$router.push('/card/'+item.goodsId);
                      }else if(item.commodityTemplateId==2){
                        this.$router.push('/shop/goods/0/'+item.goodsId);
                      }else if(item.commodityTemplateId==3){
                        this.$router.push('/shop/goods2/0/'+item.goodsId);
                      }else if(item.commodityTemplateId==4){
                        this.$router.push('/moreCredit/'+item.goodsId);
                      }else if(item.commodityTemplateId==6){
                        this.$router.push('/card/'+item.goodsId);
                      }else if(item.commodityTemplateId==7){
                        this.$router.push('/shop/goods/0/'+item.goodsId);
                      }else if(item.commodityTemplateId==8){
                        this.$router.push('/shop/goods2/0/'+item.goodsId);
                      }else if(item.commodityTemplateId==9){
                        this.$router.push('/moreCredit/'+item.goodsId);
                      }
                    }else if(item.couponType==1){
                      if(item.commodityTemplateId==1){
                        this.$router.push('/card/'+item.goodsId);
                      }else if(item.commodityTemplateId==2){
                        this.$router.push('/shop/goods/1/'+item.goodsId);
                      }else if(item.commodityTemplateId==3){
                        this.$router.push('/shop/goods2/1/'+item.goodsId);
                      }else if(item.commodityTemplateId==4){
                        this.$router.push('/moreCredit/'+item.goodsId);
                      }else if(item.commodityTemplateId==6){
                        this.$router.push('/card/'+item.goodsId);
                      }else if(item.commodityTemplateId==7){
                        this.$router.push('/shop/goods/1/'+item.goodsId);
                      }else if(item.commodityTemplateId==8){
                        this.$router.push('/shop/goods2/1/'+item.goodsId);
                      }else if(item.commodityTemplateId==9){
                        this.$router.push('/moreCredit/'+item.goodsId);
                      }
                    }

                  } else if (item.jumpType == 2){
                    this.$store.state.Cookie.mutations.save('','effectTimeRange');
                    if (item.isShowEffectTimeRange) {
                      this.$store.state.Cookie.mutations.save(item.isShowEffectTimeRange,'isShowEffectTimeRange');
                      this.$store.state.Cookie.mutations.save(item.effectTimeRange,'effectTimeRange');
                    }
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
            goodsSkip(arr){
                let obj = arr[0];
                if(obj.suTmplId==1){
                    this.$router.push('/card/'+obj.suId);
                }else if(obj.suTmplId==2){
                    this.$router.push('/shop/goods/0/'+obj.suId);
                }else if(obj.suTmplId==3){
                    this.$router.push('/shop/goods2/0/'+obj.suId);
                }else if(obj.suTmplId==4){
                    this.$router.push('/moreCredit/'+obj.suId);
                }

            },
            async queryByStandardUnitId(id) {
              try {
              const res = await queryByStandardUnitId({standardUnitId:id});
              if (res.data.code == 0) {
                Indicator.close();
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
                Indicator.close();
                Toast(res.data.error);
              }

            } catch (err) {
              Toast(err);

            }
          },
            async getWeiXinOpenIdByWeiXinCode() {
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
                    // let storeId = (!this.storeId || this.storeId=='') ? 2 : this.storeId;
                    // const res = await getWeiXinOpenIdByWeiXinCode({weiXinCode:obj.code,storeId:this.storeId});
                    const res = await getWeiXinOpenIdByWeiXinCode({weiXinCode:obj.code});

                    Indicator.close();
                    if (res.data.code == 0) {
                        this.$store.state.Cookie.mutations.save(res.data.data.weiXinOpenId,'openId');
                        
                    } else if(res.data.code == 185){
                        this.$store.state.Cookie.mutations.save(res.data.data.weiXinOpenId,'openId');
                        // this.setOpenId=res.data.data.openId;
                        // this.$store.dispatch("setOpenId",res.data.data.openId);
                    } else{
                        Toast(res.data.error);
                    }

                } catch (err) {
                     Indicator.close();
                     Toast(err);

                }
            },
            async toWeiXinLogin() {
              try {
                const res = await toWeiXinLogin({platformId:7});
                Indicator.close();
                if (res.data.code == 0) {
                  window.location.href = res.data.data;
                } else{
                  console.log("fail");
                }

              } catch (err) {
                Indicator.close();
                Toast(err);
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

    .head{
        padding:0 px(24px);
        border-bottom:0.5px solid #DCDCDC;
        height:px(88px);
        position:fixed;
        width: 100%;
        box-sizing: border-box;
        z-index:999;
        background:#fff;
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

    .scan{
        width:px(44px);
        height:px(44px);
        background:url(../../../../static/assets/img/scan@2x.png);
        background-size:cover;
        position:relative;
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
        width:px(44px);
        height:px(44px);
        background:url(../../../../static/assets/img/head_cart@2x.png);
        background-size:cover;
        position:relative;
        .cart_num{
            display:block;
            position:absolute;
            line-height:px(24px);
            text-align:center;
            width:px(34px);
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
            color:#97011e;
            border-bottom:px(4px) solid #97011e;
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
            background:#97011e;
        }
    }
    #cms{
        padding:px(88px) 0 px(100px) 0;
    }
</style>
