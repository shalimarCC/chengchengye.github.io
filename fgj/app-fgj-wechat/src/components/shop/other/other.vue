<template>
    <div id="other">
        <ul>
            <li>
                <router-link to="/order">
                    <p>
                        <i class="iconfont icon-form_light"></i>
                        <span>我的订单</span>
                    </p>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </li>
            <li>
                <router-link to="/site">
                    <p>
                        <i class="iconfont icon-location_light"></i>
                        <span>地址管理</span>
                    </p>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </li>
            <li>
                <router-link to="/about">
                    <p>
                        <i class="iconfont icon-service_light"></i>
                        <span>客服中心</span>
                    </p>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default{

        data(){
            return {
                selected:"other",
            }
        },
		components: {

        },
        watch:{

        },
        created(){

        },
        methods:{


		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/other/other.scss";
</style>