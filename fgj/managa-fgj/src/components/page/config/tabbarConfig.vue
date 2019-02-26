<template>
    <div id="example">
        <div>
            <div style="margin-bottom:20px;width:100%;height:100%;">
                <h3 style="line-height:80px;">移动端分页配置:</h3>
                <ul>
                    <li style="border-top:1px dashed #ccc;border-bottom:1px dashed #ccc;padding:40px 30px;cursor:move" class="clear" v-for="(info,index) in tabForm" :key="index">
                        <div style="float:left;">
                            <p style="margin: 10px;">
                                <p v-if="info.type==1">"首页"名称:</p>
                                <p v-if="info.type==2">"商城"名称:</p>
                                <p v-if="info.type==3">"应用"名称:</p>
                                <p v-if="info.type==4">"我的"名称:</p>
                                <el-input v-model="info.value" :placeholder="info.defaultValue" style="width: 200px;"></el-input>
                            </p>
                        </div>
                        <div style="float:left;width:150px;height:150px;margin-left:50px;">
                            <p>未选中:</p>
                            <el-upload
                                class="avatar-uploader"
                                :action="baseImgPath"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleError"
                                :data="imgForm">
                                <img v-if="info.iconUrl&&info.iconUrl!=''&&info.iconUrl!=null" :src="info.iconUrl" @click="uploadKeyIndex(index,1)">
                                <i v-else class="el-icon-plus avatar-uploader-icon" @click="uploadKeyIndex(index,1)"></i>
                            </el-upload>
                        </div>
                        <div style="float:left;width:150px;height:150px;margin-left:50px;">
                            <p>已选中:</p>
                            <el-upload
                                class="avatar-uploader"
                                :action="baseImgPath"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                :on-error="handleError"
                                :data="imgForm">
                                <img  v-if="info.iconOnclickUrl&&info.iconOnclickUrl!=''&&info.iconOnclickUrl!=null" :src="info.iconOnclickUrl" @click="uploadKeyIndex(index,2)">
                                <i v-else class="el-icon-plus avatar-uploader-icon" @click="uploadKeyIndex(index,2)"></i>
                            </el-upload>
                        </div>
                    </li>
                </ul>
            </div>

            <el-button size="medium" @click="updateCmsPageTabByIdWithTx('save')">保 存</el-button>
            <el-button size="medium" type="primary" @click="updateCmsPageTabByIdWithTx('reset')">恢复初始状态</el-button>

        </div>
    </div>

</template>



<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../config/env'
import seeGoods from '../goods/seeGoods.vue'
import {findCmsPageTabAll,updateCmsPageTabByIdWithTx,getQiNiuToken} from '../../../api/getData';
export default {
    data() {
        return {
            form:{
                name:'',
                remark:'',
                clientType:'',
                showFgj:1,
                elementList:'',
                cmsPagePcId:'',
                cmsPageMId:''
            },
            tabForm:{},
            baseImgPath:'',
            baseImgUrl:'',
            imgForm:{
                key:'',
                token:'',
            },
            index:'',
            iconType:'',
        }
    },
    created () {
        this.findCmsPageTabAll();
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
        seeGoods
    },
    watch : {
    },
    methods:{
        //查询分页tab列表接口
        async findCmsPageTabAll() {
            try {
                const res = await findCmsPageTabAll();

                if (res.data.code == 0) {
                    if(res.data.data&&res.data.data.length>0){
                        this.tabForm = res.data.data;
                        console.log(this.tabForm);
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
        updateCmsPageTabByIdWithTx(updateType){
            if(updateType=='save'){
                this.update(updateType);
            }else if(updateType=='reset'){
                this.$confirm('所有配置将恢复到默认配置,请确认?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $.each(this.tabForm,function(key,info){
                        info.value = info.defaultValue;
                        info.iconUrl = info.iconDefaultUrl;
                        info.iconOnclickUrl = info.iconOnclickDefaultUrl;
                    })
                    this.update(updateType);
                }).catch(() => {

                });
            }
        },
        async update(updateType) {
            try {
                const obj = new Object();
                obj.tabList = JSON.stringify(this.tabForm);
                const res = await updateCmsPageTabByIdWithTx({tabList:obj.tabList});

                if (res.data.code == 0) {
                    if(updateType=='save'){
                        this.$message({
	                        type: 'success',
	                        message: '保存成功'
                        });
                        this.findCmsPageTabAll();
                    }else if(updateType=='reset'){
                        this.$message({
	                        type: 'success',
	                        message: '恢复成功'
                        });
                        this.findCmsPageTabAll();
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
                    message: '操作失败,请联系管理员！404'
                });

            }
        },
        //上传之前获取key，index
        uploadKeyIndex(index,iconType) {
            this.index = index;
            this.iconType = iconType;
        },
        handleError(res) {   //显示错误
            this.$notify({
                title: '错误',
                message: res,
                type: 'error',
                duration: 2000
            });
        },
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
        handleAvatarSuccess(response){
            if(this.iconType==1){
                this.$set(this.tabForm[this.index],'iconUrl',this.baseImgUrl + response.key);
                console.log(this.tabForm);
            }else if(this.iconType==2){
                this.$set(this.tabForm[this.index],'iconOnclickUrl',this.baseImgUrl + response.key);
                console.log(this.tabForm);
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

    }
}
</script>

<style scoped>
#example{
    margin-left: 20px;
    margin-top: 10px;
    padding-left: 10px;
    padding-bottom: 10px;
    border: 1px solid #f4f4f4;
}
.clear .el-upload--text {
    background-color: #fff;
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    width:100%;
    width:100%;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow:initial;
}
.clear .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:100%;
    width:100%;
  }
 .clear .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
 .clear .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    /* line-height: 150px; */
    text-align: center;
  }
  .clear .avatar {
    width: 150px;
    height: 150px;
    display:inline-block;
  }

.clear .avatar-uploader{
    display:inline;
    width:150px;
    height:150px;
}
.clear .avatar-uploader img{
    width:100%;
    height:100%;

}
.clear .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width:100%;
    height:100%;
    /* line-height:150px; */
    text-align: center;
}
.clear .el-upload{
    width:100%;
    height:100%;
}
p{
    display: inline-block;
}
</style>


