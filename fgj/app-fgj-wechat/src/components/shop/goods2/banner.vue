<template>
  <!--<div class="swipe">-->
  <!--<div class="swiper-container">-->
  <!--<div class="swiper-wrapper">-->
  <!--<div class="swiper-slide" v-for="str in bannerGoodsData">-->
  <!--<img v-lazy="str+'?imageMogr2/size-limit/300k!'" style="width:100%;height:100%;">-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="swiper-pagination swiper-pagination-white"></div>-->
  <!--</div>-->
  <!--</div>-->
  <div class="swipe2">
    <swiper ref="mySwiper">
      <swiper-slide v-for="(info,key) in bannerGoodsData" :key="key">
        <img v-lazy="info+'?imageMogr2/size-limit/300k!'" :key="key" style="width:100%;height:100%;">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.min.css';
  export default{
    props: {
      bannerGoodsData: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    data(){
      return {
        swiperOption: {
          loop: true,
          speed: 600,
          // autoplay: 5000,
          autoplay: true,
          effect: 'coverflow',
          pagination: '.swiper-pagination',
          paginationClickable: true,
        }
      }
    },
    mounted() {

    },
    methods:{
      // swiperLoad(){
      //     var swiper = new Swiper('.swiper-container', {
      //         pagination: '.swiper-pagination',
      //         paginationClickable: true,
      //         speed: 600,
      //         autoplay: 3000,
      //         onTouchEnd: function() {
      //             swiper.startAutoplay()
      //         }
      //     });
      // }
    }
  }
</script>

<style lang="scss" >
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  .swiper-container{
    width:100%;
    height:100%;
    background:#fff;
  }
  .swipe2{
    height: px(440px);
    color: #fff;
    font-size: 20px;
    .banner{
      height: 100%;
      width: 100%;
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
