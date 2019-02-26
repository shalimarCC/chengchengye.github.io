<template>
    <!--单行左右滑动-->
      <div class="goodslist" v-if="showGoods" :style="goodsStyle">
        <ul>
          <li v-for="info in goodsList.suComb" @click="goodsSkip(info)" :style="liStyle">
            <div class="goods_img">
              <img :src="info.pictureUrl"  v-if="info.pictureUrl!=null" :style="imgStyle"/>
              <img src="../../../../static/assets/img/goods_error.png" style="border:1px solid #fff" v-else alt="">
              <div class="logo logo1" v-show="info.saleWay==4"></div>
              <div class="logo logo2" v-show="info.saleWay==6"></div>
              <div class="operateByown1" v-if="info.isOwnMerchant"><img src="../../../../static/assets/img/own.png"></div>
            </div>
            <h6 :style="titleStyle">{{info.name}}</h6>
            <!--商品价格-->
            <p v-if="goodsList.showPrice==2||goodsList.showPrice==3">
              {{NumLittle(info.salePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.salePrice).num2}}
              </span>
              <span class="fubi">积分</span>
            </p>
            <!--pu价格-->
            <p v-if="goodsList.showPrice==4||goodsList.showPrice==5">
              {{NumLittle(info.puSalePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.puSalePrice).num2}}
              </span>
              <span class="fubi">积分</span>
            </p>
            <!--范围价格-->
            <p v-if="goodsList.showPrice==6||goodsList.showPrice==7">
              {{NumLittle(info.minSalePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.minSalePrice).num2}}
              </span>-{{NumLittle(info.maxSalePrice).num1+'.'}}<span style="font-size:12px">{{NumLittle(info.maxSalePrice).num2}}
              </span>
              <span class="fubi">积分</span>
            </p>
            <del v-if="goodsList.showPrice==2||goodsList.showPrice==4||goodsList.showPrice==6">&yen;{{info.marketPrice.toFixed(2)}}</del>
            <div class="shopCart" v-if="goodsList.showCart==2">加入购物车</div>
            <div class="shopCart" v-if="goodsList.showCart==3">立即购买</div>
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
            goodsList:{},
            imgStyle:{
              width:240,
              height:240,
            },
            goodsStyle:{
              // height: 380,
              marginTop:10,
              marginBottom:10
            },
            liStyle:{
              marginLeft:20,
              width:200
            },
            titleStyle:{
              width:0
            },
            showGoods:false
          }
        },
        created(){
            this.goodsList = this.elementObj.config11;
            if(this.goodsList.suComb.length>this.goodsList.showCount){
              this.goodsList.suComb = this.goodsList.suComb.slice(0,this.goodsList.showCount)
            }
            if(this.goodsList.suComb.length>0){
              this.showGoods = true;
            }
            //组件配置
            // if(this.goodsList.showPrice!=1){
            //   this.goodsStyle.height = countFit(this.goodsList.suRowHeightWithPC);
            // }else{
            //   this.goodsStyle.height = countFit(this.goodsList.suRowHeightNoPC);
            // }
            if(this.goodsList.backgroundType==1){ //颜色
              this.goodsStyle.background = this.goodsList.backgroundRGB;
            }else if(this.goodsList.backgroundType==2){ //透明
              this.goodsStyle.background ='rgba(0,0,0,0)'
            }else if(this.goodsList.backgroundType==3){ //图片
              this.goodsStyle.background = 'url('+this.goodsList.backgroundImgUrl+')';
              this.goodsStyle.backgroundSize='100% 100%';
              this.goodsStyle.backgroundRepeat='no-repeat';
            }
            this.goodsStyle.marginTop = countFit(this.goodsList.marginTop);
            this.goodsStyle.marginBottom = countFit(this.goodsList.ySpacing);
            //商品图配置
            this.imgStyle.width = countFit(this.goodsList.suImgWidth);
            this.imgStyle.height = countFit(this.goodsList.suImgHeight);

            this.titleStyle.width = countFit(this.goodsList.suImgWidth)
            this.liStyle.marginLeft = countFit(this.goodsList.xSpacing);
            this.liStyle.width = countFit(this.goodsList.suImgWidth);
            // if(this.goodsList.showCart==1){
            //   this.liStyle.height = countFit(this.goodsList.suRowHeightNoPC);
            // }else{
            //   this.liStyle.height = countFit(this.goodsList.suRowHeightWithPC);
            // }

        },
        methods:{
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
          },
          goodsSkip(obj){
            this.$emit('goodsSkip',[obj]);
          },
        }
    }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  .goodslist{
    /*background:#fff;*/
    overflow:hidden;
    /*padding:0 px(14px);*/
    padding-top:px(20px);
    ul{
      overflow-x: auto;
      white-space: nowrap;
      display: flex;
      /*height:px(400px);*/
      li{
        background: #fff;
        /*margin:0 px(10px);*/
        /*width:px(240px);*/
        .goods_img{
          position:relative;
          .logo {
            position: absolute;
            left: 0px;
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
          img{
            width:100%;
            height:100%;
          }
          .operateByown1{
            position: absolute;
            top:px(-30px);
            left:px(4px);
            img{
              width: px(56px);
              height:px(28px)
            }
          }
        }
        h6{
          font-size:px(28px);
          color:#323232;
          width:px(240px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height:px(55px);
          text-align: center;
        }
        p{
          font-size:px(26px);
          color:#ff8546;
          width:px(240px);
          text-overflow:ellipsis;
          line-height:px(36px);
          text-align: center;
          .fubi{
            font-size: px(22px)
          }
        }
        del{
          text-align: center;
          font-size:px(20px);
          color:#969696;
          display:block;
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
  ul::-webkit-scrollbar{
    display: none;
  }


</style>
