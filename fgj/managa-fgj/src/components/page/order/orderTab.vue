<template>
  <el-tabs v-model="activeNameOrder" type="card">
    <el-tab-pane label="基本信息" name="first">
        <basic-order v-if="activeNameOrder == 'first'"></basic-order>
    </el-tab-pane>

    <el-tab-pane label="子订单信息" name="branchOrder">
        <branch-order v-if="activeNameOrder == 'branchOrder'"></branch-order>
    </el-tab-pane>

    <el-tab-pane label="第三方订单" name="thirdpartyOrder">
        <thirdparty-order v-if="activeNameOrder == 'thirdpartyOrder'"></thirdparty-order>
    </el-tab-pane>

    <el-tab-pane label="收货信息" name="siteOrder" v-if="showSite==1">
        <site-order v-if="activeNameOrder == 'siteOrder'"></site-order>
    </el-tab-pane>

    <el-tab-pane label="发票信息" name="invoiceOrder">
        <invoice-order v-if="activeNameOrder == 'invoiceOrder'"></invoice-order>
    </el-tab-pane>

    <el-tab-pane label="商品列表" name="goodsOrder">
        <goods-order v-if="activeNameOrder == 'goodsOrder'"></goods-order>
    </el-tab-pane>

    <el-tab-pane label="unit列表" name="unitOrder">
        <unit-order v-if="activeNameOrder == 'unitOrder'"></unit-order>
    </el-tab-pane>

    <el-tab-pane label="财务信息" name="financeOrder">
        <finance-order v-if="activeNameOrder == 'financeOrder'"></finance-order>
    </el-tab-pane>

    <el-tab-pane label="物流信息" name="logisticsOrder">
        <logistics-order v-if="activeNameOrder == 'logisticsOrder'"></logistics-order>
    </el-tab-pane>

    <el-tab-pane label="客服与售后信息" name="serviceOrder">
        <service-order v-if="activeNameOrder == 'serviceOrder'"></service-order>
    </el-tab-pane>

    <el-tab-pane label="查看操作记录流水" name="recordOrder">
        <record-order v-if="activeNameOrder == 'recordOrder'"></record-order>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import {findOrderDetail} from '../../../api/getData';
  import basicOrder  from './orderTab/basicOrder.vue';
  import branchOrder  from './orderTab/branchOrder.vue';
  import invoiceOrder  from './orderTab/invoiceOrder.vue';
  import financeOrder  from './orderTab/financeOrder.vue';
  import siteOrder  from './orderTab/siteOrder.vue';
  import goodsOrder  from './orderTab/goodsOrder.vue';
  import unitOrder  from './orderTab/unitOrder.vue';
  import logisticsOrder  from './orderTab/logisticsOrder.vue';
  import serviceOrder  from './orderTab/serviceOrder.vue';
  import recordOrder  from './orderTab/recordOrder.vue';
  import thirdpartyOrder from './orderTab/thirdparty.vue';
  export default {
    data() {
      return {
        activeNameOrder: '',
        flag1:false,
        showSite:1
      };
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                let str = curVal.path;
                str = str.substring(0,12)


                if(str == "/orderDetail"){
                    Object.assign(this.$data, this.$options.data())
                    this.activeNameOrder = 'first';
                }

　　　　　　 },
            deep:true
        }

    },
    components: {
        basicOrder,branchOrder,invoiceOrder,financeOrder,siteOrder,goodsOrder,unitOrder,logisticsOrder,serviceOrder,recordOrder,thirdpartyOrder
    },
    created () {
        this.activeNameOrder = 'first';
        this.findOrderDetail();
    },
    methods: {
        async findOrderDetail (){
            try {

                const res = await findOrderDetail({soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.showSite = res.data.data.isShowAddr;

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },

    }
  };
</script>

<style scoped>
#example {
    padding: 10px 20px;
    text-align:center;
}


</style>