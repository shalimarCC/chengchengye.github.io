<template>
    <div class="head" :style="[showTitle?headStyle:'']">
          <ul>
                <li @click="routerBack">
                    <i class="iconfont icon-fanhui"></i>
                </li>
                <li v-if="title!='商品详情'">
                    <span class="title">{{title}}</span>
                </li>
                <li v-else class="goods_title">
                    <span :class="{'active':goodsType==1}" @click="checkType(1)">商品</span>
                    <span :class="{'active':goodsType==2}" @click="checkType(2)">详情</span>
                </li>
                <li v-if="title=='商品列表'">
                  <router-link to="/search">
                    <div class="search">
                    </div>
                  </router-link>
                </li>
                <li>
                    <router-link to="/shop/shopCart"  v-if="title=='商品详情'||title=='商品列表'">
                        <div class="head_cart">
                            <span class="cart_num" v-if="cartNum>99">99+</span>
                            <span class="cart_num" v-else-if="cartNum>0&&cartNum<=99">{{cartNum}}</span>
                        </div>
                    </router-link>
                </li>
                <li @click="couponCenter()" v-if="title=='我的优惠券'">
                    <div class="couponList">领券中心</div>
                </li>
                <li v-if="title=='领券中心'">
                    <router-link to="/coupon">
                      <div class="coupon">我的</div>
                    </router-link>
                </li>
                <li v-if="title=='选择单位抬头'">
                    <router-link to="/shop/editInvoice/0">
                        <div class="coupon">新增</div>
                    </router-link>
                </li>
                <li @click="insertFeedbackWithTx()" v-if="title=='意见反馈'">
                    <div class="coupon" style="color:#ff8546;">提交</div>
                </li>
                <li @click="deleteInvoice()" v-if="title=='编辑抬头'">
                  <div class="coupon">删除</div>
                </li>
                <li @click="selectElecInvoice()" v-if="elecType==1">
                  <div class="coupon">发送到邮箱</div>
                </li>

                <li @click="sendElecInvoice()" v-if="elecType==2">
                  <div class="coupon" style="color:#ff8546;">确定</div>
                </li>
                <li @click="scanCode" v-if="title=='购物车'">
                  <div class="scan"></div>
                </li>
                <li v-if="title=='以旧换新'">
                  <router-link to="/exchangeRule">
                    <div class="coupon">规则说明</div>
                  </router-link>

                </li>
          </ul>
    </div>

</template>

