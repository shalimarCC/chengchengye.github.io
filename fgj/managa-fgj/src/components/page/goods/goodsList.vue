<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:10px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="ruleForm.merchantProductSerialNumber"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="ruleForm.name"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="销售价格" v-model="ruleForm.salePrice"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="市场价格" v-model="ruleForm.marketPrice"></el-input>

    </div>
    <div style="margin-bottom:10px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="促销价格" v-model="ruleForm.promotionPrice"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="已售基数" v-model="ruleForm.soldBase"></el-input>

        <el-select v-model="ruleForm.saleWay" placeholder="销售方式">
            <el-option
            label="正常销售"
            value="1">
            </el-option>
            <el-option
            label="团购"
            value="2">
            </el-option>
            <el-option
            label="普通预售"
            value="4">
            </el-option>
            <el-option
            label="会籍预售"
            value="6">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.status" placeholder="商品状态">
            <el-option
            label="待上架"
            value="1">
            </el-option>
            <el-option
            label="审核中"
            value="2">
            </el-option>
            <el-option
            label="已上架"
            value="3">
            </el-option>
            <el-option
            label="已下架"
            value="4">
            </el-option>
        </el-select>
    </div>
    <div style="margin-bottom:20px;">
        <el-select v-model="ruleForm.orderBy" placeholder="排序方式" @change="orderSort">
            <el-option
            label="创建时间"
            value="0">
            </el-option>
            <el-option
            label="前端编号"
            value="1">
            </el-option>
        </el-select>
    </div>
    <div style="margin-bottom:20px;">

        创建时间：
        <el-date-picker
            v-model="ruleForm.beginTime"
            type="date"
            placeholder="请选择" style="width: 200px;">
        </el-date-picker>
        --
        <el-date-picker
            v-model="ruleForm.finishTime"
            type="date"
            placeholder="请选择" style="width: 200px;margin-right:15px;">
        </el-date-picker>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="所属总店" v-model="ruleForm.storeName"></el-input>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button class="filter-item" @click="syncSaveSuSerachRule" style="float:right" type="primary" icon="edit" size="medium">刷新商品缓存</el-button>
        <el-button class="filter-item" @click="addProduct" style="float:right" type="primary" icon="edit" size="medium">添加</el-button>
    </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" max-height="600">

        <el-table-column align="center" label="商品集合编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.merchantProductSerialNumber}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品销售名" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="销量" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.salesVolume}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="销售价格" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.salePrice}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="市场价格" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.marketPrice}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="促销价格" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.promotionPrice}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="已售基数" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.soldBase}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="购买方式" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.buyType==1">支持积分+现金购买</span>
                <span v-if="scope.row.buyType==2">仅支持现金支付</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="销售方式" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.saleWay==1">正常销售</span>
                <span v-else-if="scope.row.saleWay==2">团购</span>
                <span v-else-if="scope.row.saleWay==3">兑换卷</span>
                <span v-else-if="scope.row.saleWay==4">普通预售</span>
                <span v-else-if="scope.row.saleWay==5">会籍购买</span>
                <span v-else-if="scope.row.saleWay==6">会籍预售</span>
                <span v-else-if="scope.row.saleWay==7">预售</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="运营方" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.merchantName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="所属客户端" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.clients}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="所属总店" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.storeName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="福利企业" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.companys}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.suStatus==1">草稿</span>
                <span v-else-if="scope.row.suStatus==3">已上架</span>
                <span v-else-if="scope.row.suStatus==4">已下架</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品显示" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isVisible==0">显示</span>
                <span v-else-if="scope.row.isVisible==1">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品二维码" min-width="80">
            <template slot-scope="scope">
                <span @click="goodsQrcode(scope.row)"><img src="../../../../static/img/qrcode.png" style="width:50px;height:50px;cursor:pointer;" alt=""></span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="审核记录" min-width="150">
            <template slot-scope="scope">
                <el-button v-if="scope.row.status==3||scope.row.status==4" type="success" size="small" plain :disabled="true">审核通过</el-button>
                <el-button v-else-if="scope.row.status==2" type="warning" size="small" plain :disabled="true">正在审核</el-button>
                <el-button v-else-if="scope.row.status==1" type="warning" size="small" plain @click="checkGoods(scope.row.id)">提交审核</el-button>
                <el-button v-else-if="scope.row.status==5" type="danger" size="small" plain @click="findAllGoods(scope.row.id)">失败原因</el-button>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="400" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editProduct(scope.row.id)">编辑</el-button>
                <el-button type="primary" size="small" plain @click="seeGoods(scope.row.id)" :disabled="scope.row.suStatus==1">查看</el-button>
                <el-button type="primary" size="small" plain @click="previewGoods(scope.row.id)">预览</el-button>
                <el-button v-if="scope.row.suStatus==1" type="warning" size="small" plain :disabled="true">草稿</el-button>
                <el-button v-else-if="scope.row.suStatus==3" type="warning" size="small" plain @click="checkProduct(scope.row.id,4)">申请下架</el-button>
                <el-button v-else-if="scope.row.suStatus==4" type="primary" size="small" plain  @click="checkProduct(scope.row.id,3)">申请上架</el-button>
                <el-button type="primary" size="small" plain  @click="findCouponStore(scope.row.id)">查看门店配置</el-button>
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

    <el-dialog title="查看商品" :visible.sync="dialogFormVisible">
        <div style="height:400px;overflow-y:auto;overflow-x:hidden;">
            <see-goods :goods-id="goodsId" v-if="dialogFormVisible" ref="seegoods"></see-goods>
        </div>
    </el-dialog>

    <el-dialog title="生成二维码" :visible.sync="dialogFormVisible3" width="400px" center>
            <el-form ref="form" label-width="130px">
                <el-form-item label="请选择渠道">
                    <el-select v-model="qrcodeForm.channelId" @change="createQrcode">
                        <el-option
                            v-for="item in channeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="请选择客户端">
                    <el-select v-model="qrcodeForm.clientId" @change="createQrcode">
                        <el-option
                            v-for="item in clientList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="请选择门店">
                    <el-cascader
                        :options="storeList"
                        change-on-select
                        v-model="qrcodeForm.branchId"
                        :props="props"
                        @change="createQrcode"
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="请选择二维码类型">
                    <el-select v-model="qrcodeForm.qrtype" @change="createQrcode">
                        <el-option
                            v-for="item in qrcodeType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="请选择商品规格" v-if="qrcodeForm.qrtype==4 || qrcodeForm.qrtype==5">
                    <el-select v-model="qrcodeForm.puId" @change="createQrcode">
                        <el-option
                            v-for="item in productUnitList"
                            :key="item.id"
                            :label="item.puName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div style="width:100%;text-align:center;">
                <img :src="imgSrc" style="width:200px;height:200px;" id="qrcode">
                <a href="" id="downloadLink"></a>
            </div>

            <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            placeholder="二维码链接"
            v-model="qrUrl">
            </el-input>

            <div slot="footer" class="dialog-footer" :span="24">
                <el-button type="primary" @click="downloadQrcode">下载</el-button>
                <el-button type="primary" @click="copyQrcode">复制链接</el-button>
                <el-button type="primary" @click="resetQrcode">重新生成</el-button>
            </div>
        </el-dialog>

        <el-dialog title="查看门店配置" :visible.sync="dialogFormVisible2" size="tiny">
            <h6>当前已选择门店共{{checkStoreList.length}}家</h6>
            <div style="margin:15px 0;">
                <el-input placeholder="请输入关键字" v-model="storeForm.storeName">
                    <el-button slot="append" icon="el-icon-search" @click="standardUnitStoreByStandardUnitId"></el-button>
                </el-input>
            </div>
            <el-table :data="checkStoreList" border fit highlight-current-row style="width: 100%">

                <el-table-column align="center" label="门店信息" min-width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.storeName}}</span>
                    </template>
                </el-table-column>

            </el-table>

            <div slot="footer" class="dialog-footer" :span="24">
                <el-button size="medium" @click="dialogFormVisible2 = false">关 闭</el-button>
            </div>
        </el-dialog>
  </div>
