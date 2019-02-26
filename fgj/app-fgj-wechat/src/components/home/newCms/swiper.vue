<template>
    <div class="swiperConfig">
      <!--最左轮播-->
      <ul v-if="item.bannerListSort==1" :style="elementStyle" class="swiperContent">
        <li :style="liStyle">
          <div class="swipeBanner" style="width:100%;height:100%">
            <swiper ref="mySwiper" class="swiper" style="width:100%;height:100%">
              <swiper-slide v-for="(info,key) in item.bannerList" :key="key">
                <img :style="liStyle" v-lazy="info.imgUrl+'?imageMogr2/size-limit/300k!'" :key="key"  @click="linkSkip(info)">
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination" v-if="item.bannerList.length>1"></div>
            </swiper>
          </div>
        </li>
        <li v-for="ban in item.banner" :style="bannerStyle" v-if="item.style!=0" @click="linkSkip(ban.link)">
          <img :src="ban.imgUrl" :style="ban.bannerImg">
        </li>
      </ul>
      <!--夹心轮播-->
      <ul v-if="item.bannerListSort==2" :style="elementStyle" class="swiperContent">
        <li :style="bannerStyle" v-if="item.style!=0" @click="linkSkip(item.banner[0].link)">
          <img :src="item.banner[0].imgUrl" :style="item.banner[0].bannerImg">
        </li>
        <li :style="liStyle">
          <div class="swipeBanner" style="height:100%">
            <swiper ref="mySwiper" class="swiper" style="height:100%">
              <swiper-slide v-for="(info,key) in item.bannerList" :key="key">
                <img :style="liStyle" v-lazy="info.imgUrl+'?imageMogr2/size-limit/300k!'" :key="key"  @click="linkSkip(info)" style="width:100%;height:100%;">
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination" v-if="item.bannerList.length>1"></div>
            </swiper>
          </div>
        </li>
        <li v-if="item.banner.length>1&&item.style!=0" @click="linkSkip(item.banner[1].link)">
          <img :src="item.banner[1].imgUrl" :style="item.banner[1].bannerImg">
        </li>
      </ul>
      <!--右轮播-->
      <ul v-if="item.bannerListSort==3" :style="elementStyle" class="swiperContent">
        <li v-for="ban in item.banner" :style="bannerStyle" v-if="item.style!=0" @click="linkSkip(ban.link)">
          <img :src="ban.imgUrl" :style="ban.bannerImg">
        </li>
        <li :style="liStyle">
          <div class="swipeBanner" style="height:100%">
            <swiper ref="mySwiper" class="swiper" style="height:100%">
              <swiper-slide v-for="(info,key) in item.bannerList" :key="key">
                <img :style="liStyle" v-lazy="info.imgUrl+'?imageMogr2/size-limit/300k!'" :key="key"  @click="linkSkip(info)" style="width:100%;height:100%;">
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination" v-if="item.bannerList.length>1"></div>
            </swiper>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
  import 'swiper/dist/css/swiper.min.css';
  import {countFit} from '@/until';
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
                item:{},
                swiperOption: {
                  // loop: true,
                  // speed: 600,
                  // autoplay: 5000,
                  // autoplay: true,
                  effect: 'coverflow',
                  pagination: '.swiper-pagination',
                  paginationClickable: true,
                },
                elementStyle:{
                  marginTop:10,
                  paddingLeft:0,
                  paddingRight:0,
                  height:0,
                  background:'',
                  backgroundSize:'',
                  backgroundRepeat:''
                },
                bannerImg:{
                  width:'',
                  borderRadius:'',
                },
                liStyle:{
                  width: 750,
                  marginRight:0,
                },
                bannerStyle:{
                  marginRight:10
                },
                totalWidth:'',
                aspect:''
            }
        },
        created() {
          var _this = this;
          this.item = this.elementObj.config8;
          //组件配置
          if(this.item.backgroundType==1){ //颜色
            this.elementStyle.background = this.item.backgroundRGB;
          }else if(this.item.backgroundType==2){ //透明
            this.elementStyle.background ='rgba(0,0,0,0)'
          }else if(this.item.backgroundType==3){ //图片
            this.elementStyle.background = 'url('+this.item.backgroundImgUrl+')';
            this.elementStyle.backgroundSize='100% 100%';
            this.elementStyle.backgroundRepeat='no-repeat';
          }
          this.elementStyle.paddingLeft = countFit(this.item.paddingSide);
          this.elementStyle.paddingRight = countFit(this.item.paddingSide);
          this.elementStyle.height = countFit(this.item.totalHeight);
          this.elementStyle.marginTop = countFit(this.item.marginTop);
          if(this.item.style==0){ //纯轮播
            if(this.item.bannerListWidth>750){
              this.aspect = this.item.bannerListWidth/750;
              this.liStyle.width = countFit(this.item.bannerListWidth/this.aspect);
              this.liStyle.height = countFit(this.item.totalHeight/this.aspect);
              this.liStyle.marginRight =  countFit(this.item.paddingLeftRight/this.aspect);
              this.elementStyle.paddingLeft = countFit(this.item.paddingSide/this.aspect);
              this.elementStyle.paddingRight = countFit(this.item.paddingSide/this.aspect);
            }else{
              //轮播图配置
              this.liStyle.width = countFit(this.item.bannerListWidth)
              this.liStyle.height = countFit(this.item.totalHeight)
              this.liStyle.marginRight =  countFit(this.item.paddingLeftRight)
              //banner配置
              if(this.item.banner){
                $.each(this.item.banner,function (key,info) {
                  let bannerImg = new Object();
                  if(info.borderRadiusCheckBox==1){
                    bannerImg.borderRadius = countFit(info.borderRadius);
                  }
                  bannerImg.width = countFit(info.width);
                  info.bannerImg = bannerImg;
                });
              }
            }
          }else if(this.item.style==1){ //单加轮播
            if((parseInt(this.item.bannerListWidth)+parseInt(this.item.banner[0].width)+this.item.paddingSide*2+parseInt(this.item.paddingLeftRight))>750){
              this.aspect = (parseInt(this.item.bannerListWidth)+parseInt(this.item.banner[0].width)+this.item.paddingSide*2+parseInt(this.item.paddingLeftRight))/750;
              this.liStyle.width = countFit(this.item.bannerListWidth/this.aspect);
              this.liStyle.height = countFit(this.item.totalHeight)
              this.liStyle.marginRight =  countFit(this.item.paddingLeftRight/this.aspect)
              //banner配置
              if(this.item.banner){
                $.each(this.item.banner,function (key,info) {
                  let bannerImg = new Object();
                  if(info.borderRadiusCheckBox==1){
                    bannerImg.borderRadius = countFit(info.borderRadius);
                  }
                  bannerImg.width = countFit(info.width/_this.aspect);
                  bannerImg.height = countFit(_this.item.totalHeight);
                  info.bannerImg = bannerImg;
                });
              }
              this.elementStyle.paddingLeft = countFit(this.item.paddingSide/this.aspect);
              this.elementStyle.paddingRight = countFit(this.item.paddingSide/this.aspect);
            }else{
              //轮播图配置
              this.liStyle.width = countFit(this.item.bannerListWidth)
              this.liStyle.height = countFit(this.item.totalHeight)
              this.liStyle.marginRight =  countFit(this.item.paddingLeftRight)
              //banner配置
              if(this.item.banner){
                $.each(this.item.banner,function (key,info) {
                  let bannerImg = new Object();
                  if(info.borderRadiusCheckBox==1){
                    bannerImg.borderRadius = countFit(info.borderRadius);
                  }
                  bannerImg.width = countFit(info.width);
                  bannerImg.marginRight = countFit(_this.item.paddingLeftRight);
                  info.bannerImg = bannerImg;
                });
              }
            }
          }else if(this.item.style==2){ //双图加轮播
            console.log((parseInt(this.item.bannerListWidth)+parseInt(this.item.banner[0].width)+parseInt(this.item.banner[1].width)+this.item.paddingSide*2+parseInt(this.item.paddingLeftRight)*2))
            if((parseInt(this.item.bannerListWidth)+parseInt(this.item.banner[0].width)+parseInt(this.item.banner[1].width)+this.item.paddingSide*2+parseInt(this.item.paddingLeftRight)*2)>750){

              this.aspect = (parseInt(this.item.bannerListWidth)+parseInt(this.item.banner[0].width)+parseInt(this.item.banner[1].width)+this.item.paddingSide*2+parseInt(this.item.paddingLeftRight)*2)/750;
              this.liStyle.width = countFit(this.item.bannerListWidth/this.aspect);
              this.liStyle.height = countFit(this.item.totalHeight)
              this.liStyle.marginRight =  countFit(this.item.paddingLeftRight/this.aspect)
              //banner配置
              if(this.item.banner){
                $.each(this.item.banner,function (key,info) {
                  let bannerImg = new Object();
                  if(info.borderRadiusCheckBox==1){
                    bannerImg.borderRadius = countFit(info.borderRadius);
                  }
                  bannerImg.width = countFit(info.width/_this.aspect);
                  bannerImg.height = countFit(_this.item.totalHeight);
                  info.bannerImg = bannerImg;
                });
              }
              //banner和轮播图间距
              this.bannerStyle.marginRight =countFit(this.item.paddingLeftRight/_this.aspect);
              this.bannerStyle.marginLeft =countFit(this.item.paddingLeftRight/_this.aspect);
              this.elementStyle.paddingLeft = countFit(this.item.paddingSide/this.aspect);
              this.elementStyle.paddingRight = countFit(this.item.paddingSide/this.aspect);
            }else{
              //轮播图配置
              this.liStyle.width = countFit(this.item.bannerListWidth);
              this.liStyle.height = countFit(this.item.totalHeight);
              this.liStyle.marginRight =  countFit(this.item.paddingLeftRight);
              //banner配置
              if(this.item.banner){
                $.each(this.item.banner,function (key,info) {
                  let bannerImg = new Object();
                  if(info.borderRadiusCheckBox==1){
                    bannerImg.borderRadius = countFit(info.borderRadius);
                  }
                  bannerImg.width = countFit(info.width);
                  bannerImg.marginRight = countFit(_this.item.paddingLeftRight);
                  info.bannerImg = bannerImg;
                });
              }
            }
          }
          //轮播图配置
          // this.liStyle.width = countFit(this.item.bannerListWidth)
          // this.liStyle.height = countFit(this.item.totalHeight)
          // this.liStyle.marginRight =  countFit(this.item.paddingLeftRight)
          // var _this = this;
          // //banner配置
          // if(this.item.banner){
          //   $.each(this.item.banner,function (key,info) {
          //     let bannerImg = new Object();
          //     if(info.borderRadiusCheckBox==1){
          //       bannerImg.borderRadius = countFit(info.borderRadius);
          //     }
          //     bannerImg.width = countFit(info.width);
          //     info.bannerImg = bannerImg;
          //   });
          // }
          if(this.item.bannerList.length==1){ //一个的时候不能滑
            this.liStyle.pointerEvents = 'none';
          }

        },
        mounted() {
        },
        methods:{
            linkSkip(obj){
                this.$emit('linkSkip',[obj]);
            },
		    }
    }
</script>

<style lang="scss">
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    .swiperConfig{
      ul{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        overflow-y: hidden;
        overflow-x: hidden;
        li{
          height: 100%;
          img{
            height: 100%;
          }
        }
      }
      .swipeBanner{
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 20px;

      }
      .swiper{
        height: 100%;
      }
      .swiper-slide{
        background-size:cover;
      }
      .swiper-pagination-bullet {
        display: inline-block;
        width:px(16px);
        height: px(10px);
        background: #fff;
        opacity: 1;
      }
      .swiper-pagination-bullet-active{
        width:px(10px);
        height: px(10px);
        background: #ff8546;
      }
    }


</style>
