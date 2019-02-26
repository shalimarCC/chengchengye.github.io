<template>
  <div id="tabbar">
    <ul class="tab-item">
      <li v-for="(info,key) in item" @click="tabSkip(info,key)">
        <img class="iconImg" :src="info.iconUrl"  v-if="!info.showIcon">
        <img class="iconImg" :src="info.iconOnclickUrl"  v-if="info.showIcon">
        <span :class="[itemKey==key?'active':'']">{{info.pageTabValue}}</span>
      </li>
    </ul>

  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  import {countFit} from '@/until';
  import {
    findCmsPageTabFront
  } from '../../../api/getData';
  export default{
    data(){
      return {
        item:[],
        itemKey:0
      }
    },
    created(){
      this.findCmsPageTabFront()
      if(this.$store.state.Cookie.mutations.fetch('companyName')=='福管加电子商务平台'){
        this.showApp = false;
      }
      if(this.$route.path == "/home"){
        this.selected = 'home';
      }else if(this.$route.path == "/app"){
        this.selected = 'app';
      }else if(this.$route.path == "/my"){
        this.selected = 'my';
      }else{
        // this.selected = curVal.path;
      }
    },
    watch:{
      item:{
        handler(curVal,oldVal){
          // console.log(curVal)
        },
      }
    },
    mounted(){

    },
    methods:{
      tabSkip(info,iconkey){
        if(this.itemKey==iconkey){
          // this.itemKey =-1
        }else{
          this.itemKey = iconkey;
        }
        $.each(this.item,function (key,info) {
          if(key ==iconkey){
            // info.showIcon=!info.showIcon;
          }else{
            info.showIcon = false;
          }
        });
        switch (info.id) {
          case 1:
            this.$router.push('/home');
            // window.location.reload();
            break;
          case 2:
            this.$router.push('/Mall');
            // window.location.reload();
            break;
          case 3:
            this.$router.push('/Application');
            // window.location.reload();
            break;
          case 4:
            this.$router.push('/my');
            break;
        }
      },
      appSkip(){
        MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {

        });
      },
      //tab页配置
      async findCmsPageTabFront() {
        try {
          const res = await findCmsPageTabFront();
          if (res.data.code == 0) {
            this.item = res.data.data;
            var _this = this;
            $.each(this.item,function (key,info) {
              let i = 1;
              if(_this.$route.path == "/home"){
                i=1;
              }else if(_this.$route.path == "/Mall"){
                i=2;
              }else if(_this.$route.path == "/Application"){
                i=3;
              }else{
                i=4;
              }
              if(i==info.type){
                _this.itemKey = key;
                info.showIcon= true;
              }
              // if(info.pageTabValue.includes(_this.$route.name)){  //匹配不够准确
              //   _this.itemKey = key;
              //   info.showIcon= true;
              // }
            })
          } else {
            Toast(res.data.data);
          }

        } catch (err) {
          Toast(err);
        }
      },

      mySkip(){
        this.$router.push('/my');
      },
      shopSkip(){
        this.$router.push('/home');
      },
    }
  }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  #tabbar{
    background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: top left;
    /*position: relative;*/
    background-color: #fafafa;
    /*display: -webkit-box;*/
    /*display: -ms-flexbox;*/
    /*display: flex;*/
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    text-align: center;
    z-index:999;
  }
  .tab-item{
    padding: px(12px) 0 px(8px) 0;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-decoration: none;
    font-size:px(30px);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap:wrap;
    justify-content:space-around;
    li{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .iconImg{
      width:px(48px);
      height:px(48px);
    }
    span{
      font-size:px(22px);
      color:#969696;
      width:100%;
      margin-top:px(10px);
    }
    .active{
      color:#ff8546;
    }
  }

</style>
