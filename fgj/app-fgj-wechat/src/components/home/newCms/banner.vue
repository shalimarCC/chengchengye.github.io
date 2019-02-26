<template>
    <div class="banner" :style="bannerStyle">
      <ul>
        <li v-for="info in item.banner" @click="linkSkip(info.link)">
          <span style="display: block">
            <img :src="info.imgUrl" :style="info.imgStyle">
          </span>

        </li>
      </ul>
    </div>
</template>

<script>
    import {countFit} from '@/until'
    export default {
        props: {
          elementObj: {
            type: Object,
            default: function () {
              return {}
            }
          },
        },
        data(){
          return{
            item:{
            },
            bannerStyle:{
              marginTop:10,
              height:0,
              paddingLeft:10,
              paddingRight:10,
              overflowX:'hidden',
              background:'',
              backgroundSize:'',
              backgroundRepeat:''
            },
            imgStyle:{
              marginRight:0,
              height:100,
              width: 100,  //三图238
              borderRadius:0
            },
            liStyle:{
              marginLeft:0
            }
          }
        },
        mounted(){
          this.item = this.elementObj.config7;
          //组件配置
          this.bannerStyle.height = countFit(this.item.totalHight); //组件高度
          this.bannerStyle.marginTop = countFit(this.item.marginTop);   //向上间距
          // this.bannerStyle.paddingLeft = countFit(this.item.paddingSide);   //左侧间距
          // if(this.item.banner.length>1){
          //   this.bannerStyle.paddingLeft = countFit(this.item.paddingSide);   //两侧边距
          //   this.bannerStyle.paddingRight = countFit(this.item.paddingSide);   //两侧边距
          // }else{
          //   this.liStyle.marginLeft = countFit(this.item.margin)
          // }
          if(this.item.backgroundType==1){ //颜色
            this.bannerStyle.background = this.item.backgroundRGB;
          }else if(this.item.backgroundType==2){ //透明
            this.bannerStyle.background ='rgba(0,0,0,0)'
          }else if(this.item.backgroundType==3){ //图片
            this.bannerStyle.background = 'url('+this.item.backgroundImgUrl+')';
            this.bannerStyle.backgroundSize='100% 100%';
            this.bannerStyle.backgroundRepeat='no-repeat';
          }
          if(this.item.leftToRight==0){
            this.bannerStyle.overflowX ='hidden';
            if(this.item.banner.length==1){
              this.bannerStyle.overflowX ='hidden';
              this.bannerStyle.overflowY ='hidden';
            }
          }else if(this.item.leftToRight==1){
            this.bannerStyle.overflowX ='scroll';
            // this.bannerStyle.marginRight = countFit(this.item.paddingSide);   //左侧间距
          }else{
            if(this.item.banner.length==1){
              this.bannerStyle.overflowX ='hidden';
              this.bannerStyle.overflowY ='hidden';
            }
          }
          //banner配置
          // this.imgStyle.marginRight = countFit(this.item.margin);
          // this.imgStyle.height = countFit(this.item.bannerHeight);
          //对每个banner单独配置
          var _this = this;
          var allWidth= 0;
          var aspect = 0; //计算缩放比
          $.each(this.item.banner,function (key,info) {
            allWidth += parseInt(info.width);
          });
          //计算总宽
          allWidth = allWidth + (this.item.banner.length-1)*this.item.margin + this.item.paddingSide*2;
          aspect = allWidth/750;
          $.each(this.item.banner,function (key,info) {
            let imgObj =new Object();
            if(info.borderRadiusCheckBox==1){
              imgObj.borderRadius = countFit(info.borderRadius);
            }
            //计算缩放比后的宽高
            if((allWidth>750)&&(!_this.item.leftToRight||_this.item.leftToRight==0)){
              // imgObj.width = (750-_this.item.paddingSide*2-_this.item.margin*(_this.item.banner.length-1))/(_this.item.banner.length);
              // imgObj.width = countFit(imgObj.width);
              imgObj.width = countFit(parseInt(info.width)/aspect);
              imgObj.height = countFit(_this.item.bannerHeight/aspect);
              imgObj.marginRight = countFit(parseInt(_this.item.margin)/aspect);
              _this.bannerStyle.paddingLeft = countFit(_this.item.paddingSide/aspect);   //左侧间距
              if(_this.item.banner.length>1){
                _this.bannerStyle.paddingLeft = countFit(_this.item.paddingSide/aspect);   //两侧边距
                _this.bannerStyle.paddingRight = countFit(_this.item.paddingSide/aspect);   //两侧边距
              }
            }else{
              imgObj.width = countFit(info.width);
              imgObj.height = countFit(_this.item.bannerHeight);
              imgObj.marginRight = countFit(_this.item.margin);
              _this.bannerStyle.paddingLeft = countFit(_this.item.paddingSide);   //左侧间距
              if(_this.item.banner.length>1){
                _this.bannerStyle.paddingLeft = countFit(_this.item.paddingSide);   //两侧边距
                _this.bannerStyle.paddingRight = countFit(_this.item.paddingSide);   //两侧边距
              }
            }
            if(allWidth<750){
              _this.bannerStyle.justifyContent = 'center';
            }
            if(key == (_this.item.banner.length-1)){
              imgObj.marginRight =0;
            }
            info.imgStyle = imgObj;
            // console.log(info.imgStyle)
          })
        },
        methods:{
          linkSkip(obj){
            this.$emit('linkSkip',[obj]);
          },
        }
    }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  .banner{
    width: 100%;
    overflow-x: scroll;
    display: flex;
    align-items: center;
    ul{
      display: flex;
      justify-content: flex-start;
      li{
       /*flex: 1;*/
       img{
         display: block;
         vertical-align: top;
       }
      }
    }
  }
  .banner::-webkit-scrollbar{
    display: none;
  }

</style>
