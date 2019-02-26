<template>
    <div id="order_list">
        <ul>
            <li v-for="order in orderData">
                <div class="order_head">
                    <p>订单号：{{order.orderCode}}</p><span>{{order.orderStatusStr}}</span>
                </div>

                <div class="order_goods clear" v-for="goods in order.goodsList">
                    <div class="goods_left">
                        <img v-lazy="goods.skuImage+'?imageMogr2/size-limit/500k!'">
                    </div>
                    <div class="goods_right">
                        <h4>{{goods.merchantProductName}}</h4><b>×{{goods.num}}</b>
                        <div class="goods_price">
                            <p>
                                <span>&yen;{{goods.price}}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="allGoods">
                    <span>共{{order.goodsAccount}}件商品</span>
                    <span>合计：&yen{{order.orderAmount}}</span>
                </div>

                <div class="orderBtn">
                    <div v-if="order.orderStatus == 0">
                        <mt-button size="small" plain>取消订单</mt-button>
                        <mt-button size="small" type="danger">去支付</mt-button>
                    </div>

                    <div v-if="order.orderStatus == 2">
                        <mt-button size="small" plain>查看物流</mt-button>
                        <mt-button size="small" type="danger">确认收货</mt-button>
                    </div>

                    <div v-if="order.orderStatus == 3">
                        <mt-button size="small" plain>查看物流</mt-button>
                        <mt-button size="small" plain>删除订单</mt-button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

    export default{
        props:{
            orderData: {
                type: Array,
                default: function () {
                    return []
                }
            },
        },
        data(){
            return {

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
@import "../../../style/component/other/orderList.scss";
</style>