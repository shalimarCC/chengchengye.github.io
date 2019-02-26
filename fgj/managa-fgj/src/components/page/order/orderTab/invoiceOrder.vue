<template>
    <div>

        <el-form ref="basicData" :model="invoiceData" label-width="120px" style="padding:20px 100px;min-width:400px;">
            <el-row :gutter="60">
                <el-col :span="24">
                    <h4>发票信息</h4>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="发票类型：" style="text-align:left;">
                        <el-select v-model="invoiceData.invoiceType" placeholder="请选择">
                            <el-option
                                label="电子普通发票"
                                :value="1">
                            </el-option>
                            <el-option
                                label="纸质普通发票"
                                :value="0">
                            </el-option>
                            <el-option
                                label="增值税专用发票"
                                :value="2">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="发票内容：" style="text-align:left;">
                        <el-select v-model="invoiceData.invoiceContentType" placeholder="请选择">
                            <el-option
                                label="商品明细"
                                :value="0">
                            </el-option>
                            <el-option
                                label="商品类别"
                                :value="1">
                            </el-option>
                        </el-select>

                        <el-button class="filter-item" type="primary" @click="updateInvoiceTypeInfo" icon="edit" size="medium">保存</el-button>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <h4>发票抬头<el-button class="filter-item" style="margin-left:20px;" type="primary" @click="findInvoiceList" icon="edit" size="medium">修改</el-button></h4>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="抬头类型：" style="text-align:left;">
                        <span v-if="invoiceData.titleType==0">个人</span>
                        <span v-else-if="invoiceData.titleType==1">单位</span>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="发票抬头：" style="text-align:left;">
                        <span>{{invoiceData.title}}</span>
                    </el-form-item>
                </el-col>



                <el-col :span="12">
                    <el-form-item label="纳税人识别号：" style="text-align:left;">
                        <span>{{invoiceData.tpic}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="注册地址：" style="text-align:left;">
                        <span>{{invoiceData.registerAddr}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="注册电话：" style="text-align:left;">
                        <span>{{invoiceData.registerTel}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="开户银行：" style="text-align:left;">
                        <span>{{invoiceData.depositBank}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="银行账号：" style="text-align:left;">
                        <span>{{invoiceData.bankAccount}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="营业执照：" style="text-align:left;">
                        <a :href="invoiceData.businessLicenceUrl" target="_Blank">营业执照</a>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <div  style="padding:20px 100px;">
        <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row>

            <el-table-column align="center" label="所属子订单编号">
                <template slot-scope="scope">
                    <span>{{scope.row.childCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="发票类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.invoiceType==0">纸质普通发票</span>
                    <span v-else-if="scope.row.invoiceType==1">电子普通发票</span>
                    <span v-else-if="scope.row.invoiceType==2">增值税专用发票</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="发票号码">
                <template slot-scope="scope">
                    <span>{{scope.row.invoiceCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="财务状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.financeStatus==0">未开票</span>
                    <span v-else-if="scope.row.financeStatus==1">已开票</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="电子发票附件">
                <template slot-scope="scope">
                    <a :href="scope.row.invoiceAttcUrl" target="_Blank">{{scope.row.invoiceAttcUrl}}</a>
                </template>
            </el-table-column>

            <el-table-column align="center" label="备注">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" plain @click="orderInvoice(scope.row.id)">开具发票</el-button>
                </template>
            </el-table-column>

        </el-table>
        </div>

        <el-dialog title="开具发票" :visible.sync="dialogFormVisible">
            <el-form label-width="120px">
                <el-form-item label="发票类型">
                    <el-select v-model="invoiceForm.invoiceType">
                        <el-option
                            label="电子普通发票"
                            :value="1">
                        </el-option>
                        <el-option
                            label="纸质普通发票"
                            :value="0">
                        </el-option>
                        <el-option
                            label="增值税专用发票"
                            :value="2">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="发票号码">
                    <el-input v-model="invoiceForm.invoiceCode"></el-input>
                </el-form-item>

                <el-form-item label="发票抬头">
                    <span>{{invoiceForm.invoiceTitleContent}}</span>
                </el-form-item>

                <el-form-item label="发票金额">
                    <span>&yen;{{invoiceForm.invoiceValue}}</span>
                </el-form-item>

                <el-form-item label="发票备注">
                    <el-input type="textarea" :rows="3" v-model="invoiceForm.remark"></el-input>
                </el-form-item>

                <el-form-item label="上传电子发票">
                        <el-upload
                            class="upload-demo"
                            :action="baseImgPath"
                            :on-success="handleAvatarSuccess2"
                            :before-upload="beforeAvatarUpload2"
                            :on-error="handleError"
                            :data="imgForm"
                            :limit="1">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                        </el-upload>
                    </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button @click="drawInvoice" type="primary">确定</el-button>
            </div>
        </el-dialog>



        <el-dialog title="编辑发票抬头" :visible.sync="dialogFormVisible2" width="80%">
            <div style="margin-bottom:20px;height:40px;">
                <el-button class="filter-item" type="primary" style="float:right;" @click="addInvoice" size="small">添加</el-button>
            </div>
            <el-radio-group v-model="checkInvoice" style="width:100%;">
                <el-table :key='tableKey' :data="invoiceList" v-loading.body="listLoading" border fit highlight-current-row>
                    <el-table-column align="center" width="40">
                        <template slot-scope="scope">
                            <el-radio :label="scope.row.id">1</el-radio>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="发票抬头">
                        <template slot-scope="scope">
                            <span>{{scope.row.titleContent}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="税号">
                        <template slot-scope="scope">
                            <span>{{scope.row.taxpayerIdentificationCode}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="注册地址">
                        <template slot-scope="scope">
                            <span>{{scope.row.registerAddr}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="注册电话">
                        <template slot-scope="scope">
                            <span>{{scope.row.registerTel}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="开户银行">
                        <template slot-scope="scope">
                            <span>{{scope.row.depositBank}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="银行账号">
                        <template slot-scope="scope">
                            <span>{{scope.row.bankAccount}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="营业执照">
                        <template slot-scope="scope">
                            <a :href="scope.row.businessLicenceUrl" target="_Blank">营业执照</a>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="创建类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.createType==0">用户</span>
                            <span v-else-if="scope.row.createType==1">运营</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">

                            <el-button type="primary" size="small" plain @click="findInvoiceById(scope.row.id)" v-if="scope.$index!=0">编辑</el-button>
                            <span v-else>快照不可编辑</span>
                        </template>
                    </el-table-column>

                </el-table>
            </el-radio-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button @click="changeCommonInvoiceInfo" type="primary">确定</el-button>
            </div>

            <el-dialog title="编辑发票" :visible.sync="innerVisible" append-to-body width="50%">
                <el-form label-width="120px">

                    <el-form-item label="抬头类型" class="is-required">
                        <el-select v-model="invoiceForm2.titleType">
                            <el-option
                                label="个人"
                                :value="0">
                            </el-option>
                            <el-option
                                label="单位"
                                :value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="发票抬头" class="is-required">
                        <el-input v-model="invoiceForm2.titleContent"></el-input>
                    </el-form-item>

                    <el-form-item label="税号" class="is-required" v-if="invoiceForm2.titleType==1">
                        <el-input v-model="invoiceForm2.taxpayerIdentificationCode"></el-input>
                    </el-form-item>

                    <el-form-item label="注册地址" v-if="invoiceForm2.titleType==1">
                        <el-input v-model="invoiceForm2.registerAddr"></el-input>
                    </el-form-item>

                    <el-form-item label="注册电话" v-if="invoiceForm2.titleType==1">
                        <el-input v-model="invoiceForm2.registerTel"></el-input>
                    </el-form-item>

                    <el-form-item label="开户银行" v-if="invoiceForm2.titleType==1">
                        <el-input v-model="invoiceForm2.depositBank"></el-input>
                    </el-form-item>

                    <el-form-item label="银行账号" v-if="invoiceForm2.titleType==1">
                        <el-input v-model="invoiceForm2.bankAccount"></el-input>
                    </el-form-item>

                    <el-form-item label="营业执照" v-if="invoiceForm2.titleType==1">
                        <el-upload
                            class="upload-demo"
                            :action="baseImgPath"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-error="handleError"
                            :data="imgForm"
                            :limit="1">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                        </el-upload>
                    </el-form-item>


                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                    <el-button @click="insertOrUpdateInvoiceWithTx" type="primary">确定</el-button>
                </div>
            </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../../config/env'
import {findInvoiceBySoId,updateInvoiceInfo,drawInvoice,soChildInvoiceInfo,updateInvoiceTypeInfo,
        findInvoiceList,insertOrUpdateInvoiceWithTx,getQiNiuToken,findInvoiceById,changeCommonInvoiceInfo} from '../../../../api/getData';
export default {

    data () {

        return {
            invoiceData:{

            },
            invoiceData1:{
                orderId:'',
                titleType:'',
                title:'',
                invoiceType:'',
                taxNo:'',
                invoiceContentType:''
            },
            tableKey: 0,
            listLoading: true,
            dataSource:[],
            dialogFormVisible:false,
            dialogFormVisible1:false,
            dialogFormVisible2:false,
            invoiceList:[],
            invoiceForm:{
                invoiceType:'',
                soChildId:'',
                remark:'',
                invoiceCode:'',
                invoiceAttcUrl:'',
                invoiceValue:'',
                invoiceTitleContent:''
            },
            checkInvoice:'',
            invoiceForm2:{
                id:'',
                titleType:'',
                titleContent:'',
                taxpayerIdentificationCode:'',
                registerAddr:'',
                registerTel:'',
                bankAccount:'',
                depositBank:'',
                businessLicenceUrl	:'',
                orderId:'',
            },
            innerVisible:false,
            imgForm:{
                key:'',
                token:'',
            },
            baseImgPath:'',
            baseImgUrl:'',
        }
    },
    created () {
        this.findInvoiceBySoId();
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        const res = getQiNiuToken();
        res.then(_data => {
            if(_data.data.code == 0){

                this.imgForm.token = _data.data.data;
            }else{
                this.$message({
                    type:"error",
                    message:_data.data.error
                })
            }
        })
    },
    components: {

    },
    computed: {
    },
    methods:{
        //更换公共发票信息
        async changeCommonInvoiceInfo(){
            try {
                const res = await changeCommonInvoiceInfo({orderId:this.$route.params.orderId,commonInvoiceId:this.checkInvoice});

                if (res.data.code == 0) {
                    this.dialogFormVisible2 = false;
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.findInvoiceBySoId();
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
        //新增发票抬头
        addInvoice(){
            this.invoiceForm2 = {
                id:'',
                titleType:'',
                titleContent:'',
                taxpayerIdentificationCode:'',
                registerAddr:'',
                registerTel:'',
                bankAccount:'',
                depositBank:'',
                businessLicenceUrl:'',
                orderId:'',
            },
            this.innerVisible = true;
        },
        //编辑发票
        async findInvoiceById(id){
            try {
                const res = await findInvoiceById({id:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.invoiceForm2 = {
                        id:data.id,
                        titleType:data.titleType,
                        titleContent:data.titleContent,
                        taxpayerIdentificationCode:data.taxpayerIdentificationCode,
                        registerAddr:data.registerAddr,
                        registerTel:data.registerTel,
                        bankAccount:data.bankAccount,
                        depositBank:data.depositBank,
                        businessLicenceUrl:data.businessLicenceUrl,
                        orderId:'',
                    };
                    this.innerVisible = true;
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
        //保存发票抬头
        async insertOrUpdateInvoiceWithTx(){
            try {
                this.invoiceForm2.orderId = this.$route.params.orderId;
                const res = await insertOrUpdateInvoiceWithTx(this.invoiceForm2);

                if (res.data.code == 0) {
                    this.innerVisible = false;
                    this.findInvoiceList();
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
        //编辑发票抬头
        async findInvoiceList (){
            try {
                const res = await findInvoiceList({orderId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.invoiceList = res.data.data;
                    this.checkInvoice = this.invoiceList[0].id;
                    this.dialogFormVisible2 = true;
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
        //修改订单发票类型的信息
        async updateInvoiceTypeInfo (){
            try {
                const res = await updateInvoiceTypeInfo({orderId:this.$route.params.orderId,invoiceType:this.invoiceData.invoiceType,invoiceContentType:this.invoiceData.invoiceContentType});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.findInvoiceBySoId();
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



        async findInvoiceBySoId (){
            try {

                const res = await findInvoiceBySoId({soId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.invoiceData = res.data.data;


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
        // //编辑发票
        // editInvoice(id){
        //     this.invoiceData1.titleType = this.invoiceData.titleType;
        //     this.invoiceData1.title = this.invoiceData.title;
        //     this.invoiceData1.invoiceType = this.invoiceData.invoiceType;
        //     this.invoiceData1.taxNo = this.invoiceData.tpic;
        //     this.invoiceData1.invoiceContentType = this.invoiceData.invoiceContentType;
        //     this.dialogFormVisible1 = true;
        // },

        //开具发票
        async orderInvoice(id){
            try {
                const res = await soChildInvoiceInfo({soChildId:id});

                if (res.data.code == 0) {
                    this.dialogFormVisible = true;
                    this.invoiceForm = {
                        invoiceValue:res.data.data.invoice.invoiceValue,
                        invoiceTitleContent:res.data.data.invoice.invoiceTitleContent,
                        invoiceType:res.data.data.invoice.invoiceType,
                        soChildId:res.data.data.invoice.id,
                        remark:res.data.data.invoice.remark,
                        invoiceCode:res.data.data.invoice.invoiceCode,
                        invoiceAttcUrl:res.data.data.invoice.invoiceAttcUrl
                    };
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

        async updateInvoiceInfo (){
            try {
                this.invoiceData1.orderId = this.$route.params.orderId;
                const res = await updateInvoiceInfo(this.invoiceData1);

                if (res.data.code == 0) {
                    this.dialogFormVisible1 = false;
                    this.findInvoiceBySoId();
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

        async drawInvoice (){
            try {
                const res = await drawInvoice(this.invoiceForm);

                if (res.data.code == 0) {
                    this.dialogFormVisible = false;
                    this.findInvoiceBySoId();
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
        //上传图片
        beforeAvatarUpload(file) {    //在图片提交前进行验证  轮播图
            let curr = moment().format('YYYYMMDDHHmmss').toString();
            let prefix = moment(file.lastModified).format('HHmmss').toString();
            let key = curr+"egeo"+prefix;
            this.imgForm.key = key;
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const res = getQiNiuToken();

            res.then(_data => {
                if(_data.data.code == 0){

                    this.imgForm.token = _data.data.data;
                }else{
                    this.$message({
                        type:"error",
                        message:_data.data.error
                    })
                }
            })
             console.log(this.imgForm)
            if (!isJPG&&!isPNG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }

            return isJPG||isPNG

        },
        //上传图片
        beforeAvatarUpload2(file) {    //在图片提交前进行验证  轮播图
            let curr = moment().format('YYYYMMDDHHmmss').toString();
            let prefix = moment(file.lastModified).format('HHmmss').toString();
            let key = curr+file.name;
            this.imgForm.key = key;
            const isPdf = file.type === 'application/pdf'
            //const isPNG = file.type === 'image/png'
            const res = getQiNiuToken();

            res.then(_data => {
                if(_data.data.code == 0){

                    this.imgForm.token = _data.data.data;
                }else{
                    this.$message({
                        type:"error",
                        message:_data.data.error
                    })
                }
            })
            //  console.log(this.imgForm)
            if (!isPdf) {
                this.$message.error('上传文件只能是 PDF 格式!')
            }

            return isPdf

        },
        handleError(res) {   //显示错误
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },
        handleAvatarSuccess(response){
            this.invoiceForm2.businessLicenceUrl = this.baseImgUrl + response.key;
        },
        handleAvatarSuccess2(response){
            this.invoiceForm.invoiceAttcUrl = this.baseImgUrl + response.key;
        },
    }
}

</script>


<style scoped>

</style>