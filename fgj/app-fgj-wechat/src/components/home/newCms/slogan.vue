<template>
   <div class="slogan" :style="sloganStyle">
     <ul :style="ulStyle">
       <li v-for="info in iconObj.sloganList"  @click="linkSkip(info.link)" :style="info.iconStyle">
         <img :src="info.icon" :style="iconImg"/>
         <p :style="info.iconSize">{{info.text}}</p>
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
          iconObj: {},
          sloganStyle:{
            marginTop:10,
            background:'',
            backgroundSize:'',
            backgroundRepeat:''
          },
          ulStyle:{

          },
          iconStyle:{
            height:68,
            lineHeight:68
          },
          iconImg:{
            width: 28,
            height: 28
          }
        }
      },
      mounted(){
        this.iconObj = this.elementObj.config9;
        //组件配置
        this.sloganStyle.marginTop = countFit(this.iconObj.marginTop);
        if(this.iconObj.backgroundType==1){ //颜色
          this.sloganStyle.background = this.iconObj.backgroundRGB;
        }else if(this.iconObj.backgroundType==2){ //透明
          this.sloganStyle.background ='rgba(0,0,0,0)'
        }else if(this.iconObj.backgroundType==3){ //图片
          this.sloganStyle.background = 'url('+this.iconObj.backgroundImgUrl+')';
          this.sloganStyle.backgroundSize='100% 100%';
          this.sloganStyle.backgroundRepeat='no-repeat';
        }
        this.iconStyle.height = countFit(this.iconObj.totalHeight)
        this.iconStyle.lineHeight = countFit(this.iconObj.totalHeight)
        this.iconStyle.marginRight = countFit(this.iconObj.margin)
        this.iconImg.width = countFit(this.iconObj.iconHeight)
        this.iconImg.height = countFit(this.iconObj.iconHeight)
        var _this = this;
        $.each(this.iconObj.sloganList,function (key,info) {
          let iconObj = new Object();
          let iconStyle = new Object();
          iconObj.fontSize = countFit(info.fontSize);
          info.iconSize = iconObj;

          iconStyle.height = countFit(_this.iconObj.totalHeight)
          iconStyle.lineHeight = countFit(_this.iconObj.totalHeight)
          iconStyle.marginRight = countFit(_this.iconObj.margin)
          if(key == (_this.iconObj.sloganList.length-1)){ //最后一个右边距
            iconStyle.marginRight =0;
          }
          info.iconStyle = iconStyle;
        })
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
  .slogan{
    display: flex;
    ul{
      display: flex;
      display: -webkit-flex; /* Safari */
      margin: 0 auto;
      /*flex-wrap: nowrap;*/
      li{
        display: flex;
        flex-direction: row;
        align-items: center;
        /*flex-wrap: nowrap;*/
        p{
          font-size:px(26px);
          color:#323232;
          margin-left: px(14px);
          width: max-content;
        }
      }
      li:last-child{
        margin-right: 0;
      }
    }
  }
</style>
