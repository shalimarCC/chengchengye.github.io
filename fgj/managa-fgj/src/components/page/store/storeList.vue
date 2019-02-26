<template>
    <div class="filter-container" id="example" v-loading="listLoading1">
        <div style="margin-bottom:20px;width:100%;text-align:right">
            <el-button class="filter-item" @click="addProduct" type="primary" icon="edit">新增门店</el-button>
        </div>

        <tree-grid :columns="columns" :tree-structure="true" v-on:setTableTree="setTableTree" :data-source="dataSource"></tree-grid>

        <el-dialog :title="dilogTitle" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="上级门店" prop="pId">
                <el-cascader
                    :options="dataSource"
                    change-on-select
                    v-model="form.pids"
                    :props="props"
                    :disabled="form.id!=''"
                ></el-cascader>
                </el-form-item>

                <el-form-item label="所属公司">
                    <el-select v-model="form.companyId" :disabled="form.id!=''||form.pids.length!=0">
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <p>注：仅限根节点门店可配置所属企业</p>
                </el-form-item>


                <el-form-item label="门店名称" prop="listSort">
                    <el-input style="width: 200px" class="filter-item" placeholder="不超过50字" v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="是否零售销售" prop="serialNumber">
                    <el-radio-group v-model="form.isDetail">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="省市区">
                    <el-select v-model="form.provinceId" placeholder="请选择省份" @change="changeSite(form.provinceId,1)">
                        <el-option
                        v-for="item in provinceList"
                        :key="item.id"
                        :label="item.areaname"
                        :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.cityId" placeholder="请选择城市" @change="changeSite(form.cityId,2)">
                        <el-option
                        v-for="item in cityList"
                        :key="item.id"
                        :label="item.areaname"
                        :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.countyId" placeholder="请选择区域" @change="changeSite(form.countyId,3)">
                        <el-option
                        v-for="item in areaList"
                        :key="item.id"
                        :label="item.areaname"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="详细地址">
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="form.detailAddress">
                    </el-input>
                </el-form-item>

                <el-form-item label="门店折扣">
                    <el-input-number v-model="form.discount" controls-position="right" :max="100"></el-input-number>%
                    <p>如不填写，默认为上一级门店折扣率</p>
                </el-form-item>

                <el-form-item label="是否门店菜单" prop="serialNumber">
                    <el-radio-group v-model="form.hasStoreMenu">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="类目备注">
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="form.description">
                    </el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" :span="24">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateShop">确 定</el-button>
            </div>

        </el-dialog>

        <el-dialog title="生成二维码" :visible.sync="dialogFormVisible2" width="400px" center>
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
                        :options="dataSource"
                        change-on-select
                        v-model="qrcodeForm.branchId"
                        :props="props"
                        disabled
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



        <el-dialog title="查看商品" :visible.sync="dialogFormVisible3" size="tiny" width="80%">
            <div style="margin-bottom:10px;">

                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="goodsForm.standardUnitSerialNumber">
                </el-input>

                销售价格：
                <el-input-number v-model="goodsForm.salePriceStart" controls-position="right" :min="0"></el-input-number>至
                <el-input-number v-model="goodsForm.salePriceStop" controls-position="right" :min="0"></el-input-number>


                <el-select v-model="goodsForm.isVisible" placeholder="显示状态" style="width: 200px;margin-right:15px;">
                    <el-option
                        key="1"
                        label="隐藏"
                        value="1">
                    </el-option>
                    <el-option
                        key="0"
                        label="显示"
                        value="0">
                    </el-option>
                </el-select>
            </div>
            <div style="margin-bottom:10px;">

                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="goodsForm.standardUnitName">
                </el-input>

                促销价格：
                <el-input-number v-model="goodsForm.promotionPriceStart" controls-position="right" :min="0"></el-input-number>至
                <el-input-number v-model="goodsForm.promotionPriceStop" controls-position="right" :min="0"></el-input-number>

                <el-select v-model="goodsForm.status" placeholder="上架状态" style="width: 200px;margin-right:15px;">
                    <el-option
                        v-for="item in goodsStatus"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                    </el-option>
                </el-select>


                <el-button class="filter-item" type="primary" icon="search" size="medium" @click="searchGoodsForm">搜索</el-button>
                <el-button @click="resetForm" size="medium">重置</el-button>
            </div>
            <el-table :key='tableKey1' :data="goodsList" v-loading.body="listLoading1" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="商品编号" min-width="250">
                    <template slot-scope="scope">
                        <span>{{scope.row.standardUnitSerialNumber}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品名称" min-width="250">
                    <template slot-scope="scope">
                        <span>{{scope.row.standardUnitName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="销售价格" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.salePrice}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="促销价格" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.promotionPrice}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="市场价格" min-width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.marketPrice}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="上架状态" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==3">已上架</span>
                        <span v-else-if="scope.row.status==4">已下架</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="显示状态" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isVisible==0">显示</span>
                        <span v-else-if="scope.row.isVisible==1">隐藏</span>
                    </template>
                </el-table-column>


                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="small" @click="seeGoods(scope.row.id)">查看详情</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange3"
                @current-change="handleCurrentChange3"
                :current-page.sync="goodsForm.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="goodsForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count1">
                </el-pagination>
            </div>
            <el-dialog title="查看产品" :visible.sync="dialogFormVisible1" append-to-body>
                <div>
                    <see-goods :goods-id="goodsId" v-if="dialogFormVisible1" ref="seegoods"></see-goods>
                </div>
            </el-dialog>

        </el-dialog>

        <el-dialog title="选择管理员" :visible.sync="dialogFormVisible4" size="tiny">
            <div style="margin-bottom:20px;">

                <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="手机号码" v-model="userForm.mobile">
                </el-input>

                <el-select v-model="userForm.account_status" placeholder="账号状态" style="width: 200px;margin-right:15px;">
                    <el-option
                        key="0"
                        label="有效"
                        value="0">
                    </el-option>
                    <el-option
                        key="1"
                        label="失效"
                        value="1">
                    </el-option>
                </el-select>


                <el-button class="filter-item" type="primary" icon="search" size="medium" @click="userStoreAdmin">搜索</el-button>
                <el-button @click="resetForm1" size="medium">重置</el-button>
            </div>

            <el-checkbox-group v-model="checkUserForm.checkUserList">
            <el-table :key='tableKey' :data="userList" border fit height="450" highlight-current-row style="width: 100%">
                <el-table-column align="center" width="30">
                    <template slot-scope="scope">
                        <el-checkbox :label="scope.row.id">1</el-checkbox>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="姓名" min-width="80">.
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="员工编号" min-width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.memberCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="邮箱" min-width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.mail}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.mobile}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="所属公司" min-width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.companyName}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="注册状态" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">未注册</span>
                        <span v-else-if="scope.row.status == 1">已注册</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="账号状态" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.accountStatus == 1">无效</span>
                        <span v-else-if="scope.row.accountStatus == 0">有效</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="失效时间" min-width="100">
                    <template slot-scope="scope">
                        {{setTime(scope.row.invalidTime)}}
                    </template>
                </el-table-column>

            </el-table>
            </el-checkbox-group>

            <div slot="footer" class="dialog-footer" :span="24">
                <el-button size="medium" @click="dialogFormVisible4 = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="insertStoreAdminWithTx">确 定</el-button>
            </div>


        </el-dialog>
    </div>
