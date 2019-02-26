<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="推广渠道" v-model="ruleForm.name"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="session" v-model="ruleForm.session"></el-input>


        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="addVersions" size="medium" type="primary" icon="edit">新增</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="推广渠道" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="session" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.session}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="日下载量" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.dailyDownloads}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="总下载量" min-width="180">
            <template slot-scope="scope">
                <span>{{scope.row.downloads}}</span>
            </template>
        </el-table-column>


       <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editVersions(scope.row.id)">编辑</el-button>
                <el-button type="primary" size="small" plain @click="downloadImg(scope.row.url)">下载二维码</el-button>
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


    <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form label-width="120px" :model="versionsForm">
            <el-form-item label="推广渠道">
                <el-input v-model="versionsForm.name"></el-input>
            </el-form-item>


            <el-form-item label="Session">
                <el-input v-model="versionsForm.session"></el-input>
            </el-form-item>


            <el-form-item label="二维码">
                    <el-upload
                        class="avatar-uploader"
                        :action="baseImgPath"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-error="handleError"
                        :data="imgForm">
                        <img v-if="versionsForm.url" :src="versionsForm.url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>


        </el-form>

        <div slot="footer" class="dialog-footer" :span="24">
            <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="saveVersions">确 定</el-button>
        </div>

    </el-dialog>



  </div>
</template>


<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env';
import {findDownloadOfPage,insertDownloadWithTx,updateDownloadByIdWithTx,findDownloadById,getQiNiuToken } from '../../../api/getData';
export default {
    data() {
        return {
            listLoading:true,
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            dialogFormVisible:false,
            ruleForm:{
                id:'',
                versionsMark:'',
                type:'',
                versionStatus:'',
                pageNo:1,
                pageSize:10
            },
            versionsForm:{
                id:'',
                name:'',
                session:'',
                url:'',
            },
            title:'新增推广',
            updataUrl:'',
            baseImgPath:'',
            baseImgUrl:'',
            imgForm:{
                key:'',
                token:'',
            },
        }
    },
    created() {
        this.findDownloadOfPage();
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
            this.versionsForm.url = this.baseImgUrl + response.key;
        },
        //获取列表
        async findDownloadOfPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findDownloadOfPage(obj);

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
            this.findDownloadOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findDownloadOfPage()
        },


        //重置
        resetForm(){
            this.ruleForm = {
                id:'',
                versionsMark:'',
                type:'',
                pageNo:1,
                pageSize:10
            }
            this.findDownloadOfPage();
        },
        //搜索
        handleFilter(){
            this.findDownloadOfPage();
        },
        //新增
        addVersions(){
            this.versionsForm = {
                id:'',
                name:'',
                session:'',
                url:'',
            };
            this.title = '新增推广';
            this.dialogFormVisible = true;
        },

        //编辑

        async editVersions(id) {
            try {
                const res = await findDownloadById({id:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.versionsForm = {
                        id:data.id,
                        name:data.name,
                        session:data.session,
                        url:data.url,
                    }
                    this.title = '编辑推广';
                    this.dialogFormVisible = true;
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

        //保存按钮
        saveVersions(){
            if(this.versionsForm.id == ''){
                this.insertDownloadWithTx();
            }else{
                this.updateDownloadByIdWithTx();
            }
        },

        //新增保存

        async insertDownloadWithTx() {
            try {
                var obj = JSON.parse(JSON.stringify(this.versionsForm));
                const res = await insertDownloadWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增版本成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findDownloadOfPage();
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

        async updateDownloadByIdWithTx() {
            try {
                var obj = JSON.parse(JSON.stringify(this.versionsForm));
                const res = await updateDownloadByIdWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改版本成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findDownloadOfPage();
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

        downloadImg(url){
            window.open(url);
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
            return y + '-' + m + '-' + d
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
</style>


