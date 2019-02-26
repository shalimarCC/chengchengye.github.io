<template>
    <div>
        <el-table :data="branchData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="子订单编号">
                <template slot-scope="scope">
                    <span>{{scope.row.childCode}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="收货人">
                <template slot-scope="scope">
                    <span>{{scope.row.receiverName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="联系电话">
                <template slot-scope="scope">
                    <span>{{scope.row.mobile}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="省市区">
                <template slot-scope="scope">
                    <span>{{scope.row.province+scope.row.city+scope.row.county}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="详细地址">
                <template slot-scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="配送日期">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.deliveryDate)}}</span>
                </template>
            </el-table-column>

            <!-- <el-table-column align="center" label="创建类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.type==1">用户创建</span>
                    <span v-else-if="scope.row.type==2">运营创建</span>
                </template>
            </el-table-column> -->

            <el-table-column align="center" label="修改时间">
                <template slot-scope="scope">
                    <span>{{setTime(scope.row.updateTime)}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="修改人">
                <template slot-scope="scope">
                    <span>{{scope.row.modifier}}</span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" plain @click="orderSiteDetail(scope.row.soChildId)">修改</el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-dialog title="修改收货地址" :visible.sync="outerVisible">

            <div style="margin-bottom:20px;height:30px;">
                <el-button class="filter-item" style="float:right" @click="addSite" size="medium" type="primary" icon="edit">添加地址</el-button>
            </div>
            <el-table :data="siteData" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column
                width="55"
                align="center">
                    <template slot-scope="scope">
                        &nbsp;<el-radio v-model="checkSiteId" :label="scope.row.id">&nbsp;</el-radio>
                    </template>

                </el-table-column>

                <el-table-column align="center" label="收货人">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="联系电话">
                    <template slot-scope="scope">
                        <span>{{scope.row.mobile}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="收货地址">
                    <template slot-scope="scope">
                        <span>{{scope.row.province+scope.row.city+scope.row.county+scope.row.address}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="创建类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==1">用户创建</span>
                        <span v-if="scope.row.type==2">后台创建</span>
                        <span v-if="scope.row.type==3">快照</span>
                        <span v-if="scope.row.type==4">原始快照</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.type==1" type="primary" size="small" plain disabled="disabled" @click="changeSite(scope.row.id)" title="用户创建的收货信息不可修改">修改</el-button>
                        <el-button v-else-if="scope.row.type==3||scope.row.type==4" type="primary" size="small" plain disabled="disabled" @click="changeSite(scope.row.id)" title="快照信息不可修改">修改</el-button>
                        <el-button v-else type="primary" size="small" plain @click="changeSite(scope.row.id)">修改</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="ruleForm.pageNo"
                :page-sizes="[8,10,20,30, 50]"
                :page-size="ruleForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
                </el-pagination>
            </div>


            <el-dialog
            width="50%"
            title="修改地址"
            :visible.sync="changeVisible"
            append-to-body>
                <el-form :model="changeForm" label-width="120px">
                    <el-form-item label="收货人姓名">
                        <el-input v-model="changeForm.receiverName"></el-input>
                    </el-form-item>

                    <el-form-item label="收货人手机">
                        <el-input v-model="changeForm.receiverMobile"></el-input>
                    </el-form-item>

                    <el-form-item label="省市区">
                        <el-select v-model="changeForm.provinceId" placeholder="请选择省份" @change="findProvCityAreaAll(changeForm.provinceId,1)">
                            <el-option
                            v-for="item in provinceList"
                            :key="item.id"
                            :label="item.areaname"
                            :value="item.id">
                            </el-option>
                        </el-select>

                        <el-select v-model="changeForm.cityId" placeholder="请选择城市" @change="findProvCityAreaAll(changeForm.cityId,2)">
                            <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.areaname"
                            :value="item.id">
                            </el-option>
                        </el-select>

                        <el-select v-model="changeForm.countyId" placeholder="请选择区域">
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
                        v-model="changeForm.address">
                        </el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="changeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changeSiteInfo">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog
            width="50%"
            title="新增地址"
            :visible.sync="innerVisible"
            append-to-body>
                <el-form ref="form" :model="siteForm" label-width="120px">
                    <el-form-item label="收货人姓名">
                        <el-input v-model="siteForm.receiverName"></el-input>
                    </el-form-item>

                    <el-form-item label="收货人手机">
                        <el-input v-model="siteForm.receiverMobile"></el-input>
                    </el-form-item>

                    <el-form-item label="省市区">
                        <el-select v-model="siteForm.provinceId" placeholder="请选择省份" @change="findProvCityAreaAll(siteForm.provinceId,1)">
                            <el-option
                            v-for="item in provinceList"
                            :key="item.id"
                            :label="item.areaname"
                            :value="item.id">
                            </el-option>
                        </el-select>

                        <el-select v-model="siteForm.cityId" placeholder="请选择城市" @change="findProvCityAreaAll(siteForm.cityId,2)">
                            <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.areaname"
                            :value="item.id">
                            </el-option>
                        </el-select>

                        <el-select v-model="siteForm.countyId" placeholder="请选择区域">
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
                        v-model="siteForm.address">
                        </el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateReceiverInfo">确定</el-button>
                </div>
            </el-dialog>

            <div slot="footer" class="dialog-footer">
                <el-button @click="outerVisible = false">取 消</el-button>
                <el-button @click="updateSite" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {receiverInfos,userReceiverInfos,findProvCityAreaAll,updateReceiverInfo,receiverAddressById,updateAddressCreateByBackStage} from '../../../../api/getData';
export default {

    data () {

        return {
            branchData:[],
            listLoading:true,
            outerVisible:false,
            innerVisible:false,
            changeVisible:false,
            siteData:[],
            checkSiteId:'',
            provinceList:[],
            cityList:[],
            areaList:[],
            siteForm:{
                soChildId:'',
                receiverName:'',
                receiverMobile:'',
                provinceId:'',
                cityId:'',
                countyId:'',
                address:'',
            },
            changeForm:{
                soChildId:'',
                receiverName:'',
                receiverMobile:'',
                provinceId:'',
                cityId:'',
                countyId:'',
                address:'',
            },
            soChildId:'',
            ruleForm:{
                pageNo:1,
                pageSize:8
            },
            count: null,
        }
    },
    created () {
        this.receiverInfos();
    },
    components: {

    },
    computed: {
    },
    methods:{
        async receiverInfos (){
            try {

                const res = await receiverInfos({orderId:this.$route.params.orderId});

                if (res.data.code == 0) {
                    this.branchData = res.data.data.list;
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


         //时间戳转换
        setTime(time) {
            if(time!=null&&time!=""){
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
                return '';
            }

        },

        async orderSiteDetail(id){
            try {
                this.soChildId = id;
                var pageNum = this.ruleForm.pageNo;
                const res = await userReceiverInfos({soChildId:id, pageNum:pageNum});

                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.siteData = res.data.data.list;
                    this.checkSiteId = res.data.data.selectedId;
                    this.outerVisible = true;
                    this.findProvCityAreaAll(0,0);
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

        //新增地址
        addSite(){
            this.cityList = [];
            this.areaList = [];
            this.siteForm = {
                soChildId:this.soChildId,
                receiverName:'',
                receiverMobile:'',
                provinceId:'',
                cityId:'',
                countyId:'',
                address:'',
            };
            this.innerVisible = true;
        },

        //获取地址列表
        async findProvCityAreaAll(id,siteType) {
            try {
                const res = await findProvCityAreaAll({parentno:id});
                if (res.data.code == 0) {
                    if(siteType == 0){
                        this.provinceList = res.data.data;
                        this.siteForm.cityId = '';
                        this.siteForm.countyId = '';
                        this.changeForm.cityId = '';
                        this.changeForm.countyId = '';
                    }else if(siteType == 1){
                        this.cityList = res.data.data;
                        this.siteForm.cityId = '';
                        this.siteForm.countyId = '';
                        this.changeForm.cityId = '';
                        this.changeForm.countyId = '';
                    }else{
                        this.areaList = res.data.data;
                        this.siteForm.countyId = '';
                        this.changeForm.countyId = '';
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
        async getProvCityAreaAll(id,siteType) {
            try {
                const res = await findProvCityAreaAll({parentno:id});
                if (res.data.code == 0) {
                    if(siteType == 0){
                        this.provinceList = res.data.data;
                    }else if(siteType == 1){
                        this.cityList = res.data.data;
                    }else{
                        this.areaList = res.data.data;
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

        //保存新增地址
        async updateReceiverInfo() {
            try {
                const res = await updateReceiverInfo(this.siteForm);
                if (res.data.code == 0) {
                    this.innerVisible = false;
                    this.orderSiteDetail(this.soChildId);
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

        //选择地址
        async updateSite() {
            try {
                const res = await updateReceiverInfo({receiverAddressId:this.checkSiteId,soChildId:this.soChildId});
                if (res.data.code == 0) {
                    this.outerVisible = false;
                    this.receiverInfos();
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

        //修改地址
        async changeSite(id){
            try {
                const res = await receiverAddressById({updateAddressId:id});
                if (res.data.code == 0) {
                    this.cityList = [];
                    this.areaList = [];
                    this.getProvCityAreaAll(0,0);
                    this.changeForm = {
                        soChildId:this.soChildId,
                        updateAddressId:id,
                        receiverName:res.data.data.goodReceiverName,
                        receiverMobile:res.data.data.goodReceiverMobile,
                        provinceId:res.data.data.goodReceiverProvinceId,
                        cityId:res.data.data.goodReceiverCityId,
                        countyId:res.data.data.goodReceiverCountyId,
                        address:res.data.data.goodReceiverAddress,
                    };
                    this.getProvCityAreaAll(this.changeForm.provinceId,1);
                    this.getProvCityAreaAll(this.changeForm.cityId,2);
                    this.changeVisible = true;
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

        //提交修改地址内容
        async changeSiteInfo() {
            try {
                const res = await updateAddressCreateByBackStage(this.changeForm);
                if (res.data.code == 0) {
                    this.changeVisible = false;
                    this.orderSiteDetail(this.soChildId);
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
            this.orderSiteDetail(this.soChildId);
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.orderSiteDetail(this.soChildId);
        },

    }
}

</script>


<style scoped>
    button[disabled] {
        color:#c0c4cc;
    }
    .el-button.is-disabled {
        color:#c0c4cc;
    }
</style>