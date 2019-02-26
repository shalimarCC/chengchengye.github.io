<template>
  <div class="news" :style="newsStyle">
    <div class="leftImg" :style="leftImgStyle" v-if="listData.showLeftBanner==1" @click="linkSkip(listData.banner.link)">
      <img :src="listData.banner.imgUrl" :style="leftImgStyle">
    </div>
    <div class="rightText" :style="textStyle">
      <!--<vueSeamless :data="listData" :class-option="classOption">-->
      <vueSeamless :data="listData.msgList" :class-option="classOption">
        <ul>
          <li v-for="item in listData.msgList">
            <!--显示标题-->
            <div class="newsMsg" :style="contentStyle" v-if="listData.showMsgType==1||listData.showMsgType==3">
              <span class="news_title"  v-text="item.title" :style="titleStyle"></span>
              <span class="date" :style="dateStyle" v-text="item.date" v-if="listData.showMsgDate!=1"></span>
            </div>
            <!--显示内容详情-->
            <div class="newsMsg" :style="contentStyle" v-if="listData.showMsgType==2||listData.showMsgType==3">
              <span class="news_content" v-text="item.content" :style="titleStyle"></span>
              <span class="date" :style="dateStyle" v-text="item.date" v-if="listData.showMsgDate!=1&&listData.showMsgType!=3"></span>
            </div>
          </li>
        </ul>
      </vueSeamless>
      <p class="noMsg" :style="nomsgStyle" v-if="listData.msgList.length==0">暂时没有新消息</p>
    </div>
  </div>

</template>

<script>
    import vueSeamless from 'vue-seamless-scroll';
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
        components:{
          vueSeamless
        },
        data(){
          return{
            listData: {},
            newsStyle:{
              height: 100,
              marginTop:10,
              background:'',
              backgroundSize:'',
              backgroundRepeat:''
            },
            leftImgStyle:{
              width: 80,
              height: 80,
              borderRadius:2
            },
            textStyle:{
              width: 626,
              height: 80,
              fontSize:24,
              marginLeft:20
            },
            titleStyle:{
              marginTop:0
            },
            nomsgStyle:{
              lineHeight:80
            },
            dateStyle:{

            },
            contentStyle:{},
            showImg: true,
          }
        },
        computed: {
          classOption: function () {
            return {
              step: 1,
              direction:1,
              waitTime:1000,
              switchDelay:0,
              singleHeight: 0,
              openWatch:true
            }
          }
        },
        created(){
          this.listData = this.elementObj.config13;
          this.classOption.waitTime =parseInt(this.listData.scrollInterval)*1000;
          // this.classOption.switchDelay =parseInt(this.listData.scrollInterval)*1000;
          this.classOption.singleHeight =(this.listData.totalHeight/2);
        },
        mounted(){
          this.listData = this.elementObj.config13;
          if(this.listData.showLeftBanner==0||!this.listData.showLeftBanner){
            this.textStyle.width =750-88;
          }else if(this.listData.showLeftBanner==1){
            this.textStyle.width =750-parseInt(this.listData.banner.width)-parseInt(this.listData.bannerPadding)-88;
            this.textStyle.marginTop= countFit(this.listData.totalHeight-this.listData.banner.height);
            this.textStyle.marginBottom= countFit(this.listData.totalHeight-this.listData.banner.height);
          }
          //组件配置
          this.newsStyle.height =countFit(this.listData.totalHeight);
          this.newsStyle.marginTop =countFit(this.listData.marginTop);
          if(this.listData.backgroundType==1){ //颜色
            this.newsStyle.background = this.listData.backgroundRGB;
          }else if(this.listData.backgroundType==2){ //透明
            this.newsStyle.background ='rgba(0,0,0,0)';
          }else if(this.listData.backgroundType==3){ //图片
            this.newsStyle.background = 'url('+this.listData.backgroundImgUrl+')';
            this.newsStyle.backgroundSize='100% 100%';
            this.newsStyle.backgroundRepeat='no-repeat';
          }

          //左侧banner
          this.leftImgStyle.width =countFit(this.listData.banner.width);
          this.leftImgStyle.height =countFit(this.listData.banner.height);
          if(this.listData.banner.borderRadiusCheckBox==1){
            this.leftImgStyle.borderRadius =countFit(this.listData.banner.borderRadius);
          }
          this.titleStyle.width =this.textStyle.width-140;
          this.textStyle.marginLeft =countFit(this.listData.bannerPadding);
          this.textStyle.width =countFit(this.textStyle.width);

          this.textStyle.height =countFit(this.listData.totalHeight);
          this.textStyle.fontSize =countFit(this.listData.fontSize);
          //内容配置
          this.contentStyle.lineHeight =(this.listData.totalHeight/4)+'px'; //消息上下间隔
          this.contentStyle.width =this.textStyle.width;
          this.nomsgStyle.lineHeight =countFit(this.listData.totalHeight);
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
  .news {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .leftImg{
      margin-right:px(20px);
      img{
        margin-left:px(24px);
        display: block;
        vertical-align: top;
      }
    }
    .rightText{
      background: #f4f4f4;
      border-radius: 5px;
      padding: px(0px) px(20px);
    }
    ul{
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      li{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .newsMsg{
          display: flex;
        }
        .news_title{
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #323232;
          font-weight: bold;
        }
        .news_content{
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #323232;
        }
        .title{
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #323232;
          font-weight: bold;
        }
        .date{
          width: px(150px);
          color: #969696;
          margin-left: px(14px);
          white-space: nowrap;
        }
      }

    }
    .noMsg{
      text-align: center;
      color: #323232
    }
  }

</style>