<script>
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import Cookie from '../../../config/mUtils';
    import {
      findCartItemSumByUserId,
      standardPayCancle,
      insertFeedbackWithTx,
      queryElecInvoice,
      findInvoiceOfPage,
      deleteInvoiceWithTx,
      getSign,
      findCouponUnitByUserOfPage,
      qrCodeVerifyValid
    } from '../../../api/getData';
    export default{

        data(){
            return {
                title:'',
                goodsType:1,
                cartNum:0,
                elecType:0,
                invoiceInfos:'',
                invoiceLength:'',
                headStyle:{
                   zIndex:2006
                },
                showTitle:false
            }
        },
        components: {

        },
        created (){
            this.title = this.$route.name;
            this.cartNum = this.$store.state.shopCartNum;
            if(this.title=='商品详情'||this.title=='商品列表'){
               // this.findCartItemSumByUserId();
            }
            if(this.title =='商品分类'){
              this.showTitle = true;
            }
        },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    this.title = curVal.name;
                    this.checkType(1);
                    if(this.title=='商品详情'||this.title=='商品列表'){
                        this.findCartItemSumByUserId();
                    }
                    if(this.title=='编辑发票'){
                      this.invoiceInfoId = this.$route.params.id;
                      if(this.invoiceInfoId==0){
                        this.title = '新增抬头';
                      }else if(this.invoiceInfoId>0){
                        this.title = '编辑抬头';
                        this.findInvoiceOfPage();
                      }
                    }

                    if(/\/shop\/elecInvoice1/.test(this.$route.path)){
                      this.elecType=1;
                      var elecInvoiceCode=this.$route.params.orderCode;
                      this.queryElecInvoice(elecInvoiceCode);
                    }else if(/\/shop\/elecInvoice2/.test(this.$route.path)){
                      this.elecType=2;
                    }else{
                      this.elecType=0;
                    }
                },
                deep:true
            },
            "$store.state.shopCartNum":{
                handler(curVal,oldVal){
                    this.cartNum = this.$store.state.shopCartNum;
                },
                deep:true
            },
            "$store.state.cardTitle": {
                handler(curVal,oldVal){
                    this.title = this.$store.state.cardTitle;
                },
                deep:true
            }
        },
        computed:{

        },
        methods:{
            //获取已有发票抬头
            async queryElecInvoice(orderCode) {
              try {
                const res = await queryElecInvoice({orderCode:orderCode});
                if (res.data.code == 0) {
                  this.invoiceInfos = res.data.data;
                  if(this.invoiceInfos&&this.invoiceInfos.length==0){
                    Toast("电子发票开具中,请耐心等待");
                    this.elecType=0;
                  }
                } else {
                  Toast("电子发票开具中,请耐心等待");
                  this.elecType=0;
                }
              } catch (err) {
                Toast(err);
              }
            },
            //删除抬头
            deleteInvoice(){
              var id = this.$route.params.id;
              MessageBox({
                title: '提示',
                message: '确定删除当前抬头？',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(action => {
                if(action=='confirm'){
                  this.deleteInvoiceWithTx(id);
                }else{

                }
              });
            },
            async deleteInvoiceWithTx(id){
              try {
                const res = await deleteInvoiceWithTx({id:id});
                if (res.data.code == 0) {
                  Toast('删除成功');

                  if(this.invoiceLength>1){
                    this.$router.push({path: '/shop/invoiceList/'+this.$store.state.invoiceForm});
                  }else{
                    this.$router.push({path: '/shop/orderInvoice'});
                  }

                } else {
                  Toast('删除失败');

                  if(this.invoiceLength>1){
                    this.$router.push({path: '/shop/invoiceList/0'+this.$store.state.invoiceForm});
                  }else{
                    this.$router.push({path: '/shop/orderInvoice'});
                  }
                }

              } catch (err) {
                Toast(err);
              }
            },
            routerBack(){
                if(this.$route.path == "/shop"){
                    this.$router.push('/home');
                }else if(this.$route.path == "/shop/order" || this.$route.path == "/shop/site"){
                    this.$router.push('/my');
                }else if(/\/shop\/orderDatails/.test(this.$route.path)){
                    this.$router.push('/shop/order');
                }else if(/\/shop\/pay/.test(this.$route.path)){
                    MessageBox({
                        title: '确定要放弃付款',
                        message: '订单创建后会保留30分钟，请尽快支付',
                        showCancelButton: true,
                        confirmButtonText: '确认离开',
                        cancelButtonText: '继续支付',
                    }).then(action => {
                        if(action=='confirm'){
                            this.standardPayCancle();
                        }
                    });
                }else if(this.$route.path.includes('shopCart')){
                      if(this.$store.state.Cookie.mutations.fetch('saveRouter')!="/home"){
                        if(this.$store.state.Cookie.mutations.fetch('saveRouter'=='/good')){
                          if(this.$store.state.Cookie.mutations.fetch('type')=='puc'){
                            this.$router.push('/home')
                            this.$store.state.Cookie.mutations.save('','type')
                          }else{
                            this.$router.go(-1);
                          }

                        }else{
                          this.$router.push('/home');
                        }
                        if(this.$store.state.Cookie.mutations.fetch('type')=='puc'){
                          this.$router.push('/home')
                        }
                      }else{
                        this.$router.push('/home');
                      }
                }else if(this.$route.path == "/idea"){
                      this.$router.push('/my');
                      window.location.reload()
                }else if(this.$route.path.includes('orderConfim')){
                    this.$store.state.Cookie.mutations.save('','isFb');
                    this.$store.state.Cookie.mutations.save('','siteId');
                    this.$store.dispatch("setUseCouponId",'');
                    if(this.$store.state.Cookie.mutations.fetch('type')=='puo'){
                      this.$router.push('/home')
                    }else{
                      this.$router.go(-1);
                    }
                }else if(this.$route.path.includes('cmsGoodsList')){
                  if(this.$store.state.Cookie.mutations.fetch('type')=='coupon_unit'){
                      this.$router.push('/coupon')
                  }else{
                    this.$router.go(-1);
                  }
                }else if(this.$route.path == "/coupon"){
                  this.$store.state.Cookie.mutations.save('','type');
                  this.$router.push('/my')
                }else if((/\/shop\/goods/.test(this.$route.path))||(/\/shop\/goods2/.test(this.$route.path))||(this.$route.path.includes('moreCredit'))||(this.$route.path.includes('card'))){
                  this.$store.state.Cookie.mutations.save(false,'fromScan')
                  if(!this.$store.state.Cookie.mutations.fetch('fromCmslist')){
                    this.$store.state.Cookie.mutations.save('','typeID');
                  }
                  if(this.$store.state.Cookie.mutations.fetch('type')=='coupon_unit'){
                    this.$router.push('/coupon')
                  }else{
                    this.$router.go(-1);
                  }
                }else{
                  if(window.history.length<=1){
                    this.$router.push('/home')
                  }else{
                    this.$router.go(-1);
                  }
                }
            },
            checkType(type){
                this.goodsType = type;
                this.$store.dispatch("setGoodsType",type);
            },
            //放弃支付
            async standardPayCancle() {
                try {
                    const res = await standardPayCancle({orderCode:this.$route.params.orderCode});

                    if (res.data.code == 0) {
                        this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                    } else if(res.data.code == 501){
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                      });
                    } else {
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                      });
                    }

                } catch (err) {
                    Toast(err);
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
            //      提交反馈
            async insertFeedbackWithTx() {
                try {
                    const res = await insertFeedbackWithTx({feedback:this.$store.state.feedback});
                    if (res.data.code == 0) {
                        Toast('提交反馈成功');
                        this.$store.dispatch('setFeedback','');
                        this.$router.go(-1);
                    } else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
              //去领券中心
            couponCenter(){
              // this.$store.state.Cookie.mutations.save('','typeID');
              this.$router.push('/couponList');
            },
            async findInvoiceOfPage() {
                try {
                    const res = await findInvoiceOfPage();
                    if (res.data.code == 0) {
                      this.invoiceInfos = res.data.data.list;
                      this.invoiceLength = res.data.data.list.length;
                    } else {
                      console.log("暂无发票信息");
                    }
                } catch (err) {
                  //  Toast(err);
                    console.log("暂无发票信息");
                }
            },
            selectElecInvoice(){
                this.$router.push('/shop/elecInvoice2/'+this.$route.params.orderCode);
            },

            sendElecInvoice(){
                this.$router.push('/shop/sendInvoice/');
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
                      // thtf.qrCodeVerifyValid(obj,res.resultStr);
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
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }

    .head{
        text-align:center;
        padding:0 px(20px);
        border-bottom:0.5px solid #f4f4f4;
        line-height:px(88px);
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
        /*font-weight:900;*/
    }

    ul{
        display: flex;
        display: -webkit-flex; /* Safari */
        justify-content:space-between;
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
    .coupon{
        position: absolute;
        top: 0px;
        right: px(24px);
        font-size: px(28px);
        color:#323232;
    }
    .couponList{
        position: absolute;
        top: 3px;
        right: px(24px);
        font-size: px(28px);
        color:#323232;
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
