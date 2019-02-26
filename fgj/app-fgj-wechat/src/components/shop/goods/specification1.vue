<template>
<div v-if="standardType" id="standard">
    <div class="standard">
        <div class='clear standard_title'>
            <img v-if="goodsStandardImg!=null" :src="goodsStandardImg+'?imageMogr2/size-limit/100k!'">
            <img v-else src="../../../../static/assets/img/goods_error.png">
            <p>
                <b>{{salePrice.toFixed(2)}}<i class="fubi">积分</i></b>
            </p>
        </div>
        <div v-for="(item,key) in goodsStandardList" class="standardList clear">
            <template>
                <h5>{{item.attName}}</h5>
                    <div>
                         <span class="button sku" v-for="standard in item.attValue" :class="{'disabled':standard.realStockNum<=0||standard.status==4}" @click="canSelect($event)" :attr-id="standard.attValueId">{{standard.attValue}}</span>
                    </div>
            </template>
        </div>
    </div>

    <div class="buy_btn_box">
        <div class="buy_btn" v-if="goodsType==2 || goodsType==3" v-show="buyType==0" @click="handleClick">
            确定
        </div>
        <div class="buy_btn" v-if="goodsType==2 || goodsType==3" v-show="buyType==1" @click="handleClick">
            确定
        </div>
    </div>

    <div class="close">
        <i class="iconfont icon-close" @click="closeGoodsProperty"></i>
    </div>
