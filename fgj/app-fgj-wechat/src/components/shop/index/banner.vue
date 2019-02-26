<template>
    <div class="swipe">
        <div class="swiper-container">
            <div class="swiper-wrapper">

                    <div class="swiper-slide" v-for="str in bannerList" :style="{ backgroundImage: 'url(' + str.pictureUrl + ')' }"><router-link :to="'/shop/goods/0/'+str.standardUnitId"></router-link></div>

            </div>
            <div class="swiper-pagination swiper-pagination-white"></div>
        </div>
    </div>
</template>

<script>
  import Swiper from 'swiper';
  import {findBannerAll} from '../../../api/getData';
  import 'swiper/dist/css/swiper.min.css';
  import { Toast } from 'mint-ui';
  export default{

        data(){
            return {
                bannerList:[],
            }
        },
        created(){
            this.findBannerAll();
        },
        mounted() {

        },
        methods:{
            //获取banner列表
            async findBannerAll() {
                try {
                    const res = await findBannerAll({location:2});

                    if (res.data.code == 0) {
                        this.bannerList = res.data.data;
                        this.$nextTick(() => {
                            var swiper = new Swiper('.swiper-container', {
                                pagination: '.swiper-pagination',
                                paginationClickable: true,
                                loop: true,
                                speed: 800,
                                autoplay: 1000,
                                onTouchEnd: function() {
                                    swiper.startAutoplay()
                                }
                            });
                        })


                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                     Toast('网络错误');
                }
            },
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
        height: px(360px);
        color: #fff;
        font-size: 20px;
        .banner{
            height: 100%;
            width: 100%;
        }
        .swiper-slide{
            background-size:cover;
            a{
                display:block;
                width:100%;
                height:100%;
            }
        }
        .swiper-pagination-bullet {
            display: inline-block;
            width:px(12px);
            height: px(12px);

        }
        .swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{
            margin:0 3px;
        }
    }




</style>
