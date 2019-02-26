<template>
    <div id="example">
        <template v-if="active==1">
            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="优惠券标题">
                    {{form.title}}
                </el-form-item>

                <el-form-item label="优惠券类型">
                    <el-select v-model="form.couponType" placeholder="请选择优惠券类型" style="width: 200px;margin-right:15px;" @change="form.discountAmount=''" disabled>
                        <el-option label="满减券" :value="0">
                        </el-option>
                        <el-option label="兑换券" :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品价值" v-if="form.couponType==1">
                    {{form.discountAmount}}
                    <p style="font-size:12px;line-height:30px;color:#999;text-align:left;">Tips : 单件商品的价值，便于后期统计。</p>
                </el-form-item>

                <el-form-item label="优惠金额" v-if="form.couponType===0">
                    {{form.discountAmount}}
                </el-form-item>

                <el-form-item label="触发金额" v-if="form.couponType===0">
                    {{form.triggerAmount}}
                </el-form-item>

                <el-form-item label="选择商品">
                    <el-select v-model="form.goodsType" placeholder="请选择商品类型" style="width: 200px;margin-right:15px;" disabled>
                        <el-option label="单个SU" :value="0">
                        </el-option>
                        <el-option label="SU组" :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="可触发满减规则的单SU" v-if="form.goodsType === 0">
                    <el-button type="primary" size="small" plain @click="seeGoods(form.goodsId)" v-if="checkGoods.name != ''">{{checkGoods.name}}</el-button>
                </el-form-item>

                <el-form-item label="可触发满减规则的商品组"  v-if="form.goodsType == 1">
                    <el-button type="primary" size="small" plain @click="seeStandardUnit()" v-if="checkStandardUnit.name != ''">{{checkStandardUnit.name}}</el-button>
                    </el-tag>

                </el-form-item>

                <el-form-item label="可使用次数" v-if="form.couponType===0">
                    {{form.usageCount}}
                </el-form-item>

                <el-form-item label="自定义icon" v-if="form.couponType==1">
                    <div class="avatar-uploader">
                        <img :src="form.iconUrl">
                    </div>
                </el-form-item>

                <el-form-item label="所属公司">
                    <el-button type="primary" size="small" plain @click="findCouponCompanyOfPage()">查看</el-button>
                </el-form-item>

                <el-form-item label="优惠券详情">
                    {{form.detail}}
                </el-form-item>

            </el-form>
            <el-dialog title="关联企业" :visible.sync="dialogFormVisible2">
                <div style="height:500px;overflow:auto;">
                    <el-table :data="companyData" border fit highlight-current-row style="width: 100%">
                        <el-table-column align="center" label="企业/企业分组名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.companyName}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="公司类型">
                            <template slot-scope="scope">
                                <span>730新需求</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="备注">
                            <template slot-scope="scope">
                                <span>{{scope.row.companyContent}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-dialog>

            <el-dialog title="查看商品详情" :visible.sync="dialogFormVisible1" append-to-body>
                <div>
                    <see-goods :goods-id="goodsId" v-if="dialogFormVisible1" ref="seegoods"></see-goods>
                </div>
            </el-dialog>

            <el-dialog title="查看商品分组" :visible.sync="dialogFormVisible3" append-to-body>
                <div>
                    <el-table :key='tableKey1' :data="goodsList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

                        <el-table-column align="center" label="商品名称" min-width="250">
                            <template slot-scope="scope">
                                <span>{{scope.row.StandardUnitName}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="商品ID" min-width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.standardUnitId}}</span>
                            </template>
                        </el-table-column>


                        <el-table-column align="center" label="操作" width="350">
                            <template slot-scope="scope">
                                <el-button type="primary" plain size="small" @click="seeGoods(scope.row.standardUnitId)">查看详情</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                        <el-pagination
                        @size-change="handleSizeChange3"
                        @current-change="handleCurrentChange3"
                        :current-page.sync="ruleForm3.pageNo"
                        :page-sizes="[10,20,30, 50]"
                        :page-size="ruleForm3.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="count3">
                        </el-pagination>
                    </div>
                </div>
            </el-dialog>
        </template>
        <template v-else-if="active==2">
            <img src="../../../assets/success.jpg" />
        </template>

  </div>

