<template>
    <div class="swipe">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="str in bannerGoodsData">
                    <img v-lazy="str.imgUrl+'?imageMogr2/size-limit/300k!'" style="width:100%;height:100%;" @click="linkSomewhere(str.linkUrl)">
                </div>
            </div>
            <div class="swiper-pagination swiper-pagination-white"></div>
        </div>
    </div>

</template>

<script>
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.min.css';
  export default{
        props: {
            bannerGoodsData: {
                default: function () {
                    return []
                }
            },
        },
        data(){
            return {

            }
        },
        mounted() {
        },
        methods:{
            swiperLoad(){
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    speed: 600,
                    autoplay: 3000,
                    onTouchEnd: function() {
                        swiper.startAutoplay()
                    }
                });
            },
          linkSomewhere(url){
              if(url){
                location.href=url;
              }
          }
		  }
    }
</script>

<style lang="scss">
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }

    .swiper-container{
        width:100%;
        height:100%;

    }
    .swipe{
    height: px(440px);
    color: #fff;
    font-size: 20px;
    .banner{
        height: 100%;
        width: 100%;
    }
    }
    .swiper-slide{
        background-size:cover;
    }
    .swiper-pagination-bullet {
        display: inline-block;
        width:px(10px);
        height: px(10px);
        background: #7c5e53;
    }
</style>
