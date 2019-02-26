<template>
    <div class="index  page-loadmore-wrapper">
        <div class="index_wrapper">
            <banner></banner>
            <div class="banner_footer"><img src="../../../../static/assets/img/banner_footer.png"></div>
            <goods-list></goods-list>
        </div>
    </div>
</template>

<script>
    import banner from './banner';
    import goodsList from './goodsList';
    export default{

        data(){
            return {
                selected:'home'
            }
        },

        components: {
          'banner':banner,
                'goodsList':goodsList
        },
        mounted() {

        },
        methods:{

		}
    }
</script>

<style lang="scss" scoped>
 @import "../../../style/component/index/index.scss";
</style>
