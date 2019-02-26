<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="addActivity" style="float:right" type="primary" size="medium" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="卡券名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="关联商品" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.standardUnitName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="所属分类" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.leadingEndCategoryName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="排序" min-width="100">
            <template slot-scope="scope">
                 <span>{{scope.row.sortValue}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="是否显示" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isShow==0">否</span>
                <span v-else-if="scope.row.isShow==1">是</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" plain size="small" @click="editActivity(scope.row.id)">编辑</el-button>

            </template>
        </el-table-column>

    </el-table>
    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10,20,30, 50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="120px">
            <el-form-item label="卡券名称">
                <el-input v-model="bannerForm.name"></el-input>
            </el-form-item>

            <el-form-item label="所属分类">
                <el-select v-model="bannerForm.leadingEndCategoryId">
                    <el-option
                        v-for="item in cateList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

           <el-form-item label="关联商品">
                <el-select
                    v-model="bannerForm.standardUnitId"
                    filterable
                    placeholder="请输入关键词"
                    :loading="loading">
                        <el-option
                        v-for="item in goodsList"
                        :key="item.standardUnitId"
                        :label="item.standardUnitName"
                        :value="item.standardUnitId">
                        </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="是否显示">
                <el-select v-model="bannerForm.isShow">
                    <el-option
                        label="否"
                        :value="0">
                    </el-option>
                    <el-option
                        label="是"
                        :value="1">
                    </el-option>
                </el-select>
            </el-form-item>

             <el-form-item label="排序">
                <el-input-number v-model="bannerForm.sortValue"></el-input-number>
            </el-form-item>


            <el-form-item label="图片">
                    <el-upload
                        class="avatar-uploader"
                        :action="baseImgPath"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-error="handleError"
                        :data="imgForm">
                        <img v-if="bannerForm.pictureUrl" :src="bannerForm.pictureUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="updateBannerByIdWithTx">确 定</el-button>
        </div>

    </el-dialog>
  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {findCardStampsAdministrationOfPage,findLeadingEndCategoryAll,findStandardUnitIdAndName,getQiNiuToken,insertCardStampsAdministrationWithTx,updateCardStampsAdministrationByIdWithTx,findCardStampsAdministrationById} from '../../../api/getData';
export default {
    data() {
        return {
            imgForm:{
                key:'',
                token:'',
            },
            dataSource: [],
            offset: 0,
            limit: 10,
            count: null,
            currentPage: 1,
            tableKey: 0,
            listLoading: true,
            dialogFormVisible:false,
            dialogTitle:"新增模板",
            activityName:'',
            bannerForm:{
                name:'',
                sortValue:'',
                path:'',
                isShow:'',
                id:'',
                pictureUrl:'',
                leadingEndCategoryId:'',
                standardUnitId:''
            },
            cateList:[],
            goodsList:[],
            baseImgPath:'',
            baseImgUrl:'',
            loading: false,
        }
    },
    created() {
        this.findCardStampsAdministrationOfPage();
        this.findStandardUnitIdAndName();
        this.findLeadingEndCategoryAll();
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
        async findCardStampsAdministrationOfPage() {
            try {

                this.listLoading = false;
                const res = await findCardStampsAdministrationOfPage({ pageNo: this.currentPage, pageSize: this.limit });

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
            this.limit = val;
            this.findCardStampsAdministrationOfPage()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.findCardStampsAdministrationOfPage()
        },



        //获取商品列表
        async findStandardUnitIdAndName () {
            try {
                const res = await findStandardUnitIdAndName();
                if (res.data.code == 0) {
                    this.goodsList = res.data.data;
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

        //获取类目列表
        async findLeadingEndCategoryAll () {
            try {
                const res = await findLeadingEndCategoryAll();
                if (res.data.code == 0) {
                    this.cateList = res.data.data;
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



        //新增banner
        addActivity () {
            this.bannerForm = {
                name:'',
                sortValue:'',
                path:'',
                isShow:'',
                id:'',
                pictureUrl:'',
                leadingEndCategoryId:'',
                standardUnitId:''
            };

            this.dialogTitle = '新增模板';
            this.dialogFormVisible = true;
        },


        //编辑
        editActivity (id) {
            this.findCardStampsAdministrationById(id);
            this.dialogTitle = '修改模板';
            this.dialogFormVisible = true;
        },

        //根据ID查询信息
        async findCardStampsAdministrationById (id) {
            try {
                const res = await findCardStampsAdministrationById({id:id});
                if (res.data.code == 0) {
                    this.bannerForm = {
                            name:res.data.data.name,
                            sortValue:res.data.data.sortValue,
                            path:res.data.data.path,
                            isShow:res.data.data.isShow,
                            id:res.data.data.id,
                            pictureUrl:res.data.data.pictureUrl,
                            leadingEndCategoryId:res.data.data.leadingEndCategoryId,
                            standardUnitId:res.data.data.standardUnitId,
                        };
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


        //保存
        updateBannerByIdWithTx () {
            if(this.bannerForm.id==""){
                this.insertCardStampsAdministrationWithTx();
            }else{
                this.updateCardStampsAdministrationByIdWithTx();
            }
        },
        //保存
        async insertCardStampsAdministrationWithTx () {
            try {

                const res = await insertCardStampsAdministrationWithTx(this.bannerForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '更新Banner成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findCardStampsAdministrationOfPage();
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
        async updateCardStampsAdministrationByIdWithTx () {
            try {

                const res = await updateCardStampsAdministrationByIdWithTx(this.bannerForm);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '更新Banner成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findCardStampsAdministrationOfPage();
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
            this.bannerForm.pictureUrl = this.baseImgUrl + response.key;
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
</style>