</template>


<script>
import QRCode from 'qrcode'
import seeGoods from './seeGoods2.vue'
import {baseUrl,qrCodeUrl} from '../../../config/env'
import {goodsList,putawaySoldOut,findAllGoods,deleteByProductId,submitAuditWithTx,syncSaveSuSerachRule,updateRdidByChannelIdCampaignId,
findChannelAll,standardUnitStoreByStandardUnitId,findPuNameBySuIdBackStage,findStoreAllInfo,findRdidByChannelIdCampaignId,findMerchantProductById} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                merchantProductSerialNumber: "",
                name: "",
                salePrice: "",
                marketPrice: "",
                promotionPrice: "",
                soldBase: "",
                saleWay: "",
                status: "",
                create: "",
                storeName:"",
                pageNo:1,
                pageSize:10,
                orderBy:"0"
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            goodsId:'',
            dialogFormVisible:false,
            qrcodeForm:{
                channelId:'',
                clientId:'',
                branchId:[],
                headActivityCode:'',
                couponId:'',
                couponType:'',
                headActivityCode:'',
                qrtype:'',
                puId:''
            },
            channeList:[],
            clientList:[
                {
                   name:'app',
                   id:1
                },
                {
                   name:'微信',
                   id:2
                },
                {
                   name:'web',
                   id:3
                }
            ],
            qrcodeType:[
                {
                    name:'商品二维码',
                    id:2
                },
                {
                    name:'商品购物车二维码',
                    id:4
                },
                {
                    name:'商品订单二维码',
                    id:5
                }
            ],
            productUnitList:[],
            imgSrc:'./static/img/qrcode.png',
            qrUrl:'',
            dialogFormVisible3:false,
            storeList:[],
            props:{
                value: 'id',
                label: 'name'
            },
            storeForm:{
                standardUnitId:'',
                storeName:'',
                pageSize:10,
                pageNo:1
            },
            checkStoreList:[],
            dialogFormVisible2:false,
            platformId:'',
            qrCodeUrl:''
        }
    },
    created() {
        this.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        if(this.platformId == 7){
            this.qrCodeUrl = baseUrl+'/fgjWechat/#'
        }else if(this.platformId == 2){
            this.qrCodeUrl = baseUrl+'/muu/#'
        }
        this.goodsList();
        this.findChannelAll();
        this.findStoreAllInfo();
    },
    components: {
        seeGoods
    },

    methods: {
        //排序方式切换
        orderSort(){
            this.goodsList(this.ruleForm.orderBy);
        },
        //查询已选择门店接口
        findCouponStore(id){
            this.storeForm.standardUnitId = id;
            this.standardUnitStoreByStandardUnitId();
        },
        async standardUnitStoreByStandardUnitId (id) {
            try {
                const res = await standardUnitStoreByStandardUnitId(this.storeForm);
                if (res.data.code == 0) {
                    this.checkStoreList = res.data.data.stores;
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
        //查询su所有规格属性
        async findPuNameBySuIdBackStage(){
            try{
                const res = await findPuNameBySuIdBackStage({suId:this.qrcodeForm.goodsId});
                if (res.data.code == 0){
                    this.productUnitList = res.data.data;
                    console.log(this.productUnitList);
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                 this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！4044'
                });
            }
        },
        //打开生成二维码
        goodsQrcode(obj){
            this.qrcodeForm = {
                channelId:'',
                clientId:'',
                branchId:[],
                headActivityCode:'',
                goodsId:'',
                puId:'',
                qrtype:''
            };
            this.qrUrl = '';
            this.imgSrc = './static/img/qrcode.png';
            this.qrcodeForm.goodsId = obj.id;
            this.qrcodeForm.headActivityCode = obj.headActivityCode;
            this.dialogFormVisible3 = true;
            //this.findMerchantProductById();
            this.findPuNameBySuIdBackStage();
        },
        //获取门店列表
        async findStoreAllInfo() {
            try {

                this.listLoading = false;
                const res = await findStoreAllInfo();
                if (res.data.code == 0) {
                    this.storeList = res.data.data;

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });

                this.listLoading1 = false;
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

                this.listLoading1 = false;

            }
        },
        //生成二维码
        createQrcode(){
            if(this.qrcodeForm.qrtype == 4||this.qrcodeForm.qrtype== 5){
                if(this.qrcodeForm.branchId.length==0 || this.qrcodeForm.clientId=='' || this.qrcodeForm.channelId==''|| this.qrcodeForm.headActivityCode=='' ||  this.qrcodeForm.qrtype==''){
                }else{
                    let thtf = this;
                    this.channeList.forEach((info,key)=>{
                        if(info.id==thtf.qrcodeForm.channelId){
                            thtf.qrcodeForm.shortCode = info.shortCode;
                        }
                    })
                    this.findRdidByChannelIdCampaignId();
                }
            }else if(this.qrcodeForm.qrtype == 2){
                if(this.qrcodeForm.branchId.length==0 || this.qrcodeForm.clientId=='' || this.qrcodeForm.channelId==''|| this.qrcodeForm.headActivityCode=='' ||  this.qrcodeForm.qrtype==''){
                }else{
                    let thtf = this;
                    this.channeList.forEach((info,key)=>{
                        if(info.id==thtf.qrcodeForm.channelId){
                            thtf.qrcodeForm.shortCode = info.shortCode;
                        }
                    })
                    this.findRdidByChannelIdCampaignId();
                }
            }

        },
         //根据渠道id和活动id更新rdid接口
        async findRdidByChannelIdCampaignId () {
            try {
                let obj = new Object();
                obj.type = this.qrcodeForm.qrtype;
                if(this.qrcodeForm.qrtype ==4){
                    obj.typeId = this.qrcodeForm.puId;
                    obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+'-PUCID'+this.qrcodeForm.puId;
                }else if(this.qrcodeForm.qrtype==5){
                    obj.typeId = this.qrcodeForm.puId;
                    obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+'-PUOID'+this.qrcodeForm.puId;
                }else{
                    obj.typeId = this.qrcodeForm.goodsId;
                    obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+'-SUID'+this.qrcodeForm.goodsId;
                }
                obj.storeId = this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1];
                obj.channelId = this.qrcodeForm.channelId;
               // obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+'-SUID'+this.qrcodeForm.goodsId;
                console.log(obj);
                const res = await findRdidByChannelIdCampaignId(obj);
                if (res.data.code == 0) {
                    let type = '';
                    let qdTyprId = '';
                    if(this.qrcodeForm.qrtype == 2){
                        type='su';
                        qdTyprId = '-SUID';
                    };
                    if(this.qrcodeForm.qrtype == 4){
                        type='puc';
                        qdTyprId = '-PUCID';
                    };
                    if(this.qrcodeForm.qrtype == 5){
                        type='puo';
                        qdTyprId = '-PUOID';
                    };
                    if(this.qrcodeForm.qrtype ==4||this.qrcodeForm.qrtype==5){
                        this.qrUrl = this.qrCodeUrl+'/promotionURL/QRCode.html?platformID='+this.platformId+
                        '&clientID='+this.qrcodeForm.clientId+
                        '&channelID='+this.qrcodeForm.channelId+
                        '&campaignID='+this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+qdTyprId+this.qrcodeForm.puId+
                        '&type='+type+
                        '&typeID='+this.qrcodeForm.puId+
                        '&branchID='+this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1]+
                        '&rdid='+res.data.data.rdid;
                    }else{
                         this.qrUrl = this.qrCodeUrl+'/promotionURL/QRCode.html?platformID='+this.platformId+
                        '&clientID='+this.qrcodeForm.clientId+
                        '&channelID='+this.qrcodeForm.channelId+
                        '&campaignID='+this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+qdTyprId+this.qrcodeForm.goodsId+
                        '&type='+type+
                        '&typeID='+this.qrcodeForm.goodsId+
                        '&branchID='+this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1]+
                        '&rdid='+res.data.data.rdid;
                    }
                    let thtf = this;
                    QRCode.toDataURL( this.qrUrl, function (err, url) {
                        thtf.imgSrc = url;
                    })
                } else {

                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        //重新生成二维码
        resetQrcode(){
            if(this.qrcodeForm.branchId=='' || this.qrcodeForm.clientId=='' || this.qrcodeForm.channelId==''|| this.qrcodeForm.headActivityCode==''){

            }else{
                this.$confirm('该操作会导致该活动与渠道的原有二维码全部失效，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    let thtf = this;
                    this.channeList.forEach((info,key)=>{
                        if(info.id==thtf.qrcodeForm.channelId){
                            thtf.qrcodeForm.shortCode = info.shortCode;
                        }
                    })
                    this.updateRdidByChannelIdCampaignId();
                }).catch(() => {

                })

            }
        },
        //根据渠道id和活动id更新rdid接口
        async updateRdidByChannelIdCampaignId () {
            try {
                let obj = new Object();
                obj.type = this.qrcodeForm.qrtype;
                if(this.qrcodeForm.qrtype ==4){
                    obj.typeId = this.qrcodeForm.puId;
                    obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+'-PUCID'+this.qrcodeForm.puId;
                }else if(this.qrcodeForm.qrtype==5){
                    obj.typeId = this.qrcodeForm.puId;
                    obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+'-PUOID'+this.qrcodeForm.puId;
                }else{
                    obj.typeId = this.qrcodeForm.goodsId;
                    obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+'-SUID'+this.qrcodeForm.goodsId;
                }
                obj.storeId = this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1];
                obj.channelId = this.qrcodeForm.channelId;
               // obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+'-SUID'+this.qrcodeForm.goodsId;
                console.log(obj);
                const res = await updateRdidByChannelIdCampaignId(obj);
                if (res.data.code == 0) {
                    let type = '';
                    let qdTyprId = '';
                    if(this.qrcodeForm.qrtype == 2){
                        type='su';
                        qdTyprId = '-SUID';
                    };
                    if(this.qrcodeForm.qrtype == 4){
                        type='puc';
                        qdTyprId = '-PUCID';
                    };
                    if(this.qrcodeForm.qrtype == 5){
                        type='puo';
                        qdTyprId = '-PUOID';
                    };
                    if(this.qrcodeForm.qrtype ==4||this.qrcodeForm.qrtype==5){
                        this.qrUrl = this.qrCodeUrl+'/promotionURL/QRCode.html?platformID='+this.platformId+
                    '&clientID='+this.qrcodeForm.clientId+
                    '&channelID='+this.qrcodeForm.channelId+
                    '&campaignID='+this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+qdTyprId+this.qrcodeForm.puId+
                    '&type='+type+
                    '&typeID='+this.qrcodeForm.puId+
                    '&branchID='+this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1]+
                    '&rdid='+res.data.data.rdid;
                    }else{
                        this.qrUrl = this.qrCodeUrl+'/promotionURL/QRCode.html?platformID='+this.platformId+
                    '&clientID='+this.qrcodeForm.clientId+
                    '&channelID='+this.qrcodeForm.channelId+
                    '&campaignID='+this.qrcodeForm.shortCode+'-'+this.qrcodeForm.headActivityCode+qdTyprId+this.qrcodeForm.goodsId+
                    '&type='+type+
                    '&typeID='+this.qrcodeForm.goodsId+
                    '&branchID='+this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1]+
                    '&rdid='+res.data.data.rdid;
                    }

                    let thtf = this;
                    QRCode.toDataURL( this.qrUrl, function (err, url) {
                        thtf.imgSrc = url;
                    })
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
        //复制二维码链接
        copyQrcode(){
            if(this.qrUrl == ''){

            }else{
                var oInput = document.createElement('input');
                oInput.value = this.qrUrl;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.style.display='none';
                this.$message({
                    type: 'success',
                    message: '复制成功'
                });
            }

        },

        //下载二维码
        downloadQrcode(){
            if(this.qrUrl == ''){

            }else{
               // 获取base64的图片节点
                var img = document.getElementById('qrcode');
                // 构建画布
                var canvas = document.createElement('canvas');
                canvas.width = img.width+100;
                canvas.height = img.height+100;

                canvas.getContext('2d').drawImage(img, 0, 0);
                // 构造url
                let url = canvas.toDataURL('image/png');
                // 构造a标签并模拟点击
                let imgName = this.qrUrl.replace(this.qrCodeUrl+'/promotionURL/QRCode.html?','');
                imgName = imgName.replace(/=/g,' ');
                imgName = imgName.replace(/&/g,' ');
                var downloadLink = document.getElementById('downloadLink');
                downloadLink.setAttribute('href', url);
                downloadLink.setAttribute('download', imgName+'.png');
                downloadLink.click();
            }

        },
        //获取渠道列表
        async findChannelAll () {
            try {
                const res = await findChannelAll();
                if (res.data.code == 0) {
                    this.channeList = res.data.data;
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
        //商品预览
        previewGoods(id){
            // window.open(baseUrl+'/appFgj/#/shop/goods/'+id,'newwindow','height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no')
            window.open(baseUrl+'/appFgj/#/shop/goods/'+id,'newwindow')
        },
        //获取列表
        async goodsList() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await goodsList(obj);

                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.dataSource = res.data.data.list;

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
            this.goodsList()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.goodsList()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageSize = 10;
            this.ruleForm.pageNo = 1;

            this.ruleForm.create = this.setTimestamp(this.ruleForm.create);
            this.ruleForm.beginTime = this.ruleForm.beginTime?this.setTimestamp(this.ruleForm.beginTime):this.ruleForm.beginTime;
            this.ruleForm.finishTime = this.ruleForm.finishTime?this.setTimestamp(this.ruleForm.finishTime):this.ruleForm.finishTime;
            // console.log(this.ruleForm.beginTime)
            // console.log(this.ruleForm.finishTime)
            // console.log(this.setTimestamp(this.ruleForm.beginTime))
            this.goodsList();
        },
        //重置
        resetForm(formName) {
            this.ruleForm = {
                merchantProductSerialNumber: "",
                name: "",
                salePrice: "",
                marketPrice: "",
                promotionPrice: "",
                soldBase: "",
                saleWay: "",
                status: "",
                create: "",
                storeName:"",
                pageNo:1,
                pageSize:10
            }
            this.goodsList();
        },
        //查看商品
        seeGoods(id){
            this.goodsId = id;
            this.dialogFormVisible = true;
        },
        //新增商品
        addProduct () {
            this.$router.push( {path:'/goods/addGoods'} )
        },


        //编辑商品
        editProduct (id) {
            this.$router.push( {path:'/goods/goodsTabs/'+id} )
        },

        checkProduct (id,status) {
            this.$confirm('是否同步该操作至该SU下的所有PU?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.putawaySoldOut(id,status,1);
            }).catch(() => {
              this.putawaySoldOut(id,status,0);
            })
        },

        //提交审核
        checkGoods(id) {
            this.submitAuditWithTx(id);
        },

        //上下架
        async submitAuditWithTx (id){
            try {

                const res = await submitAuditWithTx({id:id});
                if (res.data.code == 0) {

                    this.$notify({
                        title: '成功',
                        message: res.data.data,
                        type: 'success',
                        duration: 2000
                    });
                    this.goodsList()

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }

            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },
        //刷新缓存
        async syncSaveSuSerachRule (){
            try {

                const res = await syncSaveSuSerachRule();
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.data
                    });
                    this.goodsList()

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }

            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },


        //上下架
        async putawaySoldOut (id,status,type){
            try {

                const res = await putawaySoldOut({id:id,status:status,type:type});
                if (res.data.code == 0) {

                    this.$notify({
                        title: '成功',
                        message: res.data.data,
                        type: 'success',
                        duration: 2000
                    });
                    this.goodsList()

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }

            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },

        //查看失败原因
        async findAllGoods (id) {
            try {

                const res = await findAllGoods({merchantProdId:id});
                if (res.data.code == 0) {

                    this.$notify({
                        title: '失败原因',
                        message: res.data.data.cause,
                        type: 'warning',
                        duration: 5000
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },


        //删除
        delGoods (id){
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              this.deleteByProductId(id)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        },
        async deleteByProductId (id) {
            try {
                 const res = await deleteByProductId({id:id});

                 if (res.data.code == 0) {
                    this.$notify({
                        title: '删除',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    });
                     this.goodsList()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
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
                return "";
            }
            const t = new Date(time);
            return t.getTime()
        },




    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


