<template>
    <div>
        <div style="padding:20px 100px;">
            <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" empty-text="此订单不含unit信息" border fit highlight-current-row>

                <el-table-column align="center" label="子订单编号">
                    <template slot-scope="scope">
                        <span>{{scope.row.childCode}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品PU编号">
                    <template slot-scope="scope">
                        <span>{{scope.row.puSn}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="卡号">
                    <template slot-scope="scope">
                        <span>{{scope.row.cardNo}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="卡密">
                    <template slot-scope="scope">
                        <span v-if="scope.row.passWord">********</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="链接">
                    <template slot-scope="scope">
                        <span v-if="scope.row.shortUrl">{{scope.row.shortUrl}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="开始时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.startTime}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="结束时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.endTime}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="分配时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.allocationTime}}</span>
                    </template>
                </el-table-column>

            </el-table>
        </div>

    </div>
</template>
<script>
import {findSoItemBySoIdAndUnit} from '../../../../api/getData';
export default {

    data () {

        return {
            listLoading:true,
            tableKey:1,
            dataSource:[]
        }
    },
    created () {
        this.findSoItemBySoIdAndUnit();
    },
    components: {

    },
    computed: {
    },
    methods:{
        async findSoItemBySoIdAndUnit (){
            try {

                const res = await findSoItemBySoIdAndUnit({soId:this.$route.params.orderId});

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