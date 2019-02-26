<template>
    <div id="invoice">
        <div class="invoice_3 tpid">
            <span class="cell_title">*名称</span>
            <input type="text" class="cell_input name" v-model="invoiceForm.titleContent" placeholder="请输入单位名称">
        </div>
        <div class="invoice_3 tpid">
            <span class="cell_title">*税号</span>
            <input type="text" class="cell_input name" v-model="invoiceForm.taxpayerIdentificationCode" placeholder="请输入纳税人识别号">
        </div>

        <div class="invoice_3 tpid alert" style="margin-top:10px;background:#fdeed4;font-size:px(28px);height:35px;">
            <i></i>
            <span class="cell_title" style="color:#ff8546;margin-left:11px;">以下信息用于增值税专用发票</span>
            <span class="cell_input addition"></span>
        </div>
        <div class="invoice_3 tpid">
            <span class="cell_title">注册地址</span>
            <input type="text" class="cell_input addition" v-model="invoiceForm.registerAddr" placeholder="选填">
        </div>
        <div class="invoice_3 tpid">
            <span class="cell_title">注册电话</span>
            <input type="text" class="cell_input addition" v-model="invoiceForm.registerTel" placeholder="选填" maxlength="15">
        </div>
        <div class="invoice_3 tpid">
            <span class="cell_title">开户银行</span>
            <input type="text" class="cell_input addition" v-model="invoiceForm.depositBank" placeholder="选填">
        </div>
        <div class="invoice_3 tpid">
            <span class="cell_title">银行账号</span>
            <input type="text" class="cell_input addition" v-model="invoiceForm.bankAccount" placeholder="选填" maxlength="23">
        </div>
        <div class="invoice_3 tpid">
            <span class="cell_title">上传营业执照</span>
            <span class="cell_input addition"></span>
        </div>
        <div class="invoice_3 tpid blank">
            <div style="width:80px;height:80px;background:#f4f4f4;border-radius:6px;" v-show="!invoiceForm.businessLicenceUrl">

                <!-- // 
                @click="document.getElementById('selectPhoto').click()" -->
                <!-- <el-upload
                    id="selectPhoto"
                    class="avatar-uploader photo"
                    :action="baseImgPath"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"//
                    :before-upload="beforeAvatarUpload"//
                    :on-error="handleError"//
                    :data="imgForm"
                    style="color:#fff;font-size:16px;visibility:hidden;">
                </el-upload> 
                //-->
              <input type="file" accept="image/*" id="imgcamera" multiple="camera,multiple" name="imgcamera" style="display:none;" @change="ImgChange($event)">
                <!-- <input type="file" accept="image/*" id="imgPhotos" name="imgPhotos" style="display:none;" @change="selectPhotos($event)"> -->
            </div>
            <img v-show="invoiceForm.businessLicenceUrl" :src="invoiceForm.businessLicenceUrl" class="avatar" style="position:relative;height:110px;margin-right:170px;" @click="cameraImg()">
            <div v-show="!invoiceForm.businessLicenceUrl" class="defaultPhoto" @click="cameraImg()">
                <i></i>
                <span>添加照片</span>
            </div>
            <!-- <div v-show="!invoiceForm.businessLicenceUrl" class="defaultPhoto" @click="photoImg()">
                <i></i>
                <span>从相册中选择</span>
            </div> -->
        </div>


        <div class="invoice_3 tpid default" style="margin-top:10px;margin-bottom:10px;">
            <span class="cell_title">设为默认</span>
            <span class="cell_input addition"></span>
            <i class="notChosen" v-if="invoiceForm.isDefault==0" @click="invoiceForm.isDefault=1"></i>
            <i class="chosen" v-if="invoiceForm.isDefault==1" @click="invoiceForm.isDefault=0"></i>
        </div>

        <div class="btn" @click="updateInvoice();">保存并使用抬头</div>
        
        <!-- <mt-actionsheet
            :actions="actions"
            v-model="sheetVisible">
        </mt-actionsheet> -->
    </div>
