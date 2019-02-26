<template>
  <div class="rateFeedback">
    <div>
      <div class="hint">
        <span><img src="../../../../static/assets/img/alert@2x.png">请先阅读页面底部的比价说明</span>
      </div>
      <div class="cell" @click="chooseSpecification">
        <span v-if="!$store.state.skuId">请选择商品规格</span>
        <span v-else>{{name}}-{{findName($store.state.skuId)}}</span>
        <i class="iconfont icon-more"></i>
      </div>
      <div class="cell" @click = "chooseForm">
        <!--<span>请选择比价平台</span>-->
        <span>{{platformName}}</span>
        <i class="iconfont icon-more"></i>
      </div>
      <div class="feedbackContent">
        <textarea placeholder="写几句吧，帮助我们了解更多您的需求" v-model="content"></textarea>
        <div class="upLoad">
          <input type="file" accept="image/*" multiple="camera,multiple" id="imgPhotos" name="imgPhotos" style="display:none;" @change="selectPhotos($event)">
          <div class="photo defaultPhoto" @click="photoImg" v-if="imgList.length!=3">
            <img src="../../../../static/assets/img/photo.png">
            <p>上传凭证</p>
            <p>(限三张)</p>
          </div>
          <ul class="uploadImg">
            <li class="imgList" v-if="businessLicenceUrl" v-for="(item,key) in imgList">
              <img :src="item">
              <span class="delete" @click="deleteImg(key)"><img src="../../../../static/assets/img/delPhoto.png"></span>
            </li>
          </ul>
        </div>
        <p>(所选平台上该商品详情页图片)</p>
      </div>
      <div class="cell">
        <span>联系方式：<input placeholder="请输入联系方式" v-model="phone" type="number" maxlength="11"></span>
      </div>
      <div class="rateInstruction">
        <p class="rate">比价说明：</p>
        <p>
          福管加承诺平台商品价格均低于天猫/京东上的同类商品(仅限天猫官方旗舰店、京东自营、京东官方旗舰店中的商品)；
        </p>
        <p>
          若用户在使用中对比发现福管加商城中商品价格较高，请及时将信息反馈给我们，福管加欢迎广大用户们的监督。
        </p>
      </div>
      <div :class="[(phone==''||$store.state.skuId==''||platformName=='请选择比价平台'||imgList.length==0||content=='')?'btn disabled':'btn']" @click="insertComparePriceInfo">提交</div>
    </div>
    <mt-popup
      v-model="popupVisibleSpecification"
      position="bottom" class="mint-popup-4">
      <specification v-on:setSkuID="setSkuID" :goods-status="goodsData.status" :buyType="parseInt(buyType)" :picridiolist="picRidioList" v-if="goodsPopup" :paynum="payNum" v-on:closeGoodsProperty="closeGoodsProperty" :goods-standard-list="goodsStandardList" :goods-type="goodsType" :radio="goodsData.radio*1" :goods-sku-list="goodsSkuList" :goods-volume="goodsData.salesVolume*1" :goods-price="goodsData.salePrice" :goods-name="goodsData.standardUnitName" :goods-img-src="goodsData.picture"></specification>
    </mt-popup>
    <mt-popup
      v-model= "popupPlatform"
      position="bottom" class="mint-popup-4">
      <ul class="platform">
        <li>请选择比价平台</li>
        <li v-for="(item,key) in platform" @click="choosePlatform(key,item.id,item.platformName)" :class="[keyvalue==key?'active':'']">{{item.platformName}}</li>
      </ul>
      <div class="btn1" @click="submit">确定</div>
    </mt-popup>

  </div>
