<template>
    <div class="bodyCheck">
      <div v-if="!showIframe">
        <template>
          <banner :banner-goods-data="bannerList" ref="banner" class="banner"></banner>
        </template>
        <div  v-if="healthData.length>0">
          <ul
            class="healthList"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="msgloading"
            infinite-scroll-distance="30"
          >
            <li v-for="(item,key) in healthData">
              <div class="top">
                <img :src="item.imgUrl">
                <div class="title">
                  <p class="name">{{item.skuName}}</p>
                  <p>
                    <span class="time">有效期至：{{item.endTime}}</span>
                    <span @click="seeCard(key)" v-model="item.value">查看卡号 <a :class="[ item.value?'pullUp':'pulldown']"></a></span>
                  </p>
                </div>
              </div>
              <div v-if="item.value" class="card">
                <p><span>卡号：{{item.cardNumber}}</span><b  class="btn" @click="copy(item.cardNumber)">复制</b></p>
                <p><span>卡密：{{item.cardThick}}</span><b  @click="copy(item.cardThick)">复制</b></p>
              </div>
              <div class="order" @click="orderCheck(item.linkUrl)">
                <span v-if="!item.isAppUse">立即预约</span>
                <span v-else>查看详情</span>
              </div>

            </li>
          </ul>
          <div class="noMore" v-if="Moregoods">没有更多了</div>
        </div>
        <div v-else>
          <div class="noExam">
            <img src="../../../../static/assets/img/my/bodyCheck_error.png" class="bodyCheck_error">
            <p>无体检卡券</p>
          </div>
        </div>
      </div>

      <iframe :src="linkUrl" width="100%" scrolling="auto" height="100%"  v-if="showIframe"></iframe>
    </div>
</template>

<script>
    import { Indicator } from 'mint-ui';
    import banner from './banner';
    import{myBodyCheck,queryBannerListByType} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import Clipboard from 'clipboard'
    export default {
        data(){
          return{
              healthData:[],
              bannerList:'',
              showCard:false,
              showIframe:false,
              linkUrl:'',
              copyText:'',
              ispull:false,
              value:-1,
              msgloading:false,
              pageNo:1,
              Moregoods:0
          }
        },
        components: {
          'banner': banner,
        },
        created(){
          this.myBodyCheck();
          this.queryBannerListByType();
        },
        methods:{
          loadMore(){
            this.msgloading = true;
            this.myBodyCheck();
            Indicator.open();
          },
          copy(obj){
            this.copyText = obj;
            var _this = this;
            let clipboard = new Clipboard('.card',{
              text: function(obj) {
                return _this.copyText
              }
            });
            clipboard.on('success', e => {
             Toast('复制成功')
              // 释放内存
              clipboard.destroy()
            })
            clipboard.on('error', e => {
              // 不支持复制
              Toast('浏览器不支持自动复制，请手动复制')
              // 释放内存
              clipboard.destroy()
            })
          },
          //体检轮播图
          async queryBannerListByType(){
            try{
              const res = await queryBannerListByType({belongPage:2})
              if(res.data.code==0){
                  this.bannerList = res.data.data.bannerList;
                  this.$nextTick(() => {
                    this.$refs.banner.swiperLoad();
                  })
              }
            }catch (err) {

            }
          },
          async myBodyCheck(){
            try{
              const res = await myBodyCheck({pageNo:this.pageNo,pageSize:20});
              if(res.data.code==0){
                if(res.data.data.cardPage.list.length ==0){
                  this.Moregoods = 1
                }else{
                  this.Moregoods = 0
                }
                this.pageNo ++;
                this.healthData = this.healthData.concat(res.data.data.cardPage.list);
                this.healthData = this.healthData.map(t=>Object.assign(t,{value:false}));
                console.log(this.healthData);
                if(this.Moregoods ==0){
                  this.msgloading = false;
                }
                Indicator.close();
              }else{
                Toast(res.data.error)
              }
            }catch (err) {

            }
          },
          orderCheck(url){
            this.linkUrl = url;
            // this.linkUrl = 'http://qtdzd.wddcn.com/vshop/autologin.html?code=A3F69049179BB0620F0B89E839C40215&p=KFGJ000038939016&ref=http%3A%2F%2Fweixin.wddcn.com%2FViews%2FWeChat%2FWeiShop%2FssCarousel.ashx%3FrefType%3Dmyorder%26mid%3D660';
            this.showIframe = true;

          },
          seeCard(key){
            this.healthData[key].value = !this.healthData[key].value;
            this.$set(this.healthData,key,this.healthData[key])
          }
        }
    }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  .bodyCheck{
    height:100%;
    font-size: px(28px);
    position: relative;
    background: #f4f4f4;
    .banner{
      height: px(320px);
    }
  }
  .healthList{
    background: #f4f4f4;
    li{
      position: relative;
      margin-top: px(20px);
      background: #fff;
      border-bottom: 1px solid #f4f4f4;
      .top{
        height: px(224px);
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #f4f4f4;
        position: relative;
        img{
          width:px(200px);
          height:px(200px);
          padding-left:px(24px);
        }
        .title{
          padding: px(15px);
          color: #323232;
          .name{
            line-height: px(40px);
          }
          .time{
            font-size: px(24px);
            color: #787878;
            line-height: px(190px);
            margin-right: px(75px);
          }
          p:last-child{
            position: absolute;
            bottom: px(-50px);
            /*margin-top: px(35px);*/
          }
        }

      }
      .order{
        width: px(158px);
        height: px(68px);
        line-height: px(68px);
        color: #ff8546;
        border: 1px solid #ff8546;
        text-align: center;
        border-radius: 10px;
        /*position: absolute;*/
        margin: px(10px) 0;
        margin-left: 73%;
      }
      .card{
        border-bottom: 1px solid #f4f4f4;
        p{
          line-height: px(60px);
          color: #646464;
          margin-left: px(24px);
          display: flex;
          justify-content: space-between;
          margin-right: px(24px);
          b{
            color: #ff8546;
          }
        }
      }

    }
  }
  iframe{
    position:absolute;
    top:0;
    z-index: 100000;
  }
  .noExam{
    color: #9b9b9b;
    text-align: center;
    padding-top: px(100px);
    .bodyCheck_error{
      width: px(230px);
      height: px(180px);
      margin:0 auto px(50px);
    }
  }
  .pulldown{
    background-image:url(../../../../static/assets/img/cms/down@2x.png);
    background-size: 100%;
    width: px(30px);
    height: px(30px);
    position: absolute;
    right: px(-40px);
    margin-top: px(20px);
    bottom:px(77px);
  }
  .pullUp{
    background-image:url(../../../../static/assets/img/cms/up@2x.png);
    background-size: 100%;
    width: px(30px);
    height: px(30px);
    position: absolute;
    right: px(-40px);
    margin-top: px(20px);
    bottom:px(77px);
  }
  .noMore{
    font-size: px(26px);
    text-align: center;
    color: #646464;
  }
</style>
