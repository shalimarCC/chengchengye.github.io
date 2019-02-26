<template>
    <div id="success">
        <img src="../../../../static/assets/img/success.png">
        <p>付款成功!</p>
        <div class="success_btn">
            <router-link :to="'/shop/orderDatails/'+orderCode">
                <div class="btn order">查看订单</div>
            </router-link>

            <div class="btn home" @click="goBack()">返回首页</div>

        </div>
    </div>
</template>

<script>
    import Cookie from '../../../config/mUtils';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import MD5 from 'crypto-js/md5';
    export default{
        data(){
            return {
                orderCode:''
            }
        },

        watch:{

        },

        mounted() {

        },
        created(){
            this.orderCode = this.$route.params.orderCode;
        },
        methods:{
            goBack(){
                Cookie.mutations.closeWebView();
            }
        }
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }

    #success{
        width:100%;
        text-align:center;
        padding-top:px(60px);
    }

    img{
        width:px(280px);
        height:px(220px);
    }
    p{
        font-size: px(32px);
        color: #323232;
        margin-top:px(30px);
    }

    .success_btn{
        width:100%;
        display: flex;
        display: -webkit-flex; /* Safari */
        justify-content:space-around;
        margin-top:px(80px);
        .btn{
            width:px(280px);
            line-height:px(70px);
            text-align:center;

            border-radius: 5px;
            font-size:px(32px);
        }
        .home{
            background:#ff8546;
            color:#fff;
        }
        .order{
            border: 1px solid #969696;
        }
    }

</style>