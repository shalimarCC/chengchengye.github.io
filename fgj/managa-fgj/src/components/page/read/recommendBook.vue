<template>
  <div class="filter-container" id="example">
    <div>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="书籍名称" v-model="ruleForm.booksName">
        </el-input>

        <el-select v-model="ruleForm.type" placeholder="书籍状态" style="width: 200px;margin-right:15px;">

            <el-option label="待上架" value="2">
            </el-option>
            <el-option label="已上架" value="0">
            </el-option>
            <el-option label="已下架" value="1">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="findReadRecommendOfPage">搜索</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>


     </div>

     <div style="margin-bottom:20px;text-align:right;">

        <el-button class="filter-item" @click="addBook" type="primary" icon="el-icon-circle-plus">添加</el-button>
        <el-button class="filter-item" @click="updateReadRecommendBatchStatusByIds(1)" type="warning" icon="el-icon-error">批量下架</el-button>
        <el-button class="filter-item" @click="updateReadRecommendBatchStatusByIds(0)" type="success" icon="el-icon-success">批量上架</el-button>


     </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column
            align="center"
            type="selection"
            width="55">
            </el-table-column>

        <el-table-column align="center" label="书籍名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.booksName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="书籍作者" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.author}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="出版社" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.publishingHouse}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="书籍状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.type==0">已上架</span>
                <span v-else-if="scope.row.type==1">已下架</span>
                <span v-else-if="scope.row.type==2">待上架</span>
            </template>

        </el-table-column>


        <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editPlatform(scope.row.id)">编辑</el-button>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="120px" :rules="rules" :model="bookForm">
            <el-form-item label="书籍名称" prop="booksName">
                <el-input v-model="bookForm.booksName"></el-input>
            </el-form-item>

            <el-form-item label="所属公司" prop="companyId">
                <el-select v-model="bookForm.companyIdList" collapse-tags multiple :disabled="allStatus">
                    <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="allStatus">所有用户可见</el-checkbox>
            </el-form-item>


            <el-form-item label="书籍作者" prop="author">
                <el-input v-model="bookForm.author"></el-input>
            </el-form-item>

            <el-form-item label="出版社" prop="publishingHouse">
                <el-input v-model="bookForm.publishingHouse"></el-input>
            </el-form-item>


            <el-form-item label="书籍简介" prop="recommendLanguage">
                <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="bookForm.recommendLanguage">
                </el-input>
            </el-form-item>

            <el-form-item label="封面图片" prop="booksPicture">
                    <el-upload
                        class="avatar-uploader"
                        :action="baseImgPath"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-error="handleError"
                        :data="imgForm">
                        <img v-if="bookForm.booksPicture" :src="bookForm.booksPicture" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>


        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="uploadReadBook">确 定</el-button>
        </div>

    </el-dialog>


  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {findReadRecommendOfPage_HT,getQiNiuToken,findCompanyIdOrName,insertReadRecommend_HT,updateReadRecommendById_HT,findReadRecommendById_HT,updateReadRecommendBatchStatusByIds_HT} from '../../../api/getData';
