<template>
    <div id="contentCon">
        <!-- 基础信息 -->
        <div class="basicMessage">
            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="模板名称">
                    <el-input class="filter-item" placeholder="模板名称" :maxlength="30" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="模板备注">
                    <el-input class="filter-item" placeholder="模板备注" v-model="form.remark"></el-input>
                </el-form-item>
                <el-form-item label="所属客户端">
                    <el-select v-model="form.clientType" placeholder="选择所属客户端" disabled>
                        <el-option
                            v-for="item in clientTypeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板类型">
                    <el-select v-model="form.type" placeholder="选择模板类型" disabled>
                        <el-option
                            v-for="item in tempTypeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最低支持版本">
                    <p class="clientTypeLowest">安卓 1.01 </br> IOS 1.01</p>
                </el-form-item>
            </el-form>
        </div>
        <!-- 组件配置 -->
        <div class="tempConfig">
            <h3>组件配置：</h3>
            <div class="configIn">
                <ul>
                    <li class="hasconfigIn" v-if="form.elementList" v-for="(info,index) in form.elementList">
                        <div class="hasconfigCon clearfix">
                            <div :style="'background-image:url('+info.sampleImgUrl+')'">
                                <el-button class="filter-item" @click="addExampleAfresh(info.id,index)" size="medium" type="primary" icon="edit">重新选择</el-button>
                                <el-button class="filter-item" @click="deleteExample(info.id,index)" size="medium" type="primary" icon="edit">删除组件</el-button>
                            </div>
                            <div>
                                <p>组件名：{{info.name}}</p>
                                <p>iOS版本号：{{info.clientVersionIRemark}}</p>
                                <p>Android版本号：{{info.clientVersionARemark}}</p>
                            </div>
                        </div>
                    </li>
                    <li class="noconfigIn">
                        <el-button class="filter-item" @click="addExample" size="medium" type="primary" icon="edit">新增组件</el-button>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 保存取消按钮 -->
        <div class="saveBtn">
            <el-button class="filter-item" size="medium" type="primary" icon="edit" @click="saveActTemp">保存</el-button>
            <el-button class="filter-item" size="medium" type="primary" icon="edit">取消</el-button>
        </div>
        <!-- 选择组件 -->
        <el-dialog title="选择组件" :visible.sync="dialogFormVisible1" append-to-body width="600px" top="4vh">
            <div class="checkelement">
                <ul>
                    <li v-for="info in elementList">
                        <el-radio v-model="radio" :label="info.id" @change="getcheckedInfo">
                            <div class="checkelelist clearfix">
                                <div>
                                    <p>组件名：{{info.name}}</p>
                                    <p>iOS版本号：{{info.clientVersionIRemark}}</p>
                                    <p>Android版本号：{{info.clientVersionARemark}}</p>
                                </div>
                                <div v-if="info.sampleImgUrl && info.sampleImgUrl!=null"><img :src="info.sampleImgUrl"/></div>
                            </div>
                        </el-radio>
                    </li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer" :span="24">
                <el-button size="medium" @click="cancel">取 消</el-button>
                <el-button size="medium" type="primary" @click="tempComfirmed">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
