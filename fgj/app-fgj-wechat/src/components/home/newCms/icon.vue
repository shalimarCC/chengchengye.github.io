<template>
    <div class="icon" :style="elementStyle">
        <ul>
            <li v-for="info in iconObj.iconList"  @click="linkSkip(info.link)" :style="iconStyle">
                <img :src="info.imgUrl" :style="iconImg"/>
                <p :style="iconText" v-if="iconObj.showIconText==1">{{info.text}}</p>
            </li>
            <li  @click="moreIcon" :style="iconStyle" v-if="showMore">
              <img :src="iconObj.lastIcon" :style="iconImg"/>
              <p :style="iconText" v-if="iconObj.showIconText==1">{{iconObj.lastText}}</p>
            </li>
        </ul>
    </div>

</template>

<script>
  import { Toast } from 'mint-ui';
  import {instContent} from '../../../api/getData';
  import {countFit} from '@/until'
  export default{
        props: {
            elementObj: {
                type: Object,
                default: function () {
                    return {}
                }
            },
        },
        data(){
            return {
                iconObj:{
                },
                elementStyle:{
                  marginTop:10,
                  background:'',
                  backgroundSize:'',
                  backgroundRepeat:''
                },
                iconStyle:{
                  marginRight:10,  //三个45，四个10，五个3
                  marginLeft:48    //三个75，四个48，五个23
                },
                iconImg:{
                  width: 120,
                  height:120
                },
                iconText:{
                  fontSize:26
                },
                showMore:false,
                moreIconList:''
            }
        },
        mounted() {
          this.iconObj = this.elementObj.config10;
          //组件配置
          this.elementStyle.marginTop = countFit(this.iconObj.marginTop);
          if(this.iconObj.backgroundType==1){ //颜色
            this.elementStyle.background = this.iconObj.backgroundRGB;
          }else if(this.iconObj.backgroundType==2){ //透明
            this.elementStyle.background ='rgba(0,0,0,0)'
          }else if(this.iconObj.backgroundType==3){ //图片
            this.elementStyle.background = 'url('+this.iconObj.backgroundImgUrl+')';
            this.elementStyle.backgroundSize='100% 100%';
            this.elementStyle.backgroundRepeat='no-repeat';
          }
          if(this.iconObj.showIconText!=1){
            this.iconStyle.display = 'flex';
            this.iconStyle.alignItems = 'center'
          }
          //icon配置
          this.iconImg.width = countFit(this.iconObj.iconHeight);
          this.iconImg.height = countFit(this.iconObj.iconHeight);
          switch (this.iconObj.columns) {
            case '3':
              this.iconStyle.marginRight = countFit(45);
              this.iconStyle.marginLeft = countFit(75);
              break;
            case '4':
              this.iconStyle.marginRight = countFit(10);
              this.iconStyle.marginLeft = countFit(48);
              break;
            case '5':
              this.iconStyle.marginRight = countFit(3);
              this.iconStyle.marginLeft = countFit(23);
          }
          this.iconStyle.height = countFit(this.iconObj.rowHeight)
          this.iconText.fontSize = countFit(this.iconObj.fontSize);
          if(this.iconObj.showTop2Row==1){  //只有两行显示全部
            if(this.iconObj.columns==3){
              if(this.iconObj.iconList.length>=6){
                this.moreIconList = this.iconObj.iconList;
                this.showMore = true;
                this.iconObj.iconList = this.iconObj.iconList.slice(0,5);
              }
            }else if(this.iconObj.columns==4){
              if(this.iconObj.iconList.length>=8){
                this.moreIconList = this.iconObj.iconList;
                this.showMore = true;
                this.iconObj.iconList = this.iconObj.iconList.slice(0,7);
              }
            }else if(this.iconObj.columns==5){
              if(this.iconObj.iconList.length>=10){
                this.moreIconList = this.iconObj.iconList;
                this.showMore = true;
                this.iconObj.iconList = this.iconObj.iconList.slice(0,9);
              }
            }
          }
        },
        methods:{
            linkSkip(obj){
                this.$emit('linkSkip',[obj]);
            },
            moreIcon(){
              this.showMore = false;
              this.iconObj.iconList= this.moreIconList;
            }
		    }
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    .icon{
        /*background:#f4f4f4;*/
        display: flex;
        justify-content: center;
        ul{
            width:100%;
            /*background:#Fff;*/
            margin:0 auto;
            display: flex;
            display: -webkit-flex; /* Safari */
            flex-wrap:wrap;
            justify-content:flex-start;
            li{
                /*height: px(200px);*/
                text-align:center;
                img{
                   /*margin-top: px(18px);*/
                }
                p{
                    margin-top: px(18px);
                    color:#323232;
                }
            }
        }
    }
</style>
