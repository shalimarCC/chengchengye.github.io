<template>
    <div style="padding:20px 100px;">
        <el-table :data="branchData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="第三方订单类型">
                <template slot-scope="scope">
                    <span>{{scope.row.thirdpartyType}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="第三方订单ID">
                <template slot-scope="scope">
                    <span>{{scope.row.thirdpartyId}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="对应子订单编号">
                <template slot-scope="scope">
                    <span>{{scope.row.childCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="第三方订单状态">
                <template slot-scope="scope">
                    <span>{{scope.row.thirdpartyStatus}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="最后更新时间">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.updateTime)}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="用户姓名">
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="身份证号码">
                <template slot-scope="scope">
                    <span>{{scope.row.idCardNum}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="手机号码">
                <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="油卡号">
                <template slot-scope="scope">
                    <span>{{scope.row.oidCardNum}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="备注">
                <template slot-scope="scope">
                    <span>{{scope.row.comment}}</span>
                </template>
            </el-table-column>

        </el-table>




    </div>
</template>
<script>
import {findSoThirdpartyBySoId} from '../../../../api/getData';
export default {

    data () {

        return {
            branchData:[],
            listLoading:true,
            dialogFormVisible:false,
            dialogFormVisible1:false,
            branchForm:{

            },
            childData:[],
            soChildId:''
        }
    },
    created () {
        this.findSoThirdpartyBySoId();
    },
    components: {

    },
    computed: {
    },
    methods:{
        async findSoThirdpartyBySoId (){
            try {

                const res = await findSoThirdpartyBySoId({soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.branchData = res.data.data;
                    this.listLoading = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                    this.listLoading = false;
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
                this.listLoading = false;
            }
        },

        //导出
        async exportSoChild (){
            try {

                const res = await exportSoChild({orderId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    window.open(res.data.data.url);
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

        async findSochildById (id){
            try {

                const res = await findSochildById({soChildId:id});

                if (res.data.code == 0) {
                    this.branchForm = res.data.data.soChildInfo;
                    this.dialogFormVisible = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                    this.listLoading = false;
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
            }
        },

        //点击拆单

        async puInfoForOpenOrder (id){
            try {
                this.soChildId = id;
                const res = await puInfoForOpenOrder({soChildId:id});

                if (res.data.code == 0) {
                    this.dialogFormVisible1 = true;
                    this.childData = res.data.data.puList;
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
                this.listLoading = false;
            }
        },

        //拆单保存
        async openOrder (){
            try {
                let obj = new Object();
                obj.soChildId = this.soChildId;
                var arr = new Array();
                $.each(this.childData,function(key,info){
                    let obj1 = new Object();
                    obj1.itemId = info.id;
                    obj1.num = info.num;
                    arr.push(obj1);
                })
                obj.puIdArr = JSON.stringify(arr);
                const res = await openOrder(obj);

                if (res.data.code == 0) {
                    this.dialogFormVisible1 = false;
                    this.findAllSOChildBySoId();
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
                this.listLoading = false;
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