</template>



<script>
var moment = require('moment');
moment().format();
import seeGoods from '../goods/seeGoods2.vue'
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {findMerchantProductOfPage,findStandardUnitCombinationOfPage,findCompanyIdOrName,queryStandardUnitListByBlurry,getQiNiuToken,insertOrUpdateCouponWithTx,findCouponById,findCouponCompanyOfPage,findByStandardUnitCombinationIdOfPage} from '../../../api/getData';
export default {
    data() {
        return {
            form:{
                id:'',
                companys:'',
                title:'',
                detail:'',
                iconUrl:'',
                couponType:'',
                goodsType:'',
                goodsId:'',
                usageCount:'',
                jumpType:'',
                discountAmount:'',
                triggerAmount:'',
            },
            active:1,
            dialogFormVisible1:false,
            dialogFormVisible3:false,
            goodsForm:{
                standardUnitName:'',
                status:'',
                saleWay:'',
                pageNo:1,
                pageSize:10,

            },
            count1:null,
            tableKey1: 0,
            listLoading1: true,
            offset1: 0,
            goodsListBase:[],
            goodsId:'',
            dataSource2: [],
            offset2: 0,
            count2: null,
            tableKey2: 0,
            listLoading2: true,
            dialogFormVisible2:false,
            ruleForm:{
                combinationName:'',
                pageNo:1,
                pageSize:10
            },
            checkGoods:{
                name:'',
                id:''
            },
            checkStandardUnit:{
                name:'',
                id:''
            },
            companyList:[],
            allStatus:false,
            baseImgPath:'',
            baseImgUrl:'',
            imgForm:{
                key:'',
                token:'',
            },
            companyData:[],
            companyForm:{
                id:'',
                type:0,
                pageNo:1,
                pageSize:10
            },
            goodsList:[],
            count3:null,
            listLoading:false,
            ruleForm3:{
                standardUnitCombinationId:'',
                pageNo:1,
                pageSize:10
            },
        }
    },
    created () {
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        this.findCompanyIdOrName();
        this.findCouponById();
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
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,12);

                if(str == "/seeDiscount"){
                    Object.assign(this.$data, this.$options.data());
                    this.findCouponById();
                }

            },
        }
    },
    components: {
        seeGoods
    },
    methods:{

        //获取公司列表
        async findCouponById () {
            try {
                const res = await findCouponById({id:this.$route.params.id});
                if (res.data.code == 0) {
                    let obj = res.data.data;
                    this.form = {
                        id:obj.id,
                        companys:obj.companyList,
                        title:obj.title,
                        detail:obj.detail,
                        iconUrl:obj.iconUrl,
                        couponType:obj.couponType,
                        goodsType:obj.goodsType,
                        goodsId:obj.goodsId,
                        usageCount:obj.usageCount,
                        jumpType:obj.jumpType,
                        discountAmount:obj.discountAmount,
                        triggerAmount:obj.triggerAmount,
                    };
                    if(obj.goodsType == 0){
                        this.checkGoods={
                            name:obj.suName,
                            id:obj.goodsId
                        };
                    }else if(obj.goodsType == 1){
                        this.checkStandardUnit={
                            name:obj.suName,
                            id:obj.goodsId
                        };
                    }
                    if(obj.companyList[0]==-1){
                        this.form.companys = [];
                        this.allStatus = true;
                    }else{
                        this.allStatus = false;
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
        //新增商品
        addGoods(){
            this.goodsForm = {
                standardUnitName:'',
                status:'',
                saleWay:'',
                pageNo:1,
                pageSize:10,

            };
            this.queryStandardUnitListByBlurry();
            this.dialogFormVisible = true;
        },
        //查看商品分组详情
        async seeStandardUnit () {
            try {
                this.ruleForm3.standardUnitCombinationId = this.form.goodsId;
                const res = await findByStandardUnitCombinationIdOfPage(this.ruleForm3);
                this.listLoading = false;
                if (res.data.code == 0) {
                    this.count3 = res.data.data.totalSize;
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
            this.ruleForm3.pageSize = val;
            this.seeStandardUnit()
        },
        handleCurrentChange3(val) {
            this.ruleForm3.pageNo = val;
            this.offset1 = (val - 1) * this.ruleForm3.pageSize;
            this.seeStandardUnit()
        },
        //查看商品详情
        seeGoods(id){
            this.goodsId = id;
            this.dialogFormVisible1 = true;
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
            this.form.companys = arr;
        },

        //重置
        resetForm(){
            this.goodsForm = {
                standardUnitName:'',
                status:'',
                saleWay:'',
                pageNo:1,
                pageSize:10,

            };
            this.queryStandardUnitListByBlurry();
        },
        //优惠卷的所属公司列表
        async findCouponCompanyOfPage(){
            try {
                this.companyForm.id = this.$route.params.id;
                this.companyForm.type = 0;
                const res = await findCouponCompanyOfPage(this.companyForm);
                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.dialogFormVisible2 = true;
                    this.companyData = res.data.data;
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
        async queryStandardUnitListByBlurry () {
            try {
                const obj = new Object();
                $.each(this.goodsForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await queryStandardUnitListByBlurry(obj);
                this.listLoading1 = false;
                if (res.data.code == 0) {
                    this.count1 = res.data.data.totalSize;
                    this.goodsListBase = res.data.data.list;
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
        //选择商品确定
        selectGoods(obj){
            this.checkGoods.name = obj.name;
            this.checkGoods.id = obj.id;
            this.dialogFormVisible = false;
        },

        //选择商品分组
        addStandardUnit(){
            this.ruleForm = {
                combinationName:'',
                pageNo:1,
                pageSize:10
            };
            this.findStandardUnitCombinationOfPage();
            this.dialogFormVisible2 = true;
        },

         //分页
        handleSizeChange2(val) {
            this.ruleForm.pageSize = val;
            this.findStandardUnitCombinationOfPage()
        },
        handleCurrentChange2(val) {
            this.ruleForm.pageNo = val;
            this.offset2 = (val - 1) * this.ruleForm.pageSize;
            this.findStandardUnitCombinationOfPage()
        },
        //重置
        resetForm(){
            this.ruleForm = {
                combinationName:'',
                pageNo:1,
                pageSize:10

            };
            this.findStandardUnitCombinationOfPage();
        },
        async findStandardUnitCombinationOfPage () {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                const res = await findStandardUnitCombinationOfPage(obj);
                this.listLoading2 = false;
                if (res.data.code == 0) {
                    this.count2 = res.data.data.totalSize;
                    this.dataSource2 = res.data.data.list;
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
        //选择商品分组确定
        selectStandardUnit(obj){
            this.checkStandardUnit.name = obj.combinationName;
            this.checkStandardUnit.id = obj.standardUnitCombinationId;
            this.dialogFormVisible2 = false;
        },
        //重置商品组合
        resetStandardUnit(){
            this.checkStandardUnit = {
                name:'',
                id:''
            }
        },

        //保存
        saveDiscount(){
            if(this.form.goodsType==0){
                this.form.goodsId = this.checkGoods.id;
                this.form.jumpType = 1;
            }else if(this.form.goodsType==1){
                this.form.goodsId = this.checkStandardUnit.id;
                this.form.jumpType = 2;
            }
            this.insertOrUpdateCouponWithTx();
        },
        async insertOrUpdateCouponWithTx(){
            try {
                let obj = JSON.parse(JSON.stringify(this.form));
                if(this.allStatus){
                    obj.companys = "[-1]";
                }else{
                    obj.companys = JSON.stringify(this.form.companys);
                }
                const res = await insertOrUpdateCouponWithTx(obj);
                if (res.data.code == 0) {
                    this.active = 2;
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
            const t = new Date(time);
            return t.getTime()
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
            if (!isJPG&&!isPNG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }

            return isJPG||isPNG

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
            this.form.iconUrl = this.baseImgUrl + response.key;
        },

    }


}
</script>

<style>
#example {
    padding: 5px 20px;

}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:100%;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader {
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
.avatar-uploader img{
    width:100%;
    height:100%;
}
</style>


