<template>
    <div id="example">
        <template v-if="active==1">
            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="优惠券标题">
                    <el-input class="filter-item" placeholder="请输入优惠券标题" v-model="form.title"></el-input>
                </el-form-item>

                <el-form-item label="优惠券类型">
                    <el-select v-model="form.couponType" placeholder="请选择优惠券类型" style="width: 200px;margin-right:15px;" @change="form.discountAmount=''">
                        <el-option label="满减券" :value="0">
                        </el-option>
                        <el-option label="兑换券" :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品价值" v-if="form.couponType==1">
                    <el-input class="filter-item" placeholder="请输入商品价值" v-model="form.discountAmount"></el-input>
                    <p style="font-size:12px;line-height:30px;color:#999;text-align:left;">Tips : 单件商品的价值，便于后期统计。</p>
                </el-form-item>

                <el-form-item label="优惠金额" v-if="form.couponType===0">
                    <el-input class="filter-item" placeholder="请输入优惠金额" v-model="form.discountAmount"></el-input>
                </el-form-item>

                <el-form-item label="触发金额" v-if="form.couponType===0">
                    <el-input class="filter-item" placeholder="请输入触发金额" v-model="form.triggerAmount"></el-input>
                </el-form-item>

                <el-form-item label="选择商品">
                    <el-select v-model="form.goodsType" placeholder="请选择商品类型" style="width: 200px;margin-right:15px;">
                        <el-option label="单个SU" :value="0">
                        </el-option>
                        <el-option label="SU组" :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="请选择单SU" v-if="form.goodsType === 0">
                    <el-tag
                    closable
                    :disable-transitions="false"
                    @close=""
                    v-if="checkGoods.name != ''">
                    {{checkGoods.name}}
                    </el-tag>

                    <el-button class="filter-item" type="primary" @click="addGoods">选择SU</el-button>
                </el-form-item>

                <el-form-item label="请选择商品组"  v-if="form.goodsType == 1">
                    <el-tag
                    closable
                    :disable-transitions="false"
                    @close="resetStandardUnit"
                    v-if="checkStandardUnit.name != ''">
                    {{checkStandardUnit.name}}
                    </el-tag>

                    <el-button class="filter-item" type="primary" @click="addStandardUnit">选择分组</el-button>
                </el-form-item>

                <el-form-item label="可使用次数" v-if="form.couponType===0">
                    <el-input-number v-model="form.usageCount" disabled :min="1"></el-input-number>
                </el-form-item>

                <el-form-item label="自定义icon" v-if="form.couponType==1">
                    <el-upload
                        class="avatar-uploader"
                        :action="baseImgPath"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-error="handleError"
                        :data="imgForm">
                        <img v-if="form.iconUrl" :src="form.iconUrl">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="所属公司">
                    <el-select v-model="form.companys" collapse-tags multiple :disabled="allStatus.length>0">
                        <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-checkbox-group v-model="allStatus">
                        <el-checkbox :label="-1">全部正式公司可见</el-checkbox>
                        <el-checkbox :label="-2">全部竞品公司可见</el-checkbox>
                        <el-checkbox :label="-3">全部演示公司可见</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="所属门店">
                    <el-tree
                      :data="storeList"
                      show-checkbox
                      node-key="id"
                      ref="tree1"
                      highlight-current
                      :props="defaultProps"
                      v-if="!allStatus2">
                    </el-tree>

                    <el-checkbox v-model="allStatus2">全部</el-checkbox>
                    <el-button type="primary" plain size="small" @click="findCouponStoreOfPage">查看已选择门店</el-button>
                </el-form-item>

                <el-form-item label="优惠券详情">
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="form.detail"
                    maxlength="200">
                    </el-input>
                </el-form-item>

            </el-form>
            <div style="position: sticky;bottom: 0;text-align:center;width:100%;">
                <el-button size="medium" style="margin: 12px;" @click='saveDiscount'>保存</el-button>
            </div>
            <el-dialog title="选择SU" :visible.sync="dialogFormVisible" size="tiny">
                <div style="margin-bottom:20px;">

                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="goodsForm.name">
                    </el-input>

                    <el-button class="filter-item" type="primary" icon="search" size="medium" @click="searchGoods">搜索</el-button>
                    <el-button @click="resetGoods" size="medium">重置</el-button>
                </div>
                <el-table :key='tableKey1' :data="goodsListBase" v-loading.body="listLoading1" border fit highlight-current-row style="width: 100%">


                    <el-table-column align="center" label="商品名称" min-width="250">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品价格" min-width="80">
                        <template slot-scope="scope">
                            <span>{{scope.row.salePrice}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品状态" min-width="80">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status==3">已上架</span>
                            <span v-else-if="scope.row.status==4">已下架</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="销售方式" min-width="80">
                        <template slot-scope="scope">
                            <span v-if="scope.row.saleWay==1">正常销售</span>
                            <span v-else-if="scope.row.saleWay==2">团购</span>
                            <span v-else-if="scope.row.saleWay==3">预售</span>
                        </template>
                    </el-table-column>


                    <el-table-column align="center" label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="small" @click="selectGoods(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page.sync="goodsForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="goodsForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count1">
                    </el-pagination>
                </div>


            </el-dialog>

            <el-dialog title="选择商品组合" :visible.sync="dialogFormVisible2" size="tiny">
                <div style="margin-bottom:20px;">

                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="组合名称" v-model="ruleForm.combinationName">
                    </el-input>



                    <el-button class="filter-item" type="primary" icon="search" size="medium" @click="findStandardUnitCombinationOfPage">搜索</el-button>
                    <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
                </div>
                <el-table :key='tableKey2' :data="dataSource2" v-loading.body="listLoading2" border fit highlight-current-row style="width: 100%">

                    <el-table-column align="center" label="组合名称" min-width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.combinationName}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="商品数量" min-width="80">
                        <template slot-scope="scope">
                            <span>{{scope.row.standardUnitSize}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="分组类型" min-width="80">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type==1">选择商品</span>
                            <span v-else-if="scope.row.type==2">关联类目树</span>
                            <span v-else-if="scope.row.type==3">关联标签</span>
                        </template>
                    </el-table-column>


                    <el-table-column align="center" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="small" @click="selectStandardUnit(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="ruleForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="ruleForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count2">
                    </el-pagination>
                </div>
            </el-dialog>

            <el-dialog title="所属门店" :visible.sync="dialogFormVisible3" size="tiny">
                <h6>当前已选择门店{{checkStoreList.length}}家</h6>
                <el-table :key='tableKey2' :data="checkStoreList" border fit highlight-current-row style="width: 100%">

                    <el-table-column align="center" label="门店" min-width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}-{{scope.row.area}}-{{scope.row.city}}-{{scope.row.detailAddress}}</span>
                        </template>
                    </el-table-column>

                </el-table>
                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange3"
                    @current-change="handleCurrentChange3"
                    :current-page.sync="storeForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="storeForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count3">
                    </el-pagination>
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
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {findMerchantProductOfPage,findStandardUnitCombinationOfPage,findCompanyIdOrName,queryStandardUnitListByBlurry,
getQiNiuToken,insertOrUpdateCouponWithTx,findStoreAllInfo,findCouponStoreOfPage} from '../../../api/getData';
export default {
    data() {
        return {
            form:{
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
                stores:[]
            },
            active:1,
            dialogFormVisible:false,
            goodsForm:{
                name:'',
                pageNo:1,
                pageSize:10,

            },
            count1:null,
            tableKey1: 0,
            listLoading1: true,
            offset1: 0,
            goodsListBase:[],

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
            allStatus:[],
            baseImgPath:'',
            baseImgUrl:'',
            imgForm:{
                key:'',
                token:'',
            },
            storeList:[],
            allStatus2:false,
            checkStoreList:[],
            storeForm:{
                ids:[],
                pageSize:10,
                pageNo:1
            },
            count3: null,
            dialogFormVisible3:false,
            defaultProps: {
              children: 'children',
              label: 'name'
            },
        }
    },
    created () {

        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        this.findCompanyIdOrName();
        this.findStoreAllInfo();
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
                 str = str.substring(0,12)
                if(str == "/addDiscount"){
                    Object.assign(this.$data, this.$options.data());
                    this.findCompanyIdOrName();
                    this.findStoreAllInfo();
                }

            },
        }
    },
    methods:{
        //查询已选择门店接口
        async findCouponStoreOfPage () {
            try {
                if(this.allStatus2){
                    this.storeForm.ids = '[-1]';
                }else{
                    this.storeForm.ids = JSON.stringify(this.$refs.tree1.getCheckedKeys(true));
                }

                const res = await findCouponStoreOfPage(this.storeForm);
                if (res.data.code == 0) {
                    this.count3 = res.data.data.totalSize;
                    this.checkStoreList = res.data.data.list;
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
            this.storeForm.pageSize = val;
            this.findCouponStoreOfPage()
        },
        handleCurrentChange3(val) {
            this.storeForm.pageNo = val;
            this.offset1 = (val - 1) * this.storeForm.pageSize;
            this.findCouponStoreOfPage()
        },
        //获取门店列表
        async findStoreAllInfo () {
            try {
                const res = await findStoreAllInfo();
                if (res.data.code == 0) {
                    this.storeList = res.data.data;
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
                name:'',
                status:'',
                saleWay:'',
                pageNo:1,
                pageSize:10,

            };
            this.queryStandardUnitListByBlurry();
            this.dialogFormVisible = true;
        },
        //获取公司列表
        async findCompanyIdOrName () {
            try {
                const res = await findCompanyIdOrName();
                if (res.data.code == 0) {
                    this.companyList = res.data.data;
                    let thtf = this;
                    if(this.$store.state.Cookie.mutations.fetch().platformId==2){
                        thtf.form.companys = [2];
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

        //公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.form.companys = arr;
        },

         //分页
        handleSizeChange1(val) {
            this.goodsForm.pageSize = val;
            this.queryStandardUnitListByBlurry()
        },
        handleCurrentChange1(val) {
            this.goodsForm.pageNo = val;
            this.offset1 = (val - 1) * this.goodsForm.pageSize;
            this.queryStandardUnitListByBlurry()
        },
        //重置
        resetGoods(){
            this.goodsForm = {
                name:'',
                pageNo:1,
                pageSize:10,

            };
            this.queryStandardUnitListByBlurry();
        },
        //搜索
        searchGoods(){
            this.goodsForm.pageNo = 1;
            this.queryStandardUnitListByBlurry();
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

                if(this.allStatus.length>0){
                    obj.companys = JSON.stringify(this.allStatus);
                }else{
                    obj.companys = JSON.stringify(this.form.companys);
                }
                if(this.allStatus2){
                    obj.stores = '[-1]';
                }else{
                    obj.stores = JSON.stringify(this.$refs.tree1.getCheckedKeys(true));
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
             console.log(this.imgForm)
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

<style scoped>
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


