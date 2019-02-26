<template>
    <div class="insurance">
      <iframe :src="linkUrl" width="100%" scrolling="no" height="800px"></iframe>
      <!--<iframe src="http://ee.ikang.com/employee/platform/egeo/userLoginApi?auth=1547714378295&companyCode=egeo&username=0021002161091990&sign=f016cfa38d894dda03aafe820dc6283421efe8edde0864e99c0fb358adee2d3e" width="100%" scrolling="auto" height="100%"></iframe>-->

    </div>
</template>

<script>
  import {insurance3rdLogin}from '../../../api/getData';
    export default {
        data() {
          return {
            linkUrl:'http://qtdzd.wddcn.com/vshop/autologin.html?code=A3F69049179BB0620F0B89E839C40215&p=KFGJ000038939016&ref=http%3A%2F%2Fweixin.wddcn.com%2FViews%2FWeChat%2FWeiShop%2FssCarousel.ashx%3FrefType%3Dmyorder%26mid%3D660'
          }
        },
        created(){
          this.insurance3rdLogin();
        },
        methods:{
          async insurance3rdLogin(){
            try{
              const res = await insurance3rdLogin({type:2});
              if (res.data.code == 0) {
                this.linkUrl = res.data.data.url;
                // $('.insurance').html(this.linkUrl)
              } else {
                // Toast(res.data.data);
              }

            }catch (err) {

            }
          }
        }
    }
</script>

<style lang="scss" scoped>
  $baseWidth:750px;
  @function px($val) {
    @return $val/$baseWidth*10+rem;
  }
  .insurance{
    position: relative;
    width:100%;
    height:100%;
  }
  iframe{
    position:absolute;
    top:0;
    z-index: 100000;
  }
</style>
