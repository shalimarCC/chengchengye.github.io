<template>
    <div style="padding:20px 100px;min-width:400px;">
        <el-table :key='tableKey' :data="financeData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="流水编号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="订单编号">
                <template slot-scope="scope">
                    <span>{{scope.row.orderCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span v-if="scope.row.operate==0">拆单</span>
                    <span v-else-if="scope.row.operate==1">分拣</span>
                    <span v-else-if="scope.row.operate==2">开票</span>
                    <span v-else-if="scope.row.operate==3">发货</span>
                    <span v-else-if="scope.row.operate==4">签收导入</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作人">
                <template slot-scope="scope">
                    <span>{{scope.row.operatorName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作时间">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.creatTime)}}</span>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>
<script>
import {soOpFlow} from '../../../../api/getData';
export default {

    data () {

        return {
            listLoading:true,
            tableKey:1,
            financeData:[]
        }
    },
    created () {
        this.soOpFlow();
    },
    components: {

    },
    computed: {
    },
    methods:{
        async soOpFlow (){
            try {

                const res = await soOpFlow({orderId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.financeData = res.data.data.list;
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
            if(time!=""&&time!=null){
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
            }else{
                return ''
            }

        },
    }
}

</script>


<style scoped>

</style>