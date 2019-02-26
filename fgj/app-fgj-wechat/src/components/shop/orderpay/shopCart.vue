<template>
    <div class="cart">
        <div class="cart_top" v-if="cartType">
            <div class="hint">
                <span>提示:预售商品不可与普通商品同时结算</span>
            </div>
            <div class="cartList">
                <div class="page-loadmore-wrapper" >
                    <ul v-for="(itemList,merchantKey) in shopCartData" >
                      <div class="shopName" v-if="itemList.merchantId!=1">
                        <span>{{itemList.merchantName}}</span>
                      </div>
                      <div class="shopName" v-else>
                        <span>{{itemList.storeName}}</span>
                      </div>
                      <li  v-for="(item,key) in itemList.data">
                        <div class="goods_1">
                          <template v-if="item.status==3 && item.realStockNum!=0 && item.isVendible==1">
                            <input type="checkbox" class="mint-checkbox-input" v-model="item.check">
                            <i :class="{'icon-round':!item.check,'icon-roundcheckfill':item.check}" class="iconfont" @click="checkGoods(key,merchantKey)"></i>
                          </template>
                          <!--失效-->
                          <template v-if="item.status!=3 || item.isVendible == 0">
                            <i class="sold_no"></i>
                          </template>
                          <template v-if="item.status && item.status==3 && item.realStockNum<item.num">
                            <i class="sold_out"></i>
                          </template>
                          <template v-if="item.authority==0">
                            <i class="sold_authority"></i>
                          </template>
                        </div>
                        <div class="goods_2">
                          <img :src="item.puPicUrl+'?imageMogr2/size-limit/100k!'">
                        </div>
                        <div class="goods_3">
                          <div class="goods_title"><h5><span class="operateByown" v-if="item.isOwnMerchant">自营</span>{{item.productUnitName}}</h5><i class="iconfont icon-delete_light" @click="deleteGoodsSku(item.cartItemId)"></i></div>
                          <div class="goods_limit" v-if="item.limitRule">
                            {{item.limitRule}}
                          </div>
                          <div class="goods_authority" v-if="item.saleWay==4">
                            底价预售
                          </div>
                          <div class="goods_authority membership" v-if="item.saleWay==6">
                            会员底价预售
                          </div>
                          <!--<br><br>-->
                          <div class="goods_period" v-if="item.saleWay==4||item.saleWay==6">
                            预售时间{{item.presellPeriod}}天
                          </div>
                          <div class="saleBycash" v-if="item.buyType==2">
                            该商品仅支持现金购买
                          </div>
                          <div class="goods3_price">
                            <span>{{item.salePrice.toFixed(2)}} 积分</span>
                            <p>
                              <i class="cart_del" v-if="item.num>1" @click="setReductPayNum(key,item.cartItemId,item.isVendible,item.status,merchantKey)"></i>
                              <i class="cart_del" v-else-if="item.num<=1"></i>
                              <b>{{item.num}}</b>
                              <i class="cart_add" v-if="item.num<item.realStockNum" @click="setAddPayNum(key,item.cartItemId,item.isVendible,item.status,merchantKey)"></i>
                              <i class="cart_add" v-else-if="item.num>=item.realStockNum"></i>
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                </div>
            </div>
            <div class="cart_bottom">
                <div>
                    <input type="checkbox" class="mint-checkbox-input" v-model="allCheck">
                    <i :class="{'icon-round':!allCheck,'icon-roundcheckfill':allCheck}" class="iconfont" @click="checkAllGoods()"></i>
                    <span>全选</span>
                </div>
                <div>
                    <p><span>合计：</span><b>{{allPrice.toFixed(2)}}</b><b> 积分</b></p>
                    <h6>实付金额以结算页面为准</h6>
                </div>
                <div @click="orderConfirm">
                    去结算
                </div>
            </div>
        </div>
        <div class="cart_error" v-else>
            <img src="../../../../static/assets/img/error/shopcart.png" alt="">
            <p>购物车竟然是空的</p>
            <p>扫码立即加购</p>
            <p class="btn" @click="scanCode" >扫一扫</p>
        </div>
    </div>
</template>

