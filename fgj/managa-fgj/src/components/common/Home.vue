<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <v-head-top></v-head-top>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar1.vue';
    import vHeadTop from './headerTop.vue';
    export default {
        components:{
            vHead, vSidebar,vHeadTop
        }
    }
</script>
