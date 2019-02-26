<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="优惠券编号" v-model="ruleForm.couponCode">
        </el-input> -->

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="优惠券批次" v-model="ruleForm.couponBatchCode">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="批次名称" v-model="ruleForm.couponBatchName">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="优惠券组/标题" v-model="ruleForm.title">
        </el-input>

        <el-select v-model="ruleForm.grantType" placeholder="发放方式" style="width: 200px;margin-right:15px;">
            <el-option label="系统发放" value="0">
            </el-option>
            <el-option label="用户领取-手动领取/扫码领取" value="1">
            </el-option>
            <el-option label="用户领取-注册领取" value="2">
            </el-option>
            <el-option label="用户领取-unit 领取" value="3">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.isDisplay" placeholder="是否前端展示" style="width: 200px;margin-right:15px;">
            <el-option label="否" value="0">
            </el-option>
            <el-option label="是" value="1">
            </el-option>
        </el-select>
     </div>
     <div style="margin-bottom:20px;">
        <el-date-picker
            v-model="ruleForm.effectStartTime"
            type="date"
            placeholder="有效期（起）" style="width: 200px;">
        </el-date-picker>--
        <el-date-picker
            v-model="ruleForm.effectEndTime"
            type="date"
            placeholder="有效期（止)" style="width: 200px;margin-right:15px;">
        </el-date-picker>

        <el-date-picker
            v-model="ruleForm.receiveStartTime"
            type="date"
            placeholder="发放时间（起）" style="width: 200px;">
        </el-date-picker>--
        <el-date-picker
            v-model="ruleForm.receiveEndTime"
            type="date"
            placeholder="发放时间（止)" style="width: 200px;margin-right:15px;">
        </el-date-picker>

        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button class="filter-item" style="float:right" type="primary" @click="exportCouponUnit" icon="edit" size="medium">优惠券导出</el-button>
     </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border height="650" @selection-change="handleSelectionChange" fit highlight-current-row style="width: 100%" :row-key="getRowKeys">
        <el-table-column
            type="selection"
            width="50"
            align="center"
            :reserve-selection="true">
        </el-table-column>
        <el-table-column align="center" label="优惠券批次" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.couponBatchCode}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="批次名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.couponBatchName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="优惠券组/标题" width="80">
            <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="用户组" min-width="150">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="findEmployeeByCouponBatch(scope.row.id)">查看</el-button>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发放时间" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="有效日期" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.effectTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="有效周期" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.effectDays}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="可领取日期" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.receiveTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发放方式" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.grantType==0">系统发放</span>
                <span v-else-if="scope.row.grantType==1">用户领取</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="领取方式" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.getType==0">手动领取/扫码领取</span>
                <span v-if="scope.row.getType==1">注册领取</span>
                <span v-if="scope.row.getType==2">unit领取</span>
                <span v-if="scope.row.getType==3">以旧换新</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="客户端使用页" min-width="160">
            <template slot-scope="scope">
                <span v-if="scope.row.linkableButtonPageList && scope.row.linkableButtonPageList[0].clientType==6">{{scope.row.linkableButtonPageList[0].pageName}}</span>
                <span v-else-if="scope.row.linkableButtonPageList && scope.row.linkableButtonPageList[1].clientType==6">{{scope.row.linkableButtonPageList[1].pageName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="PC端使用页" min-width="160">
            <template slot-scope="scope">
                 <span v-if="scope.row.linkableButtonPageList && scope.row.linkableButtonPageList[0].clientType==5">{{scope.row.linkableButtonPageList[0].pageName}}</span>
                <span v-else-if="scope.row.linkableButtonPageList && scope.row.linkableButtonPageList[1].clientType==5">{{scope.row.linkableButtonPageList[1].pageName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否前端展示" min-width="60">
            <template slot-scope="scope">
                <span v-if="scope.row.isDisplay==0">否</span>
                <span v-else-if="scope.row.isDisplay==1">是</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="可否再次领用" min-width="60">
            <template slot-scope="scope">
                <span v-if="scope.row.isRepeat==0">否</span>
                <span v-else-if="scope.row.isRepeat==1">是</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发放数量" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.grantCount==-1">不限量</span>
                <span v-else>{{scope.row.grantCount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作人" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.creator}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="修改时间" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.updateTime}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="已领取数量" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.receivedCount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="已使用数量" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.usedCount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="已过期数量" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.expiredCount}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="活动短码(未含渠道码)" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.campaignId}}</span>
            </template>
        </el-table-column>



        <el-table-column align="center" label="操作" width="300"  fixed="right">
            <template slot-scope="scope">
                <span class="btnsCode"  @click="openQrcode(scope.row)"><img src="../../../../static/img/qrcode.png" style="width:50px;height:50px;cursor:pointer;" alt=""></span>
                <span class="btnsIn">
                    <el-button style="margin:0 0 4px 0;" type="primary" @click="editGrantDiscount(scope.row.id)" :disabled="scope.row.grantType==0" size="small" plain>编辑</el-button>
                    <el-button style="margin:0 0 4px 0;" type="primary" v-if="scope.row.isEffect==0" @click="invalidCouponBatchWithTx(scope.row.id)" size="small" plain>设为失效</el-button>
                    <el-button style="margin:0 0 4px 0;" type="primary" v-if="scope.row.grantType==0 || scope.row.getType==2" @click="partialFailure(scope.row.id)" size="small" plain>部分失效</el-button>
                    <el-button style="margin:0 0 4px 0;" type="primary" v-if="scope.row.isEffect==1" disabled size="small" plain>已失效</el-button>
                    <el-button style="margin:0 0 4px 0;" type="primary" v-if="scope.row.isDisplay==0" @click="updateCouponBatchByIdWithTx(scope.row.isDisplay,scope.row.id)" size="small" plain>显示</el-button>
                    <el-button style="margin:0 0 4px 0;" type="primary" v-if="scope.row.isDisplay==1" @click="updateCouponBatchByIdWithTx(scope.row.isDisplay,scope.row.id)" size="small" plain>隐藏</el-button>
                </span>
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


    <el-dialog title="关联企业" :visible.sync="dialogFormVisible2">
        <div style="height:500px;overflow:auto;">
            <el-table :data="userData" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="员工编号">
                    <template slot-scope="scope">
                        <span>{{scope.row.memberCode}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="邮箱">
                    <template slot-scope="scope">
                        <span>{{scope.row.mail}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="手机号码">
                    <template slot-scope="scope">
                        <span>{{scope.row.mobile}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="性别">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex==0">女</span>
                        <span v-else-if="scope.row.sex==1">男</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="生日">
                    <template slot-scope="scope">
                        <span>{{scope.row.birthday}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="所属公司">
                    <template slot-scope="scope">
                        <span>{{scope.row.companyName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="所在部门">
                    <template slot-scope="scope">
                        <span>{{scope.row.departmentName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="注册状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==0">未注册</span>
                        <span v-if="scope.row.status==1">已注册</span>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page.sync="userForm.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="userForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count1">
                </el-pagination>
            </div>
        </div>
    </el-dialog>

    <el-dialog title="生成二维码" :visible.sync="dialogFormVisible3" width="400px" center>
            <el-form ref="form" :model="form" label-width="120px">
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

            </el-form>
            <div style="width:100%;text-align:center;">
                <img :src="imgSrc" id="qrcode" style="width:200px;height:200px;">
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

        <el-dialog title="部分失效请设置起止unit编号" :visible.sync="dialogFormVisible4" width="400px" center>
            <div class="unitCodese">
                <el-input v-model="startNum"></el-input>
                <span>-</span>
                <el-input v-model="endNum"></el-input>
            </div>
            <div class="btnscol">
                <el-button type="primary" @click="efficacyConfirm">确定</el-button>
                <el-button type="primary" @click="dialogFormVisible4=false">取消</el-button>
            </div>

        </el-dialog>
  </div>
</template>


<script>
import QRCode from 'qrcode';
import {qrCodeUrl} from '../../../config/env'
import {baseUrl} from '../../../config/env'
var moment = require('moment');
moment().format();
import {
    findCouponBatchOfPage,
    findEmployeeByCouponBatch,
    invalidCouponBatchWithTx,
    updateCouponBatchByIdWithTx,
    findStoreAllInfo,
    findChannelAll,
    findRdidByChannelIdCampaignId,
    updateRdidByChannelIdCampaignId,
    exportCouponUnit,
    updateCouponUnitStatus
    } from '../../../api/getData';
export default {
    data() {
        return {
            getRowKeys(row) {
                return row.id;
            },
            selectedData: [],
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            form:{

            },
            title:'新增优惠券',
            ruleForm:{
                grantType:'',
                isDisplay:'',
                couponBatchCode:'',
                receiveStartTime:'',
                receiveEndTime:'',
                effectStartTime:'',
                effectEndTime:'',
                title:'',
                pageNo:1,
                pageSize:10,
                couponBatchName:''
            },
            failReason:'',
            companyList:[],
            loading:false,
            dialogFormVisible1:false,
            dataSource1:[],
            count1: null,
            offset1: 0,
            tableKey1:0,
            userForm:{
                pageSize:10,
                pageNo:1,
                id:''
            },
            userData:[],
            checkGroup:[],
            ruleForm1:{
                couponCode:'',
                title:'',
                couponType:'',
                goodsId:'',
                isDelete:'',
                pageNo:1,
                pageSize:10
            },
            seeGroupForm:{},
            dialogFormVisible2:false,
            qrcodeForm:{
                channelId:'',
                clientId:'',
                branchId:[],
                campaignId:'',
                couponId:'',
                couponType:'',
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
            goodsStatus:[
                {
                    key:"已上架",
                    value:"3"
                },
                {
                    key:"已下架",
                    value:"4"
                }
            ],
            imgSrc:'./static/img/qrcode.png',
            qrUrl:'',
            dialogFormVisible3:false,
            storeList:[],
            props:{
                value: 'id',
                label: 'name'
            },
            platformId:'',
            qrCodeUrl:'',
            passAll:[],
            passAllType1:[],
            passAllType2:[],
            selectionList:[],
            uploadExcel:false,
            dialogFormVisible4:false,
            couponBatchId:'',
            startNum:'',
            endNum:''
        }
    },
    created() {
        this.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        if(this.platformId == 7){
            this.qrCodeUrl = baseUrl+'/fgjWechat/#'
        }else if(this.platformId == 2){
            this.qrCodeUrl = baseUrl+'/muu/#'
        }
        this.findCouponBatchOfPage();
        this.findStoreAllInfo();
        this.findChannelAll();
    },

    methods: {
        //设置部分失效
        partialFailure(id){
            this.couponBatchId = id;
            this.startNum='';
            this.endNum='';
            this.dialogFormVisible4=true;
        },
        async updateCouponUnitStatus(){
            try{
                var reg =  /^[0-9]*$/;
                if(!reg.test(this.startNum)){
                    this.$message({
                        type: 'error',
                        message: 'unit编号输入不合法,请输入数字'
                    });
                    return false;
                };
                if(!reg.test(this.endNum)){
                    this.$message({
                        type: 'error',
                        message: 'unit编号输入不合法,请输入数字'
                    });
                    return false;
                };
                const res = await updateCouponUnitStatus({couponBatchId:this.couponBatchId,startNum:this.startNum,endNum:this.endNum});
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        message: res.data.data
                    });
                    this.dialogFormVisible4 = false;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '失效设置数据获取失败，请重试'
                });
            }
        },
        efficacyConfirm(){
            this.updateCouponUnitStatus();
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
        //导出优惠券列表
        // async exportCouponUnit() {
        //     try {
        //         console.log(JSON.stringify(this.passAll))
        //         const res = await exportCouponUnit({batchList:JSON.stringify(this.passAll)});
        //         if (res.data.code == 0) {
        //             window.open(res.data.data);
        //         }
        //     } catch (err) {
        //
        //     }
        // },
        exportCouponUnit(){
            let arr = new Array;
            var _this = this;
            this.uploadExcel = false;
            console.log(this.selectionList)
            if(!this.selectionList||this.selectionList.length==0){
                this.$message.error('请选择优惠券');
            }else{
                $.each(this.selectionList,function(key,info){
                    if(info.getType == 2 && info.grantType == 1) {
                        arr.push(info.id);
                        _this.passAll = arr;
                        if(!_this.uploadExcel){
                            window.location.href = baseUrl +'/back-promotion-web/promotion/couponBatch/exportCouponUnit.do'+'?'+'batchList='+JSON.stringify(_this.passAll)+'&platformId='+_this.platformId;
                        }
                    }else {
                        _this.$message.error('仅 unit领取型的发放批次可以被导出，请重新选择');
                        _this.uploadExcel = true;
                    }
                })
            }
        },
        handleSelectionChange (selection) {
            this.selectionList = selection;
            // let arr = new Array;
            // $.each(selection,function(key,info){
            //     if(info.getType != 2 && info.grantType != 1){
            //         this.$message.error('仅 unit领取型的发放批次可以被导出，请重新选择');
            //     }else{
            //         arr.push(info.id);
            //     }
            // })
            // this.passAll = arr;
            this.selectedData = [];
            if (selection) {
                selection.forEach(row => {
                    if (row) {
                        this.selectedData.push(row.id);
                    }
                });
            }
            console.log(this.selectedData);
        },
        openQrcode(obj){
            this.qrcodeForm = {
                channelId:'',
                clientId:'',
                branchId:[],
                campaignId:'',
                couponId:''
            };
            this.qrcodeForm.couponId = obj.id;
            this.qrcodeForm.campaignId = obj.campaignId;
            this.qrcodeForm.couponType = obj.couponRelType;
            this.qrUrl = '';
            this.imgSrc = './static/img/qrcode.png';
            this.dialogFormVisible3 = true;

        },
        //生成二维码
        createQrcode(){
            if(this.qrcodeForm.branchId.length==0 || this.qrcodeForm.clientId=='' || this.qrcodeForm.channelId==''|| this.qrcodeForm.campaignId==''){

            }else{
                let thtf = this;
                this.channeList.forEach((info,key)=>{
                    if(info.id==thtf.qrcodeForm.channelId){
                        thtf.qrcodeForm.shortCode = info.shortCode;
                    }
                })
                this.findRdidByChannelIdCampaignId();

            }
        },
         //根据渠道id和活动id更新rdid接口
        async findRdidByChannelIdCampaignId () {
            try {
                let obj = new Object();
                obj.type = 3;
                obj.typeId = this.qrcodeForm.couponId;
                obj.storeId = this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1];
                obj.channelId = this.qrcodeForm.channelId;
                obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.campaignId;
                const res = await findRdidByChannelIdCampaignId(obj);
                if (res.data.code == 0) {
                    let type = this.qrcodeForm.couponType == 0 ? 'coupon' : 'coupon_group';
                    if(this.platformId == 7){
                        this.qrCodeUrl = baseUrl+'/fgjWechat/#'
                    }else if(this.platformId == 2){
                        this.qrCodeUrl = baseUrl+'/muu/#'
                    }
                    this.qrUrl =  this.qrCodeUrl+'/promotionURL/QRCode.html?platformID='+this.platformId+
                    '&clientID='+this.qrcodeForm.clientId+
                    '&channelID='+this.qrcodeForm.channelId+
                    '&campaignID='+this.qrcodeForm.shortCode+'-'+this.qrcodeForm.campaignId+
                    '&type='+type+
                    '&typeID='+this.qrcodeForm.couponId+
                    '&branchID='+this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1]+
                    '&rdid='+res.data.data.rdid;
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
        //重新生成二维码
        resetQrcode(){
            if(this.qrcodeForm.branchId=='' || this.qrcodeForm.clientId=='' || this.qrcodeForm.channelId==''|| this.qrcodeForm.campaignId==''){

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
                obj.type = 3;
                obj.typeId = this.qrcodeForm.couponId;
                obj.storeId = this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1];
                obj.channelId = this.qrcodeForm.channelId;
                obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.campaignId;
                const res = await updateRdidByChannelIdCampaignId(obj);
                if (res.data.code == 0) {
                    let type = this.qrcodeForm.couponType == 0 ? 'coupon' : 'coupon_group';

                    this.qrUrl = this.qrCodeUrl+'/promotionURL/QRCode.html?platformID='+this.platformId+
                    '&clientID='+this.qrcodeForm.clientId+
                    '&channelID='+this.qrcodeForm.channelId+
                    '&campaignID='+this.qrcodeForm.shortCode+'-'+this.qrcodeForm.campaignId+
                    '&type='+type+
                    '&typeID='+this.qrcodeForm.couponId+
                    '&branchID='+this.qrcodeForm.branchId[this.qrcodeForm.branchId.length-1]+
                    '&rdid='+res.data.data.rdid;
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
        //下载二维码
        downloadQrcode(){
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
        //获取列表
        async findCouponBatchOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                if(obj.grantType == 1){
                    obj.grantType = 1;
                    obj.getType = 0;
                }
                if(obj.grantType == 2){
                    obj.grantType = 1;
                    obj.getType = 1;
                }
                if(obj.grantType == 3){
                    obj.grantType = 1;
                    obj.getType = 2;
                }
                if(obj.receiveStartTime!=''&&obj.receiveStartTime!=null){
                    obj.receiveStartTime = this.setTimestamp(obj.receiveStartTime);
                }
                if(obj.receiveEndTime!=''&&obj.receiveEndTime!=null){
                    obj.receiveEndTime = this.setTimestamp(obj.receiveEndTime);
                }
                if(obj.effectStartTime!=''&&obj.effectStartTime!=null){
                    obj.effectStartTime = this.setTimestamp(obj.effectStartTime);
                }
                if(obj.effectEndTime!=''&&obj.effectEndTime!=null){
                    obj.effectEndTime = this.setTimestamp(obj.effectEndTime);
                }
                this.listLoading = false;
                const res = await findCouponBatchOfPage(obj);

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
            this.findCouponBatchOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findCouponBatchOfPage()
        },

        //重置
        resetForm(){
            this.ruleForm={
                grantType:'',
                isDisplay:'',
                couponBatchCode:'',
                receiveStartTime:'',
                receiveEndTime:'',
                effectStartTime:'',
                effectEndTime:'',
                title:'',
                pageNo:1,
                pageSize:10
            };

            this.findCouponBatchOfPage()
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findCouponBatchOfPage()
        },
        //编辑
        editGrantDiscount(id){
            this.$router.push("/editGrantDiscount/"+id)
        },
        //设为失效
        invalidCouponBatchWithTx(id){
            this.$confirm('该操作将使该批次下所有可使用的优惠券更改为已失效状态，确定操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
                }).then(() => {
                    this.invalidCouponBatchWithTxAjax(id)
                }).catch(() => {
            })
        },
        async invalidCouponBatchWithTxAjax (id) {
            try {
                const res = await invalidCouponBatchWithTx({id:id});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '已设为失效'
                    });
                    this.findCouponBatchOfPage();
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
        updateCouponBatchByIdWithTx(isDisplay,id){
            if(isDisplay==0){
                this.$confirm('该操作将显示该批次下优惠券领取入口（包括领券中心、商品详情），确定操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                    }).then(() => {
                        this.updateCouponBatchByIdWithTxAjax(id)
                    }).catch(() => {
                })
            }else if(isDisplay==1){
                this.$confirm('该操作将隐藏该批次下优惠券领取入口（包括领券中心、商品详情），确定操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                    }).then(() => {
                        this.updateCouponBatchByIdWithTxAjax(id)
                    }).catch(() => {
                })
            }
        },
        async updateCouponBatchByIdWithTxAjax (id) {
            try {
                const res = await updateCouponBatchByIdWithTx({id:id});
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '修改状态成功'
                    });
                    this.findCouponBatchOfPage();
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
        //新增优惠券组
        addGroup(){
            this.title = '新增优惠券';
            this.groupForm = {
                coupons:[],
                groupName:'',
                groupDescp:'',
                id:''
            };
            this.dialogFormVisible = true;
        },

        //查询优惠卷批次已选择的员工
        async findEmployeeByCouponBatch(id){
            try {

                const res = await findEmployeeByCouponBatch({id:id,pageNo:this.userForm.pageNo,pageSize:this.userForm.pageSize});
                if (res.data.code == 0) {
                    this.userForm.id = id;
                    this.count1 = res.data.data.totalSize;
                    this.userData = res.data.data.list;
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

        //分页
        handleSizeChange2(val) {
            this.userForm.pageSize = val;
            // console.log(this.userForm.id);
            this.findEmployeeByCouponBatch(this.userForm.id);
        },
        handleCurrentChange2(val) {
            this.userForm.pageNo = val;
            this.offset = (val - 1) * this.userForm.pageSize;
            this.findEmployeeByCouponBatch(this.userForm.id);
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
            const t = new Date(time);
            return t.getTime()
        },




    }
}
</script>

<style>
#example {
    padding: 10px 20px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .btnsCode{
      display:block;
      float:left;
      width:50px;
  }
  .btnsIn{
      display:block;
      float:left;
      width:200px;
  }
  .unitCodese{
      display:flex;
  }
  .unitCodese span{
      display:inline-block;
      padding:0 6px;
      line-height: 40px;
  }
  .btnscol{
      text-align: center;
      padding-top: 20px;
  }
</style>