</template>
<script>
  var moment = require('moment');
  moment().format();
  import { baseImgPath,baseImgUrl } from '../../../config/env';
  import specification1 from './specification1';
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import {
    findComparePrice,
    insertComparePriceInfo,
    findMerchantProdetails,
    skuByMerchantProductId,
    getQiNiuToken
  } from '../../../api/getData';
  export default {
    data(){
      return{
        popupVisibleSpecification:false,
        goodsData:'',
        commodityTemplateId:'',
        goodType:false,
        goodsPopup:false,
        goodsSkuList:'',
        goodsStandardList:'',
        buyType:0,
        picRidioList:[],
        goodsType:2,
        phone:'',
        payNum:1,
        name:'',
        platform:'',
        platformId:'',
        content:'',
        platformName:'请选择比价平台',
        popupPlatform:false,
        keyvalue:-1,
        imgForm:{
          key:'',
          token:'',
        },
        baseImgPath:'',
        baseImgUrl:'',
        businessLicenceUrl:'',
        imgList:[],
        isDisabled:false,
      }
    },
    components: {
      'specification': specification1
    },
    created(){
      this.$store.dispatch("setSkuId",'');
      this.findMerchantProdetails();
      this.skuByMerchantProductId();
      this.findComparePrice()
      this.baseImgPath = baseImgPath;
      this.baseImgUrl = baseImgUrl;
    },
    mounted(){
      // if(this.$store.state.skuId&&this.platformId&&this.content&&this.phone&&this.imgList){
      //   this.isDisabled = true;
      // }
    },
    watch:{
      popupVisibleSpecification:{
        handler(curVal,oldVal){
          if(curVal){
            $(".page-loadmore-wrapper").css("overflow","hidden");
          }else{
            $(".page-loadmore-wrapper").css("overflow","auto");
          }
        }
      },
      'skuId':{
        handler(curVal,oldVal){
          if(curVal == ""){
            this.isDisabled = true;
          }else{
            this.isDisabled = false;
          }
        }
      },
    },
    methods:{
      //获取商品信息
      async findMerchantProdetails() {
        try {
          const res = await findMerchantProdetails({standardUnitId:this.$route.params.goodsId});
          if (res.data.code == 0){
            this.goodsData = res.data.data;
            this.commodityTemplateId = res.data.data.commodityTemplateId;
            this.$store.state.Cookie.mutations.save(this.commodityTemplateId,'commodityTemplateId');
            this.name = res.data.data.standardUnitName;
            Indicator.close();
            this.goodType=true;
          } else {
            Indicator.close();
            Toast(res.data.data);
          }
        } catch (err) {
          Indicator.close();
          Toast('网络错误');

        }
      },
      //获取商品SKU
      async skuByMerchantProductId() {
        try {
          const res = await skuByMerchantProductId({standardUnitId:this.$route.params.goodsId});

          if (res.data.code == 0) {
            this.goodsSkuList = res.data.data.pu;
            this.goodsStandardList = res.data.data.puAttNames;
            this.goodsPopup = true;
          } else {
            Toast(res.data.data);
          }

        } catch (err) {
          Toast('网络错误');

        }
      },
      //获取比价平台类型列表
      async findComparePrice(){
        try{
          const res = await findComparePrice({standardUnitId:this.$route.params.goodsId});

          if (res.data.code == 0) {
            this.platform = res.data.data.comparePlatform;
          } else {
            Toast(res.data.data);
          }

        }catch(err){
          Toast('网络错误');
        }
      },
      //反馈内容
      async insertComparePriceInfo(){
        try{
          if(this.$store.state.skuId==''||this.platformId==''||this.content==''||this.phone==''||this.imgList.length==0){
            return
          }
          const res = await insertComparePriceInfo({puId:this.$store.state.skuId,id: this.platformId,content:this.content,phone:this.phone,picUrl:this.imgList.toString()});
          if(res.data.code == 0){
            this.$router.go(-1);
          }else{
            Toast(res.data.error)
          }
        }catch (err) {
          Toast('网络错误');
        }
      },
      //选择规格
      chooseSpecification(){
        this.popupVisibleSpecification = true;
      },
      //关闭选择规格窗口
      closeGoodsProperty(){
        this.popupVisibleSpecification = false;
      },
      //彈出选择平台
      chooseForm(){
        this.popupPlatform = true;
      },
      //选择平台
      choosePlatform(key,id,name){
        // if(this.keyvalue!=key){
          this.keyvalue = key;
        // }else{
        //   this.keyvalue = -1;
        // }
        this.platformId = id;
        this.platformName = name;
        this.popupPlatform = false;
      },
      setSkuID(sku){
        this.payNum = sku[1];
      },
      //將skuId转化為name的方法
      findName(id){
        for(var key in this.goodsSkuList){
          if(this.goodsSkuList[key].productUnitId==id){
            return this.goodsSkuList[key].keyName;
          }
        }
      },
      deleteImg(key){
        this.imgList.splice(key,1);
      },
      photoImg(){
        document.getElementById("imgPhotos").value = ""; //上传文件时先把file类型input清空下
        $("input[id='imgPhotos']").click();
      },
      selectPhotos(photoData){
        var _this = $(photoData.target)[0],
          _file = _this.files[0],
          fileType = _file.type;
        var thtf=this;

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
              if (this.width > 110 || this.height > 110) {  //110只是示例，可以根据具体的要求去设定缩放图片大小
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
                thtf.businessLicenceUrl = thtf.baseImgUrl + data.key;
                thtf.imgList.push(thtf.businessLicenceUrl);
                console.log(thtf.imgList)
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
      },
      submit(){
        this.popupPlatform = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../style/component/goods/ratefeedback.scss";
</style>
