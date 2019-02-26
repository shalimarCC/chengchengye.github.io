<template>
  <el-tabs v-model="activeNameGoods" type="card" @tab-click="handleClick" style="padding: 20px 0;">
    <el-tab-pane label="基本信息" name="first">
        <basic-goods :basic-goods-data="basicGoodsData" v-if="activeNameGoods == 'first'"></basic-goods>
    </el-tab-pane>
    <el-tab-pane label="规格属性" name="second">
        <property-goods :property-goods-data="propertyGoodsData" v-if="activeNameGoods == 'second'"></property-goods>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="third">
        <img-goods :img-goods-data="imgGoodsData" v-if="activeNameGoods == 'third'"></img-goods>
    </el-tab-pane>

  </el-tabs>
</template>
<script>
  import {findMerchantProductById,merchantProductViwe} from '../../../api/getData';
  import basicGoods  from './tabs/basicGoods.vue'
  import propertyGoods  from './tabs/propertyGoods.vue'
  import imgGoods  from './tabs/imgGoods.vue'
  export default {
    data() {
      return {
        activeNameGoods: '',

        flag1:false,
        basicGoodsData:{

        },
        propertyGoodsData:[],
        imgGoodsData:{

        },
        tabName:'first'
      };
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                let str = curVal.path;
                str = str.substring(0,16)
                if(str == "/goods/goodsTabs"){
                    this.findMerchantProductById ();
                    Object.assign(this.$data, this.$options.data())
                }

　　　　　　 },
            deep:true
        }

    },
    components: {
        basicGoods,propertyGoods,imgGoods
    },
    created () {
        this.findMerchantProductById ();
    },
    methods: {
        async findMerchantProductById (){
            try {

                const res = await findMerchantProductById({merchantProductId:this.$route.params.goodsId});

                if (res.data.code == 0) {
                    //组织基本信息
                    this.basicGoodsData.clientList = res.data.data.clientList;
                    this.basicGoodsData.companyList = res.data.data.companyList;
                    this.basicGoodsData.demoCompanyList = res.data.data.demoCompanyList;
                    this.basicGoodsData.competingCompanyList = res.data.data.competingCompanyList;
                    this.basicGoodsData.merchantProduct = res.data.data.merchantProduct;
                    this.basicGoodsData.sellPlatformMerchantProdList = res.data.data.sellPlatformMerchantProdList;
                    this.basicGoodsData.merchantProductTagList = res.data.data.merchantProductTagList;
                    this.basicGoodsData.spuKeyWordList = res.data.data.spuKeyWordList;
                    this.basicGoodsData.suKeyWordList = res.data.data.suKeyWordList;
                    this.basicGoodsData.webBannerPictureList = res.data.data.webBannerPictureList;
                    this.basicGoodsData.storeIdList = res.data.data.storeIdList;
                    this.basicGoodsData.membershipIdList = res.data.data.membershipIdList;
                    //组织规格
                    this.propertyGoodsData = res.data.data.productUnitList;
                    //组织商品图片
                    this.imgGoodsData.picture = res.data.data.picture;
                    this.imgGoodsData.pictureList = res.data.data.pictureList;
                    this.imgGoodsData.merchantProductId = this.$route.params.goodsId;


                    this.activeNameGoods = this.tabName;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
        async merchantProductViwe (productId) {

            try {

                const res = await merchantProductViwe({productId:productId});

                if (res.data.code == 0) {
                     //组织基本信息
                    this.basicGoodsData.name = res.data.data.productVO.name;
                    this.basicGoodsData.categoryName = res.data.data.productVO.categoryName;
                    this.basicGoodsData.chineseName = res.data.data.productVO.chineseName;

                    //组织属性规格
                    this.propertyGoodsData.apecificationList = res.data.data.productVO.apecificationList;
                    this.propertyGoodsData.list = res.data.data.productVO.list;

                    //组织商品图片
                    this.imgGoodsData.url = res.data.data.productVO.url;
                    this.imgGoodsData.pictureList = res.data.data.productVO.pictureList;


                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },
      handleClick(tab, event) {

            this.tabName = tab.name;
            this.findMerchantProductById();
      }
    }
  };
</script>

<style scoped>
#example {
    padding: 10px 20px;
    text-align:center;
}


</style>