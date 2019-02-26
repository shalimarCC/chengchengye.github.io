<template>
    <div style="padding:20px 100px;min-width:400px;">
        <el-table :key='tableKey' :data="financeData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="操作订单编号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="订单编号">
                <template slot-scope="scope">
                    <span>{{scope.row.childCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="用户名">
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="用户备注">
                <template slot-scope="scope">
                    <span>{{scope.row.userRemark}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="运营备注">
                <template slot-scope="scope">
                    <span>{{scope.row.operateRemark}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作时间">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.updateTime)}}</span>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>
<script>
import {customerServices} from '../../../../api/getData';
export default {

    data () {

        return {
            listLoading:true,
            tableKey:1,
            financeData:[]
        }
    },
    created () {
        this.customerServices();
    },
    components: {

    },
    computed: {
    },
    methods:{
        async customerServices (){
            try {

                const res = await customerServices({orderId:this.$route.params.orderId});

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