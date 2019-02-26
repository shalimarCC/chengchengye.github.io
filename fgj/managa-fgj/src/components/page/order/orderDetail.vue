<template>
    <div id="example" v-loading.body="fullscreenLoading" element-loading-text="拼命加载中">

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h5 style="display:inline;">订单状态</h5>
                <el-button style="float: right;" size="medium" @click="updateOrderStatus" type="primary">保存</el-button>
            </div>
            <div>
                <el-form>
                    <el-form-item label="当前订单状态">
                        <el-select v-model="orderStatus" placeholder="订单状态" style="width:400px">
                            <el-option
                                v-for="item in orderStatusListData"
                                :key="item.value"
                                :label="item.key"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h5 style="display:inline;">订单信息</h5>
                <el-button style="float: right;" size="small" @click="updateOrderInfo" type="primary">保存</el-button>
            </div>
            <div>
                <el-form :model="orderInfo">
                    <el-form-item label="订单编号">
                        <span style="font-size:16px;line-height:36px;">{{orderInfo.orderCode}}</span>
                    </el-form-item>
                    <el-form-item label="下单时间">
                        <span style="font-size:16px;line-height:36px;">{{setTime(orderInfo.createTime)}}</span>
                    </el-form-item>
                    <el-form-item label="支付方式">
                        <span style="font-size:16px;line-height:36px;">{{orderInfo.orderPaymentTypeStr}}</span>
                    </el-form-item>
                    <el-form-item label="订单总额">
                        <el-input v-model="orderInfo.orderAmount" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="运费金额">
                        <el-input v-model="orderInfo.orderDeliveryFeeAccounting" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="实付金额">
                        <el-input v-model="orderInfo.orderPaidByAccount" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="买家留言">
                        <span style="font-size:16px;line-height:36px;">{{orderInfo.orderRemarkUser}}</span>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h5 style="display:inline;">商品信息</h5>

            </div>
            <div>
                <el-table :data="orderItemList" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="商品编号">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品规格">
                        <template slot-scope="scope">
                            <span v-for="sku in scope.row.skuAttValues">{{sku}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品单价">
                        <template slot-scope="scope">
                            <span>{{scope.row.orderAmount}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="购买数量">
                        <template slot-scope="scope">
                            <span>{{scope.row.buyCount}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品总额">
                        <template slot-scope="scope">
                            <span>{{scope.row.productAmount}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h5 style="display:inline;">收货信息</h5>
                <el-button style="float: right;" size="small" @click="updateReceiverAddress" type="primary">保存</el-button>
            </div>
            <div>
                <el-form :model="receiverAddress">

                    <el-form-item label="收件人">
                        <el-input v-model="receiverAddress.receiverName" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="receiverAddress.receiverPhone" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="收件地址">
                        <el-input v-model="receiverAddress.receiverAddress" style="width:400px;"></el-input>
                    </el-form-item>

                </el-form>
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h5 style="display:inline;">发票信息</h5>
                <el-button style="float: right;" size="small" @click="updateInvoiceInfo" type="primary">保存</el-button>
            </div>
            <div>
                <el-form :model="orderInfo">

                    <el-form-item label="抬头类型">
                        <el-select v-model="invoiceInfo.invoiceType" placeholder="抬头类型" style="width:400px">
                            <el-option
                                key="0"
                                label="个人"
                                value="0">
                            </el-option>

                            <el-option
                                key="1"
                                label="公司"
                                value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发票抬头">
                        <el-input v-model="invoiceInfo.invoiceTitleContent" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="发票类型">
                        <el-select v-model="invoiceInfo.invoiceTitleType" placeholder="抬头类型" style="width:400px">
                            <el-option
                                key="0"
                                label="不开发票"
                                value="0">
                            </el-option>

                            <el-option
                                key="1"
                                label="普通发票"
                                value="1">
                            </el-option>

                            <el-option
                                key="2"
                                label="增值税发票"
                                value="2">
                            </el-option>

                            <el-option
                                key="3"
                                label="电子发票"
                                value="3">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="纳税人识别号">
                        <el-input v-model="invoiceInfo.taxpayerIdentificationCode" style="width:400px;"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h5 style="display:inline;">买家信息</h5>
            </div>
            <div>
                <el-form label-width="80px">
                    <el-row :gutter="60">
                        <el-col :span="11">
                            <el-form-item label="用户名" style="text-align:left;">
11111111
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="邮箱" style="text-align:left;">
2222222222
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="电话" style="text-align:left;">
3333333333
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="性别" style="text-align:left;">
44444444444
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h5 style="display:inline;">物流信息</h5>
                <el-button style="float: right;margin:0 10px;" size="small" @click="addOrderPackage">新增</el-button>
                <el-button style="float: right;" size="small" @click="updateOrderPackage" type="primary">保存</el-button>
            </div>
            <div>
                <el-table :data="orderPackageList" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="包裹编号">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="物流公司">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.shipCompanyCode" placeholder="物流公司">
                                <el-option
                                    v-for="item in courierList"
                                    :key="item.value"
                                    :label="item.key"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="运单号">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.deliveryExpressNbr"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="物流信息">
                        <template slot-scope="scope">
                            <el-button :plain="true" size="small" @click="openDeliveryTrace(scope.row.deliveryExpressNbr,scope.row.shipCompanyCode)" type="info">查看物流</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品信息">
                        <template slot-scope="scope">
                            <p v-for="goods in scope.row.packageItem">{{goods}};</p>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="info" size="small" @click="packageSetGoods(scope.row.id)">商品设置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <el-dialog title="物流信息" :visible.sync="dialogFormVisible1">
            <template v-for="(info,key) in logisticsData">
                <div v-if="key==logisticsData.length-1">
                    <p style="color:#f00;">{{info.acceptTime}}</p>
                    <p style="color:#f00;">{{info.remark}}</p>
                </div>
                <div v-else>
                    <p>{{info.acceptTime}}</p>
                    <p>{{info.remark}}</p>
                </div>
            </template>
        </el-dialog>

        <el-dialog title="包裹商品设置" :visible.sync="dialogFormVisible2">
            <el-table :data="packageGoodsList" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="商品编号">
                        <template slot-scope="scope">
                            <span>{{scope.row.skuId}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品规格">
                        <template slot-scope="scope">
                            <span v-for="sku in scope.row.skuAttValues">{{sku}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品数量">
                        <template slot-scope="scope">
                            <span>{{scope.row.buyCount}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="是否选中">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.checked"
                                on-color="#13ce66"
                                off-color="#ff4949"
                                :disabled="scope.row.checked">
                            </el-switch>
                        </template>
                    </el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer" :span="24">
                <el-button @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="updateSoItem">确 定</el-button>
            </div>
        </el-dialog>
    </div>


</template>



<script>

import {backOrderDetail,orderStatusList,updateOrderStatus,updateOrderInfo ,updateDeliveryInfo,updateInvoiceInfo,findSoPackageAll,openDeliveryTrace,soDetailItemVoBySoId,updateSoItem,insertSoPackageWithTx,updateSoPackageByIdWithTxAll,updateOrderByOrderId} from '../../../api/getData';
export default {
    data() {
        return {
            fullscreenLoading: true,
            orderStatusListData:[],
            orderStatus:'',
            orderInfo: {
                orderCode:'',
                createTime:'',
                orderPaymentTypeStr:'',
                orderRemarkUser:'',
                orderPaidByAccount:'',
                orderAmount:'',
                orderDeliveryFeeAccounting:''
            },
            orderItemList:[],
            invoiceInfo:{
                invoiceType:'',
                invoiceTitleContent:'',
                invoiceTitleType:'',
                taxpayerIdentificationCode:''
            },
            receiverAddress:{
                receiverAddress:'',
                receiverPhone:'',
                receiverName:''
            },
            orderPackageList:[],

            dialogFormVisible1:false,
            dialogFormVisible2:false,
            logisticsData:[],
            courierList:[
                {
                    key:'中通快递',
                    value:'ZTO'
                },
                {
                    key:'德邦物流',
                    value:'DEPPON'
                },
                {
                    key:'申通快递',
                    value:'STO'
                },
                {
                    key:'顺丰快递',
                    value:'SF'
                },
                {
                    key:'圆通快递',
                    value:'YTO'
                },
                {
                    key:'EMS',
                    value:'EMS'
                }
            ],
            packageGoodsList:[],
            packId:'',
        }
    },
    created () {
        this.orderStatusList();
        this.backOrderDetail();
        this.findSoPackageAll();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,12)

                 if(str == "/orderDetail"){
                   Object.assign(this.$data, this.$options.data())
                    this.orderStatusList();
                    this.backOrderDetail();

                }

            },
        }
    },
    components: {

    },

    methods:{
        //获取基本信息
        async backOrderDetail () {
            try {
                const res = await backOrderDetail({orderId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.fullscreenLoading = false;
                    let data = res.data.data;


                    //订单状态
                    this.orderStatus = data.orderInfo.orderStatus.toString();

                    //订单信息
                    this.orderInfo = {
                        orderCode:data.orderInfo.orderCode,
                        createTime: data.orderInfo.createTime,
                        orderPaymentTypeStr:data.orderInfo.orderPaymentTypeStr,
                        orderRemarkUser:data.orderInfo.orderRemarkUser,
                        orderPaidByAccount:data.orderInfo.orderPaidByAccount,
                        orderAmount:data.orderInfo.orderAmount,
                        orderDeliveryFeeAccounting:data.orderInfo.orderDeliveryFeeAccounting
                    };

                    //收货地址
                    this.receiverAddress = {
                        receiverAddress:data.orderInfo.receiverAddress,
                        receiverPhone:data.orderInfo.receiverPhone,
                        receiverName:data.orderInfo.receiverName
                    };

                    //商品信息
                    this.orderItemList = data.orderItemList;

                    if(data.invoiceInfo != null){
                         //发票信息
                        this.invoiceInfo = {
                            invoiceType:data.invoiceInfo.invoiceTitleType.toString(),
                            invoiceTitleContent:data.invoiceInfo.invoiceTitleContent,
                            invoiceTitleType:data.invoiceInfo.invoiceType.toString(),
                            taxpayerIdentificationCode:data.invoiceInfo.taxpayerIdentificationCode
                        }
                    }

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
                    this.orderStatusListData = res.data.data;
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

        //获取包裹信息
        async findSoPackageAll() {
            try {
                const res = await findSoPackageAll({id:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.orderPackageList = res.data.data;
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

        //获取物流信息
        async openDeliveryTrace(id,name) {
            try {
                this.dialogFormVisible1 = true;
                const res = await openDeliveryTrace({waybillNum:id,shipCompanyCode:name});

                if (res.data.code == 0) {
                    this.logisticsData = res.data.data;
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

        //修改订单状态

         async updateOrderStatus () {
            try {

                const res = await updateOrderStatus({orderId:this.$route.params.orderId,status:this.orderStatus});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改订单状态成功',
                        type: 'success',
                        duration: 2000
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

        //修改订单信息

         async updateOrderInfo () {
            try {
                let obj = new Object();
                obj.orderId = this.$route.params.orderId;
                obj.payMoney = this.orderInfo.orderPaidByAccount;
                obj.deliveryAmount = this.orderInfo.orderDeliveryFeeAccounting;
                obj.orderAmount = this.orderInfo.orderAmount;

                const res = await updateOrderInfo(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改订单信息成功',
                        type: 'success',
                        duration: 2000
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

        //修改发票信息

         async updateInvoiceInfo () {
            try {
                let obj = new Object();
                obj.orderId = this.$route.params.orderId;
                obj.titleType = this.invoiceInfo.invoiceType;
                obj.title = this.invoiceInfo.invoiceTitleContent;
                obj.invoiceType = this.invoiceInfo.invoiceTitleType;
                obj.taxNo = this.invoiceInfo.taxpayerIdentificationCode;
                const res = await updateInvoiceInfo(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改订单信息成功',
                        type: 'success',
                        duration: 2000
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

        //修改收货信息

         async updateReceiverAddress () {
            try {
                let obj = JSON.parse(JSON.stringify(this.receiverAddress));
                obj.id = this.$route.params.orderId;
                const res = await updateOrderByOrderId(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改订单信息成功',
                        type: 'success',
                        duration: 2000
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

        //新增物流包裹
        async addOrderPackage () {
            try {
                const res = await insertSoPackageWithTx({soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '新增包裹成功！'
                    });
                    this.findSoPackageAll();
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

        //包裹商品设置
        async packageSetGoods (id) {
            try {
                this.packId = id;
                this.dialogFormVisible2 = true;
                const res = await soDetailItemVoBySoId({packId:id,soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.packageGoodsList = res.data.data;
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

        //分包裹
        async updateSoItem () {
            try {
                var arr = new Array();
                $.each(this.packageGoodsList,function(key,info){
                    let obj = new Object();
                    obj.id = info.id;
                    obj.checked = info.checked;
                    arr.push(obj);
                })


                const res = await updateSoItem({packId:this.packId,list:JSON.stringify(arr),id:this.$route.params.orderId});

                if (res.data.code == 0) {
                   this.$message({
                        type: 'success',
                        message: '包裹设置成功！'
                    });
                    this.findSoPackageAll();
                    this.dialogFormVisible2 = false;
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

        //保存订单物流信息
        async updateOrderPackage () {
            try {
                var arr = new Array();

                $.each(this.orderPackageList,function(key,info){
                    let obj = new Object();
                    obj.shipCompanyCode = info.shipCompanyCode;
                    obj.deliveryExpressNbr = info.deliveryExpressNbr;
                    obj.id = info.id;
                    arr.push(obj);
                })

                const res = await updateSoPackageByIdWithTxAll({packId:this.packId,list:JSON.stringify(arr),soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改订单包裹成功',
                        type: 'success',
                        duration: 2000
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

    }


}
</script>

<style scoped>
#example {
    padding: 10px 20px;

}
.box-card{
    margin-bottom:20px;
}
.el-loading-spinner{
    top:20%;
}
</style>