</template>


<script>
import {qrCodeUrl,baseUrl} from '../../../config/env'
import QRCode from 'qrcode'
import TreeGrid from './TreeGrid.vue'
import seeGoods from '../goods/seeGoods2.vue'

import {findStoreAllInfo,findCompanyIdOrName,findProvCityAreaAll,findChannelAll,findStandardUnitStoreOfPage,insertStoreTreeNodeWithTx,findStoreById,
userStoreAdmin,updateStoreByIdWithTx,insertStoreAdminWithTx,updateRdidByChannelIdCampaignId,findRdidByChannelIdCampaignId} from '../../../api/getData';
export default {
    data() {
        return {
            form: {
                pids:[],
                storeTreeId: "",
                companyId:"",
                nodeId:"",
                name:"",
                isDetail:"",
                provinceId:"",
                cityId:"",
                countyId:"",
                detailAddress:"",
                discount:"",
                hasStoreMenu:"",
                description:"",
                province:"",
                city:"",
                county:"",
                id:""
            },
            dataSource: [],
            tableKey: 0,
            listLoading: true,
            listLoading1:true,
            dialogFormVisible: false,
            dialogFormVisible2:false,
            columns: [
                {
                text: '活动短码（未添加渠道码）',
                dataIndex: 'activityCode'
                },
                {
                text: '门店节点码',
                dataIndex: 'listSort'
                },
                {
                text: '门店',
                dataIndex: 'name'
                },
                {
                text: '类目创建时间',
                dataIndex: 'createTime'
                },
                {
                text: '购物车折扣',
                dataIndex: 'discount'
                },
                {
                text: '是否零售',
                dataIndex: 'isDetail'
                },
                {
                text: '门店菜单',
                dataIndex: 'hasStoreMenu'
                },
                {
                text: '二维码',
                dataIndex: ''
                }
            ],
            props : {
                value: 'nodeId',
                label: 'name'
            },
            companyList:[],
            provinceList:[],
            cityList:[],
            areaList:[],
            qrcodeForm:{
                channelId:'',
                clientId:'',
                branchId:[],
                campaignId:''
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
            goodsList:[],
            goodsForm:{
                storeId:'',
                standardUnitName:'',
                standardUnitSerialNumber:'',
                salePriceStart:'',
                salePriceStop:'',
                promotionPriceStart:'',
                promotionPriceStop:'',
                status:'',
                isVisible:'',
                pageSize:10,
                pageNo:1
            },
            dialogFormVisible1:false,
            count1:null,
            tableKey1: 0,
            userForm:{
                companyId:'',
                storeId:'',
                mobile:'',
                account_status:''
            },
            userList:[],
            checkUserForm:{
                storeId:'',
                checkUserList:[],
            },
            dialogFormVisible4:false,
            dilogTitle:'新增门店',
            selectUserList:[],
            goodsId:'',
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
        this.findStoreAllInfo();
        this.findCompanyIdOrName();
        this.findProvCityAreaAll(0,0);
        this.findChannelAll();
    },
    components: {
        TreeGrid,seeGoods
    },
    methods: {
        arrThan(arr1,arr2){
            //临时数组存放
            var tempArray1 = [];//临时数组1
            var tempArray2 = [];//临时数组2

            for(let i=0;i<arr1.length;i++){
                tempArray1[arr1[i]]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
            }

            for(let i=0;i<arr2.length;i++){
                if(!tempArray1[arr2[i]]){
                    tempArray2.push(arr2[i]);//过滤array1 中与array2 相同的元素；
                }
            }
            return tempArray2;
        },
        //选择用户
        async insertStoreAdminWithTx () {
            try {
                let obj = new Object();
                obj.storeId = this.checkUserForm.storeId;

                obj.addUserList = JSON.stringify(this.arrThan(this.selectUserList,this.checkUserForm.checkUserList));
                obj.removeUserList = JSON.stringify(this.arrThan(this.checkUserForm.checkUserList,this.selectUserList));

                const res = await insertStoreAdminWithTx(obj);
                if (res.data.code == 0) {
                    this.dialogFormVisible4 = false;
                    this.$message({
                        type: 'success',
                        message: '选择管理员成功'
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
        handleSelectionChange(val) {
            this.checkUserForm.checkUserList = val;
        },
        resetForm1() {
            this.userForm.mobile = "";
            this.userForm.account_status = "";
            this.userForm.pageZise = 1;
            this.userStoreAdmin();
        },
        //管理员列表
        async userStoreAdmin () {
            try {
                const obj = new Object();
                $.each(this.userForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await userStoreAdmin(obj);
                if (res.data.code == 0) {
                    this.userList = res.data.data.userList;
                    this.selectUserList = res.data.data.uids;
                    this.checkUserForm.checkUserList = res.data.data.uids;
                    this.checkUserForm.storeId = obj.storeId;
                    this.dialogFormVisible4 = true;
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
        //查看商品详情
        seeGoods(id){
            this.goodsId = id;
            this.dialogFormVisible1 = true;
        },
        seeGoodsList(id){
            this.goodsForm.storeId = id;
            this.findStandardUnitStoreOfPage();
        },
        //查看门店所选商品
        async findStandardUnitStoreOfPage () {
            try {
                const obj = new Object();
                //下面的判断会把0过滤掉
                $.each(this.goodsForm, function (key, info) {
                    // console.log(info)
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                // console.log(obj)
                const res = await findStandardUnitStoreOfPage(obj);
                if (res.data.code == 0) {
                    this.count1 = res.data.data.totalSize;
                    this.goodsList = res.data.data.list;
                    this.dialogFormVisible3 = true;
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
        handleSizeChange3(val) {
            this.goodsForm.pageSize = val;
            this.findStandardUnitStoreOfPage()
        },
        handleCurrentChange3(val) {
            this.goodsForm.pageNo = val;
            this.offset1 = (val - 1) * this.goodsForm.pageSize;
            this.findStandardUnitStoreOfPage()
        },
        //重置
        resetForm(){
            let storeId = this.goodsForm.storeId;
            this.goodsForm = {
                storeId:storeId,
                standardUnitName:'',
                standardUnitSerialNumber:'',
                salePriceStart:'',
                salePriceStop:'',
                promotionPriceStart:'',
                promotionPriceStop:'',
                status:'',
                isVisible:'',
                pageSize:10,
                pageNo:1

            };
            this.findStandardUnitStoreOfPage();
        },
        searchGoodsForm(){
            this.goodsForm.pageNo = 1;
            this.findStandardUnitStoreOfPage();
        },
        //生成二维码
        createQrcode(){
            if(this.qrcodeForm.branchId=='' || this.qrcodeForm.clientId=='' || this.qrcodeForm.channelId==''|| this.qrcodeForm.campaignId==''){

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
                obj.type = 1;
                obj.typeId = this.qrcodeForm.storeId;
                obj.storeId = this.qrcodeForm.storeId;
                obj.channelId = this.qrcodeForm.channelId;
                obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.campaignId;
                const res = await findRdidByChannelIdCampaignId(obj);
                if (res.data.code == 0) {
                    let type = this.qrcodeForm.branchId.length == 1 ? 'main_store' : 'branch';
                    if(this.platformId == 7){
                        this.qrCodeUrl = baseUrl+'/fgjWechat/#'
                    }else if(this.platformId == 2){
                        this.qrCodeUrl = baseUrl+'/muu/#'
                    }
                    this.qrUrl = this.qrCodeUrl+'/promotionURL/QRCode.html?platformID='+this.platformId+
                    '&clientID='+this.qrcodeForm.clientId+
                    '&channelID='+this.qrcodeForm.channelId+
                    '&campaignID='+this.qrcodeForm.shortCode+'-'+this.qrcodeForm.campaignId+
                    '&type='+type+
                    '&typeID='+this.qrcodeForm.storeId+
                    '&branchID='+this.qrcodeForm.storeId+
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
                obj.type = 1;
                obj.typeId = this.qrcodeForm.storeId;
                obj.storeId = this.qrcodeForm.storeId;
                obj.channelId = this.qrcodeForm.channelId;
                obj.campaignCode = this.qrcodeForm.shortCode+'-'+this.qrcodeForm.campaignId;
                const res = await updateRdidByChannelIdCampaignId(obj);
                if (res.data.code == 0) {
                    let type = this.qrcodeForm.branchId.length == 1 ? 'main_store' : 'branch';

                    this.qrUrl = this.qrCodeUrl+'/promotionURL/QRCode.html?platformID='+this.platformId+
                    '&clientID='+this.qrcodeForm.clientId+
                    '&channelID='+this.qrcodeForm.channelId+
                    '&campaignID='+this.qrcodeForm.shortCode+'-'+this.qrcodeForm.campaignId+
                    '&type='+type+
                    '&typeID='+this.qrcodeForm.storeId+
                    '&branchID='+this.qrcodeForm.storeId+
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
        changeSite(id,siteType){
            let thtf = this;
            if(siteType == 1){
                $.each(this.provinceList,function(key,info){
                    if(id == info.id){
                        thtf.form.province = info.areaname;
                    }
                })
                this.form.city = '';
                this.form.county = '';
                this.form.cityId = '';
                this.form.countyId = '';
                this.findProvCityAreaAll(id,siteType);
            }else if(siteType == 2){
                $.each(this.cityList,function(key,info){
                    if(id == info.id){
                        thtf.form.city = info.areaname;
                    }
                })
                this.form.county = '';
                this.form.countyId = '';
                this.findProvCityAreaAll(id,siteType);
            }else{
                $.each(this.areaList,function(key,info){
                    if(id == info.id){
                        thtf.form.county = info.areaname;
                    }
                })
            }
        },
        //获取地址列表
        async findProvCityAreaAll(id,siteType) {
            try {
                const res = await findProvCityAreaAll({parentno:id});
                if (res.data.code == 0) {
                    if(siteType == 0){
                        this.provinceList = res.data.data;
                    }else if(siteType == 1){
                        this.cityList = res.data.data;
                    }else{
                        this.areaList = res.data.data;
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
        //获取公司列表
        async findCompanyIdOrName () {
            try {
                const res = await findCompanyIdOrName();
                if (res.data.code == 0) {
                    this.companyList = res.data.data;
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
        //公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.form.companyIds = arr;
        },
        //获取列表
        async findStoreAllInfo() {
            try {

                this.listLoading = false;
                const res = await findStoreAllInfo();
                if (res.data.code == 0) {
                    this.dataSource = res.data.data;
                    this.listLoading1 = false;

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

         //分页
        handleSizeChange(val) {
            this.limit = val;
            this.getUserList()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.getUserList()
        },

        //时间戳转换
        setTime(time) {
            const t = new Date(time);
            let y = t.getFullYear();
            let m = t.getMonth() + 1;
            let d = t.getDate();
            if (m < 10) {
                m = '0' + m
            }
            if (d < 10) {
                d = '0' + d
            }

            return y + '-' + m + '-' + d
        },

        //新增门店
        addProduct () {
            this.dialogFormVisible = true;
            this.checkLabel = [];
            this.dilogTitle = '新增门店';
            this.form =  {
                pids:[],
                storeTreeId: "",
                nodeId:"",
                companyId:"",
                name:"",
                isDetail:"",
                provinceId:"",
                cityId:"",
                countyId:"",
                detailAddress:"",
                discount:"",
                hasStoreMenu:"",
                description:"",
                province:"",
                city:"",
                county:"",
                id:""
            };
        },
        //保存
        updateShop(){
            if(this.form.pids.length != 0){
                this.form.companyId = '';
            }
            if(this.form.id == ""){
                this.insertStoreTreeNodeWithTx();
            }else{
                this.updateStoreByIdWithTx();
            }
        },
        //新增保存
        async insertStoreTreeNodeWithTx () {
            try {
                let obj  = JSON.parse(JSON.stringify(this.form));
                if(this.form.pids.length == 0){
                }else{
                    obj.nodeId = this.form.pids[this.form.pids.length-1];
                    $.each(this.dataSource,function(key,info){
                        if(obj.pids[0] == info.nodeId){
                            obj.storeTreeId = info.storeTreeId;
                        }
                    })
                }

                obj.pids = JSON.stringify(obj.pids);
                const res = await insertStoreTreeNodeWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: '新增',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findStoreAllInfo();
                    this.dialogFormVisible = false;
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
        //新增保存
        async updateStoreByIdWithTx () {
            try {
                let obj  = JSON.parse(JSON.stringify(this.form));
                if(this.form.pids.length == 0){
                }else{
                    $.each(this.dataSource,function(key,info){
                        if(obj.pids[0] == info.nodeId){
                            obj.nodeId = info.nodeId;
                            obj.storeTreeId = info.storeTreeId;
                        }
                    })
                }

                obj.pids = JSON.stringify(obj.pids);
                const res = await updateStoreByIdWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: '编辑',
                        message: '保存成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findStoreAllInfo();
                    this.dialogFormVisible = false;
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
        setTableTree(arr){
            const type = arr[1];
            const obj = arr[0];
            if(type==1){
                this.dilogTitle = '编辑门店';
                this.findStoreById(obj.id);
            }else if(type==3){
                //添加下级
                this.dilogTitle = '添加下级';
                this.form =  {
                    pids:[],
                    storeTreeId: "",
                    nodeId:"",
                    companyId:"",
                    name:"",
                    isDetail:"",
                    provinceId:"",
                    cityId:"",
                    countyId:"",
                    detailAddress:"",
                    discount:"",
                    hasStoreMenu:"",
                    description:"",
                    province:"",
                    city:"",
                    county:"",
                    id:""
                };
                let arr = new Array();
                arr = obj.pids;
                arr.push(obj.nodeId);
                this.form.pids = arr;
                this.dialogFormVisible = true;
            }else if(type==2){
                this.userForm.mobile = "";
                this.userForm.account_status = "";
                this.userForm.pageZise = 1;
                this.userForm.companyId = obj.companyId;
                this.userForm.storeId = obj.id;
                this.userStoreAdmin();
            }else if(type==4){
                this.$router.push('/storeMenuList/'+obj.id);
            }else if(type==5){
                this.seeGoodsList(obj.id);
            }else if(type==6){
                let arr = new Array();
                arr = obj.pids;
                arr.push(obj.nodeId);
                this.qrcodeForm = {
                    channelId:'',
                    clientId:'',
                    branchId:[],
                    campaignId:''
                };
                this.qrcodeForm.branchId = arr;
                this.qrcodeForm.campaignId = obj.activityCode;
                this.qrcodeForm.nodeId = obj.nodeId;
                this.qrcodeForm.storeId = obj.id;
                this.qrUrl = '';
                this.imgSrc = './static/img/qrcode.png';
                this.dialogFormVisible2 = true;
            }
        },

        //删除
        async findStoreById (id){
            const res = await findStoreById({id:id});
            if(res.data.code==0){
                let obj = res.data.data;
                this.form =  {
                    pids:[],
                    storeTreeId: obj.storeTreeId,
                    nodeId:obj.nodeId,
                    companyId:obj.companyId,
                    name:obj.name,
                    isDetail:obj.isDetail,
                    provinceId:obj.provinceId,
                    cityId:obj.cityId,
                    countyId:obj.countyId,
                    detailAddress:obj.detailAddress,
                    discount:obj.discount,
                    hasStoreMenu:obj.hasStoreMenu,
                    description:obj.description,
                    province:obj.province,
                    city:obj.city,
                    county:obj.county,
                    id:id
                };
                if(obj.pids!=null){
                    if(obj.pids[0]==0){
                        this.form.pids = [];
                    }else{
                        this.form.pids = obj.pids;
                    }
                }
                this.findProvCityAreaAll(obj.provinceId,1);
                this.findProvCityAreaAll(obj.cityId,2);
                this.dialogFormVisible = true;
            }else{

                this.$message({
                    type: 'error',
                    message: res.data.error
                });
            }
        },


    }
}
</script>

<style>
#example {
    padding: 5px 20px;
}
.el-cascader-menu{
    width:300px;
}
</style>


