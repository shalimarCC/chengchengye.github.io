<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:10px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="子订单编号" v-model="ruleForm.soChildCode">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="所属用户" v-model="ruleForm.mail">
        </el-input>


    </div>

    <div style="margin-bottom:10px;">
        <el-date-picker
            v-model="ruleForm.orderCreateTimeStart"
            type="date"
            placeholder="母订单下单时间" style="width: 200px;">
        </el-date-picker> --
        <el-date-picker
            v-model="ruleForm.orderCreateTimeEnd"
            type="date"
            placeholder="母订单下单时间" style="width: 200px;margin-right:15px;">
        </el-date-picker>

        <el-select v-model="ruleForm.soType" placeholder="订单类型" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in orderType"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>
    </div>

    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.soChildDeliveryStatus" placeholder="子订单物流状态" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in orderStatus"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.soConfirmStatus" placeholder="母订单确认状态" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in orderConfirmStatus"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>

        <el-date-picker
            v-model="ruleForm.sendStart"
            type="date"
            placeholder="应发货日期" style="width: 200px;">
        </el-date-picker>--
        <el-date-picker
            v-model="ruleForm.sendEnd"
            type="date"
            placeholder="应发货日期" style="width: 200px;margin-right:15px;">
        </el-date-picker>

        <el-checkbox v-model="ruleForm.showTest">显示测试数据</el-checkbox>

        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
    </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit @selection-change="handleSelectionChange" highlight-current-row style="width: 100%" max-height="600">
        <el-table-column
        type="selection"
        width="55"
        align="center">
        </el-table-column>

        <el-table-column align="center" label="子订单编号">
            <template slot-scope="scope">
                <span>{{scope.row.soChildCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属用户">
            <template slot-scope="scope">
                <span>{{scope.row.mail}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="买家姓名">
            <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="买家电话">
            <template slot-scope="scope">
                <span>{{scope.row.mobile}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="下单时间">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="应发货日期">
            <template slot-scope="scope">
                <span v-if="scope.row.sendTime!=null">{{setTime(scope.row.sendTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="优惠前总额">
            <template slot-scope="scope">
                <span>{{scope.row.amountTotal}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="优惠总额">
            <template slot-scope="scope">
                <span>{{scope.row.discount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="平摊优惠券">
            <template slot-scope="scope">
                <span>{{scope.row.couponeDiscount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="平摊门店优惠">
            <template slot-scope="scope">
                <span>{{scope.row.storeDiscount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="结算总额">
            <template slot-scope="scope">
                <span>{{scope.row.amount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="子订单物流状态">
            <template slot-scope="scope">
                <span v-if="scope.row.soChildDeliveryStatus==0">待发货</span>
                <span v-else-if="scope.row.soChildDeliveryStatus==1">分拣中</span>
                <span v-else-if="scope.row.soChildDeliveryStatus==2">已发货</span>
                <span v-else-if="scope.row.soChildDeliveryStatus==3">已签收</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="母订单确认状态">
            <template slot-scope="scope">
                <span v-if="scope.row.soConfirmStatus==0">未确认</span>
                <span v-else-if="scope.row.soConfirmStatus==1">已确认</span>
                <span v-else-if="scope.row.soConfirmStatus==2">已取消</span>
                <span v-else-if="scope.row.soConfirmStatus==3">已完成</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单类型">
            <template slot-scope="scope">
                <span v-if="scope.row.saleWay==1">普通</span>
                <span v-else-if="scope.row.saleWay==7">预售</span>
            </template>
        </el-table-column>


    </el-table>
    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="ruleForm.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="ruleForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div>

  </div>
</template>


<script>
import Cookie from '../../../config/mUtils';
import { baseUrl } from '../../../config/env';
import {soChildAllList,orderStatusList,soRefundInfo,orderSortExport,orderExport,soRefund} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                soChildCode:'',
                mail: "",
                puName : "",
                orderCreateTimeStart:"",
                orderCreateTimeEnd: "",
                soType:"",
                soChildDeliveryStatus: "",
                soConfirmStatus: "",
                sendStart: "",
                sendEnd:"",
                showTest:"",
                pageNo: 1,
                pageSize: 10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            orderStatus:[
                {
                    key:"待发货",
                    value:"0"
                },
                {
                    key:"分拣中",
                    value:"1"
                },
                {
                    key:"已发货",
                    value:"2"
                },
                {
                    key:"已签收",
                    value:"3"
                },
            ],
            orderPayStatus:[
                {
                    key:"未支付",
                    value:"0"
                },
                {
                    key:"已支付",
                    value:"1"
                },
                {
                    key:"已退款",
                    value:"2"
                }
            ],
            orderType:[
                {
                    key:"普通",
                    value:"1"
                },
                {
                    key:"预售",
                    value:"7"
                },
            ],
            orderConfirmStatus:[
                {
                    key:"未确认",
                    value:"0"
                },
                {
                    key:"已确认",
                    value:"1"
                },
                {
                    key:"已取消",
                    value:"2"
                },
                {
                    key:"已完成",
                    value:"3"
                }
            ],
            paymentType:[
                {
                    key:"支付宝",
                    value:"1"
                },
                {
                    key:"微信",
                    value:"2"
                },
            ],
            refundData:[
                {
                    type:'积分',
                    payNum:'',
                    returnNum:'',
                    num:0
                },
                {
                    type:'现金',
                    payNum:'',
                    returnNum:'',
                    num:0
                }
            ],
            dialogFormVisible:false,
            dataHeaders:{
                platformId:7,
                ut:''
            },
            basePath:'',
            passAll:[],
            refundObj:{
                refundCash:'',
                refundFubi:'',
                reason:'',
                orderId:''
            }
        }
    },
    created() {
        //发货信息导入
        this.basePath1 = baseUrl+"/back-order-web/order/soPackage/deliveryImport.do";
        this.dataHeaders.ut = Cookie.mutations.fetch().cookieValue;
        this.soChildAllList();
        //this.orderStatusList();
    },

    methods: {
        //获取列表
        async soChildAllList() {
            try {
                console.log(this.ruleForm)
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                });
                if(obj.orderCreateTimeStart!=''&&obj.orderCreateTimeStart!=null){
                    obj.orderCreateTimeStart = this.setTimestamp(obj.orderCreateTimeStart);
                }
                if(obj.orderCreateTimeEnd!=''&&obj.orderCreateTimeEnd!=null){
                     obj.orderCreateTimeEnd = this.setTimestamp(obj.orderCreateTimeEnd);
                }
                if(obj.sendStart!=''&&obj.sendStart!=null){
                    obj.sendStart = this.setTimestamp(obj.sendStart);
                }
                if(obj.sendEnd!=''&&obj.sendEnd!=null){
                     obj.sendEnd = this.setTimestamp(obj.sendEnd);
                }
                this.listLoading = false;
                const res = await soChildAllList(obj);

                if (res.data.code == 0) {

                    this.count = res.data.data.page.totalSize;
                    this.dataSource = res.data.data.page.list;

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

        //获取订单状态
        async orderStatusList() {
            try {
                const res = await orderStatusList();

                if (res.data.code == 0) {
                    this.orderStatus = res.data.data;

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

        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.soChildAllList()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.soChildAllList();
        },

        //搜索
        handleFilter() {
            this.soChildAllList();
        },
        //选择列表复选框
        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.id);
            })
            this.passAll = arr;
        },

        //重置
        resetForm(formName) {
            this.ruleForm = {
                orderCode:'',
                email: "",
                orderCreateTimeStart : "",
                puName:"",
                orderCreateTimeEnd: "",
                status:"",
                sendStart:"",
                sendEnd:"",
                orderConfirmStatus: "",
                paymentType: "",
                orderPayStatus: "",
                showTest:"",
                pageNo: 1,
                pageSize: 10
            }
            this.soChildAllList();
        },

        //订单详情
        orderDetail (id) {
            this.$router.push( {path:'/orderDetail/'+id} );
        },

        //分拣导出
        async orderSortExport() {
            try {
                const res = await orderSortExport({orderIds:JSON.stringify(this.passAll)});

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

        //订单信息导出
        async orderExport() {
            try {
                const res = await orderExport({orderIds:JSON.stringify(this.passAll)});

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

        //查询退款详情
        async soRefundInfo(id) {
            try {
                this.refundObj = {
                    refundCash:'',
                    refundFubi:'',
                    reason:'',
                    orderId:id
                };
                const res = await soRefundInfo({orderId:id});

                if (res.data.code == 0) {

                    this.refundData[0].payNum = res.data.data.paidByFubi;
                    this.refundData[1].payNum = res.data.data.paidByCash;
                    this.refundData[0].returnNum = res.data.data.refundFubi;
                    this.refundData[1].returnNum = res.data.data.refundCash;
                    this.refundData[0].num = '';
                    this.refundData[1].num = '';
                    this.dialogFormVisible = true;

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
        //退款
        async soRefund() {
            try {
                let obj =  new Object();
                this.refundObj.refundCash = this.refundData[1].num;
                this.refundObj.refundFubi = this.refundData[0].num;
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(this.refundObj.refundCash===''&&this.refundObj.refundFubi===''){
                    this.$message({
                        type: 'error',
                        message: '退款金额不能为空'
                    });
                    return;
                }


                const res = await soRefund(this.refundObj);

                if (res.data.code == 0) {
                    this.dialogFormVisible = false;
                    this.$message({
                        type: 'success',
                        message: '退款成功'
                    });
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

        //时间转换时间戳
        setTimestamp(time) {
            if(time == ""){
                return ""
            }else{
                const t = new Date(time);
                return t.getTime()
            }

        },
        // 上传成功后的回调
        uploadSuccess (response, file, fileList) {
            if(response.code == 0){
                this.$message({
                type: 'success',
                message: '导入成功'
            });
            }else if(response.code == 169){

                this.$confirm('导入的文件中部分信息存在错误，请下载并修改后重新导入', '提示', {
                    confirmButtonText: '下载',
                    type: 'error'
                }).then(() => {
                    window.open(response.error);
                }).catch(() => {

                });

            }else{
                this.$message({
                    type: 'error',
                    message: response.error
                });
            }
        },
        // 上传错误
        uploadError (response, file, fileList) {
            this.$message({
                type: 'error',
                message: response.data.error
            });
        },
        // 上传前对文件的大小的判断
        beforeAvatarUpload (file) {
            const extension = file.name.split('.')[1] === 'xls'
            const extension2 = file.name.split('.')[1] === 'xlsx'
            const isLt2M = file.size / 1024 / 1024 < 5
            if (!extension && !extension2 ) {
                alert('上传模板只能是 xls、xlsx、doc、docx 格式!')
            }
            if (!isLt2M) {
                alert('上传模板大小不能超过 5MB!')
            }
            return extension || extension2 && isLt2M
        },
    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>
