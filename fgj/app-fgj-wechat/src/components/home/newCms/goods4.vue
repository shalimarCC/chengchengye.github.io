<template>
  <!--单行单商品-->
    <div class="goodslist" v-if="showGoods" :style="goodsStyle">
      <ul class="clear">
        <li v-for="info in suList.suComb" @click="goodsSkip(info)" :style="liStyle">
          <div class="goods_img">
            <img :src="info.pictureUrl"  v-if="info.pictureUrl!=null" :style="imgStyle"/>
            <img src="../../../../static/assets/img/goods_error.png" style="border:1px solid #fff" v-else alt="">
            <div class="logo logo1" v-show="info.saleWay==4"></div>
            <div class="logo logo2" v-show="info.saleWay==6"></div>
            <div class="operateByown1" v-if="info.isOwnMerchant"><img src="../../../../static/assets/img/own.png"></div>
          </div>
          <div class="goods_font">
            <h6>{{info.name}}</h6>
            <div class="goodsPrice" >
              <p v-if="suList.showPrice==2||suList.showPrice==3">
                {{NumLittle(info.salePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.salePrice).num2}}
              </span>
                <span class="fubi">积分</span>
              </p>
              <p v-if="suList.showPrice==4||suList.showPrice==5">
                {{NumLittle(info.puSalePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.puSalePrice).num2}}
              </span>
                <span class="fubi">积分</span>
              </p>
              <p v-if="suList.showPrice==6||suList.showPrice==7">
                {{NumLittle(info.minSalePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.minSalePrice).num2}}
              </span>-{{NumLittle(info.maxSalePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.maxSalePrice).num2}}
              </span>
                <span class="fubi">积分</span>
              </p>
              <del v-if="suList.showPrice==2||suList.showPrice==4||suList.showPrice==6">&yen;{{info.marketPrice.toFixed(2)}}</del>
            </div>
          </div>
          <div class="shopCart" v-if="suList.showCart==2">加入购物车</div>
          <div class="shopCart" v-if="suList.showCart==3">立即购买</div>
        </li>
      </ul>
    </div>
</template>

<script>
  import {countFit} from '@/until'
  export default{
    props: {
      elementObj: {
        type: Object,
        default: function () {
          return {}
        }
      },
    },
    data(){
      return {
        suList:{
        },
        imgStyle:{
          width:240,
          height:240,
        },
        goodsStyle:{
          height: 380,
          marginTop:10,
          marginBottom:10
        },
        liStyle:{
          marginRight:20,
          marginLeft:20,
        },
        showGoods:false
      }
    },
    mounted(){
      this.suList = this.elementObj.config11;
      if(this.suList.suComb.length>this.suList.showCount){
        this.suList.suComb = this.suList.suComb.slice(0,this.suList.showCount)
      }
      if(this.suList.suComb.length>0){
        this.showGoods = true;
      }
      //组件配置
      // if(this.suList.showPrice!=1){
      //   this.goodsStyle.height = countFit(this.suList.suRowHeightWithPC*this.suList.suComb.length);
      // }else{
      //   this.goodsStyle.height = countFit(this.suList.suRowHeightNoPC*this.suList.suComb.length);
      // }
      if(this.suList.backgroundType==1){ //颜色
        this.goodsStyle.background = this.suList.backgroundRGB;
      }else if(this.suList.backgroundType==2){ //透明
        this.goodsStyle.background ='rgba(0,0,0,0)'
      }else if(this.suList.backgroundType==3){ //图片
        this.goodsStyle.background = 'url('+this.suList.backgroundImgUrl+')';
        this.goodsStyle.backgroundSize='100% 100%';
        this.goodsStyle.backgroundRepeat='no-repeat';
      }
      this.goodsStyle.marginTop = countFit(this.suList.marginTop);
      this.goodsStyle.marginBottom = countFit(this.suList.ySpacing);
      //商品图配置
      this.imgStyle.width = countFit(this.suList.suImgWidth);
      this.imgStyle.height = countFit(this.suList.suImgHeight);

      this.liStyle.marginRight = countFit(this.suList.xSpacing);
      this.liStyle.marginLeft = countFit(this.suList.xSpacing);
      this.liStyle.marginBottom = countFit(this.suList.ySpacing);
      this.liStyle.height = countFit(this.suList.suRowHeightWithPC);
    },
    methods:{
      linkSkip(obj){
        this.$emit('linkSkip',[obj]);
      },
      goodsSkip(obj){
        console.log(obj)
        this.$emit('goodsSkip',[obj]);
      },
      goodsMore(){
        this.$emit('goodsMore',[this.instId]);
      },
      NumLittle(num){
        let  obj= new Object();
        num = num.toFixed(2);
        obj.num1 = parseInt(num); //整数部分
        obj.num2 = num-obj.num1;  //小数部分
        if(obj.num2==0){
          obj.num2= '00';
        }else{
          obj.num2 = obj.num2.toFixed(2)*100
        }
        return obj;
      }
    }
  }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  .goodslist{
    /*background:#f4f4f4;*/
    ul{
      width:100%;
      li{
        border-bottom:1px solid #f4f4f4;
        background:#fff;
        width:100%;
        height:px(260px);
        display: flex;
        display: -webkit-flex; /* Safari */
        position: relative;
        .goods_img{
          width:px(340px);
          height:px(260px);
          position:relative;
          .logo {
            position: absolute;
            left: 0;
            bottom: 0;
            width: px(80px);
            height: px(80px);
          }
          .logo1 {
            background-image: url('../../../../static/assets/img/cms/sale@2x.png');
            background-size: 100%;
          }
          .logo2 {
            background-image: url('../../../../static/assets/img/cms/VIP@2x.png');
            background-size: 100%;
          }
          .operateByown1{
            position: absolute;
            top:px(-36px);
            left:px(4px);
            img{
              width: px(56px);
              height:px(28px)
            }
          }
          img{
            width:100%;
            height:100%;
          }
        }
        .goods_font{
          width:px(452px);
          margin:0 px(24px);
        }
        h6{
          margin-top:px(20px);
          font-size:px(28px);
          color:#323232;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height:px(44px);
          height:px(88px);
          margin-bottom: px(70px);
        }
        .shopCart{
          position: absolute;
          right:px(20px);
          bottom:px(14px);
          text-align: center;
          font-size: px(22px);
          background: #ff8456;
          color: #fff;
          width:px(126px);
          //padding: 0 px(20px);
          line-height: px(36px);
          margin: 0 auto px(20px);
          border-radius: px(5px);
        }
        .goodsPrice{
          position: absolute;
          bottom:px(24px);
          margin-left: px(15px);
        }
        p{
          font-size:px(26px);
          color:#ff8546;
          text-overflow:ellipsis;
          line-height:px(48px);
          .fubi{
            font-size: px(22px)
          }
        }
        del{
          font-size:px(20px);
          color:#969696;
          display:block;
        }
      }
    }
  }


</style>
