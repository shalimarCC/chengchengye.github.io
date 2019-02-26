<template>
    <div>
      <el-form ref="form" label-width="150px" style="padding:20px 200px;min-width:400px;">

            <el-form-item label="列表页图片" style="text-align:left;">
                <el-upload
                    class="avatar-uploader"
                    :action="baseImgPath"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess1"
                    :before-upload="beforeAvatarUpload"
                    :on-error="handleError"
                    :data="imgForm">
                    <img v-if="picture" :src="picture" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div style="padding: 3px;position:absolute;top:0;left:10px;">
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="delImgList1" style="padding:7px;"></el-button>
                </div>
            </el-form-item>

            <el-form-item label="详情页轮播图" style="text-align:left;">
                <template>
                    <div class="color-list">
                        <div class="color-item" v-for="(info,key) in pictureList" v-dragging="{ item: info, list: pictureList, group: 'info' }" :key="info">
                            <el-card style="width:140px;float:left;margin:8px;position:relative;" :body-style="{ padding: '0px' }">
                                <img :src="info" class="image" style="width:140px;height:140px;">
                                <div style="padding: 3px;position:absolute;top:0;right:5px;">
                                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="delImgList(key)" style="padding:7px;"></el-button>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </template>
                <el-upload
                :show-file-list="false"
                :action="baseImgPath"
                list-type="picture-card"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload"
                :on-error="handleError"
                :data="imgForm"
                >
                        <i class="el-icon-plus"></i>

                </el-upload>
            </el-form-item>
            <p style="font-size:12px;line-height:30px;color:#999;text-align:left;">Tips : 可拖拽排序。</p>
        </el-form>
        <div style="text-align:center;">
            <el-button style="margin-top: 12px;" size="medium" @click='updateMerchantProductPictureByIdWithTx'>保存</el-button>
            <el-button size="medium" style="margin-top: 12px;" @click='updateRefGoods'>保存并提交</el-button>
        </div>
    </div>
</template>
<script>
var moment = require('moment');
moment().format();
import { baseImgPath,baseImgUrl } from '../../../../config/env';
import {getQiNiuToken,updateMerchantProductPictureByIdWithTx} from '../../../../api/getData';
export default {
    props: {
        imgGoodsData: {
            type: Object,
            default: function () {
                return {}
            }
        },


    },

    data () {
        return {
            imgForm:{
                key:'',
                token:'',
            },
            baseImgPath:'',
            baseImgUrl:'',
            pictureList:[],
            picture:'',
            status:''
        }
    },
    created () {
        this.baseImgPath = baseImgPath;
        this.baseImgUrl = baseImgUrl;
        this.pictureList = this.imgGoodsData.pictureList;
        this.picture = this.imgGoodsData.picture;
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
    methods:{
        async updateMerchantProductPictureByIdWithTx (){
            try {
                let obj  = new Object();
                obj.status = this.status;
                obj.picture = this.picture;
                obj.pictureList = JSON.stringify(this.pictureList);
                obj.merchantProductId = this.imgGoodsData.merchantProductId;
                const res = await updateMerchantProductPictureByIdWithTx(obj);

                if (res.data.code == 0) {
                     this.$notify({
                        title: '修改',
                        message: '修改成功',
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
        //保存并提交
        updateRefGoods(){
            this.status = 2;
            this.updateMerchantProductPictureByIdWithTx();
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
        handleAvatarSuccess2(response,file){
            this.pictureList.push(this.baseImgUrl + response.key);
        },


        delImgList (key) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.pictureList.splice(key,1);
                this.$notify({
                    title: '删除',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },


        handleAvatarSuccess1 (response) {
            this.picture = this.baseImgUrl + response.key;
        },


        delImgList1 () {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.picture = null;
                this.$notify({
                    title: '删除',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    }
}

</script>


<style scoped>
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