<template>
    <div id="tabbar" v-if="selected=='home'||selected=='app'||selected=='my'">
        <div :class="{'active':selected=='home'}" class="tab-item" @click="shopSkip">
            <i class="shop_check tab_icon" v-if="selected=='home'"></i>
            <i class="shop tab_icon" v-else></i>
            <span>商城</span>
        </div>
        <div :class="{'active':selected=='app'}" class="tab-item tab-cart" @click="appSkip" v-if="showApp">
            <i class="app_check tab_icon" v-if="selected=='app'"></i>
            <i class="app tab_icon" v-else></i>
            <span>应用</span>
        </div>
        <div :class="{'active':selected=='my'}" class="tab-item"  @click="mySkip">
            <i class="my_check tab_icon" v-if="selected=='my'"></i>
            <i class="my tab_icon" v-else></i>
            <span>我的</span>
        </div>

    </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  export default{

        data(){
            return {
                selected:'app',
                showApp:true
            }
        },
        watch : {
            '$route': {
            },

        },
        created(){
            if(this.$store.state.Cookie.mutations.fetch('companyName')=='福管加电子商务平台'){
              this.showApp = false;
            }
            if(this.$route.path == "/home"){
                this.selected = 'home';
            }else if(this.$route.path == "/app"){
                this.selected = 'app';
            }else if(this.$route.path == "/my"){
                this.selected = 'my';
            }else{
                // this.selected = curVal.path;
            }
        },
        methods:{
            appSkip(){
                MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {

                });
            },
            mySkip(){
                this.$router.push('/my');
            },
            shopSkip(){
                this.$router.push('/home');
            },
        }
    }
</script>

<style lang="scss">
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    #tabbar{
        background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-position: top left;
        position: relative;
        background-color: #fafafa;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        right: 0;
        bottom: 0;
        left: 0;
        position: fixed;
        text-align: center;
        z-index:999;
    }
    .tab-item{
        padding: px(12px) 0 px(8px) 0;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        text-decoration: none;
        font-size:px(30px);
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        flex-wrap:wrap;
        justify-content:center;
        span{
            font-size:px(22px);
            color:#969696;
            width:100%;
            margin-top:px(10px);
        }
    }

    .active{
        span{
            color:#ff8546;
        }
    }


    .tab_icon{
        width:px(48px);
        height:px(48px);
        background-size:100%;
    }
    .shop_check{
        background-image:url(../../../../static/assets/img/shop_check.png);
    }
    .shop{
        background-image:url(../../../../static/assets/img/shop.png);
    }
    .app_check{
        background-image:url(../../../../static/assets/img/app_check.png);
    }
    .app{
        background-image:url(../../../../static/assets/img/app.png);
    }
    .my_check{
        background-image:url(../../../../static/assets/img/my_check.png);
    }
    .my{
        background-image:url(../../../../static/assets/img/my.png);
    }
</style>
