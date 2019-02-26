<template>
    <div :style="goodsStyle">
      <!--单行左右滑动-->
      <goods1 :element-obj="elementObj" v-if="elementObj.config11.showType==1" v-on:goodsSkip="goodsSkip"></goods1>
      <!--单行双商品-->
      <goods2 :element-obj="elementObj" v-if="elementObj.config11.showType==3" v-on:goodsSkip="goodsSkip"></goods2>
      <!--<goods2 :element-obj="elementObj" v-if="elementObj.config11.showType==1"></goods2>-->
      <!--单行三商品-->
      <goods3 :element-obj="elementObj" v-if="elementObj.config11.showType==4" v-on:goodsSkip="goodsSkip"></goods3>
      <!--<goods3 :element-obj="elementObj" v-if="elementObj.config11.showType==1"></goods3>-->
      <!--单行单商品-->
      <goods4 :element-obj="elementObj" v-if="elementObj.config11.showType==2" v-on:goodsSkip="goodsSkip"></goods4>
      <!--<goods4 :element-obj="elementObj" v-if="elementObj.config11.showType==1"></goods4>-->
    </div>
</template>

<script>
    import goods1 from '../newCms/goods1'
    import goods2 from '../newCms/goods2'
    import goods3 from '../newCms/goods3'
    import goods4 from '../newCms/goods4'
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
            goodsStyle:{
              marginTop:10,
            }
          }
        },
        components: {
          'goods1':goods1,
          'goods2':goods2,
          'goods3':goods3,
          'goods4':goods4,
        },
        mounted(){
          this.goodsStyle.marginTop = countFit(this.elementObj.config11.marginTop)
        },
        methods:{
          goodsSkip(arr){
            console.log(arr);
            let obj = arr[0];
            if(obj.commodityTemplateId==1||obj.commodityTemplateId==6){
              this.$router.push('/card/'+obj.standardUnitId);
            }else if(obj.commodityTemplateId==2||obj.commodityTemplateId==7){
              this.$router.push('/shop/goods/0/'+obj.standardUnitId);
            }else if(obj.commodityTemplateId==3||obj.commodityTemplateId==8){
              this.$router.push('/shop/goods2/0/'+obj.standardUnitId);
            }else if(obj.commodityTemplateId==4||obj.commodityTemplateId==9){
              this.$router.push('/moreCredit/'+obj.standardUnitId);
            }
          },
        }
    }
</script>

<style scoped>

</style>