export default {
    data() {
        return {

            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            dialogFormVisible2:false,
            form:{

            },
            ruleForm:{
                booksName:'',
                type:'',
                companyId:[],
                pageNo:1,
                pageSize:10
            },
            bookForm:{
                id:'',
                companyIdList:'',
                booksName:'',
                author:'',
                publishingHouse:'',
                recommendLanguage:'',
                booksPicture:'',
                allStatus:false
            },
            rules:{
                booksName: [
                    { required: true, message: '请输入书籍名称', trigger: 'blur' }
                ],
                companyId: [
                    { required: true, message: '请选择公司', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '请输入书籍作者', trigger: 'blur' },
                    { max: 10, message: '字符长度不得超过10位', trigger: 'blur' }
                ],
                publishingHouse: [
                    { max: 10, message: '字符长度不得超过10位', trigger: 'blur' }
                ],
                recommendLanguage: [
                    { max: 500, message: '字符长度不得超过500位', trigger: 'blur' }
                ],
                booksPicture: [
                    { required: true, message: '请上传书籍图片', trigger: 'blur' }
                ],
            },
            failReason:'',
            dialogTitle:'',
            baseImgPath:'',
            baseImgUrl:'',
            imgForm:{
                key:'',
                token:'',
            },
            companyList:[],
            passAll:[],
            allStatus:false
        }
    },
    created() {
        this.findReadRecommendOfPage();
        this.findCompanyIdOrName();
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
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
        //获取列表
        async findReadRecommendOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findReadRecommendOfPage_HT(obj);

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
        //公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.exampleForm.companyIdList = arr;
        },


        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findReadRecommendOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findReadRecommendOfPage()
        },

        handleSelectionChange (selection) {
            let arr = new Array;
            $.each(selection,function(key,info){
                arr.push(info.id);
            })
            this.passAll = arr;
        },
        //重置
        resetForm(){
            this.ruleForm={
                commodityName:'',
                status:'',
                commodityType:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            };

            this.findReadRecommendOfPage()
        },



        //查询所有公司
        async findCompanyIdOrName(){
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
        //批量上下架
        async updateReadRecommendBatchStatusByIds(type){
            try {

                const res = await updateReadRecommendBatchStatusByIds_HT({ids:JSON.stringify(this.passAll),type:type});

                if (res.data.code == 0) {
                    this.findReadRecommendOfPage();
                    this.$notify({
                        title: 'Success',
                        message: '批量上下架成功',
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
        addBook () {
            this.dialogTitle = "新增推荐书籍";
            this.bookForm = {
                id:'',
                companyIdList:[],
                booksName:'',
                author:'',
                publishingHouse:'',
                recommendLanguage:'',
                booksPicture:'',
            };
            this.dialogFormVisible = true;
        },

        //保存按钮
        uploadReadBook(){
            if(this.bookForm.id == ''){
                this.insertReadRecommend_HT();
            }else{
                this.updateReadRecommendById_HT();
            }
        },

        //新增

        async insertReadRecommend_HT () {
            try {
                let obj = JSON.parse(JSON.stringify(this.bookForm));
                if(this.allStatus){
                    obj.companyIdList = "[-1]";
                }else{
                    obj.companyIdList = JSON.stringify(this.bookForm.companyIdList);
                }
                const res = await insertReadRecommend_HT(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findReadRecommendOfPage();
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

        //修改

        async updateReadRecommendById_HT () {
            try {
                let obj = JSON.parse(JSON.stringify(this.bookForm));
                if(this.allStatus){
                    obj.companyIdList = "[-1]";
                }else{
                    obj.companyIdList = JSON.stringify(this.bookForm.companyIdList);
                }
                const res = await updateReadRecommendById_HT(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findReadRecommendOfPage();
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

        //查看
        async editPlatform (id) {
            try {

                this.dialogTitle = "修改推荐书籍";
                this.dialogFormVisible = true;
                const res = await findReadRecommendById_HT({id:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.bookForm = {
                        id:data.readRecommendId,
                        companyIdList:data.companyIdList,
                        booksName:data.booksName,
                        author:data.author,
                        publishingHouse:data.publishingHouse,
                        recommendLanguage:data.recommendLanguage,
                        booksPicture:data.booksPicture,
                    };
                    if(data.companyIdList[0]==-1){
                        this.bookForm.companyIdList = [];
                        this.allStatus=true;
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

        //审核
        async auditCommodity (type) {
            try {
                const res = await auditCommodityById_HT({id:this.form.id,oldUpdateTime:this.form.updateTime,orPass:type,failReason:this.failReason});

                if (res.data.code == 0) {
                    this.dialogFormVisible = false;
                    this.dialogFormVisible2 = false;
                    this.findReadRecommendOfPage();
                    this.$message({
                        type: 'success',
                        message: res.data.data
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
            this.bookForm.booksPicture = this.baseImgUrl + response.key;
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
</style>


