<template>
    <div class="index">
		<my-head></my-head>
        <div class="content" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
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
    export default{

        data(){
            return {
                wrapperHeight: 0,
            }
        },
        created(){

        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
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
    overflow:hidden;
    background:#fff;
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