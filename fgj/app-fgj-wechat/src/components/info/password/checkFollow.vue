<template>
    <div class="checkFollow" :style="checkHeight">
      <img src="../../../../static/assets/img/checkPro.png" class="check" v-if="showPro==3">
      <img src="../../../../static/assets/img/checkUat.png" class="check" v-if="showPro==2">
      <img src="../../../../static/assets/img/checkTest.png" class="check" v-if="showPro==1">
      <!--<img src="../../../../static/assets/img/delete.png" class="delete" @click="delete">-->
    </div>
</template>

<script>
  import { baseUrl } from '../../../config/env.js'
  import { Toast } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import {
    sendCouponUnitWithTx,
    checkIsFollow
  } from '../../../api/getData';
    export default {
        data(){
          return{
             checkUrl:'../../../../static/assets/img/checkPro.png',
             checkHeight:{
               height:0
             },
            showPro:3
          }
        },
        created(){
            this.checkHeight.height = document.documentElement.clientHeight+'px';
            if(baseUrl.includes('www.51fugj.net')){
              //预生产
              this.showPro =2;
            }else if(baseUrl.includes('www.51fugj.com')){
              //生产环境
              this.showPro =3;
            }else if(baseUrl.includes('192.168.0.57')||baseUrl.includes('2221q0482d.iok.la')){
              this.showPro =1;
              //测试环境
            }else{
              //开发环境 获取不到链接
              // this.$router.push('/home');
            }
            // this.checkIsFollow()
        },
        methods:{
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
                  }
                }else{
                  Toast({
                    message:'请关注福管加微信公众号',
                    duration:2000
                  });
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
                  if(item.couponType==1){
                    this.$router.push('/cmsGoodsList/'+item.goodsId+'/2/'+item.cmsPageId+'/1');
                  }else{
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
          delete(){
            this.$router.push('/home')
          }
        }
    }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
.checkFollow{
  width: 100%;
  background: #333;
  position: relative;
}
.check{
  display: block;
  margin:0 auto;
  width: 90%;
  padding-top: 30%;
}
.delete{
  width:px(40px);
  height: px(40px);
  position: absolute;
  top: px(40px);
  right: px(40px);
}
</style>
