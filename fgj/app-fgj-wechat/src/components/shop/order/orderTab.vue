<template>
    <div id="order">
        <ul class="nav" ref="wrapper">
            <li v-for="nav in navList" @click="navClick(nav.key)" :class="{'active':navCheck==nav.key}">{{nav.value}}</li>
        </ul>
        <div v-if="orderShow" :style="{ height: wrapperHeight + 'px' }" class="page-loadmore-wrapper">
            <order-list ref="order" :order-data="orderData" v-on:navClick="navClick" v-on:openPopop="openPopop" :navCheck="navCheck" :loading="loading" v-on:findOrderByUserAndStatus="findOrderByUserAndStatus"></order-list>
        </div>
        <div class="order_error" v-else>
            <img src="../../../../static/assets/img/error/order_error.png">
            <p>还没有相关的订单呢</p>
        </div>

        <mt-popup
        v-model="popupVisible"
        position="bottom" class="mint-popup-4" :closeOnClickModal="false">
            <pay-key :order-code="orderCode" v-if="popupVisible" v-on:closePopop="closePopop"></pay-key>
        </mt-popup>
    </div>
</template>

<script>
    import {findOrderByUserAndStatus} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import orderList from './orderList';
    import payKey from '../orderpay/payKey';
    export default{

        data(){
            return {
                navList:[
                    {
                        value:'全部',
                        key:-99
                    },
                    {
                        value:'待付款',
                        key:0
                    },
                    {
                        value:'已付款',
                        key:1
                    },
                    {
                        value:'已发货',
                        key:2
                    },
                    {
                        value:'已完成',
                        key:4
                    }
                ],
                navCheck:-99,
                pageNo:1,
                pageSize:10,
                orderData:[],
                orderShow:false,
                loading:false,
                wrapperHeight: 0,
                popupVisible:false,
                orderCode:'',
            }
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - $(".nav").height();
        },
		components: {
            orderList,payKey
        },
        watch:{

        },
        created(){
            this.navClick(-99);
        },
        methods:{
            navClick(key){
                this.navCheck = key;
                this.pageNo = 1;
                this.orderData = [];
                this.loading = true;
                Indicator.open();
                this.findOrderByUserAndStatus();
            },
            async findOrderByUserAndStatus(){
                try {
                    this.loading = true;
                    const res = await findOrderByUserAndStatus({orderStatus:this.navCheck,pageNo:this.pageNo,pageSize:this.pageSize});
                    if (res.data.code == 0) {
                        if(res.data.data.list.length == 0){
                            this.loading = true;
                            if(this.pageNo == 1){
                                this.orderShow = false;
                            }
                        }else{
                            var thtf = this;
                            $.each(res.data.data.list,function(key,info){
                                thtf.orderData.push(info);
                            })
                            this.pageNo++;
                            this.orderShow = true;
                            this.loading = false;
                        }
                        Indicator.close();
                    } else {
                        Indicator.close();
                        Toast(res.data.error);
                    }
                } catch (err) {
                    Indicator.close();
                     Toast('网络错误');
                }
            },

            //关闭键盘
            closePopop(){
                this.popupVisible = false;
            },
            //打开键盘
            openPopop(){
                this.orderCode = this.$refs.order.orderCode;
                this.popupVisible = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/order/order.scss";
</style>
