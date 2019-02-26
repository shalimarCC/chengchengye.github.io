<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="订单编号" v-model="ruleForm.orderCode">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="所属用户" v-model="ruleForm.email">
        </el-input>

        <el-date-picker
            v-model="ruleForm.startTime"
            type="date"
            placeholder="下单时间" style="width: 200px;">
        </el-date-picker>--
        <el-date-picker
            v-model="ruleForm.endTime"
            type="date"
            placeholder="下单时间" style="width: 200px;margin-right:15px;">
        </el-date-picker>


    </div>

    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.status" placeholder="订单状态" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in orderStatus"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.orderConfirmStatus" placeholder="订单确认状态" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in orderConfirmStatus"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.orderPayStatus" placeholder="订单支付状态" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in orderPayStatus"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.paymentType" placeholder="支付方式" style="width: 200px;margin-right:15px;">
            <el-option
                v-for="item in paymentType"
                :key="item.value"
                :label="item.key"
                :value="item.value">
            </el-option>
        </el-select>

        <el-checkbox v-model="ruleForm.showTest">显示测试数据</el-checkbox>

        <el-button class="filter-item" type="primary" icon="search" size="medium" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>


        <el-button size="small" style="float:right;margin-right:10px;" type="primary" @click="orderExport">订单信息导出</el-button>
        <el-button size="small" style="float:right;margin-right:10px;" type="primary" @click="orderSortExport">分拣导出</el-button>
        <el-upload
            ref="upload"
            class="upload-demo"
            style="display: inline-block;float:right;"
            :action="basePath1"
            :onError="uploadError"
            :onSuccess="uploadSuccess"
            :headers="dataHeaders"
            :beforeUpload="beforeAvatarUpload">
            <el-button slot="trigger" size="small" type="primary">发货导入</el-button>
        </el-upload>
    </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit @selection-change="handleSelectionChange" highlight-current-row style="width: 100%" max-height="600">
        <el-table-column
        type="selection"
        width="55"
        align="center">
        </el-table-column>

        <el-table-column align="center" label="订单编号">
            <template slot-scope="scope">
                <span>{{scope.row.orderCode}}</span>
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

        <el-table-column align="center" label="优惠前总额">
            <template slot-scope="scope">
                <span>{{scope.row.soAmount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="优惠总额">
            <template slot-scope="scope">
                <span>{{scope.row.discount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="优惠券优惠总额">
            <template slot-scope="scope">
                <span>{{scope.row.couponDiscount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="门店优惠总额">
            <template slot-scope="scope">
                <span>{{scope.row.storeDiscount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="结算总额">
            <template slot-scope="scope">
                <span>{{scope.row.payAmount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单状态">
            <template slot-scope="scope">
                <span>{{scope.row.orderStatusStr}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单确认状态">
            <template slot-scope="scope">
                <span v-if="scope.row.orderConfirmStatus==0">未确认</span>
                <span v-else-if="scope.row.orderConfirmStatus==1">已确认</span>
                <span v-else-if="scope.row.orderConfirmStatus==2">已取消</span>
                <span v-else-if="scope.row.orderConfirmStatus==3">已完成</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单支付状态">
            <template slot-scope="scope">
                <span v-if="scope.row.orderPayStatus==0">未支付</span>
                <span v-else-if="scope.row.orderPayStatus==1">已支付</span>
                <span v-else-if="scope.row.orderPayStatus==2">已退款</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否积分支付">
            <template slot-scope="scope">
                <span v-if="scope.row.useFubi==1">是</span>
                <span v-else>否</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="现金支付方式">
            <template slot-scope="scope">
                <span v-if="scope.row.cashPayType==1">支付宝</span>
                <span v-else-if="scope.row.cashPayType==2">微信</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="现金已付金额">
            <template slot-scope="scope">
                <span>{{scope.row.orderPaidByCash}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="积分已付金额">
            <template slot-scope="scope">
                <span>{{scope.row.orderPaidByFubi}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单来源">
            <template slot-scope="scope">
                <span v-if="scope.row.orderChannel==0">andoird</span>
                <span v-else-if="scope.row.orderChannel==1">IOS</span>
                <span v-else-if="scope.row.orderChannel==2">微信端</span>
                <span v-else-if="scope.row.orderChannel==3">web端</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="订单类型">
            <template slot-scope="scope">
                <span v-if="scope.row.saleWay==1">正常销售</span>
                <span v-else-if="scope.row.saleWay==2">团购</span>
                <span v-else-if="scope.row.saleWay==3">兑换券</span>
                <span v-else-if="scope.row.saleWay==4">普通预售</span>
                <span v-else-if="scope.row.saleWay==5">会籍购买</span>
                <span v-else-if="scope.row.saleWay==6">会籍预售</span>
                <span v-else-if="scope.row.saleWay==7">预售</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否零售">
            <template slot-scope="scope">
                <span v-if="scope.row.isDetail==0">否</span>
                <span v-else-if="scope.row.isDetail==1">是</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属门店">
            <template slot-scope="scope">
                <span>{{scope.row.storeName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="250" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="orderDetail(scope.row.id)">查看详情</el-button>
                <el-button type="warning" size="small" plain @click="soRefundInfo(scope.row.id)" :disabled="scope.row.orderConfirmStatus==0 || scope.row.orderPayStatus!=1">退款</el-button>
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

    <el-dialog title="订单退款" :visible.sync="dialogFormVisible">
        <h2 style="display:inline;">退款金额</h2>
        <el-table :data="refundData" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="支付类型">
                <template slot-scope="scope">
                    <span>{{scope.row.type}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="总支付">
                <template slot-scope="scope">
                    <span>{{scope.row.payNum}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="已退款">
                <template slot-scope="scope">
                    <span>{{scope.row.returnNum}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="本次退款">
                <template slot-scope="scope">
                    <el-input-number :min="0" v-model="scope.row.num"></el-input-number>
                </template>
            </el-table-column>
        </el-table>
        <h2 style="display:inline;">退款原因</h2>
        <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="refundObj.reason">
                </el-input>
        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="soRefund">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
import Cookie from '../../../config/mUtils';
import { baseUrl } from '../../../config/env';
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import {orderList,orderStatusList,soRefundInfo,orderSortExport,orderExport,soRefund} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                orderCode:'',
                email: "",
                startTime : "",
                puName:"",
                endTime: "",
                status:"",
                orderConfirmStatus: "",
                paymentType: "",
                orderPayStatus: "",
                showTest:"",
                pageNo: 1,
                pageSize: 10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            orderStatus:[],
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
                platformId:'',
                ut:'',
                Authorization:'',
                clientId:'',
                companyId:'',
                f:'',
                phoneModel:'',
                os:'',
                v:'',
                deviceId:''
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
        this.dataHeaders.ut = this.$store.state.Cookie.mutations.fetch().cookieValue;
        this.dataHeaders.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        this.dataHeaders.Authorization = `${CryptoJS.MD5(Cookie.mutations.fetch().cookieValue + Cookie.mutations.fetch().id).toString()}`;;
        this.dataHeaders.clientId = 3;
        this.dataHeaders.companyId = `${"1"}`;
        this.dataHeaders.f = `${"3"}`;
        this.dataHeaders.phoneModel = `${"1.0.0"}`;
        this.dataHeaders.os = `${"1.0.0"}`;
        this.dataHeaders.v = `${"1.0.0"}`;
        this.dataHeaders.deviceId = `${"0001"}`;
        this.basePath1 = baseUrl+"/back-order-web/order/soPackage/deliveryImport.do";
        this.dataHeaders.ut = Cookie.mutations.fetch().cookieValue;
        this.dataHeaders.platformId = Cookie.mutations.fetch().platformId;
        this.orderList();
        this.orderStatusList();
    },

    methods: {
        //获取列表
        async orderList() {
            try {
                console.log(this.ruleForm)
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                if(obj.startTime!=''&&obj.startTime!=null){
                    obj.startTime = this.setTimestamp(obj.startTime);
                }
                if(obj.endTime!=''&&obj.endTime!=null){
                     obj.endTime = this.setTimestamp(obj.endTime);
                }

                this.listLoading = false;
                const res = await orderList(obj);

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
            this.orderList()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.orderList();
        },

        //搜索
        handleFilter() {
            this.orderList();
        },
        //选择列表复选框
        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.id);
            })
            this.passAll = arr;
            console.log(this.passAll);
        },

        //重置
        resetForm(formName) {
            this.ruleForm = {
                orderCode:'',
                email: "",
                startTime : "",
                puName:"",
                endTime: "",
                status:"",
                orderConfirmStatus: "",
                paymentType: "",
                orderPayStatus: "",
                showTest:"",
                pageNo: 1,
                pageSize: 10
            }
            this.orderList();
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
                    var f = document.createElement("form");
                    document.body.appendChild(f);
                    var i = document.createElement("input");
                    i.type = "hidden"; f.appendChild(i);
                    i.value = "5"; i.name = "price";
                    f.action = res.data.data.url; //下载的url 地址
                    f.submit();
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
                    var f = document.createElement("form");
                    document.body.appendChild(f);
                    var i = document.createElement("input");
                    i.type = "hidden"; f.appendChild(i);
                    i.value = "5"; i.name = "price";
                    f.action = res.data.data.url; //下载的url 地址
                    f.submit();
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


