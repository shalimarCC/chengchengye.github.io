<template>
    <div id="example">
        <template v-if="active==1">
            <div style="padding:20px 100px;min-width:400px;width:800px;">
                <el-form ref="form" :model="form" label-width="80px" style="min-width:400px;text-align:left;">
                    <el-form-item label="活动名称" class="is-required">
                        <el-input v-model="form.activityName" placeholder="请输入活动名称（30字以内）" :disabled="editStatus==1" :maxlength="30"></el-input>
                    </el-form-item>

                    <el-form-item label="所属公司" class="is-required">
                        <el-select v-model="form.companyIds" multiple :disabled="allStatus||editStatus==1">
                            <p style="text-align: center;background: #ccc;color: #fff;cursor: pointer;" @click="allCheck">全选</p>
                            <el-option
                                v-for="item in companyList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <el-checkbox v-model="allStatus" :disabled="editStatus==1">所有用户可见</el-checkbox>
                    </el-form-item>

                    <el-form-item label="发起方">
                        <el-input v-model="form.createrName" :disabled="editStatus==1" placeholder="请输入发起方（15字以内）" :maxlength="15"></el-input>
                    </el-form-item>

                    <el-form-item label="活动地点" class="is-required">
                        <el-input v-model="form.location" placeholder="请输入活动地点（30字以内）" :disabled="editStatus==1" :maxlength="30"></el-input>
                    </el-form-item>

                    <el-form-item label="人数限制" class="is-required">
                        <el-input-number v-model="form.userLimit" :min="1" :disabled="userLimitStatus" @blur="praseIntEnter"></el-input-number>
                        <el-checkbox v-model="userLimitStatus">不限制报名人数</el-checkbox>
                    </el-form-item>

                    <el-form-item label="活动类型">
                        <ul>
                            <li v-for="(info,key) in form.activityTypeList" style="margin:10px 0;">
                                <el-input v-model="form.activityTypeList[key]" placeholder="请输入活动类型(15字以内)" :disabled="editStatus==1" style="width:70%;" :maxlength="15"></el-input>
                                <el-button type="danger" icon="el-icon-delete" circle style="margin-left:50px;" :disabled="key==0||editStatus==1"  size="mini" @click="delFreightRegulations(key)"></el-button>
                            </li>
                        </ul>
                        <el-button type="success" size="mini" icon="el-icon-plus"  :disabled="form.activityTypeList.length>=15||editStatus==1"  @click="addFreightRegulations">添加</el-button>

                    </el-form-item>

                    <el-form-item label="规则">
                        <el-radio-group v-model="form.activityRule" :disabled="editStatus==1">
                            <el-radio :label="1">单选</el-radio>
                            <el-radio :label="2">多选</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="活动时间" class="is-required">
                        <el-date-picker
                            v-model="startEndTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="报名开始" class="is-required">
                        <el-date-picker
                            v-model="signupStartTime"
                            type="datetime"
                            placeholder="报名开始时间"
                            :disabled="signupStartStatus||editStatus==1">
                        </el-date-picker>
                        <el-checkbox v-model="signupStartStatus" :disabled="editStatus==1">默认创建成功后即可报名</el-checkbox>
                    </el-form-item>

                    <el-form-item label="报名截止" class="is-required">
                        <el-date-picker
                            v-model="signupEndTime"
                            type="datetime"
                            placeholder="报名截止时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="封面图片">
                        <el-upload

                            :disabled="editStatus==1"
                            class="avatar-uploader"
                            :action="baseImgPath"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-error="handleError"
                            :data="imgForm">
                            <img v-if="form.coverUrl" :src="form.coverUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div class="el-upload__tip" slot="tip">推荐尺寸750*422，大小1M以内，支持png、jpg格式。</div>
                        </el-upload>

                    </el-form-item>

                    <el-form-item label="活动详情" class="is-required">
                        <template>
                            <div v-if="editStatus==1" v-html="form.detail"></div>
                            <quill-editor v-else v-model="form.detail"
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
                        </template>

                    </el-form-item>
                </el-form>


                <div style="text-align:center;"><el-button style="margin-top: 12px;" :disabled="editStatus==2" @click='modifyCategory()'>保存</el-button></div>
            </div>
        </template>

        <template v-if="active==2">
            <img src="../../../assets/success.jpg" style="width:100%;"/>
        </template>
    </div>

</template>



