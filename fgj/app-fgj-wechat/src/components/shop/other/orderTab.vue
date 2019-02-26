<template>
    <div id="order">
        <ul class="nav">
            <li v-for="nav in navList" @click="navClick(nav.key)" :class="{'active':navCheck==nav.key}">{{nav.value}}</li>

        </ul>
        <order-list :order-data="orderData" v-if="orderShow"></order-list>
    </div>
</template>

<script>
    import {findOrderByUserAndStatus} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import orderList from './orderList';
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
                        value:'待发货',
                        key:1
                    },
                    {
                        value:'已发货',
                        key:2
                    },
                    {
                        value:'已完成',
                        key:3
                    }
                ],
                navCheck:-99,
                pageNo:1,
                pageSize:10,
                orderData:[],
                orderShow:false,
            }
        },
		    components: {
            orderList
        },
        watch:{

        },
        created(){
            this.findOrderByUserAndStatus();
        },
        methods:{
            navClick(key){
                this.navCheck = key;
                this.findOrderByUserAndStatus();
            },
            async findOrderByUserAndStatus(){
                try {
                    const res = await findOrderByUserAndStatus({orderStatus:this.navCheck,pageNo:this.pageNo,pageSize:this.pageSize});
                    if (res.data.code == 0) {
                        this.orderData = res.data.data.list;
                        this.orderShow = true;
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/other/order.scss";
</style>
