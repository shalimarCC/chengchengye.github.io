<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="SKU编号" v-model="ruleForm.skuSerialNumber">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="SKU名称" v-model="ruleForm.skuName">
        </el-input>

        <el-button class="filter-item" type="primary" size="medium" icon="search" @click="handleFilter">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

        <el-button type="primary" size="medium" icon="el-icon-upload" style="float:right;" @click="channel">导入</el-button>
     </div>




    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="SKU编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.skuSerialNumber}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="SKU名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.skuName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="实体总库存" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.realStockNum}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="已分配" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.eCardSize}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="冻结量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.realFrozenStockNum}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="在线库存剩余量" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.PUrealStockNums}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="未分配" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.residue}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="可分配" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.available}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="couponUnit(scope.row.skuId)">查看</el-button>
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

    <el-dialog title="导入卡密" :visible.sync="dialogFormVisible"  v-loading="loading" element-loading-text="后台导入中~" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">

        <el-form label-width="120px" :model="couponForm">
            <el-form-item label="卡密来源">
                <el-input v-model="couponForm.source"></el-input>
            </el-form-item>

            <el-form-item label="备注">
                <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="couponForm.remark">
                </el-input>
            </el-form-item>

            <el-form-item label="类型">
                <el-select v-model="couponForm.tmplType" placeholder="请选择卡券类型">
                    <el-option label="普通卡券" :value="5">
                    </el-option>
                    <el-option label="团检券" :value="8">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="上传文件">
               <el-upload
                class="upload-demo"
                drag
                :data="couponForm"
                :action="baseFileUrl"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
                :before-upload="handleAvatarUpload"
                :auto-upload="false"
                :headers="header"
                :multiple="false"
                :limit="1"
                ref="upload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button @click="dialogFormVisible = false" size="medium">取 消</el-button>
            <el-button type="primary" @click="importECardWithTx" size="medium">确 定</el-button>
        </div>

    </el-dialog>
    </div>
  </div>
</template>


<script>
import Cookie from '../../../config/mUtils'
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import { baseUrl } from '../../../config/env';
import {findSkuECardOfPage,addStock,comeStock,uploading,importECardWithTx} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                skuSerialNumber: "",
                skuName: "",
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
            stockType:1,
            couponForm:{
                source:'',
                remark:'',
                tmplType:5
            },
            baseFileUrl:'',
            loading:false,
            header:{

            }
        }
    },
    created() {
        this.header = {
            platformId : `${Cookie.mutations.fetch().platformId}`,
            ut : `${Cookie.mutations.fetch().cookieValue}`,
            Authorization : `${CryptoJS.MD5(Cookie.mutations.fetch().cookieValue + Cookie.mutations.fetch().id).toString()}`,
            clientId : 3,
            companyId : `${"1"}`,
            f : `${"3"}`,
            phoneModel : `${"1.0.0"}`,
            os : `${"1.0.0"}`,
            v : `${"1.0.0"}`,
            deviceId :`${"0001"}`
        }
        this.findSkuECardOfPage();
        this.baseFileUrl = baseUrl+'/back-promotion-web/promotion/eCard/importECardWithTx.do';
    },

    methods: {
        //获取列表
        async findSkuECardOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findSkuECardOfPage(obj);

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
            this.findSkuECardOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findSkuECardOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;

            this.findSkuECardOfPage();
        },
        //重置
        resetForm() {
            this.ruleForm = {
                skuSerialNumber: "",
                skuName: "",
                pageNo:1,
                pageSize:10
            }
            this.findSkuECardOfPage();
        },

        //查看
        couponUnit (id) {
            this.$router.push({path:'/couponUnit/'+id})
        },
        //导入
        channel(){
            this.couponForm = {
                source:'',
                remark:'',
                tmplType:5
            };

            this.dialogFormVisible = true;
            if(this.$refs.upload != undefined){
                this.$refs.upload.clearFiles();
            }
        },
        handleAvatarUpload(){
            this.loading = true;
        },
        handleAvatarError(){
            this.loading = false;
        },
        handleAvatarSuccess(response){
            this.loading = false;
            if(response.code == 0){
                if(response.data.type == 1){
                    this.$message({
                        type: 'success',
                        message: '导入成功'
                    });
                    this.dialogFormVisible = false;
                    this.findSkuECardOfPage();
                }else{
                    this.$message({
                        type: 'error',
                        message: '导入失败，请下载失败原因！'
                    });
                    window.location.href = response.data.path;
                    this.dialogFormVisible = false;
                    this.findSkuECardOfPage();
                }

            }else{
                this.$message({
                    type: 'error',
                    message: response.error
                });
            }
        },


        //获取列表
        importECardWithTx() {
            this.$refs.upload.submit();
        },

    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


