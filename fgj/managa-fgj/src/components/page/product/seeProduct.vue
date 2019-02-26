<template>
    <div id="example">
        <template>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="padding:20px 20px;min-width:400px;">
                <el-form-item label="产品类目" style="text-align:left;">
                    <span>{{categoryName}}</span>
                </el-form-item>

                <el-form-item label="产品编码" style="text-align:left;">
                    <span style="font-size:16px;line-height:36px;">{{form.id}}</span>
                </el-form-item>

                <el-form-item label="产品名称" style="text-align:left;" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

            </el-form>


            <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="padding:20px 20px;min-width:400px;">
                <h4  style="text-align:left;">基本属性：</h4>
                <el-row :gutter="60">
                    <el-col :span="11" v-for="(info,key) in form.lists" :key="key">
                        <el-form-item v-if="info.mode == 1" :label="info.name" style="text-align:left;">
                            <el-select v-model="info.value" placeholder="请选择"  :disabled="info.key==3&&form.lists[1].value!=3">
                                <el-option
                                v-for="(item,k) in info.lists"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id"
                                 placeholder="请选择">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 2" :label="info.name" style="text-align:left;">
                            <el-input v-model="info.value"></el-input>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 3" :label="info.name" style="text-align:left;">
                            <el-checkbox-group
                                v-model="info.value"
                                >
                                <el-checkbox v-for="val in info.lists" :label="val.id" :key="val.id">{{val.value}}</el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item v-if="info.mode == 4" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-date-picker
                                    v-model="info.value"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 5" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-input v-model="info.value"></el-input>{{info.unit}}
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 6" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-input v-model="info.value"></el-input>{{info.unit}}
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 7" :label="info.name" style="text-align:left;">
                            <el-tag
                            :key="tag"
                            v-for="tag in info.value">
                            {{tag}}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="padding:20px 20px;min-width:400px;">
                <h4  style="text-align:left;">参数属性：</h4>
                <el-row :gutter="60">
                    <el-col :span="11" v-for="(info,index) in form.lists1" :key="index">
                        <el-form-item v-if="info.mode == 1" :label="info.name" style="text-align:left;">
                            <el-select v-model="info.value" placeholder="请选择" style="width:100%;">
                                <el-option
                                v-for="item in info.lists"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 2" :label="info.name" style="text-align:left;">
                            <el-input v-model="info.value"></el-input>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 3" :label="info.name" style="text-align:left;">
                            <el-checkbox-group
                                v-model="info.value"
                                >
                                <el-checkbox v-for="val in info.lists" :label="val.id" :key="val.id">{{val.value}}</el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item v-if="info.mode == 4" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-date-picker
                                    v-model="info.value"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 5" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-input v-model="info.value"></el-input>{{info.unit}}
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item v-if="info.mode == 6" :label="info.name" style="text-align:left;">
                            <el-tooltip class="item" effect="dark" :content="info.reminder" placement="right">
                                <el-input v-model="info.value"></el-input>{{info.unit}}
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-form ref="form" label-width="120px" style="padding:20px 20px;min-width:400px;">
                <h4  style="text-align:left;">规格信息：</h4>
                <el-form-item :label="info.name" style="text-align:left;"  v-for="(info,index) in standardData" :key="index">
                      <el-radio v-model="showProductAttNameId" :label="info.id">添加规格图片</el-radio>
                      <template>
                        <div class="skuList">
                            <el-table
                                :data="info.list"
                                border
                                min-height="500">

                                    <el-table-column
                                    label="规格值"
                                    min-width="100"
                                    align="center">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.value}}</span>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                    label="上传图片"
                                    align="center"
                                    v-if="showProductAttNameId==info.id">
                                        <template slot-scope="scope">
                                                <img v-if="scope.row.pictureUrl" :src="scope.row.pictureUrl">

                                        </template>
                                    </el-table-column>


                                </el-table>
                        </div>
                      </template>
                </el-form-item>
            </el-form>

            <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="padding:20px 20px;min-width:400px;">
                <h4  style="text-align:left;">产品图片：</h4>
                <el-form-item label="列表页图片" style="text-align:left;">
                        <img v-if="imageUrl1" :src="imageUrl1" class="avatar">


                </el-form-item>

                <el-form-item label="轮播图图片" style="text-align:left;">
                    <template>
                        <div class="color-list">
                            <div class="color-item" v-for="(info,key) in file_logo_img_url">
                                <el-card style="width:140px;float:left;margin:8px;position:relative;" :body-style="{ padding: '0px' }">
                                    <img :src="info.url" class="image" style="width:140px;height:140px;">
                                </el-card>
                            </div>
                        </div>
                    </template>

                </el-form-item>
                <p style="font-size:12px;line-height:30px;color:#999;text-align:left;">Tips : 可拖拽排序。</p>

                <el-form-item label="商品模板" style="text-align:left;">
                    <el-select v-model="form.commodityTemplateId" placeholder="请选择" style="width:100%;">
                        <el-option
                        v-for="item in commodityTemplateList"
                        :key="item.commodityTemplateId"
                        :label="item.templateName"
                        :value="item.commodityTemplateId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="产品详情" style="text-align:left;">
                    <template>
                        <quill-editor v-model="content"
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

            <el-dialog title="添加规格" :visible.sync="dialogFormVisible">
               <div style="height:400px;overflow:auto;">
                    <el-table
                        ref="multipleTable"
                        :data="standaList"
                        border
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                        >
                        <el-table-column
                        type="selection"
                        width="80"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="id"
                        label="id"
                        align="center">

                        </el-table-column>
                        <el-table-column
                        prop="value"
                        label="规格值"
                        align="center">
                        </el-table-column>

                    </el-table>
                </div>
                <div slot="footer" class="dialog-footer" :span="24">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveProductAttValueByProductIdAndAttnameId">确 定</el-button>
                </div>
            </el-dialog>

            <div><el-button style="margin-top: 12px;" @click='next1()'>保存</el-button></div>
        </template>


    </div>

