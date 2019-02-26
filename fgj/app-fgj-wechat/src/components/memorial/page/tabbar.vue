<template>
    <div id="tabbar" v-if="selected=='home'||selected=='shopCart'||selected=='other'">
        <router-link to="/" :class="{'active':selected=='home'}" class="tab-item">
            <i class="iconfont icon-home_light" v-if="selected!='home'"></i>
            <i class="iconfont icon-home_fill_light" v-else></i>
            <span>首页</span>
        </router-link>
        <router-link to="/shopCart" :class="{'active':selected=='shopCart'}" class="tab-item tab-cart">
            <b v-if="num>0">{{num}}</b>
            <i class="iconfont icon-cart_light" v-if="selected!='shopCart'"></i>
            <i class="iconfont icon-cart_fill_light" v-else></i>
            <span>购物车</span>
        </router-link>
        <router-link to="/other" :class="{'active':selected=='other'}" class="tab-item">
            <i class="iconfont icon-my_light" v-if="selected!='other'"></i>
            <i class="iconfont icon-my_fill_light" v-else></i>
            <span>我的</span>
        </router-link>

    </div>
</template>

<script>
  import {cartItemNumByUserId} from '../../../api/getData';
  import { Toast } from 'mint-ui';
  export default{

        data(){
            return {
                num:'',
                selected:'home'
            }
        },
        watch : {
            '$route': {
                handler(curVal,oldVal){
                    if(curVal.path == "/home"){
                        this.selected = 'home';
                        this.cartItemNumByUserId();
                    }else if(curVal.path == "/shopCart"){
                        this.selected = 'shopCart';
                        this.cartItemNumByUserId();
                    }else if(curVal.path == "/other"){
                        this.selected = 'other';
                    }else{
                        this.selected = curVal.path;
                    }
                },
                deep:true
            },
            '$store.state.cartNum': {
                handler(curVal,oldVal){
                    this.cartItemNumByUserId();
                }
            },
        },
        created(){
            this.cartItemNumByUserId();
            if(this.$route.path == "/home"){
                this.selected = 'home';
            }else if(this.$route.path == "/shopCart"){
                this.selected = 'shopCart';
            }else if(this.$route.path == "/other"){
                this.selected = 'other';
            }else{
                this.selected = this.$route.path;
            }
        },
        methods:{
            async cartItemNumByUserId() {
                try {
                    const res = await cartItemNumByUserId();
                    if (res.data.code == 0) {
                        if(res.data.data>99){
                            this.num = "99+"
                        }else{
                            this.num = res.data.data;
                        }
                    } else {


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

    }
    .tab-item{
        display: block;
        padding: px(24px) 0 px(10px) 0;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        text-decoration: none;
        font-size:px(30px);
        i{
            display:block;
            font-size:px(40px);
        }
        span{
            font-size:px(20px);
        }
    }
    .tab-cart{
        position:relative;
        b{
            display:block;
            position:absolute;
            background:#ff8546;
            line-height:px(36px);
            font-size:px(24px);
            color:#Fff;
            padding:0 px(12px);
            border-radius:px(15px);
            left:px(132px);
            top:px(10px);
        }
    }
    .active{
        color:#ff8546;
    }
</style>