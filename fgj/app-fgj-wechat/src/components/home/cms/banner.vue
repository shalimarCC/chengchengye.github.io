<template>
    <!--<div class="swipe1" :style="'margin-top:'+elementObj.instMargin/750*10+'rem'">-->
        <!--<div class="swiper-container">-->
            <!--<div class="swiper-wrapper">-->
                <!--<div class="swiper-slide" v-for="(info,key) in bannerGoodsData" :key="key" @click="linkSkip(info)">-->
                    <!--<img :src="info.imgUrl+'?imageMogr2/size-limit/300k!'" :key="key" style="width:100%;height:100%;">-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="swiper-pagination swiper-pagination-white"></div>-->
        <!--</div>-->
    <!--</div>-->
    <!--<div class="swipe1" :style="'margin-top:'+elementObj.instMargin/750*10+'rem'">-->
    <div class="swipe1" :style="'margin-top:'+elementObj.instMargin/750*10+'rem'">
        <swiper ref="mySwiper">
            <swiper-slide v-for="(info,key) in bannerGoodsData" :key="key">
                <img v-lazy="info.imgUrl+'?imageMogr2/size-limit/300k!'" :key="key"  @click="linkSkip(info)" style="width:100%;height:100%;">
            </swiper-slide>
          <!--<div class="swiper-pagination swiper-pagination-white" slot="pagination"></div>-->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
  import 'swiper/dist/css/swiper.min.css';
  import { Toast } from 'mint-ui';
  import {instContent} from '../../../api/getData';
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
                bannerGoodsData:[],
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
        created() {
            // this.instContent();
          this.bannerGoodsData = this.elementObj.inst.bannerList;
        },
        mounted() {
        },
        methods:{
            async instContent() {
                try {
                    const res = await instContent({elementId:this.elementObj.elementId,instId:this.elementObj.instId});

                    if (res.data.code == 0) {
                        this.bannerGoodsData = res.data.data.inst.bannerList;
                        this.$nextTick(() => {
                            // var swiper = new Swiper('.swiper-container', {
                            //     pagination: '.swiper-pagination',
                            //     paginationClickable: true,
                            //     speed: 600,
                            //     autoplay: 5000,
                            //     // loop: true,
                            // });
                        })
                    } else {

                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            linkSkip(obj){
                this.$emit('linkSkip',[obj]);
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
        background:#fff;
    }
    .swipe1{
      width: 100%;
      height: px(320px);
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
</style>
