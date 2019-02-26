<template>
    <div style="padding:20px 100px;min-width:400px;">
        <el-table :key='tableKey' :data="financeData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="子订单编号">
                <template slot-scope="scope">
                    <span>{{scope.row.childCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="物流公司">
                <template slot-scope="scope">
                    <span>{{scope.row.deliveryCompanyName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="快递单号">
                <template slot-scope="scope">
                    <span>{{scope.row.deliveryCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="箱号">
                <template slot-scope="scope">
                    <span>{{scope.row.soBoxCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="订单物流状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.deliveryStatus==0">待发货</span>
                    <span v-else-if="scope.row.deliveryStatus==1">分拣中</span>
                    <span v-else-if="scope.row.deliveryStatus==2">已发货</span>
                    <span v-else-if="scope.row.deliveryStatus==3">已签收</span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="最新物流时间">
                <template slot-scope="scope">
                    <span>{{scope.row.updateTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="运费（元）">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.soChildDeliveryFee)}}</span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" plain @click="soChildOpFlow(scope.row.soChildId)">查看物流流水</el-button>
                    <el-button type="warning" size="small" :disabled="!scope.row.packageExist" plain @click="addBox(scope.row.soChildId)">新增箱号</el-button>
                </template>
            </el-table-column>

        </el-table>

         <el-dialog title="新增箱号" :visible.sync="dialogFormVisible">
            <el-form label-width="120px">
                <el-form-item label="箱号">
                    <el-input v-model="logisticsForm.boxCode"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button @click="updataAddBox" type="primary">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="物流流水" :visible.sync="dialogFormVisible1">
            <el-table :key='tableKey' :data="logisticsData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

                <el-table-column align="center" label="编号">
                    <template slot-scope="scope">
                        <span>{{scope.row.id}}</span>
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
        </el-dialog>
    </div>
</template>
<script>
import {soDeliveryInfoList,addBox,soChildOpFlow} from '../../../../api/getData';
export default {

    data () {

        return {
            listLoading:true,
            tableKey:1,
            financeData:[],
            dialogFormVisible:false,
            dialogFormVisible1:false,
            logisticsForm:{
                soChildId:'',
                boxCode:''
            },
            logisticsData:[],
        }
    },
    created () {
        this.soDeliveryInfoList();
    },
    components: {

    },
    computed: {
    },
    methods:{
        async soDeliveryInfoList (){
            try {

                const res = await soDeliveryInfoList({orderId:this.$route.params.orderId});

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

        //新增箱号
        addBox(id){
            this.dialogFormVisible = true;
            this.logisticsForm = {
                soChildId:id,
                boxCode:''
            }
        },

        async updataAddBox (){
            try {
                const res = await addBox(this.logisticsForm);

                if (res.data.code == 0) {
                    this.dialogFormVisible = false;
                    this.soDeliveryInfoList();
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

        //查看物流操作流水

        async soChildOpFlow (id){
            try {

                const res = await soChildOpFlow({soChildId:id});

                if (res.data.code == 0) {
                    this.dialogFormVisible1 = true;
                    this.logisticsData = res.data.data.list;
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