</template>

<!--<script src="static/js/cvi_busy_lib.js"></script>-->
<script>
    var moment = require('moment');
    moment().format();
    import { invoiceHint,saveInvoice,invoiceById,findInvoiceOfPage,insertOrUpdateInvoice,findInvoiceById,getQiNiuToken,deleteInvoiceWithTx } from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { baseImgPath,baseImgUrl } from '../../../config/env';
    // import { Actionsheet } from 'mint-ui';
    export default{

        data(){
            return {
                invoiceForm:{
                    id:'',
                    titleContent:'',
                    taxpayerIdentificationCode:'',
                    registerAddr:'',
                    registerTel:'',
                    bankAccount:'',
                    depositBank:'',
                    businessLicenceUrl:'',
                    isDefault:1,
                },
                popupVisible:false,
                invoiceList:[],
                invoiceCheck:{
                    title:'',
                    tpid:''
                },
                isDetailStore:0,
                invoiceInfos:'',
                invoiceInfoId:'',
                imgForm:{
                    key:'',
                    token:'',
                },
                sheetVisible:false,
                loading:false,
                invoiceLength:0,
                baseImgPath:'',
                baseImgUrl:'',
                imgInfo:''
            }
        },
		    components: {

        },
        watch:{

        },
        mounted() {
            // this.getQiNiuToken();
        },
        created(){
            this.invoiceHint();
            this.findInvoiceOfPage();
            this.isDetailStore = this.$store.state.invoiceDetail ? this.$store.state.invoiceDetail : 0;
            this.invoiceForm.id = this.$route.params.id;
            if(this.invoiceForm.id!=0){
                this.findInvoiceById(this.invoiceForm.id);
            }
            
            this.baseImgPath = baseImgPath;
            this.baseImgUrl = baseImgUrl;
        },
        methods:{
            //获取发票抬头详情
            async findInvoiceById(id) {
                try {
                    const res = await findInvoiceById({id:id});
                    if (res.data.code == 0) {
                        // this.invoiceForm = res.data.data;
                        this.invoiceForm.id = res.data.data.id;
                        this.invoiceForm.titleContent = res.data.data.titleContent;
                        this.invoiceForm.taxpayerIdentificationCode = res.data.data.taxpayerIdentificationCode;
                        this.invoiceForm.registerAddr = res.data.data.registerAddr;
                        this.invoiceForm.registerTel = res.data.data.registerTel;
                        this.invoiceForm.bankAccount = res.data.data.bankAccount;
                        this.invoiceForm.depositBank = res.data.data.depositBank;
                        this.invoiceForm.businessLicenceUrl = res.data.data.businessLicenceUrl;
                        this.invoiceForm.isDefault = res.data.data.isDefault;
                        console.log(this.invoiceForm.isDefault)

                    } else {


                    }
                } catch (err) {
                     Toast('获取发票抬头详情失败');
                }
            },
            //获取发票提示
            async invoiceHint() {
                try {
                    const res = await invoiceHint();
                    if (res.data.code == 0) {
                        this.invoiceList = res.data.data.hints;

                    } else {


                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //获取已有发票信息
            async findInvoiceOfPage() {
                try {
                    const res = await findInvoiceOfPage();
                    if (res.data.code == 0) {
                        this.invoiceInfos = res.data.data.list;
                        this.invoiceLength = res.data.data.totalSize;

                        if( this.invoiceForm.isDefault==0&&this.invoiceLength>0){
                            this.invoiceForm.isDefault=0;
                        }
                        //已有发票设为默认，新增发票默认不勾选
                        if(this.invoiceForm.id==0&&this.invoiceForm.isDefault==1){
                          this.invoiceForm.isDefault=0;
                        }
                        //新增发票，设为默认
                        if(this.invoiceForm.id==0&&this.invoiceForm.isDefault==0&&this.invoiceLength==0){
                          this.invoiceForm.isDefault=1;
                        }
                        
                    } else {
                        console.log("暂无发票信息");
                    }
                } catch (err) {
                     Toast(err);
                }
            },
            //新增或编辑发票页面
            editInvoice(id){
                this.$router.push({path: '/shop/editInvoice/'+id});
            },

            updateInvoice(){
                if(this.loading==false) {
                    this.loading=true;
                    this.insertOrUpdateInvoice();
                    window.setTimeout(function(){
                        this.loading = false;
                    },3000);
                }
            },
            async insertOrUpdateInvoice() {
                try {
                    if(!this.invoiceForm.isDefault){
                        this.invoiceForm.isDefault=0;
                    }
                    const res = await insertOrUpdateInvoice(this.invoiceForm);
                    if (res.data.code == 0) {
                        // this.$store.dispatch("setInvoiceForm",this.invoiceForm.invoiceForm);
                        // this.$store.dispatch("setInvoiceId",res.data.data.invoiceId);
                        // this.$store.dispatch("setInvoiceType",this.invoiceForm.invoiceTitleType);//缓存发票信息
                        this.$store.dispatch("setCommonInvoiceId",res.data.data.id);
                        const invoiceList = findInvoiceOfPage();
                        if(invoiceList&&invoiceList.length>1){
                            this.$router.push({path: '/shop/invocieList'});
                        }else{
                            this.$store.dispatch("setTitleContent",this.invoiceForm.titleContent);
                            this.$store.dispatch("setTaxpayerIdentificationCode",this.invoiceForm.taxpayerIdentificationCode);
                            this.$router.push({path: '/shop/orderInvoice'});
                        }
                    } else {
                        Toast({
                            message: res.data.error,
                            position: 'middle',
                            duration: 3000
                        });
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },

            //打开发票提示
            popupOpen(){
                this.popupVisible = true;
                this.invoiceCheck = {
                    title:'',
                    tpid:''
                }
            },

            closePopupVisible(){
                if(this.invoiceCheck.tpid==''){
                    return;
                }else{
                    this.invoiceForm.title = this.invoiceCheck.title;
                    this.invoiceForm.tpid = this.invoiceCheck.tpid;
                    this.popupVisible = false;
                }

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
                        // this.$message({
                        //     type:"error",
                        //     message:_data.data.error
                        // })
                        Toast({
                            message: _data.data.error,
                            position: 'middle',
                            duration: 3000
                        });
                    }
                })
                if (!isJPG&&!isPNG) {
                    // this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
                    Toast('上传头像图片只能是 JPG/PNG 格式!');

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
                this.invoiceForm.businessLicenceUrl = this.baseImgUrl + response.key;
                // this.invoiceForm.businessLicenceUrl = this.baseImgUrl + this.imgForm.key;
            },

            async getQiNiuToken(){
                try {
                    const res = await getQiNiuToken();
                    if (res.data.code == 0) {
                        this.imgForm.token = res.data.data;
                    } else {
                        // this.$message({
                        //     type: 'error',
                        //     message: res.data.error
                        // });
                        Toast({
                            message: res.data.error,
                            position: 'middle',
                            duration: 3000
                        });
                    }
                } catch (err) {
                    // this.$message({
                    //     type: 'error',
                    //     message: err
                    // });
                    Toast({
                        message: err,
                        position: 'middle',
                        duration: 3000
                    });
                }
            },


            //拍照
            cameraImg() {
                document.getElementById("imgcamera").value = ""; //上传文件时先把file类型input清空下
                $("input[id='imgcamera']").click();
            },
            photoImg(){
                document.getElementById("imgPhotos").value = ""; //上传文件时先把file类型input清空下
                $("input[id='imgPhotos']").click();
            },

            selectPhotos(photoData){
                var _this = $(photoData.target)[0],
                    _file = _this.files[0],
                    fileType = _file.type;
                console.log(photoData);
                console.log(_this);
                console.log(_file);
            },

            ImgChange(imgdata) {
                // var _this = imgdata,
                //     _file = _this.files[0],
                //     fileType = _file.type;
                var _this = $(imgdata.target)[0],
                    _file = _this.files[0],
                    fileType = _file.type;
                var thtf=this;
                
                // console.log(_file.size);

                //图片方向角 added by lzk
                var Orientation = "";
                if (/image\/\w+/.test(fileType)) {
                    EXIF.getData(_file, function () {
                        EXIF.getAllTags(this);
                        Orientation = EXIF.getTag(this, 'Orientation');
                    });
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(_file);
                    fileReader.onload = function (event) {
                        var result = event.target.result;   //返回的dataURL
                        var image = new Image();
                        image.src = result;
                        image.onload = function () {  //创建一个image对象，给canvas绘制使用
                            var cvs = document.createElement('canvas');
                            var scale = 1;
                            // if (this.width > 1080 || this.height > 1080) {  //1080只是示例，可以根据具体的要求去设定缩放图片大小
                            //     if (this.width > this.height) {
                            //         scale = 1080 / this.width;
                            //     } else {
                            //         scale = 1080 / this.height;
                            //     }
                            // }
                            if (this.width > 110 || this.height > 110) {  //1080只是示例，可以根据具体的要求去设定缩放图片大小
                                if (this.width > this.height) {
                                    scale = 110 / this.width;
                                } else {
                                    scale = 110 / this.height;
                                }
                            }
                            cvs.width = this.width * scale;
                            cvs.height = this.height * scale;     //计算等比缩小后图片宽高
                            var ctx = cvs.getContext('2d');
                            ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
                            var imgtmp = new Image();
                            imgtmp.src = cvs.toDataURL(fileType, 0.8);
                            imgtmp.onload = function () {
                                var cvstmp = document.createElement('canvas');
                                var isori = false;
                                if (Orientation != "" && Orientation != 1) {
                                    //alert('旋转处理' + Orientation);
                                    switch (Orientation) {
                                        case 6://需要顺时针（向左）90度旋转
                                            //alert('需要顺时针（向左）90度旋转');
                                            isori = true;
                                            thtf.rotateImg(this, 'left', cvstmp);
                                            break;
                                        case 8://需要逆时针（向右）90度旋转
                                            //alert('需要顺时针（向右）90度旋转');
                                            thtf.rotateImg(this, 'right', cvstmp);
                                            isori = true;
                                            break;
                                        case 3://需要180度旋转
                                            //alert('需要180度旋转');
                                            thtf.rotateImg(this, 'right', cvstmp);//转两次
                                            thtf.rotateImg(this, 'right', cvstmp);
                                            isori = true;
                                            break;
                                    }
                                }
                                var newImageData;
                                if (isori)
                                    newImageData = cvstmp.toDataURL(fileType, 0.8);   //重新生成图片，fileType为用户选择的图片类型
                                else
                                    newImageData = imgtmp.src;
                                var sendData = newImageData.replace("data:" + fileType + ";base64,", '');
                                // $("#img" + imageType1).attr("src", newImageData); //显示图片
                                // var md5str = hex_md5(sendData); //MD5校验
                                // uploadImages(sendData, md5str);
                                thtf.uploadImages(sendData,_file);
                            }
                        }
                    }
                } else {
                    alert("图片类型不正确");
                }
            },

            rotateImg(img, direction, canvas) {
                //alert(img);
                //最小与最大旋转方向，图片旋转4次后回到原方向
                var min_step = 0;
                var max_step = 3;
                //var img = document.getElementById(pid);
                if (img == undefined) return;
                //img的高度和宽度不能在img元素隐藏后获取，否则会出错
                var height = img.height;
                var width = img.width;
                var step = 2;
    
                if (direction == 'right') {
                    step++;
                    //旋转到原位置，即超过最大值
                    step > max_step && (step = min_step);
                } else {
                    step--;
                    step < min_step && (step = max_step);
                }
                var ctx = canvas.getContext('2d');
                //旋转角度以弧度值为参数
                var degree = step * 90 * Math.PI / 180;
                switch (step) {
                    case 0:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0);
                        break;
                    case 1:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, 0, -height);
                        break;
                    case 2:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, -height);
                        break;
                    case 3:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, 0);
                        break;
                }
                return ctx;
            },

            //将图片上传的服务器本地
            // uploadImages(localData, md5str) {
            uploadImages(localData,file) {
                var thtf=this;
                var xval = getBusyOverlay('viewport', {
                    color: 'white',
                    opacity: 0.75,
                    text: 'viewport: loading...',
                    style: 'text-shadow: 0 0 3px black;font-weight:bold;font-size:16px;color:white'
                }, {color: '#ff0', size: 100, type: 'o'});


                var curr = moment().format('YYYYMMDDHHmmss').toString();
                var prefix = moment(file.lastModified).format('HHmmss').toString();
                var key = curr+"egeo"+prefix;

                this.imgForm.key = key;
                const isJPG = file.type === 'image/jpeg'
                const isPNG = file.type === 'image/png'

                const res = getQiNiuToken();
                res.then(_data => {
                    if(_data.data.code == 0){
                        thtf.imgForm.token = _data.data.data;
                        
                        if (!isJPG&&!isPNG) {
                            Toast('上传头像图片只能是 JPG/PNG 格式!');
                        }
                        const imgInfo = new FormData();
                        imgInfo.append("token", thtf.imgForm.token);
                        imgInfo.append("key", thtf.imgForm.key);
                        imgInfo.append("file", file);
                        $.ajax({
                            data: imgInfo,
                            type: "POST",
                            url: thtf.baseImgPath,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                xval.remove(); //此处是移除遮罩层
                                // if (data.result == 1) {
                                if (data.hash) {
                                    alert("上传成功！");
                                } else {
                                    alert("上传未成功！");
                                }
                                thtf.invoiceForm.businessLicenceUrl = thtf.baseImgUrl + data.key;
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                xval.remove(); //此处是移除遮罩层
                                thtf.$notify({
                                    title: '错误',
                                    message: "上传失败",
                                    type: 'error',
                                    duration: 2000
                                });
                            }
                        })

                    }else{
                        Toast({
                            message: _data.data.error,
                            position: 'middle',
                            duration: 3000
                        });
                    }
                })
                
        //         setTimeout(function(){  
        //             $.ajax({
        //                 type: "POST",
        //                 url: baseImgPath,
        //                 beforeSend: function () {
        //                     if (xval) {
        //                         xval.settext("正在上传图片，请稍后......");//此处可以修改默认文字，此处不写的话，就按照默认文字来。
        //                     }
        //                 },
        //                 data: {
        //                     key:thtf.imgForm.key,
        //                     token:thtf.imgForm.token
        //                 },
        //                 dataType: "json",
        //                 // contentType: 'multipart/form-data',
        //                 // boundary:"---------------------------7d4a6d158c9",
        //                 // boundary:Math.ceil(Math.random()*10),
                        
        //                 // contentType: false,
        //                 // processData: false,
        //                 timeout: 120000, //超时时间：120秒
        //                 success: function (data) {
        //                     xval.remove(); //此处是移除遮罩层
        //                     if (data.result == 1) {
        //                         alert("上传成功！");
        //                     } else {
        //                         alert("上传未成功！");
        //                     }
        //                     thtf.invoiceForm.businessLicenceUrl = thtf.baseImgUrl + data.key;
        //                 }, 
        //                 error: function (XMLHttpRequest, textStatus, errorThrown) {
        //                     xval.remove(); //此处是移除遮罩层
        //                     thtf.$notify({
        //                         title: '错误',
        //                         message: "上传失败",
        //                         type: 'error',
        //                         duration: 2000
        //                     });
        //                 }
        //             });
        //         },1500);  

            },

        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/orderpay/editInvoice.scss";
@function px($val) {
    @return $val/$baseWidth*10+rem;
}
.blank{
    input{
        padding-top:px(30px);
    }
    .el-upload__input{
        padding-top:px(30px);
    }
}
</style>
