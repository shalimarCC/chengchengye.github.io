<template>
  <div class="filter-container" id="example">
    <!-- 搜索 -->
    <div style="margin-bottom:10px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="产品名称" v-model="ruleForm.productName">
        </el-input>
        <el-select v-model="ruleForm.merchantId" placeholder="运营方">
            <el-option
                v-for="item in merchantIdList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="关联组名" v-model="ruleForm.name">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" @click="searchForm">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
     </div>
    <!-- 新增 -->
    <div class="addBtn">
        <el-button class="filter-item" type="primary" icon="search" @click="addRelated">新增关联</el-button>
    </div>
    <!-- 列表展示 -->
    <el-table :key='tableKey' ref="multipleTable" :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="库存关联组ID" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="关联组名" width="150">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="产品名" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.spuName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="运营方" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.merchantName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="关联商品数量" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.contactCount}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="最后一次更新时间" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.lastUpdateTime}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="最后一次编辑人" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.lastOperator}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="350">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editOut(scope.row.id)">编辑</el-button>
                <el-button type="primary" size="small" plain @click="editCombination(scope.row.merchantId,scope.row.id)">关联商品</el-button>
                <el-button type="primary" size="small" plain @click="dissolveContent(scope.row.id)">解散关联</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
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
    <!-- 新增弹框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" class="outPutStyle">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="关联组名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="产品">
                <el-select v-model="form.productId" filterable>
                    <el-option
                        v-for="item in productList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运营方">
                <el-select v-model="form.merchantId">
                    <el-option
                        v-for="item in merchantIdList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="editBtn">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRelatedCom">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible2" width="40%" class="outPutStyle">
        <el-form ref="form" :model="formet" label-width="120px">
            <el-form-item label="关联组名">
                <el-input v-model="formet.name"></el-input>
            </el-form-item>
            <el-form-item label="产品">
                <el-select v-model="formet.productId" disabled>
                    <el-option
                        v-for="item in productList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运营方">
                <el-select v-model="formet.merchantId" disabled>
                    <el-option
                        v-for="item in merchantIdList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="editBtn">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="updateRelatedCom">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 判断是否有权限解锁 -->
    <el-dialog :visible.sync="dialogVisible3" width="40%" class="outPutStyle">
        <p class="textIn">当前 {{adminUser}} 用户正在进行库存关联操作，{{continuetext}}</p>
        <div class="editBtn">
            <el-button @click="dialogVisible3 = false">取 消</el-button>
            <el-button type="primary" @click="continueUse" :disabled="disable">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
