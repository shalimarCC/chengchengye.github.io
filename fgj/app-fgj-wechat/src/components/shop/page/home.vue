<template>
    <div class="index">
		<my-head></my-head>
        <!--<div class="content" ref="wrapper" :style="'height:'+wrapperHeight+'px'">-->
        <div class="content" ref="wrapper" :style="contentStyle">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>

    </div>
</template>

<script>
	  import myHead from './head';
    import tabbar from '../page/tabbar';
    import {countFit} from "@/until";
    export default{

        data(){
            return {
                wrapperHeight: 0,
                contentStyle:{
                }
            }
        },
        created(){
          this.contentStyle.height = document.documentElement.clientHeight - 55+'px';
          if(this.$route.name=='购物车') {
            this.contentStyle.height = countFit(document.documentElement.clientHeight*2 - 110);
            this.contentStyle.paddingBottom = countFit(110);
          }
        },
        mounted() {
            // this.wrapperHeight = document.documentElement.clientHeight - $(this.$refs.wrapper).css("padding-top").replace("px","");
          // this.contentStyle.height = countFit(document.documentElement.clientHeight*2 - $(this.$refs.wrapper).css("padding-top").replace("px","")*2);
          // this.contentStyle.height = countFit(document.documentElement.clientHeight*2 - 88);
            if(this.$route.name=='购物车') {
              this.contentStyle.height = countFit(document.documentElement.clientHeight*2 - 110);
              this.contentStyle.paddingBottom = countFit(110);
            }
        },
        components: {
           'myHead':myHead,
           'tabbar':tabbar
        },
        methods:{

		   }
    }
</script>

<style lang="scss" scoped>
$baseWidth:750px;
@function px($val) {
    @return $val/$baseWidth*10+rem;
}
.content{
    width:100%;
    background:#fff;
    padding-top:px(88px);
    /*padding-bottom:px(110px);*/
    position: relative;
}
.page-loadmore-listitem {

    text-align: center;
}

.page-loadmore-listitem:first-child {
    border-top: 1px solid #eee;
}

.page-loadmore-wrapper {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
}
.cart_bottom{
    .mint-button-text{
        font-size:px(24px);
    }
    .mint-button{
        height:px(60px);
    }
}
</style>
