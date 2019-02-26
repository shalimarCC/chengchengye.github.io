<template>
  <!--三 Banner 左右立式组件-->
  <div :style="bannerStyle" >
    <!--左立式-->
    <div class="imgtext1" :style="imgstyle1" v-if="imgtextObj.style==1">
      <div class="imgtext1_l">
        <img :src="imgtextObj.verticalBanner.imgUrl" :style="imgtext1_l"  @click="linkSkip(imgtextObj.verticalBanner.link)">
      </div>
      <div class="imgtext1_r">
        <img :src="imgtextObj.sideUpBanner.imgUrl" :style="imgtext1_up" @click="linkSkip(imgtextObj.sideUpBanner.link)">
        <img :src="imgtextObj.sideDownBanner.imgUrl" :style="imgtext1_down" @click="linkSkip(imgtextObj.sideDownBanner.link)">
      </div>
    </div>
    <!--右立式-->
    <div class="imgtext2" :style="imgstyle2" v-if="imgtextObj.style==2">
      <div class="imgtext2_l" :style="imgtext2_l">
        <img :src="imgtextObj.sideUpBanner.imgUrl" :style="imgtext2_up" @click="linkSkip(imgtextObj.sideUpBanner.link)">
        <img :src="imgtextObj.sideDownBanner.imgUrl" :style="imgtext2_down" @click="linkSkip(imgtextObj.sideDownBanner.link)">
      </div>
      <div class="imgtext2_r">
        <img :src="imgtextObj.verticalBanner.imgUrl" :style="imgtext2_r" @click="linkSkip(imgtextObj.verticalBanner.link)">
      </div>
    </div>
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
            imgtextObj:{},
            imgstyle1:{
              height: 500,
              paddingLeft:10,
              paddingRight:10,
              background:'',
              backgroundSize:'',
              backgroundRepeat:''
            },
            imgstyle2:{
              height: 500
            },
            bannerStyle:{
              marginTop:20,
            },
            imgtext1_up:{
              width: 238,
              height:400,
              borderRadius:0,
              marginBottom:10,

            },
            imgtext1_down:{
              width: 238,
              height:400,
              borderRadius:0,
            },
            imgtext2_l:{
              marginLeft:0
            },
            imgtext2_up:{
              width: 238,
              height:400,
              borderRadius:0,
            },
            imgtext2_down:{
              width: 238,
              height:400,
              borderRadius:0,
            },
            imgtext1_l:{
              width:0,
              height:0,
              borderRadius:0,
              marginRight:10
            },
            imgtext2_r:{
              width:100,
              height:100,
              borderRadius:0,
              marginLeft:10
            },
            allWidth:''
          }
        },
        mounted(){
          this.imgtextObj = this.elementObj.config12;
          this.bannerStyle.marginTop = countFit(this.imgtextObj.marginTop);
          this.imgtext2_r.borderRadius = countFit(this.imgtext2_r.borderRadius);
          this.allWidth = parseInt(this.imgtextObj.sideUpBanner.width)+
            parseInt(this.imgtextObj.verticalBanner.width)+
            parseInt(this.imgtextObj.ySpacing)+
            parseInt(this.imgtextObj.sidePadding);
          //组件高度
          if(this.allWidth<750){
            this.imgstyle1.width = countFit(this.allWidth);
            this.bannerStyle.display = 'flex';
            this.bannerStyle.justifyContent = 'center'
          }
          this.imgstyle1.height = countFit(this.imgtextObj.totalHeight);
          this.imgstyle1.paddingLeft = countFit(this.imgtextObj.sidePadding);
          this.imgstyle1.paddingRight = countFit(this.imgtextObj.sidePadding);
          // this.imgstyle2.height =  this.imgstyle1.height;
          if(this.imgtextObj.backgroundType==1){ //颜色
            this.imgstyle1.background = this.imgtextObj.backgroundRGB;
          }else if(this.imgtextObj.backgroundType==2){ //透明
            this.imgstyle1.background ='rgba(0,0,0,0)'
          }else if(this.imgtextObj.backgroundType==3){ //图片
            this.imgstyle1.background = 'url('+this.imgtextObj.backgroundImgUrl+')';
            this.imgstyle1.backgroundSize='100% 100%';
            this.imgstyle1.backgroundRepeat='no-repeat';
          }
          this.imgstyle2 = this.imgstyle1;
          //上
          this.imgtext1_up.width = countFit(this.imgtextObj.sideUpBanner.width);
          this.imgtext1_up.height = countFit(this.imgtextObj.sideUpBanner.height);
          this.imgtext1_up.marginBottom = countFit(this.imgtextObj.ySpacing);
          if(this.imgtextObj.sideUpBanner.borderRadiusCheckBox==1){
            this.imgtext1_up.borderRadius = countFit(this.imgtextObj.sideUpBanner.borderRadius);
          }
          this.imgtext2_up = this.imgtext1_up;
          //下
          this.imgtext1_down.width = countFit(this.imgtextObj.sideDownBanner.width);
          this.imgtext1_down.height = countFit(this.imgtextObj.sideDownBanner.height);
          if(this.imgtextObj.sideDownBanner.borderRadiusCheckBox==1){
            this.imgtext1_up.borderRadius = countFit(this.imgtextObj.sideDownBanner.borderRadius);
          }
          this.imgtext2_down = this.imgtext1_down;
          //立式
          this.imgtext2_r.width =countFit(this.imgtextObj.verticalBanner.width)
          this.imgtext2_r.height =countFit(this.imgtextObj.verticalBanner.height)
          this.imgtext2_r.marginLeft =countFit(this.imgtextObj.xSpacing)
          this.imgtext2_l.width =countFit(this.imgtextObj.sideUpBanner.width)
          // this.imgtext2_l.marginLeft =countFit(this.imgtextObj.xSpacing)
          if(this.imgtextObj.verticalBanner.borderRadiusCheckBox==1){
            this.imgtext1_up.borderRadius = countFit(this.imgtextObj.verticalBanner.borderRadius);
          }
          this.imgtext1_l.width = this.imgtext2_r.width;
          this.imgtext1_l.height = this.imgtext2_r.height;
          this.imgtext1_l.marginRight = this.imgtext2_r.marginLeft

        },
        methods:{
          linkSkip(obj){
            this.$emit('linkSkip',[obj]);
          },
        }
    }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  .element{
    display: flex;
    align-items: center;
  }
  .imgtext1{
    display: flex;
    display: -webkit-flex; /* Safari */
    align-items: center;
    .imgtext1_l{
      img{
        width:100%;
        height:100%;
        display: block;
        vertical-align: top;
      }
    }
    .imgtext1_r{
      display: flex;
      display: -webkit-flex; /* Safari */
      align-content:flex-start;
      flex-wrap:wrap;
      img{
        width:100%;
        display: block;
        vertical-align: top;
      }
    }
  }
  .imgtext2{
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content: flex-start;
    align-items: center;
    .imgtext2_l{
      display: flex;
      display: -webkit-flex; /* Safari */
      align-content:flex-start;
      flex-wrap:wrap;
      img{
        width:100%;
        display: block;
        vertical-align: top;
      }
    }
    .imgtext2_r{
      img{
        width:100%;
        height:100%;
        display: block;
        vertical-align: top;
      }
    }
  }
</style>