var moment = require('moment');
moment().format();
import {baseImgPath,baseImgUrl} from '../../../config/env'
import {findCmsElement,insertCmsTemplateWithTx,templateDetail,findCmsElementById,findCmsTemplateById,updateCmsTemplateByIdWithTx} from '../../../api/getData';
export default {
    data(){
       return {
            form:{
                name:'',
                remark:'',
                clientType:'',
                elementList:[],
                type:'',
                elementIdList:[],
                templateElementList:[],
                companyType:''
            },
            configId:'',
            clientTypeList:[
                // {
                //     value:1,
                //     name:'app'
                // },
                // {
                //     value:2,
                //     name:'微信'
                // },
                // {
                //     value:3,
                //     name:'小程序'
                // },
                // {
                //     value:4,
                //     name:'web商城'
                // },
                {
                    value:5,
                    name:'PC端'
                },
                {
                    value:6,
                    name:'移动端'
                }
            ],
            elementList:[],
            dialogFormVisible1:false,
            radio:'',
            tempTypeList:[
                {
                    value:1,
                    name:'商品列表页模板'
                },
                {
                    value:2,
                    name:'首页模板'
                },
                {
                    value:3,
                    name:'商城模板'
                },
                {
                    value:4,
                    name:'应用模板'
                },
                {
                    value:5,
                    name:'活动页模板'
                }
            ],
            tempId:'',
            index:-1,
       }
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,12);
                if(str == "/editActTemp"){
                    Object.assign(this.$data, this.$options.data());
                    this.form = {
                        name:'',
                        remark:'',
                        clientType:'',
                        elementList:[],
                        type:'',
                        elementIdList:[],
                        templateElementList:[],
                        // [
                        //     {
                        //         "id":1,
                        //         "sort":1
                        //     },
                        //     {
                        //         "id":1,
                        //         "sort":1
                        //     },
                        //     {
                        //         "id":1,
                        //         "sort":1
                        //     }
                        // ]
                        companyType:''
                    };
                    this.tempId = this.$route.params.id;
                    this.findCmsElement();
                    this.findCmsTemplateById();
                }

            },
        }
    },
    created () {
        this.platformId = this.$store.state.Cookie.mutations.fetch().platformId;
        this.form.companyType = this.$route.params.companyType;
        this.tempId = this.$route.params.id;
        this.findCmsElement();
        this.findCmsTemplateById();
    },
    methods: {
        //查询模板详情--组件列表
        getcheckedInfo(value){
            this.configId = value;
            console.log(this.configId);
        },
        //查询组件列表
        async findCmsElement(){
            try{
                const res = await findCmsElement({groupType:1});
                if(res.data.code == 0){
                    this.elementList = res.data.data;
                }else{
                    $.message({
                        type:"error",
                        message:"组件查询失败，请重试"
                    });
                }
            }catch(err){
                this.$message({
                    type:"error",
                    message:"组件查询链接失败，请重试"
                });
            }
        },
        async tempComfirmed(){
            try{

                if(this.index==-1){
                    // this.form.elementIdList.push(this.configId);
                    this.form.templateElementList.push({
                        id:this.configId
                    });
                }else{
                    // this.form.elementIdList[this.index]=this.configId;
                    this.form.templateElementList[this.index].id=this.configId;
                }
                const res = await findCmsElementById({id:this.configId});
                if(res.data.code == 0){
                    // this.form.elementList.push(res.data.data);
                    // this.dialogFormVisible1 = false;
                    // console.log(this.form.elementList);
                    // console.log(this.form.elementIdList);

                    if(this.index==-1){
                        this.form.elementList.push(res.data.data);
                        this.dialogFormVisible1 = false;
                    }else{
                        this.form.elementList[this.index]=res.data.data;
                        this.index=-1;
                        this.dialogFormVisible1 = false;
                    }
                    console.log(this.form.elementList);
                    console.log(this.form.elementIdList);
                }else{
                    $.message({
                        type:"error",
                        message:"组件查询失败，请重试"
                    });
                }
            }catch(err){
                this.$message({
                    type:"error",
                    message:"组件查询链接失败，请重试"
                });
            }
        },
        //根据id查询
        async findCmsTemplateById(){
            try{
                const res = await findCmsTemplateById({id:this.tempId});
                if(res.data.code == 0){
                    this.form.name = res.data.data.name;
                    this.form.remark = res.data.data.remark;
                    this.form.clientType = res.data.data.clientType;
                    this.form.type = res.data.data.type;
                    this.form.elementList = res.data.data.elementList;
                    let that = this;
                    $.each(res.data.data.elementList,function(key,info){
                        that.form.elementIdList.push(info.id);
                        that.form.templateElementList.push({
                            id:info.id,
                            sort:info.sort
                        });
                    })
                }
            }catch(err){
                this.$message({
                    type:"error",
                    message:"模板查询链接失败，请重试"
                });
            }
        },
        //新增模板接口
        async saveActTemp(){
            try{
                let obj = new Object;
                obj.id = this.tempId;
                obj.name = this.form.name;
                obj.remark = this.form.remark;
                obj.clientType = this.form.clientType;
                obj.elementIdList = JSON.stringify(this.form.elementIdList);
                obj.templateElementList = JSON.stringify(this.form.templateElementList);
                obj.type = this.form.type;
                const res = await updateCmsTemplateByIdWithTx(obj);
                if(res.data.code == 0){
                    this.$message({
                        type:"success",
                        message:"模板修改成功"
                    });
                }else{
                    this.$message({
                        type:"error",
                        message:res.data.error
                    });
                }
            }catch(err){
                    this.$message({
                        type:"error",
                        message:"模板添加失败，请重试"
                    });
            }
        },
        //新增组件
        addExample(){
            this.dialogFormVisible1 = true;
        },
        //重新选择
        addExampleAfresh(id,index){
            // this.form.elementList.splice(index,1);
            // this.form.elementIdList.splice(index,1);
            this.index = index;
            this.dialogFormVisible1 = true;
        },
        cancel(){
            if(this.index!=-1){
                this.index=-1;
            }
            this.dialogFormVisible1 = false;
        },
        //删除组件
        deleteExample(id,index){
            this.form.elementList.splice(index,1);
            this.form.elementIdList.splice(index,1);
            this.form.templateElementList.splice(index,1);
            this.$message({
                type:"success",
                message:"组件删除成功"
            });
               console.log(this.form.elementIdList);
               console.log(this.form.elementList);
        }
    }
}
</script>