</template>



<script>

var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import { quillEditor } from 'vue-quill-editor'
import {productById ,idToName,categoryAttNameByCId,getQiNiuToken,deletePicture,updateProduct,findByProductIdAndAttNameId,attributeValueByProductIdAndCategoryId,saveProductAttValueByProductIdAndAttnameId,productAttValueDeleteById,saveImgByProductAttValueId,delImgByProductAttNameId,findCommodityTemplateByType} from '../../../api/getData';
export default {
    props: {
        productId: {
            type: Number,
            default: function () {
                return ''
            }
        },
    },
    data() {
        return {
            options: [],
            editorOption: {
                modules: {
                    toolbar: '#toolbar'
                }
            },
            props:{
                value:'id',
                children:'lists',
                label:'name'
            },

            catProps:{
                value:'id',
                children:'lists',
                label:'name'
            },

            categoryId:[],
            form:{
                categoryId:[],
                id:'',
                name:'',
                lists:[
                    {
                        value: 1,
                        key: '',
                        name:'',
                        mode:'',
                        lists:'',
                        reminder:''
                    }
                ],
                lists1:[],
                commodityTemplateId:''
            },
            rules:{
                name:[
                    {required: true, message: '请输入产品名称', trigger: 'blur'}
                ]
            },
            categoryName:'',
            imageUrl: '',
            dialogVisible: false,
            dialogVisible1: false,
            imgForm:{
                key:'',
                token:'',
            },
            file_logo_img_url : [],
            imageUrl1: null,
            content:'',
            standardData:[],
            standaList:[],
            baseImgPath:'',
            baseImgUrl:'',
            dialogFormVisible:false,
            multipleSelection:'',
            spuId:'',
            dialogFormVisible:false,
            multipleSelection:'',
            index1:'',
            index2:'',
            showProductAttNameId:'',
            showProductAttNameIdOld:'',
            commodityTemplateList:[],
            isEle:'',
        }
    },
    created () {
        this.productById();
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
    watch : {
        "$route": {
            handler(curVal,oldVal){
                let str = curVal.path;
                str = str.substring(0,20)
                if(str == "/product/editProduct"){
                    //Object.assign(this.$data, this.$options.data())
                    this.productById();
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
                }

　　　　　　 },
            deep:true
        },
        showProductAttNameId:{
            handler(curVal,oldVal){
                this.showProductAttNameIdOld = oldVal;
　　　　　　 },
        },
        'form.lists':{
            handler(curVal,oldVal){
                if(curVal[0].value!=this.isEle){
                    this.isEle = curVal[0];
                    this.findCommodityTemplateByType(curVal[0].value);
                }
　　　　　　 },
            deep:true
        },
    },
    components: {
        quillEditor
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods:{
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
              xhr.open('post',this.baseImgPath);
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
        async productById (){
            try {

                const res = await productById({id:this.$route.params.productId});

                if (res.data.code == 0) {
                    let data = res.data.data;
                    this.form.name = data.name;   //名称
                    this.categoryId = data.categoryPId;  //类目ID
                    this.spuId = data.id; //产品ID
                    this.next();
                    this.attributeValueByProductIdAndCategoryId();
                    this.categoryAttNameByCId(data.categoryAttNameValuseList);
                    this.parameterCategoryAttNameValuse(data.parameterCategoryAttNameValuse);
                    this.findCommodityTemplateByType(data.categoryAttNameValuseList[0].value);
                    this.imageUrl1 = data.url; //列表页图片
                    this.form.commodityTemplateId = data.commodityTemplateId;
                    this.file_logo_img_url = data.pictureList;
                    this.content = data.content //富文本
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

        next () {
            var arr = this.categoryId;
            this.form.categoryId = arr[arr.length-1];

            if (arr.length<=0){
                this.$notify.error({
                    title: '错误',
                    message: '请选择类目！'
                });
            }else{

                this.idToName();

            }

        },


        // 根据spuID查询属于SPU的规格值
        async attributeValueByProductIdAndCategoryId () {
            try {
                const res = await attributeValueByProductIdAndCategoryId({productId:this.spuId,categoryId:this.form.categoryId});

                if (res.data.code == 0) {
                    var tfis = this;
                    tfis.standardData = [];
                    $.each(res.data.data,function(key,info){
                        let obj = new Object();
                        obj.name = info.name;
                        obj.id = info.id;
                        obj.list = info.attributeValueList;
                        tfis.standardData.push(obj);
                        if(key==0){
                            tfis.showProductAttNameId = info.id;
                        }
                    })
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

        async attributeValueByProductIdAndCategoryId1 () {
            try {
                const res = await attributeValueByProductIdAndCategoryId({productId:this.spuId,categoryId:this.form.categoryId});

                if (res.data.code == 0) {
                    var tfis = this;
                    tfis.standardData = [];
                    $.each(res.data.data,function(key,info){
                        let obj = new Object();
                        obj.name = info.name;
                        obj.id = info.id;
                        obj.list = info.attributeValueList;
                        tfis.standardData.push(obj);
                    })
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
        // 根据spuID查询属于SPU的规格值
        async findByProductIdAndAttNameId (id) {
            try {
                this.multipleSelection = [];
                this.dialogFormVisible = true;
                const res = await findByProductIdAndAttNameId({productId:this.spuId,attNameId:id});

                if (res.data.code == 0) {
                    this.standaList = res.data.data;
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

        // 根据类型选择商品模版接口
        async findCommodityTemplateByType (type) {
            try {
                const res = await findCommodityTemplateByType({type:type});

                if (res.data.code == 0) {
                    this.commodityTemplateList = res.data.data.commodityTemplateList;
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

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        spuChange(id){
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              this.delImgByProductAttNameId(id)
            }).catch(() => {
              this.showProductAttNameId = this.showProductAttNameIdOld;
            })
        },
        // 根据spuID查询属于SPU的规格值
        async delImgByProductAttNameId (id) {
            try {
                const res = await delImgByProductAttNameId({productAttNameId:id});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '切换成功'
                    });
                    this.attributeValueByProductIdAndCategoryId1();
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
        //上传之前获取key，index
        uploadKeyIndex(index1,index2) {
            this.index1 = index1;
            this.index2 = index2;
        },

        // 保存SPU的规格值
        async saveProductAttValueByProductIdAndAttnameId () {
            try {
                var productAttValueList = new Array();
                $.each(this.multipleSelection,function(key,info){
                    let obj = new Object();
                    obj.attValueId = info.id;
                    productAttValueList.push(obj);
                })
                const res = await saveProductAttValueByProductIdAndAttnameId({productId:this.spuId,productAttValueList:JSON.stringify(productAttValueList)});

                if (res.data.code == 0) {
                    this.dialogFormVisible = false;
                    this.attributeValueByProductIdAndCategoryId();
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

        //删除标签
        handleCloseValue (id,attValueId,productAttValueId) {
             this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              this.productAttValueDeleteById(id,attValueId,productAttValueId)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        },

        // 删除SPU的规格值
        async productAttValueDeleteById (id,attValueId,productAttValueId) {
            try {

                const res = await productAttValueDeleteById({productId:this.spuId,attributeNameId:productAttValueId,attributeValueId:attValueId,productAttValueId:id});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: "删除成功！"
                    });
                    this.attributeValueByProductIdAndCategoryId();
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

        handleAvatarSuccess3(response){
           // this.standardData[this.index1].list[this.index2].pictureUrl = this.baseImgUrl + response.key;
            this.$set(this.standardData[this.index1].list[this.index2],'pictureUrl',this.baseImgUrl + response.key)
            this.saveImgByProductAttValueId();
        },
        async saveImgByProductAttValueId () {
            try {

                const res = await saveImgByProductAttValueId({productAttValueId	:this.standardData[this.index1].list[this.index2].productAttValueId,pictureUrl:this.standardData[this.index1].list[this.index2].pictureUrl});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: "上传成功"
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
        //根据类目Id获取类目名
        async idToName () {
            try {
                this.categoryName = "";
                const res = await idToName({ids:JSON.stringify(this.categoryId)});

                if (res.data.code == 0) {
                    var thtf = this;
                    $.each(res.data.data,function(key,info){
                        if(res.data.data.length-1>key){
                            thtf.categoryName += info+" > "
                        }else{
                            thtf.categoryName += info
                        }
                    })
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
        //根据类目Id获取类目属性和属性值
        async categoryAttNameByCId (res) {

            var tfis = this;

            this.form.lists = [];
            $.each(res,function(key,info){
                if(info.attributeNameDTO.mode == 3){
                    tfis.form.lists.push({
                        value: info.values,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder
                    })
                }else if(info.attributeNameDTO.mode == 1){
                    tfis.form.lists.push({
                        value: info.value,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder
                    })
                }else{
                    tfis.form.lists.push({
                        value: info.value,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder,
                        unit:info.attributeNameDTO.unit
                    })
                }
            })
        },
        //根据类目Id获取类目属性和属性值
        async parameterCategoryAttNameValuse (res) {

            var tfis = this;

            this.form.lists1 = [];
            $.each(res,function(key,info){
                if(info.attributeNameDTO.mode == 3){
                    tfis.form.lists1.push({
                        value: info.values,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder
                    })
                }else if(info.attributeNameDTO.mode == 1){
                    tfis.form.lists1.push({
                        value: info.value,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder
                    })
                }else{
                    tfis.form.lists1.push({
                        value: info.value,
                        key: info.attributeNameDTO.id,
                        name:info.attributeNameDTO.name,
                        mode:info.attributeNameDTO.mode,
                        lists:info.lists,
                        reminder:info.attributeNameDTO.reminder,
                        unit:info.attributeNameDTO.unit
                    })
                }
            })
        },


        delImgList (key) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.file_logo_img_url.splice(key,1);
                this.$notify({
                    title: '删除',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
                // const res = deletePicture({picture:this.file_logo_img_url[key].url})
                // res.then(_data => {
                //     if(_data.data.code == 0){
                //         this.file_logo_img_url.splice(key,1);
                //         this.$notify({
                //             title: '删除',
                //             message: '删除成功',
                //             type: 'success',
                //             duration: 2000
                //         });
                //     }else{
                //         this.$message({
                //             type:"error",
                //             message:_data.data.error
                //         })
                //     }
                //})
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },


        handleAvatarSuccess1 (response) {
            this.imageUrl1 = this.baseImgUrl + response.key;
        },

        beforeAvatarUpload1(file) {    //在图片提交前进行验证  列表图

            // if(this.imageUrl1 !== null){
            //     this.$message({
            //         message: '列表图只允许一张！如需替换，请先删除！',
            //         type: 'warning'
            //     });
            //     return;
            // }
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
        delImgList1 () {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.imageUrl1 = null;
                this.$notify({
                    title: '删除',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
                // const res = deletePicture({picture:this.imageUrl1})
                // res.then(_data => {
                //     if(_data.data.code == 0){
                //         this.imageUrl1 = null;
                //         this.$notify({
                //             title: '删除',
                //             message: '删除成功',
                //             type: 'success',
                //             duration: 2000
                //         });
                //     }else{
                //         this.$message({
                //             type:"error",
                //             message:_data.data.error
                //         })
                //     }
                // })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },


        onEditorChange({ editor, html, text }) {

            this.content = html
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
    padding: 5px 20px;
    text-align:center;
}
.text{
    font-size:16px;
    line-height:36px;
}
.el-upload--text {
    background-color: #fff;
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    width: 68px;
    height: 28px;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow:initial;
}
.el-upload--text {
    background-color: #fff;
    border: none;
    border-radius: 0;
    box-sizing: border-box;

    text-align: left;
    cursor: pointer;
    position: relative;
    overflow:initial;
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
  .skuList .avatar-uploader{
    display:inline-block;
    width:40px;
    height:40px;
}
.skuList .avatar-uploader img{
    width:100%;
    height:100%;

}
 .skuList .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width:100%;
        height:100%;
        line-height:28px;
        text-align: center;
    }
.skuList .el-upload{
        width:100%;
        height:100%;
    }
</style>


