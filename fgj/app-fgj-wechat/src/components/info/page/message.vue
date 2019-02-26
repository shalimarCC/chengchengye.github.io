<template>
    <div class="message">
        <div class="head">
          <ul>
            <li>
              <div style="float:left;position:absolute;line-height:30px;" @click="routerBack">
                <i class="iconfont icon-fanhui"></i>
              </div>
            </li>
            <li>
              <span :class="[showSys ? 'active title':'title']" @click="sysMsg">系统通知</span>
              <span :class="[showMsm ? 'active title':'title']" @click="newsMsg">消息通知<i class="circle" v-if="isMsg"></i></span>
            </li>
          </ul>
        </div>
        <div class="content" v-if="msglist">
          <ul
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="msgloading"
            infinite-scroll-distance="30">
            <li v-for="item in msglist" class="page-loadmore-listitem">
              <p class="time">{{setTime(item.createTime)}}</p>
              <p class="msgContent">{{item.systemInfo}}</p>
            </li>
          <li class="noMore" v-if="msglist.length>0&&Moregoods==0">没有更多了</li>
          </ul>
          <!--<div class="noMore" v-if="msglist.length>0&&Moregoods==0">没有更多了</div>-->
          <div v-if="!msglist||msglist.length==0" class="noMsg">
            <img src="../../../../static/assets/img/error/message.png">
            <p>暂时没有消息</p>
          </div>
        </div>
    </div>
</template>

<script>
    import { Indicator } from 'mint-ui';
    import {findUserInfoOfPage} from '../../../api/getData';
    export default {
      data(){
        return{
          msglist:[],
          userId:'',
          showSys:true,
          showMsm:false,
          isMsg:false,
          msgloading:false,
          pageNo:1,
          type:1,
          Moregoods:1
        }
      },
      created(){
        //获取当前用户的用户id
        this.userId = this.$store.state.Cookie.mutations.fetch('userInfo').id;
        Indicator.open();
        this.findUserInfoOfPage();

      },
      methods:{
        loadMore(){
          this.msgloading = true;
          this.findUserInfoOfPage();
          // Indicator.open();
        },
        routerBack(){
          this.$router.go(-1);
        },
        //获取消息列表
        async findUserInfoOfPage(){
          try{
            const res = await findUserInfoOfPage({type: this.type,pageNo:this.pageNo,pageSize:1000});
            if(res.data.code ==0){
              Indicator.close();
              if(res.data.data.result.list.length ==0){
                this.Moregoods = 0
              }else{
                this.Moregoods = 1
              }
              //获取消息通知未读状态
              this.isMsg = res.data.data.infoInformSum;

              this.pageNo ++;

              this.msglist = this.msglist.concat(res.data.data.result.list);
              if(this.Moregoods ==1){
                this.msgloading = false;
              }

            }

          }catch (err) {

          }
        },
        sysMsg(){
          this.showSys = true;
          this.showMsm = false;
          this.type = 1;
          this.pageNo = 1;
          this.msglist=[];
          this.findUserInfoOfPage()
        },
        newsMsg(){
          this.showMsm = true;
          this.showSys = false;
          this.isMsg = false;
          this.type = 2;
          this.pageNo = 1;
          this.msglist=[];
          this.findUserInfoOfPage()
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
          return y + '.' + m + '.' + d+'   '+h+':'+f+':'+s
        },

      }
    }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  .message{
    .head{
      text-align:center;
      padding:0 px(20px);
      border-bottom:0.5px solid #f4f4f4;
      line-height:px(88px);
      position:fixed;
      width: 100%;
      box-sizing: border-box;
      z-index:999;
      background:#Fff;
      span{
        font-size: px(36px);
      }
      .title{
        font-size: px(36px);
        color: #323232;
        margin-right: px(30px);
        position: relative;
        .circle{
          display: block;
          width: px(15px);
          height: px(15px);
          background: red;
          border-radius: 50%;
          position: absolute;
          top: px(17px);
          right: px(-8px);
          z-index: 10000;
        }
      }
      .active{
        color: #ff8546;
        border-bottom: 1px solid #ff8546;
      }
      ul{
        display: flex;
        display: -webkit-flex; /* Safari */
        justify-content:space-between;
        li{
          display: flex;
          display: -webkit-flex; /* Safari */
          align-items:center;
        }
        li:nth-child(1){
          width:px(65px);
        }
        li:nth-child(2){
          flex-grow:2;
          justify-content:center;
        }
      }
    }

  }
  .content{
    width: 100%;
    height: px(1410px);
    position: absolute;
    top: px(88px);
    background: #f4f4f4;
    overflow: hidden;
    overflow-y: auto;
    ul{
      width:95%;
      height:100%;
      margin:0 auto;
      /*background: #f4f4f4;*/
      li{
        margin-top: px(30px);
        font-size: px(26px);
        .time{
          text-align: center;
          font-size: px(26px);
        }
        .msgContent{
          font-size: px(26px);
          line-height: px(40px);
          padding: px(30px) 0 px(30px) px(20px);
          background: #fff;
        }
      }
    }
  }
  .content::-webkit-scrollbar{
    display: none;
  }
  .noMsg{
    width: 100%;
    img{
      width: px(310px);
      height: px(240px);
      display: flex;
      margin: px(316px) auto 0;
    }
    p{
      margin-top: px(40px);
      text-align: center;
      font-size: px(30px);
      color: #646464;
    }
  }
  .noMore{
    font-size: px(26px);
    text-align: center;
    color: #646464;
    padding: px(20px) 0;
  }
  .page-loadmore-listitem {
    /*text-align: center;*/
  }

  .page-loadmore-listitem:first-child {
    border-top: 1px solid #f4f4f4;
  }

  .page-loadmore-wrapper {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
  }
</style>
