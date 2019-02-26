<template>
    <div class="filter-container" id="example">

        <div style="margin-bottom:20px;">

            <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="ruleForm.productUnitSerialNumber">
            </el-input>

            <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="ruleForm.commodityProductUnitName">
            </el-input>

            <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="所属门店" v-model="ruleForm.storeName">
            </el-input>

            <el-button class="filter-item" type="primary" size="medium" icon="search" @click="handleFilter">搜索</el-button>
            <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>


        </div>




        <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

            <el-table-column align="center" label="商品规格编号" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.productUnitSerialNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品规格名称" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.commodityProductUnitName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属门店名称" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.storeName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="库存" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.realStockNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="冻结量" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.realFrozenStockNum}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="success" size="small" plain @click="editStock(scope.row)">库存调整</el-button>
                    <el-button type="success" size="small" plain @click="stockChangeApply(scope.row.id,scope.row.storeId)">库存流水</el-button>
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

        <el-dialog title="库存调整" :visible.sync="dialogFormVisible1">
            <el-form ref="form" label-width="120px">
                <el-form-item label="请填写调整数量">
                    <el-input-number controls-position="right" v-model="storeForm.stockChange"></el-input-number>
                </el-form-item>

                <el-form-item label="请选择调整原因">
                    <el-select v-model="storeForm.applyCauseId" collapse-tags>
                        <el-option
                            v-for="item in stockDictList"
                            v-if="item.id>100"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="请填写具体原因">
                    <el-input
                        type="textarea"
                        :rows="3"
                        :maxlength="50"
                        resize="none"
                        placeholder="不超过50字"
                        v-model="storeForm.concretenessCause">
                    </el-input>
                </el-form-item>

                <el-form-item label="请提供调整依据">
                    <el-upload
                        :action="baseImgPath"
                        list-type="picture-card"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-error="handleError"
                        :limit="3"
                        :data="imgForm"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :file-list="storeForm.pictureList">
                        <i class="el-icon-plus"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过3张</div>
                    </el-upload>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" :span="24">
                <el-button @click="dialogFormVisible1 = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="insertStoreStockChangeApplyWithTx" size="medium">确 定</el-button>
            </div>
        </el-dialog>
    </div>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env';
import {findStoreProductUnitOfPage,insertStoreStockChangeApplyWithTx,findStockDictAll,getQiNiuToken} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                productUnitSerialNumber: "",
                commodityProductUnitName: "",
                storeName:"",
                pageNo:1,
                pageSize:10
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            skuGoodsList:[],
            dialogFormVisible:false,
            stockTitle:'进货',
            stockType:1,
            storeForm:{
                storeProductUnitId:'',
                stockChange:'',
                applyCauseId:'',
                concretenessCause:'',
                afterStoreId:'',
                afterStoreName:'',
                commodityProductUnitName:'',
                productUnitSerialNumber:'',
                type:'',
                pictureList:[],
            },
            stockDictList:[],
            imgForm:{
                key:'',
                token:'',
            },
            baseImgPath:'',
            baseImgUrl:'',
            dialogFormVisible1:false
        }
    },
    created() {
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        this.findStoreProductUnitOfPage();
        this.findStockDictAll();
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

    methods: {
        stockChangeApply(id,storeId){
            this.$router.push('/stockChangeApply/'+id+'/'+storeId);
        },
        //库存调整保存
        async insertStoreStockChangeApplyWithTx(){
            try {
                let obj = JSON.parse(JSON.stringify(this.storeForm));
                obj.pictureList = JSON.stringify(this.storeForm.pictureList);
                const res = await insertStoreStockChangeApplyWithTx(obj);

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '库存调整成功'
                    });
                    this.dialogFormVisible1 = false;
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
        //根据类型查询字典消息接口
        async findStockDictAll() {
            try {
                const res = await findStockDictAll({type:1});

                if (res.data.code == 0) {

                    this.stockDictList = res.data.data;


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
        //库存调整
        editStock(obj){
            this.storeForm = {
                storeProductUnitId:obj.id,
                stockChange:'',
                applyCauseId:'',
                concretenessCause:'',
                afterStoreId:obj.storeId,
                afterStoreName:obj.storeName,
                commodityProductUnitName:obj.commodityProductUnitName,
                productUnitSerialNumber:obj.productUnitSerialNumber,
                type:1,
                pictureList:[],
            };
            this.dialogFormVisible1 = true;
        },
        //获取列表
        async findStoreProductUnitOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findStoreProductUnitOfPage(obj);

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
            this.findStoreProductUnitOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findStoreProductUnitOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findStoreProductUnitOfPage();
        },
        //重置
        resetForm(formName) {
            this.ruleForm = {
                productUnitSerialNumber: "",
                commodityProductUnitName: "",
                storeName:"",
                pageNo:1,
                pageSize:10
            }
            this.findStoreProductUnitOfPage();
        },



        handleRemove(file, fileList) {
            let arr = new Array();
            let thtf = this;
            $.each(fileList,function(key,info){
                arr.push(thtf.baseImgUrl + info.response.key);
            })
            this.storeForm.pictureList = arr;
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //上传之前获取key，index
        uploadKeyIndex(index) {
            //this.index = index;
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
            this.storeForm.pictureList.push(this.baseImgUrl + response.key);
        },


    }
}
</script>

<style>
#example {
    padding: 10px 20px;
}
.el-upload{
    width:148px;
}
</style>


