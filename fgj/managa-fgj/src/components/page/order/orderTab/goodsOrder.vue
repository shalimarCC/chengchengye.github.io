<template>
    <div>
        <div style="padding:20px 100px;">
            <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row>

                <el-table-column align="center" label="子订单编号">
                    <template slot-scope="scope">
                        <span>{{scope.row.soChildId}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品PU编号">
                    <template slot-scope="scope">
                        <span>{{scope.row.productUnitSerialNumber}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品PU名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.puNameAndStandard}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="购买数量">
                    <template slot-scope="scope">
                        <span>x{{scope.row.puCount}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品单价">
                    <template slot-scope="scope">
                        <span>{{scope.row.price}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="平摊优惠券">
                    <template slot-scope="scope">
                        <span>{{scope.row.promotionAver}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="平摊门店优惠">
                    <template slot-scope="scope">
                        <span>{{scope.row.storeDiscountAver}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="平摊运费优惠">
                    <template slot-scope="scope">
                        <span>{{scope.row.deliveryFeeDiscountAver}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="平摊运费">
                    <template slot-scope="scope">
                        <span>{{scope.row.deliveryFeeAver}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="结算商品单价">
                    <template slot-scope="scope">
                        <span>{{scope.row.afterDiscountPriceAver}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品原价总额">
                    <template slot-scope="scope">
                        <span>{{scope.row.productAmount}}</span>
                    </template>
                </el-table-column>

                <!-- <el-table-column align="center" label="商品总额">
                    <template slot-scope="scope">
                        <span>{{scope.row.price*scope.row.puCount}}</span>
                    </template>
                </el-table-column> -->

                <el-table-column align="center" label="优惠前总额">
                    <template slot-scope="scope">
                        <span>{{scope.row.allAmount}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="优惠总额">
                    <template slot-scope="scope">
                        <span>{{scope.row.discount}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="结算总额">
                    <template slot-scope="scope">
                        <span>{{scope.row.amount}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="是否存在unit库存">
                    <template slot-scope="scope">
                        <span v-if="scope.row.unitExist==0">否</span>
                        <span v-else-if="scope.row.unitExist==1">是</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品加入购物车类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.cartType==1">正常品</span>
                        <span v-else-if="scope.row.cartType==2">赠品</span>
                        <span v-else-if="scope.row.cartType==3">换购品</span>
                        <span v-else-if="scope.row.cartType==4">实物券</span>
                    </template>
                </el-table-column>

            </el-table>
        </div>

    </div>
</template>
<script>
import {findAllSoItemBySoId} from '../../../../api/getData';
export default {

    data () {

        return {
            dataSource:[],
            listLoading:true,
            tableKey:1,
        }
    },
    created () {
        this.findAllSoItemBySoId();
    },
    components: {

    },
    computed: {
    },
    methods:{
        async findAllSoItemBySoId (){
            try {

                const res = await findAllSoItemBySoId({soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.dataSource = res.data.data.list;
                    this.listLoading = false;
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
         //时间戳转换
        setTime(time) {
            const t = new Date(time);
            let y = t.getFullYear();
            let m = t.getMonth() + 1;
            let d = t.getDate();
            let h = t.getHours();
            let f = t.getMinutes();
            let s = t.getSeconds();
            if (m < 10) {
                m = '0' + m
            }
            if (d < 10) {
                d = '0' + d
            }
            if (h < 10) {
                h = '0' + h
            }
            if (f < 10) {
                f = '0' + f
            }
            if (s < 10) {
                s = '0' + s
            }
            return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
        },
    }
}

</script>


<style scoped>

</style>