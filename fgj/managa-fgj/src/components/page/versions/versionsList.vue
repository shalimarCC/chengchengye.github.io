<template>
  <div class="filter-container" id="example">
    <div style="margin-bottom:20px;">

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="版本号" v-model="ruleForm.versionsMark"></el-input>

        <el-select v-model="ruleForm.type" placeholder="类型" style="width: 200px;margin-right:15px;">
            <el-option label="Android" value="0">
            </el-option>
            <el-option label="iOS" value="1">
            </el-option>
        </el-select>

        <el-select v-model="ruleForm.versionStatus" placeholder="状态" style="width: 200px;margin-right:15px;">
            <el-option label="停用" value="0">
            </el-option>
            <el-option label="启用" value="1">
            </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm" size="medium">重置</el-button>

    </div>
    <div style="margin-bottom:20px;height:30px;">
        <el-button class="filter-item" @click="addVersions" size="medium" type="primary" icon="edit">新增</el-button>

    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">


        <el-table-column align="center" label="APP类型" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.user==1">福管加C端</span>
                <span v-else-if="scope.row.user==2">慢有优运营端</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="版本号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.versionsMark}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="版本水平" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.versionCode}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="版本类型" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.type==0">Android</span>
                <span v-else-if="scope.row.type==1">iOS</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="下载地址" min-width="180">
            <template slot-scope="scope">
                <span>{{scope.row.url}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="版本状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.versionStatus==0">停用</span>
                <span v-else-if="scope.row.versionStatus==1">启用</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="是否强制升级" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isConstraint==0">否</span>
                <span v-else-if="scope.row.isConstraint==1">是</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否官网版本" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isOfficial==0">否</span>
                <span v-else-if="scope.row.isOfficial==1">是</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="版本简述" min-width="180">
            <template slot-scope="scope">
                <span>{{scope.row.resume}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="发布日期" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.releaseDate)}}</span>
            </template>
        </el-table-column>

       <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click="editVersions(scope.row.id)">编辑</el-button>
                <el-button type="primary" size="small" v-if="scope.row.versionStatus == 0" plain @click="updateVersionStatus(scope.row.id,1,0)">启用</el-button>
                <el-button type="primary" size="small" v-else-if="scope.row.versionStatus == 1" plain @click="updateVersionStatus(scope.row.id,0,0)">停用</el-button>
                <el-button type="primary" size="small" :disabled="scope.row.isOfficial == 1" plain @click="updateVersionStatus(scope.row.id,1,1)">设为官版</el-button>
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
        <el-form label-width="120px">

                <el-form-item label="APP类型">
                    <el-select v-model="versionsForm.user" placeholder="请选择APP类型">
                        <el-option
                        label="福管加C端"
                        :value="1">
                        </el-option>
                        <el-option
                        label="慢有优运营端"
                        :value="2">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="版本号">
                    <el-input v-model="versionsForm.versionsMark"></el-input>
                </el-form-item>

                <el-form-item label="版本水平">
                    <el-input v-model="versionsForm.versionCode" :disabled="versionsForm.id!=''"></el-input>
                </el-form-item>

                <el-form-item label="版本类型">
                    <el-select v-model="versionsForm.type" placeholder="请选择类型">
                        <el-option
                        label="Android"
                        :value="0">
                        </el-option>
                        <el-option
                        label="iOS"
                        :value="1">
                        </el-option>

                    </el-select>
                </el-form-item>


                <el-form-item label="安装包" v-if="versionsForm.type == 0">
                    <el-upload
                    class="upload-demo"
                    :action="updataUrl"
                    :onError="uploadError"
                    :onSuccess="uploadSuccess"
                    :limit="1">
                    <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="版本简述">
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="versionsForm.resume">
                    </el-input>
                </el-form-item>

                <el-form-item label="是否强制升级">
                    <el-radio-group v-model="versionsForm.isConstraint">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
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
import { baseUrl } from '../../../config/env'
import {findVersionsOfPage,insertVersionsWithTx,findVersionsById,updateVersionsByIdWithTx,updateVersionStatus,findImportTemplateDictUrlByType} from '../../../api/getData';
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
                versionsMark:'',
                type:'',
                url:'',
                isConstraint:0,
                versionCode:'',
                installName:'',
                resume:'',
                user:''
            },
            title:'新增版本',
            updataUrl:'',
            platformId:''

        }
    },
    created() {
        this.findVersionsOfPage();
        this.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        this.updataUrl = baseUrl + '/back-user-web/user/apks/uploadApks.do?platformId='+this.platformId;
    },

    methods: {
        //下载模板
        async findImportTemplateDictUrlByType(){

            try{
                const res = await findImportTemplateDictUrlByType({type:0});
                if(res.data.code == 0){
                    this.$notify({
                        title: '成功',
                        message: '下载模板成功',
                        type: 'success',
                        duration: 2000
                    });
                    window.open(res.data.data);
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });
            }
        },
        // 上传成功后的回调
        uploadSuccess (response, file, fileList) {
            if(response.code == 0){
                this.$message({
                    type: 'success',
                    message: '导入成功'
                });
                this.versionsForm.url = response.data.url;
                this.versionsForm.installName = response.data.apkName;
            }else if(response.code == 169){

                this.$confirm('导入的文件中部分信息存在错误，请下载并修改后重新导入', '提示', {
                    confirmButtonText: '下载',
                    type: 'error'
                }).then(() => {
                    window.open(response.error);
                }).catch(() => {

                });

            }else{
                this.$message({
                    type: 'error',
                    message: response.error
                });
            }
        },
        // 上传错误
        uploadError (response, file, fileList) {
            this.$message({
                type: 'error',
                message: response.data.error
            });
        },
        // 上传前对文件的大小的判断
        beforeAvatarUpload (file) {
            const extension = file.name.split('.')[1] === 'xls'
            const extension2 = file.name.split('.')[1] === 'xlsx'
            const isLt2M = file.size / 1024 / 1024 < 5
            if (!extension && !extension2 ) {
                alert('上传模板只能是 xls、xlsx、doc、docx 格式!')
            }
            if (!isLt2M) {
                alert('上传模板大小不能超过 5MB!')
            }
            return extension || extension2 && isLt2M
        },
        //获取列表
        async findVersionsOfPage() {
            try {

                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await findVersionsOfPage(obj);

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
            this.findVersionsOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.findVersionsOfPage()
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
            this.findVersionsOfPage();
        },
        //搜索
        handleFilter(){
            this.findVersionsOfPage();
        },
        //新增
        addVersions(){
            this.versionsForm = {
                id:'',
                versionsMark:'',
                type:'',
                url:'',
                isConstraint:0,
                versionCode:'',
                installName:'',
                resume:'',
                user:''
            };
            this.title = '新增版本';
            this.dialogFormVisible = true;
        },

        //编辑

        async editVersions(id) {
            try {
                const res = await findVersionsById({id:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.versionsForm = {
                        id:data.id,
                        versionsMark:data.versionsMark,
                        versionCode:data.versionCode,
                        type:data.type,
                        url:data.url,
                        isConstraint:data.isConstraint,
                        installName:data.installName,
                        resume:data.resume,
                        user:data.user
                    }
                    this.title = '编辑版本';
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
                this.insertVersionsWithTx();
            }else{
                this.updateVersionsByIdWithTx();
            }
        },

        //新增保存

        async insertVersionsWithTx() {
            try {
                var obj = JSON.parse(JSON.stringify(this.versionsForm));
                const res = await insertVersionsWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增版本成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findVersionsOfPage();
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

        //改变状态

        async updateVersionStatus(id,status,type) {
            try {
                const res = await updateVersionStatus({id:id,updateTarget:type,versionStatus:status,isOfficial:status});

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '操作成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.findVersionsOfPage();
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

        async updateVersionsByIdWithTx() {
            try {
                var obj = JSON.parse(JSON.stringify(this.versionsForm));
                const res = await updateVersionsByIdWithTx(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改版本成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.findVersionsOfPage();
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