</div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import {saveCartItem,findCartItemSumByUserId} from '../../../api/getData';
    export default{
        props: {
            goodsStandardList: {
                type: Array,
                default: function () {
                    return []
                }
            },

            goodsSkuList: {
                type: Object,
                default: function () {
                    return []
                }
            },

            radio: {
                type: Number,
                default: function () {
                    return ''
                }
            },

            goodsImgSrc :{
                type: String,
                default: function () {
                    return ''
                }
            },

            goodsPrice :{
                // type: Number,
                default: function () {
                    return ''
                }
            },

            goodsType :{
                type: Number,
                default: function () {
                    return ''
                }
            },


            goodsVolume :{
                type: Number,
                default: function () {
                    return ''
                }
            },

            paynum :{
                type: Number,
                default: function () {
                    return ''
                }
            },

            picridiolist :{
                type: Array,
                default: function () {
                    return ''
                }
            },
            goodsStatus:{
                // type: Number,
                default: function () {
                    return ''
                }
            },
            buyType:{
                type: Number,
                default: function () {
                  return ''
                }
            },
        },
        data(){
            return {
                goodsStandardImg:'',
                picRidio:'',
                disabled:true,
                salesVolume:'',
                salePrice:'',
                // skuId:'',
                payNum:1,
                standardType:false,
                SKUResult:{

                },
                picRidioList:'',
            }
        },

        watch:{
            'goodsImgSrc':{
                handler(curVal,oldVal){
                    this.goodsStandardImg = curVal;
                }
            },
            'goodsPrice':{
                handler(curVal,oldVal){
                    this.salePrice = curVal;
                }
            },
            'goodsVolume':{
                handler(curVal,oldVal){
                    this.salesVolume = curVal;
                }
            },
            'salesVolume':{
                handler(curVal,oldVal){
                }
            },
            'skuId':{
                handler(curVal,oldVal){
                    if(curVal == ""){
                        this.disabled = true;
                    }else{
                        this.disabled = false;
                    }
                }
            },
        },
        computed:{
          // skuId:{
          //   get(){
          //     return this.$store.state.skuId
          //   },
          //   set(val){
          //     this.$store.commit('setSkuId',val)
          //   }
          // }
        },
        mounted() {
            this.goodsStandardImg = this.goodsImgSrc;
            this.salePrice = this.goodsPrice*1;
            this.salesVolume = -1;
            this.standardType = true;
            this.initSKU();
        },
        created(){
            this.picRidioList = this.picridiolist;
            this.$store.state.Cookie.mutations.save(this.$route.params.buyType,'buyType');
        },
        methods:{
            //点击事件
            canSelect(dom){
                var self = $(dom.currentTarget);
                var thtf = this;
                if($(self).hasClass('disabled')){
                    return;
                }
                //选中自己，兄弟节点取消选中
                self.toggleClass('bh-sku-selected').siblings().removeClass('bh-sku-selected');

                //已经选择的节点
                var selectedObjs = $('.bh-sku-selected');
                if(selectedObjs.length) {
                    //获得组合key价格
                    var selectedIds = [];
                    selectedObjs.each(function() {
                        selectedIds.push($(this).attr('attr-id'));
                    });
                    selectedIds.sort(function(value1, value2) {
                        return parseInt(value1) - parseInt(value2);
                    });
                    var len = selectedIds.length;
                    var prices = this.SKUResult[selectedIds.join(';')].prices;
                    // var maxPrice = Math.max.apply(Math, prices);
                    // var minPrice = Math.min.apply(Math, prices);
                    // this.salePrice = maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice;
                    this.salePrice = prices;
                    this.salesVolume = this.SKUResult[selectedIds.join(';')].count;
                    this.skuId = this.SKUResult[selectedIds.join(';')].productUnitId;
                    this.goodsStandardImg = this.SKUResult[selectedIds.join(';')].puPicUrl;
                    this.picRidio = this.SKUResult[selectedIds.join(';')].name;
                    if(this.skuId!=''){
                        this.$emit('setSkuID',[this.skuId,this.payNum,this.picRidio]);
                    }else{
                        this.$emit('setSkuID',['',1,'']);
                    }
                    //用已选中的节点验证待测试节点 underTestObjs
                    $(".sku").not(selectedObjs).not(self).each(function() {
                        var siblingsSelectedObj = $(this).siblings('.bh-sku-selected');

                        var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
                        if(siblingsSelectedObj.length) {
                            var siblingsSelectedObjId = siblingsSelectedObj.attr('attr-id');
                            for(var i = 0; i < len; i++) {
                                (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
                            }
                        } else {
                            testAttrIds = selectedIds.concat();
                        }


                        testAttrIds = testAttrIds.concat($(this).attr('attr-id'));
                        testAttrIds.sort(function(value1, value2) {
                            return parseInt(value1) - parseInt(value2);
                        });
                        if(!thtf.SKUResult[testAttrIds.join(';')]) {
                             $(this).hide().removeClass('bh-sku-selected');
                        } else {
                             $(this).show()
                            if(thtf.SKUResult[testAttrIds.join(';')].count == 0 || thtf.SKUResult[testAttrIds.join(';')].status == 4) {
                                $(this).addClass('disabled').removeClass('bh-sku-selected');
                            } else {
                                $(this).removeClass('disabled');
                            }
                            if(thtf.SKUResult[testAttrIds.join(';')].isVendible === 0){
                                $(this).hide()
                            }else{
                                $(this).show()
                            }
                        }
                    });
                } else {
                    //设置默认价格
                    this.salesVolume = -1;
                    this.salePrice = this.goodsPrice;
                    this.goodsStandardImg = this.goodsImgSrc;
                    this.skuId = '';
                    //设置属性状态
                    $('.sku').each(function() {
                        thtf.SKUResult[$(this).attr('attr-id')].isVendible === 0 ? $(this).hide() : $(this).show();
                        thtf.SKUResult[$(this).attr('attr-id')].count > 0 && thtf.SKUResult[$(this).attr('attr-id')].status == 3? $(this).removeClass('disabled') : $(this).addClass('disabled').removeClass('bh-sku-selected');

                    })

                }
            },
            //获得对象的key
            getObjKeys(obj) {
                if (obj !== Object(obj)) throw new TypeError('Invalid object');
                var keys = [];
                for (var key in obj)
                    if (Object.prototype.hasOwnProperty.call(obj, key))
                        keys[keys.length] = key;
                return keys;
            },
            //把组合的key放入结果集SKUResult
            add2SKUResult(combArrItem, sku) {
                var key = combArrItem.join(";");
                if(this.SKUResult[key]) {//SKU信息key属性·
                    if(sku.status==3 && sku.isVendible==1){
                        this.SKUResult[key].count += sku.realStockNum;
                    }
                    this.SKUResult[key].prices = this.goodsPrice*1;
                    this.SKUResult[key].puPicUrl = this.goodsImgSrc;
                    this.SKUResult[key].name = sku.keyName;
                    this.SKUResult[key].isVendible = (this.SKUResult[key].isVendible==sku.isVendible)&&sku.isVendible==0?0:1;
                    this.SKUResult[key].productUnitId = '';
                    this.SKUResult[key].status = (this.SKUResult[key].status==sku.status)&&sku.status==4?4:3;
                } else {
                    if(sku.status==3 && sku.isVendible==1){
                        this.SKUResult[key] = {
                            count : sku.realStockNum,
                            prices : sku.salePrice,
                            puPicUrl : '',
                            name : sku.keyName,
                            isVendible : sku.isVendible,
                            productUnitId : '',
                            status : sku.status,
                        };
                    }else{
                        this.SKUResult[key] = {
                            count : 0,
                            prices : sku.salePrice,
                            puPicUrl : '',
                            name : sku.keyName,
                            isVendible : sku.isVendible,
                            productUnitId : '',
                            status : sku.status,
                        };
                    }

                }
            },
            /**
            * 从数组中生成指定长度的组合
            */
            arrayCombine(targetArr) {
                if(!targetArr || !targetArr.length) {
                    return [];
                }

                var len = targetArr.length;
                var resultArrs = [];


                // 所有组合
                for(var n = 1; n < len; n++) {
                    var flagArrs = this.getFlagArrs(len, n);
                    while(flagArrs.length) {
                        var flagArr = flagArrs.shift();
                        var combArr = [];
                        for(var i = 0; i < len; i++) {
                            flagArr[i] && combArr.push(targetArr[i]);
                        }

                        resultArrs.push(combArr);
                    }
                }

                return resultArrs;
            },
            //初始化得到结果集
            initSKU() {
                var i, j, skuKeys = this.getObjKeys(this.goodsSkuList);
                for(i = 0; i < skuKeys.length; i++) {
                    var skuKey = skuKeys[i];//一条SKU信息key
                    var sku = this.goodsSkuList[skuKey]; //一条SKU信息value
                    var skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组
                    skuKeyAttrs.sort(function(value1, value2) {
                        return parseInt(value1) - parseInt(value2);
                    });
                    //对每个SKU信息key属性值进行拆分组合
                    var combArr = this.arrayCombine(skuKeyAttrs);

                    for(j = 0; j < combArr.length; j++) {

                        this.add2SKUResult(combArr[j], sku);
                    }
                    //结果集接放入SKUResult
                    this.SKUResult[skuKeyAttrs.join(";")] = {
                        count : sku.realStockNum,
                        prices : sku.salePrice,
                        puPicUrl : sku.puPicUrl,
                        name : sku.keyName,
                        isVendible : sku.isVendible,
                        productUnitId : sku.productUnitId,
                        status : sku.status
                    };

                }
                // console.log(this.SKUResult)

            },
            /**
            * 获得从m中取n的所有组合
            */
            getFlagArrs(m, n) {
                if(!n || n < 1) {
                    return [];
                }

                var resultArrs = [],
                    flagArr = [],
                    isEnd = false,
                    i, j, leftCnt;

                for (i = 0; i < m; i++) {
                    flagArr[i] = i < n ? 1 : 0;
                }

                resultArrs.push(flagArr.concat());

                while (!isEnd) {
                    leftCnt = 0;
                    for (i = 0; i < m - 1; i++) {
                        if (flagArr[i] == 1 && flagArr[i+1] == 0) {
                            for(j = 0; j < i; j++) {
                                flagArr[j] = j < leftCnt ? 1 : 0;
                            }
                            flagArr[i] = 0;
                            flagArr[i+1] = 1;
                            var aTmp = flagArr.concat();
                            resultArrs.push(aTmp);
                            if(aTmp.slice(-n).join("").indexOf('0') == -1) {
                                isEnd = true;
                            }
                            break;
                        }
                        flagArr[i] == 1 && leftCnt++;
                    }
                }
                return resultArrs;
            },


            closeGoodsProperty(){
                this.$emit('closeGoodsProperty');
            },
            setAddPayNum(){
                this.payNum++;
                if(this.skuId!=''){
                    this.$emit('setSkuID',[this.skuId,this.payNum,this.picRidio]);
                }else{
                    this.$emit('setSkuID',['',1,'']);
                }
            },
            setReductPayNum(){

                if(this.payNum>1){
                    this.payNum--;
                    if(this.skuId!=''){
                        this.$emit('setSkuID',[this.skuId,this.payNum,this.picRidio]);
                    }else{
                        this.$emit('setSkuID',['',1,'']);
                    }
                }else{
                    return;
                }
            },
            handleClick(){
                this.$store.dispatch("setSkuId",this.skuId);
                if(!this.$store.state.skuId){
                    Toast('请选择商品规格');
                  return
                }
                this.$emit('closeGoodsProperty');
            },
		}
    }
</script>

<style lang="scss" scoped>
    @import "../../../style/component/goods/specification.scss";
    #standard{
      .close{
        top:px(30px);
      }
    }
  .standardList{
    .button{
      margin-top: px(20px);
    }
  }
</style>
