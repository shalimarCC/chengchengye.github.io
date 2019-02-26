<template>
  <div class="filter-container" id="example">
    <div>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="悦评标题" v-model="ruleForm.topicHeadline">
        </el-input>

        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="书籍名称" v-model="ruleForm.booksName">
        </el-input>

        <el-select v-model="ruleForm.companyId" placeholder="所属公司">
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
        </el-select>



        <el-button class="filter-item" type="primary" icon="search" @click="topicOfPage_HT">搜索</el-button>
        <el-button @click="resetForm()">重置</el-button>


     </div>

    <div style="margin-bottom:20px;text-align:right;">

        <el-button class="filter-item" @click="addBook" type="primary" icon="el-icon-circle-plus">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="悦评标题" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.topicHeadline}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="悦评作者" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="书籍名称" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.booksName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="书籍作者" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.author}}</span>
            </template>

        </el-table-column>

        <el-table-column align="center" label="喜欢" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.praiseType==0">不喜欢</span>
                <span v-else-if="scope.row.praiseType==1">喜欢</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建人" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="80">
            <template slot-scope="scope">
                <span>{{setTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="是否显示" min-width="80">
            <template slot-scope="scope">
                <el-switch
                v-model="scope.row.topicType"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="checkType(scope.row.id,scope.row.topicType)">
                </el-switch>
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
            <el-card class="box-card">
                <h2 style="display:inline;">书籍信息</h2>
                <el-form-item label="书籍名称" prop="booksName">
                    <el-input v-model="bookForm.booksName"></el-input>
                </el-form-item>

                <el-form-item label="书籍作者" prop="author">
                    <el-input v-model="bookForm.author"></el-input>
                </el-form-item>

                <el-form-item label="出版社" prop="publishingHouse">
                    <el-input v-model="bookForm.publishingHouse"></el-input>
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
                            <img v-if="bookForm.topicCover" :src="bookForm.topicCover" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
            </el-card>
            <el-card class="box-card">
                <h2 style="display:inline;">悦评信息</h2>
                <el-form-item label="悦评标题" prop="topicHeadline">
                    <el-input v-model="bookForm.topicHeadline"></el-input>
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

                <el-form-item label="悦评作者" prop="userName">
                    <el-input v-model="bookForm.userName"></el-input>
                </el-form-item>

                <el-form-item label="悦评正文" prop="topicContent">
                    <quill-editor v-model="bookForm.topicContent"
                            ref="myQuillEditor"
                            :options="editorOption">

                                <div id="toolbar" slot="toolbar">
                                    <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-underline"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-strike"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-code-block"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-header" value="1"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-header" value="2"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-indent" value="-1"></button></span>
                                    <span class="ql-formats"><button type="button" class="ql-indent" value="+1"></button></span>
                                    <span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>

                                    <span class="ql-formats"><select class="ql-size">
                                        <option value="small"></option>
                                        <option selected></option>
                                        <option value="large"></option>
                                        <option value="huge"></option>
                                    </select></span>
                                    <span class="ql-formats"><select class="ql-header">
                                        <option value="1"></option>
                                        <option value="2"></option>
                                        <option value="3"></option>
                                        <option value="4"></option>
                                        <option value="5"></option>
                                        <option value="6"></option>
                                        <option selected="selected"></option>
                                    </select></span>
                                    <span class="ql-formats"><select class="ql-color">
                                        <option selected="selected"></option>
                                        <option value="#e60000"></option>
                                        <option value="#ff9900"></option>
                                        <option value="#ffff00"></option>
                                        <option value="#008a00"></option>
                                        <option value="#0066cc"></option>
                                        <option value="#9933ff"></option>
                                        <option value="#ffffff"></option>
                                        <option value="#facccc"></option>
                                        <option value="#ffebcc"></option>
                                        <option value="#ffffcc"></option>
                                        <option value="#cce8cc"></option>
                                        <option value="#cce0f5"></option>
                                        <option value="#ebd6ff"></option>
                                        <option value="#bbbbbb"></option>
                                        <option value="#f06666"></option>
                                        <option value="#ffc266"></option>
                                        <option value="#ffff66"></option>
                                        <option value="#66b966"></option>
                                        <option value="#66a3e0"></option>
                                        <option value="#c285ff"></option>
                                        <option value="#888888"></option>
                                        <option value="#a10000"></option>
                                        <option value="#b26b00"></option>
                                        <option value="#b2b200"></option>
                                        <option value="#006100"></option>
                                        <option value="#0047b2"></option>
                                        <option value="#6b24b2"></option>
                                        <option value="#444444"></option>
                                        <option value="#5c0000"></option>
                                        <option value="#663d00"></option>
                                        <option value="#666600"></option>
                                        <option value="#003700"></option>
                                        <option value="#002966"></option>
                                        <option value="#3d1466"></option>
                                    </select></span>
                                    <span class="ql-formats"> <select class="ql-background">
                                        <option value="#000000"></option>
                                        <option value="#e60000"></option>
                                        <option value="#ff9900"></option>
                                        <option value="#ffff00"></option>
                                        <option value="#008a00"></option>
                                        <option value="#0066cc"></option>
                                        <option value="#9933ff"></option>
                                        <option selected="selected"></option>
                                        <option value="#facccc"></option>
                                        <option value="#ffebcc"></option>
                                        <option value="#ffffcc"></option>
                                        <option value="#cce8cc"></option>
                                        <option value="#cce0f5"></option>
                                        <option value="#ebd6ff"></option>
                                        <option value="#bbbbbb"></option>
                                        <option value="#f06666"></option>
                                        <option value="#ffc266"></option>
                                        <option value="#ffff66"></option>
                                        <option value="#66b966"></option>
                                        <option value="#66a3e0"></option>
                                        <option value="#c285ff"></option>
                                        <option value="#888888"></option>
                                        <option value="#a10000"></option>
                                        <option value="#b26b00"></option>
                                        <option value="#b2b200"></option>
                                        <option value="#006100"></option>
                                        <option value="#0047b2"></option>
                                        <option value="#6b24b2"></option>
                                        <option value="#444444"></option>
                                        <option value="#5c0000"></option>
                                        <option value="#663d00"></option>
                                        <option value="#666600"></option>
                                        <option value="#003700"></option>
                                        <option value="#002966"></option>
                                        <option value="#3d1466"></option>
                                    </select></span>
                                    <span class="ql-formats"><select class="ql-font">
                                        <option selected="selected"></option>
                                        <option value="serif"></option>
                                        <option value="monospace"></option>
                                    </select></span>
                                    <span class="ql-formats">
                                        <select class="ql-align">
                                        <option selected="selected"></option>
                                        <option value="center"></option>
                                        <option value="right"></option>
                                        <option value="justify"></option>
                                    </select>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" class="ql-clean"></button>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" class="ql-link"></button>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" @click="imgClick">
                                            <svg viewBox="0 0 18 18">
                                                <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                                                <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
                                                <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
                                            </svg>
                                        </button>
                                    </span>
                                    <span class="ql-formats">
                                        <button type="button" class="ql-video"></button>
                                    </span>
                                    </div>
                        </quill-editor>
                </el-form-item>
            </el-card>
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
import { quillEditor } from 'vue-quill-editor';
import {topicOfPage_HT ,updateTopicStatusById_HT,getQiNiuToken,findCompanyIdOrName,insertTopicWithTx_HT,updateTopicByIdWithTx_HT,topicOfId_HT} from '../../../api/getData';
export default {
    data() {
        return {
            options: [],
            editorOption: {
                modules: {
                    toolbar: '#toolbar'
                }
            },
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
                topicHeadline:'',
                booksName:'',
                companyId:'',
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
                topicCover:'',
                topicContent:'',
                topicHeadline:'',
                userName:''
            },
            rules:{
                booksName: [
                    { required: true, message: '请输入书籍名称', trigger: 'blur' }
                ],
                topicContent: [
                    { required: true, message: '请输入悦评正文', trigger: 'blur' }
                ],
                topicHeadline: [
                    { required: true, message: '请输入悦评标题', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入悦评作者', trigger: 'blur' }
                ],
                companyIdList: [
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
            allStatus:false
        }
    },
    created() {
        this.topicOfPage_HT();
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
    components: {
        quillEditor
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill
        }
    },
    methods: {
        /*选择上传图片切换*/
            onFileChange(e){
                var fileInput = e.target;
                if (fileInput.files.length == 0) {
                    return;
                }
                if (fileInput.files[0].size > 1024 * 1024 * this.maxSize) {
                    alert('图片过大');
                    return;
                }
              var self = this;
              var data = new FormData;
              let curr = moment().format('YYYYMMDDHHmmss').toString();
              let prefix = moment().format('HHmmss').toString();
              let key = curr+"egeo"+prefix;

              data.append('file', fileInput.files[0],name);
              data.append("token",this.imgForm.token);
              data.append("key",key);
              this.editor.focus();
              var xhr=new XMLHttpRequest();
              xhr.open('post',baseImgPath);
              xhr.responseType='json';
              xhr.send(data);
              xhr.onload=function () {
                if(xhr.status==200){
                  self.editor.insertEmbed(self.editor.getSelection().index, 'image', self.baseImgUrl + xhr.response.key);
                }
              }
            },
            /*点击上传图片按钮*/
            imgClick() {
                if(this.canCrop){
                    this.showCrop=true;
                }else{
                  /*创建input file 不裁切，自己控制*/
                  var input = document.createElement('input');
                  input.type = 'file';
                  input.name = this.fileName;
                  input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
                  input.onchange = this.onFileChange;
                  input.click();
                }
            },
        //获取列表
        async topicOfPage_HT() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                this.listLoading = false;
                const res = await topicOfPage_HT(obj);

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
            this.topicOfPage_HT()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageSize;
            this.topicOfPage_HT()
        },

        //重置
        resetForm(){
            this.ruleForm={
                topicHeadline:'',
                booksName:'',
                companyId:'',
                pageNo:1,
                pageSize:10
            };

            this.topicOfPage_HT()
        },
        //公司全选
        allCheck(){
            let arr = new Array;
            $.each(this.companyList,function(key,info){
                arr.push(info.id);
            })
            this.bookForm.companyIdList = arr;
        },
        //改变状态
        async checkType(id,type){
            try {

                const res = await updateTopicStatusById_HT({id:id,topicType:type});

                if (res.data.code == 0) {
                     this.$message({
                        type: 'success',
                        message: '改变状态成功'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                    this.topicOfPage_HT();
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
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

        addBook () {
            this.dialogTitle = "新增悦评";
            this.bookForm = {
                id:'',
                companyIdList:[],
                booksName:'',
                author:'',
                publishingHouse:'',
                recommendLanguage:'',
                topicCover:'',
                topicContent:'',
                topicHeadline:'',
                userName:''
            };
            this.dialogFormVisible = true;
        },

        //保存按钮
        uploadReadBook(){
            let quillText = this.$refs.myQuillEditor.quill.root.innerText;
            if(quillText.length>500){
                this.$message({
                    type: 'error',
                    message: '悦评字数不得超过500字'
                });
            }else{
                if(this.bookForm.id == ''){
                    this.insertTopicWithTx_HT();
                }else{
                    this.updateTopicByIdWithTx_HT();
                }
            }

        },

        //新增

        async insertTopicWithTx_HT () {
            try {
                let obj = JSON.parse(JSON.stringify(this.bookForm));
                if(this.allStatus){
                    obj.companyIdList = "[-1]";
                }else{
                    obj.companyIdList = JSON.stringify(this.bookForm.companyIdList);
                }
                const res = await insertTopicWithTx_HT(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.topicOfPage_HT();
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

        async updateTopicByIdWithTx_HT () {
            try {
                let obj = JSON.parse(JSON.stringify(this.bookForm));
                if(this.allStatus){
                    obj.companyIdList = "[-1]";
                }else{
                    obj.companyIdList = JSON.stringify(this.bookForm.companyIdList);
                }
                this.dialogTitle = "修改悦评";
                const res = await updateTopicByIdWithTx_HT(obj);

                if (res.data.code == 0) {
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    this.topicOfPage_HT();
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
                this.dialogFormVisible = true;
                const res = await topicOfId_HT({id:id});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.bookForm = {
                        id:data.id,
                        companyIdList:data.companyIdList,
                        booksName:data.booksName,
                        author:data.author,
                        publishingHouse:data.publishingHouse,
                        recommendLanguage:data.recommendLanguage,
                        topicCover:data.topicCover,
                        topicContent:data.topicContent,
                        topicHeadline:data.topicHeadline,
                        userName:data.userName
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
            this.bookForm.topicCover = this.baseImgUrl + response.key;
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