<style scoped>
#contentCon{
    padding: 10px 30px;
}
.tempConfig h3{
    font-size:16px;
    margin-left:120px;
}
.tempConfig .configIn{
    width:750px;
    min-height:200px;
    border:1px solid #ccc;
    padding:30px;
    margin:20px 0 0 200px;
}
.tempConfig .hasconfigIn{
    border:1px dashed #ccc;
    border-radius:5px;
    margin-bottom:20px;
    padding:20px 40px;
    cursor:move;
}
.tempConfig .noconfigIn{
    width:100%;
    height:200px;
    border:1px dashed #ccc;
    border-radius:5px;
    text-align:center;
    line-height:200px;
}
.tempConfig .hasconfigIn .hasconfigCon{
    display:inline-block;
}
.tempConfig .hasconfigIn .hasconfigCon div:nth-child(1){
    text-align: center;
    width:488px;
    line-height:200px;
    display:inline-block;
    background-size:100% 100%;
    background-repeat:no-repeat;
}
.tempConfig .hasconfigIn .hasconfigCon div:nth-child(2){
    display:inline-block;
    margin:0;
    width:175px;
}
.tempConfig .hasconfigIn .hasconfigCon:nth-child(2)>p{
    line-height:30px;
}
.basicMessage{
    width:1000px;
}
.clientTypeLowest{
    line-height:20px;
    padding-top:10px;
}
.saveBtn{
    width:1000px;
    text-align: center;
    padding-top: 100px;
    margin:0 auto;
}
.checkelement{
    width:100%;
    height:450px;
    overflow:auto;
}
.checkelement li{
    border:1px dashed #ccc;
    border-radius:5px;
    margin-bottom:20px;
    padding:20px 40px;
}
.checkelelist{
    display:inline-block;
}
.checkelelist div{
    margin:0 20px;
    width:175px;
    float:left;
}
.checkelelist div p{
    line-height:30px;
}
.checkelelist img{
    width:188px;
    height:100px;
    display:inline-block;
}
.checkelement >>> .el-radio__input{
    display:block;
    float:left;
    line-height: 88px;
}
</style>