<script>
var moment = require('moment');
moment().format();
import { quillEditor } from 'vue-quill-editor'
import { baseImgPath,baseImgUrl } from '../../../config/env'
import {getQiNiuToken,simpleCompanyList,saveActivity,activityDetail} from '../../../api/getData';
export default {
    data() {
        return {
            active:1,
            options: [],
            editorOption: {
                modules: {
                    toolbar: '#toolbar'
                }
            },
            startEndTime:[],
            signupEndTime:'',
            signupStartTime:'',
            form:{
                id:'',
                activityName:'',
                createrName:'',
                location:'',
                startTime:'',
                endTime:'',
                detail:'',
                coverUrl:'',
                companyIds:[],
                signupEndTime:'',
                signupStartTime:'',
                activityTypeList:[''],
                activityRule:'',
                userLimit:''
            },
            dataSource:[],
            dialogFormVisible:false,
            imgForm:{
                key:'',
                token:'',
            },
            baseImgPath:'',
            baseImgUrl:'',
            companyList:[],
            allStatus:false,
            userLimitStatus:false,
            signupStartStatus:false,
            editStatus:false
        }
    },
    created () {
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        this.simpleCompanyList();
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
        });

        let str = this.$route.path;
        str = str.substring(0,13)
        if(str == "/editActivity"){
            this.activityDetail();
        }
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                this.baseImgPath = baseImgPath;
                this.baseImgUrl = baseImgUrl;
                this.simpleCompanyList();
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
                });
                 let str = curVal.path;
                 str = str.substring(0,13)

                if(str == "/editActivity"){
                    //Object.assign(this.$data, this.$options.data());
                    this.activityDetail();
                    this.simpleCompanyList();
                }else{
                    Object.assign(this.$data, this.$options.data());
                    this.baseImgPath = baseImgPath;
                    this.baseImgUrl = baseImgUrl;
                }

            },
        }
    },
    components: {
        quillEditor,
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill
        }
    },
    methods:{
        //input-number取整
        praseIntEnter(){
          this.form.userLimit = Math.ceil(this.form.userLimit);
        },
        //添加规则
        addFreightRegulations(){
            this.form.activityTypeList.push('');
        },
        //删除规则
        delFreightRegulations(index){
            this.form.activityTypeList.splice(index,1);
        },
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

        //获取基本信息
        async activityDetail () {
            try {

                const res = await activityDetail({id:this.$route.params.id});

                if (res.data.code == 0) {
                    let data = res.data.data.act;
                    this.editStatus = data.editStatus;
                    this.form = {
                        id:data.id,
                        activityName:data.activityName,
                        createrName:data.createrName,
                        location:data.location,
                        startTime:data.startTime,
                        endTime:data.endTime,
                        detail:data.detail,
                        coverUrl:data.coverUrl,
                        companyIds:data.companyIds,
                        signupEndTime:data.signupEndTime,
                        signupStartTime:data.signupStartTime,
                        activityTypeList:data.activityTypeList,
                        activityRule:data.activityRule,
                        userLimit:data.userLimit
                    }
                    if(data.companyIds[0]==-1){
                        this.form.companyIds = [];
                        this.allStatus = true;
                    }else{
                        this.allStatus = false;
                    }
                    if(data.signupStartTime==-1){
                        this.form.signupStartTime = '';
                        this.signupStartStatus = true;
                    }
                    if(data.userLimit==-1){
                        this.form.userLimit = '';
                        this.userLimitStatus = true;
                    }else{
                        this.userLimitStatus = false;
                    }
                    this.startEndTime = [data.startTime,data.endTime];
                    this.signupEndTime = data.signupEndTime;
                    this.signupStartTime = this.form.signupStartTime;
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

        //获取公司列表
        async simpleCompanyList (){
            try{
                const res = await simpleCompanyList();

                if (res.data.code == 0) {
                    this.companyList = res.data.data.companyList;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            }catch (err){
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
            this.form.companyIds = arr;
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
            this.form.coverUrl = this.baseImgUrl + response.key;
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

        //保存
        modifyCategory(){
            if(this.startEndTime[0]!='' && this.startEndTime[0]!=undefined){
                this.form.startTime =  this.setTimestamp(this.startEndTime[0]);
            }
            if(this.startEndTime[1]!='' && this.startEndTime[1]!=undefined){
                this.form.endTime =  this.setTimestamp(this.startEndTime[1]);
            }
            if(this.signupEndTime!=''){
                this.form.signupEndTime =  this.setTimestamp(this.signupEndTime);
            }
            if(this.signupStartTime!=''){
                this.form.signupStartTime =  this.setTimestamp(this.signupStartTime);
            }
            if(this.userLimitStatus){
                this.form.userLimit = -1;
            }
            if(this.signupStartStatus){
                this.form.signupStartTime = -1;
            }
            this.saveActivity();
        },

        async saveActivity(){
            try {
                let obj = JSON.parse(JSON.stringify(this.form));
                if(this.allStatus){
                    obj.companyIds = "[-1]";
                }else{
                    obj.companyIds = JSON.stringify(this.form.companyIds);
                }
                obj.activityTypeList = JSON.stringify(this.form.activityTypeList)
                const res = await saveActivity(obj);

                if (res.data.code == 0) {
                    this.active=2;
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
        }

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
    border-color: #ff8546;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 375px;
    height: 211px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 375px;
    height: 211px;
    display: block;
  }
</style>


