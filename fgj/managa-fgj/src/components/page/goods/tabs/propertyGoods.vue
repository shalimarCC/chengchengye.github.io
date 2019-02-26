<template>
    <div>
        <div style="padding:20px 200px;min-width:400px;" class="skuList">
             <el-table
                :data="propertyGoodsData"
                border
                min-height="500">

                    <el-table-column
                    width="55"
                    align="center">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.checked" :disabled="scope.row.isValid==0"></el-checkbox>
                        </template>

                    </el-table-column>

                    <el-table-column
                    label="pu名称"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.name" maxlength="30"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="sku名称"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.skuName}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="规格码"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.productUnitSerialNumber}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="正式公司售价"
                    min-width="100"
                    align="center"
                    v-if="checkCompany1"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.salePrice"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="演示公司售价"
                    min-width="100"
                    align="center"
                    v-if="checkCompany2"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.demoSalePrice"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="竞品公司售价"
                    min-width="100"
                    align="center"
                    v-if="checkCompany3"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.competingSalePrice"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="上传图片"
                    align="center">
                        <template slot-scope="scope">
                            <el-upload
                                class="avatar-uploader"
                                :action="baseImgPath"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleError"
                                :data="imgForm">
                                <img v-if="scope.row.puPicUrl" :src="scope.row.puPicUrl" @click="uploadKeyIndex(scope.$index)">
                                <i v-else class="el-icon-plus avatar-uploader-icon" @click="uploadKeyIndex(scope.$index)"></i>
                            </el-upload>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="是否上下架"
                    min-width="100"
                    align="center">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.status"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                :active-value="3"
                                :inactive-value="4"
                                :disabled="scope.row.isAvailable==0">
                            </el-switch>
                        </template>
                    </el-table-column>
                </el-table>
        </div>

        <div style="text-align:center;">
            <el-button size="medium" style="margin-top: 12px;" @click='updateProductUnitByIdWithTx'>保存</el-button>
            <el-button size="medium" style="margin-top: 12px;" @click='updateRefGoods'>保存并提交</el-button>
        </div>
    </div>
</template>
<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../../config/env'
import {getQiNiuToken,updateProductUnitByIdWithTx,findMerchantProductById} from '../../../../api/getData';
export default {
    props: {
        // propertyGoodsData: {
        //     type: Array,
        //     default: function () {
        //         return []
        //     }
        // },
        // basicGoodsData: {
        //     type: Object,
        //     default: function () {
        //         return {}
        //     }
        // },
    },
    data () {
        return {
            standardData:[],
            imgForm:{
                key:'',
                token:'',
            },
            inputValList:[],
            baseImgPath:'',
            baseImgUrl:'',
            index:'',
            status:'',
            checkCompany1:false,
            checkCompany2:false,
            checkCompany3:false,
            basicGoodsData:{},
            propertyGoodsData:[]
        }
    },
    created () {
        console.log(this.propertyGoodsData);
        console.log(this.basicGoodsData);
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        const res = getQiNiuToken();
        this.findMerchantProductById ();
        res.then(_data => {
            if(_data.data.code == 0){
                this.imgForm.token = _data.data.data;
            }else{
                this.$message({
                    type:"error",
                    message:_data.data.error
                })
            }
        });

    },
    mounted () {
    },
    methods:{

        async updateProductUnitByIdWithTx (){
            try {
                let obj  = new Object();
                obj.status = this.status;
                obj.productUnitVOList = JSON.stringify(this.propertyGoodsData);
                const res = await updateProductUnitByIdWithTx(obj);

                if (res.data.code == 0) {
                     this.$notify({
                        title: '修改',
                        message: '修改成功',
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
        //保存并提交
        updateRefGoods(){
            this.status = 2;
            this.updateProductUnitByIdWithTx();
        },
        handleSelectionChange(val){
            let thtf = this;
            $.each(val,function(key,info){
                let obj = new Object();
                obj.puPicUrl = info.skuPicUrl;
                obj.salePrice = info.skuCostingPrice;
                obj.skuId = info.id;
                obj.status = info.status;
                thtf.propertyGoodsData.push(obj);
            })
        },
        //获取编辑页面基本信息中的companyid的值
        async findMerchantProductById (){
            try {
                const res = await findMerchantProductById({merchantProductId:this.$route.params.goodsId});
                if (res.data.code == 0) {
                    //组织基本信息
                    this.basicGoodsData.merchantProduct = res.data.data.merchantProduct;
                    //组织规格
                    this.propertyGoodsData = res.data.data.productUnitList;
                    if(this.basicGoodsData.merchantProduct.companyIds.length!=0){
                        this.checkCompany1 = true;
                    }else{
                        this.checkCompany1 = false;
                    }
                    if(this.basicGoodsData.merchantProduct.demoCompanyIds.length!=0){
                        this.checkCompany2 = true;
                    }else{
                        this.checkCompany2 = false;
                    }
                    if(this.basicGoodsData.merchantProduct.competingCompanyIds.length!=0){
                        this.checkCompany3 = true;
                    }else{
                        this.checkCompany3 = false;
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

        //上传之前获取key，index
        uploadKeyIndex(index) {
            this.index = index;
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
            this.propertyGoodsData[this.index].puPicUrl = this.baseImgUrl + response.key;
        },
    }
}

</script>


<style>
.skuList .avatar-uploader{
    display:inline-block;
    width:40px;
    height:40px;
}
.skuList .avatar-uploader img{
    width:100%;
    height:100%;

}
 .skuList .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width:100%;
        height:100%;
        line-height:40px;
        text-align: center;
    }
.skuList .el-upload{
        width:100%;
        height:100%;
    }
</style>