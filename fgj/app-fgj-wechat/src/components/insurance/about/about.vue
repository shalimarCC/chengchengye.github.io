<template>
    <div id="goods" v-if="goodType">
        <div class="page-loadmore-wrapper">
            <div class="goods_warpper">
                <template>
                    <banner :banner-goods-data="goodsData.pictureList" ref="banner"></banner>
                </template>

                <div id="goods_data">
                    <h4>{{goodsData.standardUnitName}}</h4>
                    <p class="price">
                        <span>积分价:{{goodsData.salePrice}}</span>
                        <del>&yen;{{goodsData.marketPrice}}</del>
                        <i>已售<b>{{goodsData.salesVolume}}</b>件</i>
                    </p>

                </div>

                <div id="goods_specification">
                    <div @click="putGoodsSpecification" class="clear">
                        <span v-if="picRidioList.length==0">规格数量选择</span>
                        <span v-else>已选择：<b v-for="item in picRidioList">{{item}} </b>{{payNum}}件</span>
                        <i class="iconfont icon-more"></i>
                    </div>
                    <div @click="putGoodsProperty">
                        <span>产品参数</span>
                        <i class="iconfont icon-more"></i>
                    </div>

                </div>

                <div id="goods_state">
                    <p class="clear"><span>运费说明</span><b>{{goodsData.freightExplain}}</b></p>
                    <p class="clear"><span>发货说明</span><b>{{goodsData.shipmentsExplain}}</b></p>
                </div>

                <div id="goods_img">
                    <p class="clear"><span>商品详情</span></p>
                    <div v-html="goodsData.content"></div>
                </div>
            </div>
        </div>
        <div id="goods_bottom">
            <div id="pay" :class="{'buy_btn_disabled':goodsData.status !=3}" @click="buy">立即购买</div>
        </div>
      <!--  <mt-popup
        v-model="popupVisibleRate" class="mint-popup-5">
            <div id="rateTable">
                <h4>价格对比</h4>
                <ul>
                    <li v-for="item in goodsRateList">
                        <img :src="item.sellPlatformPictureUrl" alt="">
                        <p>{{item.sellPlatformName}}</p>
                        <span>&yen;{{item.salePrice.toFixed(2)}}</span>
                    </li>
                </ul>
                <div class="close_rate">
                    <i class="iconfont icon-close" @click="closeGoodsRate"></i>
                </div>
            </div>
        </mt-popup> -->

        <mt-popup
        v-model="popupVisibleProperty"
        position="bottom" class="mint-popup-4">
            <div id="propertyTable">
                <h4>产品参数</h4>
                <table>
                    <tr v-for="item in goodsData.attList">
                        <th>{{item.attName}}</th>
                        <td>{{item.attValue}}</td>
                    </tr>
                </table>
            </div>
            <div class="property_pop" @click="popupVisiblePropertyClose">
                完成
            </div>
        </mt-popup>

        <mt-popup
        v-model="popupVisibleSpecification"
        position="bottom" class="mint-popup-4">
            <specification v-on:setSkuID="setSkuID" v-on:buy="buy" :picridiolist="picRidioList" :paynum="payNum" v-if="popupVisibleSpecification" v-on:closeGoodsProperty="closeGoodsProperty" v-on:saveCartItem="saveCartItem" :goods-standard-list="goodsStandardList" :goods-type="goodsType" :radio="goodsData.radio*1" :goods-sku-list="goodsSkuList" :goods-volume="goodsData.salesVolume*1" :goods-price="goodsData.salePrice" :goods-name="goodsData.standardUnitName" :goods-img-src="goodsData.picture"></specification>
        </mt-popup>

    </div>
</template>

