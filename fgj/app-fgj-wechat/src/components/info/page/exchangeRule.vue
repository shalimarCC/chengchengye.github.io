<template>
    <div class="exchangeRule">
      <!--<div class="title">活动说明:</div>-->
      <pre class="content" v-if="!nocontent">
        {{content}}
      </pre>
      <div v-if="nocontent" class="nocontent">
        <img src="../../../../static/assets/img/error/order_error.png"/>
        <p>规则还在拟定中，请稍后再来查看</p>
      </div>
    </div>
</template>

<script>
  import {findRuleDescription} from '../../../api/getData'
    export default {
        data(){
          return{
              content:'',
              nocontent:false
          }
        },
        created(){
          this.findRuleDescription()
        },
        methods:{
          async findRuleDescription(){
            try{
              const res = await findRuleDescription();
              if(res.data.code ==0){
                  this.content = res.data.data.description;
                  if(this.content==''||this.content==null||this.content==undefined){
                    this.nocontent = true;
                  }else{
                    this.nocontent = false;
                  }
              }
            }catch (e) {

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
  .exchangeRule{
    width: 100%;
  }
  .title{
    font-size:px(28px);
    color: #323232;
    font-weight: bold;
    padding-left: px(24px);
    padding-top: px(28px);
  }
  .content{
    padding:px(24px);
    font-size:px(28px);
    line-height: px(35px);
    color: #323232;
    width: 95%;
    white-space: pre-wrap;
  }
  .nocontent{
    padding-top:px(228px);
    text-align: center;
    img{
      width:px(310px);
      height:px(240px);
    }
    p{
      font-size:px(30px);
      color:#646464;
      line-height: px(60px)
    }
  }
</style>