<script>
    import {
      findPageCartItem,
      cartDeleteById,
      cartItemNumPlusById,
      cartItemNumSubtractById,
      saveCartItem,
      getSign,
      qrCodeVerifyValid
    } from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    export default{

        data(){
            return {
                pageNo:1,
                shopCartList:[],
                allCheck:false,
                allPrice:0,
                selected:"shopCart",
                cartHeight:0,
                loading:false,
                cartType:true,
                storeName:'',
                shopName:'',
                shopCartData:[],
            }
        },
        created () {
            this.storeId = this.$store.state.Cookie.mutations.fetch('storeId');
            this.userInfo = this.$store.state.Cookie.mutations.fetch('userInfo');
        },
        mounted() {
            if(this.$store.state.Cookie.mutations.fetch('type')=='puc'){
              var skuId = this.$store.state.Cookie.mutations.fetch('typeID');
              this.saveCartItem(skuId);
            }else{
              this.$store.state.Cookie.mutations.save('','type');
              this.findPageCartItem();
            }
            //配置参数直接跳转进购物车
            // if(this.$route.query.skuId){
            //   this.saveCartItem(this.$route.query.skuId);
            // }
        },
		    watch : {
            'shopCartList': {
                handler(curVal,oldVal){
                    var status = false;
                    $.each(curVal,function(key,info){
                        if(info&&(info.isVendible==0||info.check)){
                            status = true;
                        }else{
                            return status = false;
                        }
                    });
                    this.allCheck = status;
                },
                deep:true
            },
        },
        methods:{
            //加入购物车
            async saveCartItem(skuId) {
              try {
                const res = await saveCartItem({num:1,productUnitId:skuId,storeId:1});
                if (res.data.code == 0) {
                  Toast('商品已经在购物车躺好了哟~');
                  this.findPageCartItem();
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

            async findPageCartItem() {
                try {
                    const res = await findPageCartItem();
                    if (res.data.code == 0) {
                        this.cartType = true;
                        Indicator.close();
                        this.computePrice();
                        if(!res.data.data.list||res.data.data.list.length == 0){
                            this.cartType = false;
                            this.loading = true;
                            this.shopCartList = this.shopCartList.concat(res.data.data.list);
                            // alert(this.shopCartList)
                        }else{
                            this.pageNo++;
                            this.shopCartList = this.shopCartList.concat(res.data.data.list);
                            if(this.shopCartList&&this.shopCartList.length>0&&this.shopCartList[0]!=null){
                            var map = {},
                              dest = [];
                            for(var i = 0; i < this.shopCartList.length; i++){
                              var ai = this.shopCartList[i];
                              if(!map[ai.merchantId]){
                                dest.push({
                                  merchantId: ai.merchantId,
                                  merchantName: ai.merchantName,
                                  storeName: ai.storeName,
                                  data: [ai]
                                });
                                map[ai.merchantId] = ai;
                              }else{
                                for(var j = 0; j < dest.length; j++){
                                  var dj = dest[j];
                                  if(dj.merchantId == ai.merchantId){
                                    dj.data.push(ai);
                                    break;
                                  }
                                }
                              }
                            }
                            this.shopCartData=dest;
                          }
                        }
                    } else {
                        this.cartType = false;
                        Indicator.close();
                    }
                } catch (err) {
                     // Toast(err);
                  Toast('网络错误');
                  this.cartType = false;
                     Indicator.close();
                }
            },
            loadMore(){
                this.findPageCartItem();
                Indicator.open();
            },
            checkGoods(key,merchantKey){
                this.shopCartData[merchantKey].data[key].check = !this.shopCartData[merchantKey].data[key].check;
                this.$set(this.shopCartData[merchantKey].data, key, this.shopCartData[merchantKey].data[key]);

                var salewayList = [];
                for(var i=0;i<this.shopCartData.length;i++){
                  for(var j=0;j<this.shopCartData[i].data.length;j++){
                    //筛选失效商品
                    if(this.shopCartData[i].data[j].status==3&&this.shopCartData[i].data[j].isVendible!=0){
                      if(this.shopCartData[i].data[j].check==true){
                        if(this.shopCartData[i].data.length==1){  //圣楠说购物车只有一个的时候，勾选了一个全选也要勾上
                            this.allCheck = true;
                        }
                        salewayList.push(this.shopCartData[i].data[j].saleWay);
                      }else{
                        if(this.shopCartData[i].data.length==1){  //不勾全选也不勾
                          this.allCheck = false;
                        }
                      }
                    }

                  }
                }
                var normal = salewayList.indexOf(1);
                var memberA = salewayList.indexOf(4);
                var memberB = salewayList.indexOf(6);
                var members = "-1";
                if(memberA!="-1"){
                  members = memberA;
                }
                if(memberB!="-1"){
                  members = memberB;
                }
                if(normal!="-1"&&members!="-1"){
                  Toast("预售商品和普通商品不可同时下单,请重新选择");
                  this.shopCartData[merchantKey].data[key].check = !this.shopCartData[merchantKey].data[key].check;
                  return;
                }
                this.computePrice();
          },
            //增加数量
            setAddPayNum(key,skuId,isVendible,status,merchantKey){
              if(this.addloading==true){
                return;
              }
              this.addloading=true;
              if(this.shopCartData[merchantKey].data[key].num < this.shopCartData[merchantKey].data[key].realStockNum  && status==3 && isVendible==1){
                var thtf = this;
                setTimeout(function(){
                  thtf.addloading=false;
                },500);
                this.cartItemNumPlusById(key,skuId,merchantKey);
              }else{
                var thtf = this;
                setTimeout(function(){
                  thtf.addloading=false;
                },500);
                return;
              }
            },
            async cartItemNumPlusById(key,skuId,merchantKey) {
                try {
                    const res = await cartItemNumPlusById({cartItemId:skuId});
                    if (res.data.code == 0) {
                        this.shopCartData[merchantKey].data[key].num++;
                        this.computePrice();
                        this.$set(this.shopCartData[merchantKey].data, key, this.shopCartData[merchantKey].data[key]);
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //减少数量
            setReductPayNum(key,skuId,isVendible,status,merchantKey){
              if(this.minusloading==true){
                return;
              }
              this.minusloading=true;
              if(this.shopCartData[merchantKey].data[key].num>1 && status==3 && isVendible==1){
                var thtf = this;
                setTimeout(function(){
                  thtf.minusloading=false;
                },500);
                this.cartItemNumSubtractById(key,skuId,merchantKey);
              }else{
                var thtf = this;
                setTimeout(function(){
                  thtf.minusloading=false;
                },500);
                return;
              }
            },
            async cartItemNumSubtractById(key,skuId,merchantKey) {
                try {
                    const res = await cartItemNumSubtractById({cartItemId:skuId});
                    if (res.data.code == 0) {
                        this.shopCartData[merchantKey].data[key].num--;
                        this.computePrice();
                        this.$set(this.shopCartData[merchantKey].data, key, this.shopCartData[merchantKey].data[key]);
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //删除
            deleteGoodsSku(skuId){
                MessageBox.confirm('确定执行此操作?').then(action => {
                    this.cartDeleteById(skuId);
                    this.checkAllGoods();
                },() => {

                });
            },

            async cartDeleteById(skuId) {
                try {
                    const res = await cartDeleteById({id:skuId});
                    if (res.data.code == 0) {
                        this.pageNo = 1;
                        this.shopCartList = [];
                        this.findPageCartItem();

                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //全选
            checkAllGoods(){
                var thtf = this;
                var salewayList = [];
                for(var i=0;i<this.shopCartData.length;i++){
                  for(var j=0;j<this.shopCartData[i].data.length;j++){
                    //筛选失效
                    if(this.shopCartData[i].data[j].status==3&&this.shopCartData[i].data[j].isVendible!=0){
                      salewayList.push(this.shopCartData[i].data[j].saleWay);
                    }
                  }
                }
                var normal = salewayList.indexOf(1);
                var memberA = salewayList.indexOf(4);
                var memberB = salewayList.indexOf(6);
                var members = "-1";
                if(memberA!="-1"){
                  members = memberA;
                }
                if(memberB!="-1"){
                  members = memberB;
                }
                if(normal!="-1"&&members!="-1"){
                  Toast("注:预售商品和普通商品不可同时下单");
                  return;
                }
                this.allCheck = !this.allCheck;
                for(var i=0;i<this.shopCartData.length;i++){
                  for(var j=0;j<this.shopCartData[i].data.length;j++){
                    if(this.shopCartData[i].data[j].realStockNum<=0 || this.shopCartData[i].data[j].isVendible==0){
                      Toast('部分商品库存不足,请重新选择');
                      this.allCheck = !this.allCheck;
                      return;
                    }else{
                      this.shopCartData[i].data[j].check = thtf.allCheck;
                      thtf.$set(this.shopCartData[i].data, j, this.shopCartData[i].data[j]);
                    }
                  }
                }
                this.computePrice();
            },
            //计算合计金额
            computePrice(){
                var thtf = this;
                this.allPrice = 0;
                var cartNum = 0;
                for(var i=0;i<this.shopCartData.length;i++){
                  for(var j=0;j<this.shopCartData[i].data.length;j++){
                    if(this.shopCartData[i].data[j].realStockNum < this.shopCartData[i].data[j].num){
                      return;
                    }else{
                      thtf.cartNum += this.shopCartData[i].data[j].num;
                      //筛选失效
                      if(this.shopCartData[i].data[j].status==3&&this.shopCartData[i].data[j].isVendible!=0){
                        if(this.shopCartData[i].data[j].check == true){
                          thtf.allPrice += this.shopCartData[i].data[j].salePrice * this.shopCartData[i].data[j].num;
                        }
                      }
                    }
                  }
                }
                this.$store.dispatch("setCartNum",cartNum);
              },

            //生成订单
            orderConfirm() {
                var arr = new Array();
                for(var i=0;i<this.shopCartData.length;i++){
                  for(var j=0;j<this.shopCartData[i].data.length;j++){
                    if(this.shopCartData[i].data[j].status==3&&this.shopCartData[i].data[j].isVendible!=0) {
                      if(this.shopCartData[i].data[j].check == true){
                        arr.push(this.shopCartData[i].data[j].cartItemId);
                      }
                    }

                  }
                }
                var obj = new Object();
                obj.cartItemIds = JSON.stringify(arr);
                obj.type = 1;
                if(arr.length == 0){
                    Toast('请选择商品~');
                }else{
                    this.$store.dispatch("setSkuObj",obj);
                    this.$router.push({path: '/shop/orderConfim'});
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
        }
    }
</script>

<style lang="scss" scoped>
 @import "../../../style/component/orderpay/shopCart.scss";

</style>
