<template>
    <div>
        <div class="success" v-show="couponResult==0">
            <img src="../../../../static/assets/img/success1.png">
            <p>兑换成功</p>
            <div class="success_btn">
                <router-link :to="'/shop/orderDatails/'+orderCode">
                    <div class="btn order">查看订单</div>
                </router-link>

                <div class="btn home" @click="goBack()">返回首页</div>

            </div>
        </div>

        <div class="success" v-show="couponResult==190||couponResult==191">
            <img src="../../../../static/assets/img/fail.png">
            <p v-show="couponResult==190">该兑换券已失效</p>
            <p v-show="couponResult==191">该商品库存不足</p>
            <div class="success_btn">
                <div class="btn home back" @click="goCoupon()">返回我的兑换券</div>
            </div>
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
                orderCode:'',
                couponResult:190,
                storeId:'',
            }
        },

        watch:{
        },

        mounted() {

        },
        created(){
            this.orderCode = this.$store.state.Cookie.mutations.fetch('couponOrderCode');
            this.couponResult = this.$store.state.Cookie.mutations.fetch('couponResult');
        },
        methods:{
            goBack(){
                this.$router.push('/home');
            },

            goCoupon(){
                this.$router.push('/coupon');
            },
        }
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }

    .success{
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
        .back{
            width:px(702px);
        }
    }

</style>