<script>
    import banner from './banner';
    import specification from './specification';
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import {findMerchantProdetails,MerchantProdAttNameAPPById,skuByMerchantProductId,saveCartItem,SellPlatformMerchantProdByMerchantProdId} from '../../../api/getData';
    export default{

        data(){
            return {
                goodsData:{

                },
                goodsStandardList:[],
                goodsSkuList:[],
                popupVisibleProperty:false,
                popupVisibleSpecification:false,
                popupVisibleRate:false,
                goodsType:1,
                skuId:0,
                payNum:1,
                goodType:false,
                goodsRateList:[],
                picRidioList:[]
            }
        },
		components: {
			'banner':banner,
            'specification':specification
        },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    let str = curVal.path;
                    str = str.substring(0,6)
                    if(str == "/goods"){
                        Indicator.open();
                        Object.assign(this.$data, this.$options.data())
                        this.findMerchantProdetails();
                        this.MerchantProdAttNameAPPById();
                        this.skuByMerchantProductId();
                    }
                },
                deep:true
            },
            popupVisibleRate:{
                handler(curVal,oldVal){
                    if(curVal){
                        $(".page-loadmore-wrapper").css("overflow","hidden");
                    }else{
                        $(".page-loadmore-wrapper").css("overflow","auto");
                    }
                }
            },
            popupVisibleProperty:{
                handler(curVal,oldVal){
                    if(curVal){
                        $(".page-loadmore-wrapper").css("overflow","hidden");
                    }else{
                        $(".page-loadmore-wrapper").css("overflow","auto");
                    }
                }
            },
            popupVisibleSpecification:{
                handler(curVal,oldVal){
                    if(curVal){
                        $(".page-loadmore-wrapper").css("overflow","hidden");
                    }else{
                        $(".page-loadmore-wrapper").css("overflow","auto");
                    }
                }
            }
        },
        created(){
            Indicator.open();
            this.findMerchantProdetails();
            this.MerchantProdAttNameAPPById();
            this.skuByMerchantProductId();
            //this.SellPlatformMerchantProdByMerchantProdId();

        },
        methods:{
            //获取商品信息
            async findMerchantProdetails() {
                try {
                    const res = await findMerchantProdetails({standardUnitId:this.$route.params.goodsId});

                    if (res.data.code == 0) {
                        this.goodType=true;
                        this.goodsData = res.data.data;
                        Indicator.close();
                        this.$nextTick(() => {
                            this.$refs.banner.swiperLoad();
                            $("#goods_img img").width("100%");
                        })
                    } else {
                        Indicator.close();
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Indicator.close();
                     Toast('网络错误');

                }
            },
            // //获取比价信息
            // async SellPlatformMerchantProdByMerchantProdId() {
            //     try {
            //         const res = await SellPlatformMerchantProdByMerchantProdId({merchantProdId:this.$route.params.goodsId});

            //         if (res.data.code == 0) {
            //             this.goodsRateList = res.data.data;
            //         } else {
            //             Toast(res.data.data);
            //         }

            //     } catch (err) {
            //          Toast('网络错误');

            //     }
            // },
            //获取商品规格
            async MerchantProdAttNameAPPById() {
                try {
                    const res = await MerchantProdAttNameAPPById({standardUnitId:this.$route.params.goodsId});

                    if (res.data.code == 0) {
                        this.goodsStandardList = res.data.data;

                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },
            //获取商品SKU
            async skuByMerchantProductId() {
                try {
                    const res = await skuByMerchantProductId({merchantProductId:this.$route.params.goodsId});

                    if (res.data.code == 0) {
                        this.goodsSkuList = res.data.data;

                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },

            //查看商品比价信息
            putGoodsRate(){
                this.popupVisibleRate = true;
            },

            //关闭商品比价信息
            closeGoodsRate(){
                this.popupVisibleRate = false;
            },
            //查看商品属性
            putGoodsProperty(){
                this.popupVisibleProperty = true;
                this.goodsType = 1;
            },

            //关闭商品属性窗口
            popupVisiblePropertyClose(){
                this.popupVisibleProperty = false;
            },
             //关闭选择规格窗口
            closeGoodsProperty(){
                this.popupVisibleSpecification = false;
            },
            //选择规格
            putGoodsSpecification(){
                this.popupVisibleSpecification = true;
            },
            setSkuID(sku){
                this.skuId = sku[0];
                this.payNum = sku[1];
                this.picRidioList = sku[2];
                this.popupVisibleSpecification = false;
            },
            //加入购物车
            joinShopcat (){
                if(this.goodsData.status == 3){
                    if(this.skuId!="" && this.payNum!=""){
                        this.saveCartItem();
                    }else{
                        this.goodsType = 2;
                        this.popupVisibleSpecification = true;
                    }
                }else{
                    return;
                }

            },
            //加入购物车
            async saveCartItem() {
                try {
                    const res = await saveCartItem({num:this.payNum,productUnitId:this.skuId});

                    if (res.data.code == 0) {
                        Toast('商品已经在购物车躺好了哟~');
                    }else if (res.data.code == 131) {
                        MessageBox('提示', '该商品已下架').then(action => {
                            this.$router.go(-1);
                        });
                    }else if (res.data.code == 132) {
                        MessageBox('提示', '该活动已过期').then(action => {
                            this.$router.go(-1);
                        });
                    }else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },

            //立即购买
            buy(){
                if(this.goodsData.status == 3){
                    if(this.skuId!="" && this.payNum!=""){
                        var obj = new Object;
                        obj.skuId = this.skuId;
                        obj.num = this.payNum;
                        this.$store.dispatch("setSkuObj",obj);
                        this.$router.push({path: '/shop/orderConfim/0'});
                    }else{
                        this.goodsType = 3;
                        this.popupVisibleSpecification = true;
                    }
                }else{
                    return;
                }
            }

		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/insurance/about.scss";
</style>
