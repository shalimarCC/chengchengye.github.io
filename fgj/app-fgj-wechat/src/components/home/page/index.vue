<template>
    <div>
        <my-head :show-fgj="showFgj" :show-cooperator="showCooperator"></my-head>
        <div id="cms" class="page-loadmore-wrapper" >
            <component :is="item.component" :element-obj="item" v-on:linkSkip="linkSkip" v-on:goodsSkip="goodsSkip" v-on:goodsMore="goodsMore" v-for="(item, index) in elementList" :key="index"></component>
        </div>
        <tabbar></tabbar>
    </div>
</template>

<script>
    import banner from '../cms/banner';
    import goodsA from '../cms/goods1';
    import goodsB from '../cms/goods2';
    import goodsC from '../cms/goods3';
    import goodsD from '../cms/goods4';
    import icon from '../cms/icon';
    import labelcomp from '../cms/labelcomp';
    import imgtext from '../cms/imgtext';
    import myHead from '../page/head';
    import tabbar from '../page/tabbar';
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import {templateConstruct,templateInstContent} from '../../../api/getData';
    export default{

        data(){
            return {
                elementList:[],
                showFgj:false,
                showCooperator:false,
            }
        },
		components: {
			      'banner':banner,
            'goodsA':goodsA,
            'goodsB':goodsB,
            'goodsC':goodsC,
            'goodsD':goodsD,
            'icon':icon,
            'imgtext':imgtext,
            'labelcomp':labelcomp,
            'myHead':myHead,
            'tabbar':tabbar
        },
        watch:{

        },
        created(){

            // console.log(this.$store.state.Cookie.mutations.fetch('userInfo'))
            if(!this.$store.state.Cookie.mutations.fetch('userInfo')||this.$store.state.Cookie.mutations.fetch('userInfo').length==0){
              this.$router.push('/login');
            }else{

            }
            this.templateInstContent();
        },
        methods:{
            async templateInstContent(){
              try {
                const res = await templateInstContent({pageNo:1,pageSize:1000,clientType:2,type:0});
                if (res.data.code == 0) {
                  let thtf = this;
                  this.showCooperator = res.data.data.showCooperator;
                  this.showFgj = res.data.data.showFgj;
                  $.each(res.data.data.instMapList,function(key,info){
                    let obj = info;
                    switch(info.configType){
                      case 0:
                        obj.component = 'banner';
                        thtf.elementList.push(obj);
                        break;
                      case 100:
                      case 101:
                      case 102:
                      case 103:
                        obj.component = 'goodsA';
                        thtf.elementList.push(obj);
                        break;
                      case 104:
                      case 105:
                      case 106:
                      case 107:
                        obj.component = 'goodsB';
                        thtf.elementList.push(obj);
                        break;
                      case 108:
                      case 109:
                      case 110:
                      case 111:
                        obj.component = 'goodsC';
                        thtf.elementList.push(obj);
                        break;
                      case 112:
                      case 113:
                        obj.component = 'goodsD';
                        thtf.elementList.push(obj);
                        break;
                      case 200:
                      case 201:
                        obj.component = 'icon';
                        thtf.elementList.push(obj);
                        break;
                      case 300:
                      case 301:
                      case 302:
                      case 303:
                        obj.component = 'imgtext';
                        thtf.elementList.push(obj);
                        break;
                      case 400:
                      case 401:
                        obj.component = 'labelcomp';
                        thtf.elementList.push(obj);
                        break;
                    }
                  })
                } else {
                  Toast(res.data.error);
                }

              } catch (err) {
                Toast('网络错误');
              }
            },
            linkSkip(arr){
                let obj = arr[0];

                if(obj.linkType == 3){
                    MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                    });
                }else if(obj.linkType == 1){
                    if(obj.linkId == 5){
                        this.$router.push('shop/category');
                    }else{
                        MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {
                        });
                    }
                }else if(obj.linkType == 2){
                  // if(!obj.linkUrl.includes('fgjWechat')){
                  //   MessageBox('', '链接不属于福管加，请配置福管加URL！').then(action => {
                  //   });
                  // }else{
                    window.location.href = obj.linkUrl;
                  // }

                }else if(obj.linkType == 4){
                    // this.$router.push('/shop/goodsList/'+obj.linkId+'/2');
                    this.$router.push('/cmsGoodsList/'+obj.linkId+'/2/'+obj.cmsPageId+'/0');
                }else if(obj.linkType == 5||obj.linkType == 6){
                    if(obj.suCompanyAvailable){
                        if(obj.suTmplId==1){
                          this.$router.push('/card/'+obj.linkId);
                        }else if(obj.suTmplId==2){
                          this.$router.push('/shop/goods/0/'+obj.linkId);
                        }else if(obj.suTmplId==3){
                          this.$router.push('/shop/goods2/0/'+obj.linkId);
                        }else if(obj.suTmplId==4){
                          this.$router.push('/moreCredit/'+obj.linkId);
                        }else if(obj.suTmplId==6){
                          this.$router.push('/card/'+obj.linkId);
                        }else if(obj.suTmplId==7){
                          this.$router.push('/shop/goods/0/'+obj.linkId);
                        }else if(obj.suTmplId==8){
                          this.$router.push('/shop/goods2/0/'+obj.linkId);
                        }else if(obj.suTmplId==9){
                          this.$router.push('/moreCredit/'+obj.linkId);
                        }
                    }
                }
            },
            goodsSkip(arr){
              let obj = arr[0];
              if(obj.suTmplId==1||obj.suTmplId==6){
                this.$router.push('/card/'+obj.suId);
              }else if(obj.suTmplId==2||obj.suTmplId==7){
                this.$router.push('/shop/goods/0/'+obj.suId);
              }else if(obj.suTmplId==3||obj.suTmplId==8){
                this.$router.push('/shop/goods2/0/'+obj.suId);
              }else if(obj.suTmplId==4||obj.suTmplId==9){
                this.$router.push('/moreCredit/'+obj.suId);
              }
            },
            goodsMore(arr){
                // this.$router.push('/shop/goodsList/'+arr[0]+'/2');
                this.$router.push('/cmsGoodsList/'+arr[0].sucId+'/2/'+arr[0].cmsPageId+'/0');
            }
		    }
    }
</script>

<style lang="scss" scoped>
$baseWidth:750px;
@function px($val) {
    @return $val/$baseWidth*10+rem;
}

#cms{
    padding:px(88px) 0 px(100px) 0;
}
</style>