import Cookie from '../../../config/mUtils'
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import { baseUrl } from '../../../config/env';
import {findContactGroupStockMapOfPage,findStartedMerchantList,releaseDistributedLock,getAllSpuList,standardProductUnitAll,updateContactGroup,addContactGroup,findContactGroupById,cancelContact,conditionStandardProductUnitAll,tryLock} from '../../../api/getData';
export default {
    data() {
        return {
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            ruleForm:{
                productName:'',
                name:'',
                merchantId:'',
                pageNo:1,
                pageSize:10
            },
            merchantIdList:[],
            productList:[],
            dialogVisible:false,
            dialogVisible2:false,
            dialogVisible3:false,
            form:{
                name:'',
                merchantId:'',
                productId:''
            },
            formet:{
                name:'',
                merchantId:'',
                productId:''
            },
            title:"新增关联组名",
            relatedId:'',
            adminUser:'',
            mid:'',
            id:'',
            disable:false,
            continuetext:''
        }
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,21)
                if(str == "/repertoryCombination"){
                    this.findContactGroupStockMapOfPage();
                }
            },
        }
    },
    created() {
        this.findContactGroupStockMapOfPage();
        this.findStartedMerchantList();
        this.getProductList();
    },
    methods: {
        //获取列表
        async findContactGroupStockMapOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findContactGroupStockMapOfPage(obj);
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
            this.findContactGroupStockMapOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findContactGroupStockMapOfPage()
        },
        //重置
        resetForm(){
            this.ruleForm={
                productName:'',
                name:'',
                merchantId:'',
                pageNo:1,
                pageSize:10
            };
            this.findContactGroupStockMapOfPage();
        },
        //搜索
        searchForm(){
            this.ruleForm.pageNo = 1;
            this.ruleForm.pageSize = 10;
            this.findContactGroupStockMapOfPage();
        },
        //关联商品
        async editCombination(mid,id){
            try{
                const res = await tryLock({id:id});
                if(res.data.code == 0){
                    this.mid = mid;
                    this.id = id;
                    this.continuetext = '';
                    if(res.data.data.role == true && res.data.data.isSuccess == true){
                        this.$router.push('/editCombination/'+ mid + '/' + id);
                    }else if(res.data.data.role == true && res.data.data.isSuccess == false){
                        this.adminUser = res.data.data.data;
                        this.continuetext = "请确认是否继续";
                        this.dialogVisible3 = true;
                    }else{
                        this.disable = true;
                        this.continuetext = "请稍后再试";
                        this.adminUser = res.data.data.data;
                        this.dialogVisible3 = true;
                    }
                }else{
                    this.$message({
                        type: 'error',
                        message: '加锁操作加载失败'
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '加锁操作加载失败，请重试'
                });
            }

        },
        //解除封闭状态
        async releaseDistributedLock(){
            try{
                const res = await releaseDistributedLock({id:this.id});
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        message: '解除封闭状态'
                    });
                    setTimeout(() => {
                        this.$router.push('/repertoryCombination');
                    }, 1000);
                }else{
                    this.$message({
                        type: 'success',
                        message: '解除封闭状态失败'
                    });
                }
            }catch(err){
                this.$message({
                    type: 'success',
                    message: '操作失败，请重试'
                });
            }
        },
        //继续操作
        continueUse(){
            this.dialogVisible3 = false;
            this.releaseDistributedLock();
            // this.$router.push('/editCombination/'+ this.mid + '/' + this.id);
        },
        //解散关联
        async dissolveContent(id){
            try{
                const res = await cancelContact({id:id});
                if(res.data.code == 0){
                    this.findContactGroupStockMapOfPage();
                    this.$message({
                        type: 'success',
                        message: '解散成功'
                    });
                }else{
                    this.$message({
                        type: 'error',
                        message: '解散加载失败，请重试'
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '解散失败，请联系管理员'
                });
            }
        },
        //获取所有运营方
        async findStartedMerchantList(){
            try {
                const res = await findStartedMerchantList();
                if (res.data.code == 0) {
                    this.merchantIdList = res.data.data;
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
        //获取产品列表
        async getProductList(){
            try {
                const res = await conditionStandardProductUnitAll();
                if (res.data.code == 0) {
                    this.productList = res.data.data;
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
        //新增关联接口
        async addContactGroup(){
            try{
               let obj = new Object;
               obj.name = this.form.name;
               obj.spuId = this.form.productId;
               obj.merchantId = this.form.merchantId;
               const res = await addContactGroup(obj);
               if(res.data.code == 0){
                    this.dialogVisible = false;
                    this.findContactGroupStockMapOfPage();
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
               }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
               }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '新增失败，请联系管理员'
                });
            }
        },
        //编辑关联接口
        async updateContactGroup(){
            try{
               const res = await updateContactGroup({name:this.formet.name,id:this.relatedId});
               if(res.data.code == 0){
                    this.dialogVisible2 = false;
                    this.findContactGroupStockMapOfPage();
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
               }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
               }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '修改失败，请联系管理员'
                });
            }
        },
        //新增关联
        addRelated(){
            this.form={
                name:'',
                merchantId:'',
                productId:''
            };
            this.title = "新增关联组名";
            this.dialogVisible = true;
        },
        //编辑关联
        editOut(id){
            this.formet={
                name:'',
                merchantId:'',
                productId:''
            };
            this.title = "编辑关联组名";
            this.dialogVisible2 = true;
            this.relatedId = id;
            this.findContactGroupById(id);
        },
        //新增关联组确认
        addRelatedCom(){
            this.addContactGroup();
        },
        //编辑关联组确认
        updateRelatedCom(){
            this.updateContactGroup();
        },
        //根据id查询关联组
        async findContactGroupById(id){
            try{
                const res = await findContactGroupById({id:id});
                if(res.data.code == 0){
                    this.formet.name = res.data.data.name;
                    this.formet.merchantId = res.data.data.merchantId;
                    this.formet.productId = res.data.data.spuId;
                    console.log(res.data.data);
                }else{
                    this.$message({
                        type: 'error',
                        message: '编辑失败'
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '编辑失败，数据获取失败'
                });
            }
        },
        //时间戳转换
        setTime(time) {
            if(time==null){
                return '';
            }
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

<style scoped>
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
  .addBtn{
      padding:10px 0;
  }
  .editBtn{
      text-align: center;
  }
  .outPutStyle .el-select{
      width:100%;
  }
  .textIn{
      text-align:center;
      padding-bottom:20px;
  }
</style>




