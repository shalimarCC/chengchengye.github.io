<template>
    <div class="titleBar">
      <div class="title" :style="titleSize">
        <!--标题居中-->
        <h3 :style="titleStyle">
          <!--默认显示短横-->
          <b v-if="item.showTitleCheckBox==1&&item.titleStyle==1"></b>
          <!--显示配置图标-->
          <img v-if="item.showTitleCheckBox==1&&(item.titleStyle==2||item.titleStyle==3)" :src="item.leftIcon" class="titleImg">
          {{item.titleContent}}
          <b v-if="item.showTitleCheckBox==1&&item.titleStyle==1"></b>
          <img v-if="item.showTitleCheckBox==1&&(item.titleStyle==2||item.titleStyle==3)" :src="item.rightIcon">
          <!--显示更多-->
          <!--更多居右的情况，position定位的-->
          <span
            :class="[item.moreStyle==1||item.moreStyle==3||item.moreStyle==5?'more closeTitle':'more']"
            :style="moreSize"
            v-if="item.showMoreCheckBox==1&&(item.moreStyle==0||item.moreStyle==2||item.moreStyle==4)"
            @click="linkSkip(item.link)"
          >
            <em v-if="item.moreStyle==0||item.moreStyle==1||item.moreStyle==2||item.moreStyle==3" style="padding: 0 5px">{{item.moreText}}</em>
            <i class="iconfont icon-more" v-if="item.moreStyle==0&&!item.moreIcon"></i>
            <img class="configImg" v-if="item.moreStyle==1||item.moreStyle==4||item.moreStyle==5" :src="item.moreIcon">
          </span>
          <!--标题居左且更多紧靠标题-->
          <span
            class="left_more"
            :style="moreSize"
            v-if="item.showMoreCheckBox==1&&(item.moreStyle==1||item.moreStyle==3||item.moreStyle==5)"
            @click="linkSkip(item.link)"
          >
           <em v-if="item.moreStyle==0||item.moreStyle==1||item.moreStyle==2||item.moreStyle==3">{{item.moreText}}</em>
            <i class="iconfont icon-more" v-if="item.moreStyle==0"></i>
            <img class="configImg" v-if="item.moreStyle==1||item.moreStyle==4||item.moreStyle==5" :src="item.moreIcon">
          </span>
        </h3>
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
          item:{},
          titleSize:{
            fontSize:28,
            height:88,
            marginTop:10,
            background:'',
            backgroundSize:'',
            backgroundRepeat:''
          },
          titleStyle:{
            justifyContent:'center'
          },
          moreSize:{
            fontSize:28,
          },
        }
      },
      mounted(){
        this.item = this.elementObj.config6;
        if(this.item.titleStyle==6){   //居右
          this.titleStyle.justifyContent ='flex-end'
          // this.titleStyle.marginRight ='8px'
        }else if(this.item.titleStyle==4||this.item.titleStyle==3){//居左
          this.titleStyle.justifyContent ='flex-start'
        }else{
          this.titleStyle.justifyContent ='center';
        }
        if(this.item.backgroundType==1){ //颜色
          this.titleSize.background = this.item.backgroundRGB;
        }else if(this.item.backgroundType==2){ //透明
          this.titleSize.background ='rgba(0,0,0,0)'
        }else if(this.item.backgroundType==3){ //图片
          this.titleSize.background = 'url('+this.item.backgroundImgUrl+')';
          this.titleSize.backgroundSize='100% 100%';
          this.titleSize.backgroundRepeat='no-repeat';
        }

        this.titleSize.marginTop = countFit(this.item.marginTop);
        //标题字体大小
        this.titleSize.fontSize = countFit(this.item.titleFontSize);
        //标题栏高度
        this.titleSize.height = countFit(this.item.titleHight);
        //更多字体大小
        this.moreSize.fontSize = countFit(this.item.moreFontSize);
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
  /*.titleBar{*/
    /*padding: 0 px(24px);*/
  /*}*/
  .title{
    width:100%;
    /*background:#Fff;*/
    position:relative;
    display: flex;
    justify-content:center;
    align-items:center;
    h3{
      width:100%;
      text-align:center;
      font-weight:100;
      color:#323232;
      display: inline-flex;
      /*justify-content:center;*/
      align-items:center;
      b{
        margin:0 px(40px);
        border-top:px(4px) solid #ff8546;
        width:px(60px);
      }
      img{
        width: px(60px);
        height: px(60px);
        margin: 0 px(20px);
      }

      .left_more{
        font-weight:100;
        color:#b3b3b3;
        margin-left: px(20px);
        em{
          font-style: normal;
        }
        img{
          width:px(32px);
          height: px(32px);
          vertical-align: middle;
          margin-left: px(5px);
          margin-bottom: 2px;
        }
      }
    }
    .more{
      /*position:absolute;*/
      /*right:px(24px);*/
      /*line-height:px(88px);*/
      font-weight:100;
      color:#b3b3b3;
      em{
        font-style: normal;
      }
      i{
        font-size:px(28px);
        font-weight:100;
        color:#b3b3b3;
      }
      .configImg{
        width:px(32px);
        height: px(32px);
        vertical-align: middle;
        margin-left: px(5px);
        margin-bottom: 2px;
      }
    }
    .closeTitle{
      right: px(70px)
    }
  }
</style>
