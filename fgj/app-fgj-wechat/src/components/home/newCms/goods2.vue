<template>
  <!--单行双商品-->
  <div class="goodslist" :style="goodsStyle" v-if="showList">
    <ul :style="ulStyle">
      <li v-for="info in suList.suComb"  @click="goodsSkip(info)" :style="liStyle">
        <div class="goods_img">
          <img :src="info.pictureUrl"  v-if="info.pictureUrl!=null" :style="imgStyle"/>
          <img src="../../../../static/assets/img/goods_error.png" :style="imgStyle" v-else alt="">
          <div class="logo logo1" v-show="info.saleWay==4"></div>
          <div class="logo logo2" v-show="info.saleWay==6"></div>
          <div class="operateByown1" v-if="info.isOwnMerchant"><img src="../../../../static/assets/img/own.png"></div>
        </div>
        <h6 :style="titleStyle">{{info.name}}</h6>
        <!--商品价格-->
        <p v-if="suList.showPrice==2||suList.showPrice==3">
          {{NumLittle(info.salePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.salePrice).num2}}
              </span>
          <span class="fubi">积分</span>
        </p>
        <!--pu价格-->
        <p v-if="suList.showPrice==4||suList.showPrice==5">
          {{NumLittle(info.puSalePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.puSalePrice).num2}}
              </span>
          <span class="fubi">积分</span>
        </p>
        <!--范围价格-->
        <p v-if="suList.showPrice==6||suList.showPrice==7">
          {{NumLittle(info.minSalePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.minSalePrice).num2}}
              </span>-{{NumLittle(info.maxSalePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.maxSalePrice).num2}}
              </span>
          <span class="fubi">积分</span>
        </p>
        <del v-if="suList.showPrice==2||suList.showPrice==4||suList.showPrice==6">
          &yen;{{info.marketPrice.toFixed(2)}}
        </del>
        <div class="shopCart" v-if="suList.showCart==2">加入购物车</div>
        <div class="shopCart" v-if="suList.showCart==3">立即购买</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {countFit} from '@/until'
    export default {
      props: {
        elementObj: {
          type: Object,
          default: function () {
            return {}
          }
        },
      },
        data(){
           return{
             showPrice:0,
             showCart:0,
             showList:true,
             suList:{},
             imgStyle:{
               width:240,
               height:240,
             },
             goodsStyle:{
               marginTop:10,
               marginBottom:10
             },
             ulStyle:{

             },
             liStyle:{
               marginLeft:20,
             },
             titleStyle:{
               width:0
             },
             num:1
           }
        },

      created(){
          this.suList = this.elementObj.config11;
          if(this.suList.suComb.length>0){
            this.showList = true;
            this.showPrice =this.suList.showPrice;
            this.showCart =this.suList.showCart;
          }

          if(this.suList.suComb.length>this.suList.showCount){
            this.suList.suComb = this.suList.suComb.slice(0,this.suList.showCount)
          }
          // if((this.suList.suComb.length/2)!=parseInt(this.suList.suComb.length/2)){
          //   this.num = parseInt(this.suList.suComb.length/2)+1;
          // }else{
          //   this.num = parseInt(this.suList.suComb.length/2);
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
          //组件配置
          this.goodsStyle.marginTop = countFit(this.suList.marginTop);
          this.goodsStyle.marginBottom = countFit(this.suList.ySpacing);
          // this.ulStyle = this.goodsStyle;
          // if(this.suList.showPrice!=1){
          //   this.goodsStyle.height = countFit(this.suList.suRowHeightWithPC*this.num);
          // }else{
          //   this.goodsStyle.height = countFit(this.suList.suRowHeightNoPC*this.num);
          // }
          this.goodsStyle.marginTop = countFit(this.suList.marginTop);
          this.goodsStyle.marginBottom = countFit(this.suList.ySpacing);
          //商品图配置
          // if(340-this.suList.suImgWidth>0){
          //   this.imgStyle.marginLeft = countFit((340-this.suList.suImgWidth)/2)
          // }
          this.imgStyle.width = countFit(this.suList.suImgWidth);
          this.imgStyle.height = countFit(this.suList.suImgHeight);

          this.liStyle.marginBottom = countFit(this.suList.ySpacing);
          this.liStyle.marginLeft = countFit(this.suList.xSpacing);
          this.liStyle.width = countFit(this.suList.suImgWidth);
          this.titleStyle.width = countFit(this.suList.suImgWidth)

        },
        methods:{
          goodsSkip(obj){
            this.$emit('goodsSkip',[obj]);
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
    /*padding:0 px(14px);*/
    ul{
      display: flex;
      display: -webkit-flex; /* Safari */
      flex-wrap:wrap;
      flex-direction: row;
      justify-content: flex-start;
      li{
        /*width:px(340px);*/
        /*padding-bottom:px(20px);*/
        /*margin-top:px(20px);*/
        background: #fff;
        .goods_img{
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
        h6{
          font-size:px(28px);
          color:#323232;
          /*margin-left:px(16px);*/
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height:px(52px);
          text-align: center;
        }
        p{
          margin-left:px(16px);
          font-size:px(26px);
          color:#ff8546;
          text-overflow:ellipsis;
          line-height:px(36px);
          text-align: center;
          .fubi{
            font-size: px(22px)
          }
        }
        del{
          margin-left:px(16px);
          font-size:px(20px);
          color:#969696;
          display:block;
          text-align: center;
        }
        .shopCart{
          text-align: center;
          font-size: px(22px);
          background: #ff8456;
          color: #fff;
          width:px(126px);
          //padding: 0 px(20px);
          line-height: px(36px);
          margin: px(10px) auto;
          border-radius: px(5px);
        }
      }
    }
  }

</style>
