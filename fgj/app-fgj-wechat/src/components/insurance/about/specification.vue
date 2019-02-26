<template>
<div v-if="standardType" id="standard">
    <div class="standard">
        <div class='clear standard_title'>
            <img v-lazy="goodsStandardImg">
            <p>
                <b>&yen;{{salePrice}}</b>
                <span v-if="salesVolume==-1">请选择规格属性</span>
                <span v-else>库存{{salesVolume}}件</span>
            </p>
        </div>

        <div v-for="(item,key) in goodsStandardList" class="standardList clear">

            <template>
                <h5>{{item.attName}}</h5>
                    <div>
                         <input type="button" class="button sku" v-for="standard in item.attValue" @click="canSelect($event)" :attr-id="standard.attValueId" :value="standard.attValue">
                    </div>
            </template>

        </div>
        <div class="num_btn">
            <h5>数量</h5>
            <p>
                <span @click="setReductPayNum" :class="{disabled : payNum <= 1}"><i class="iconfont icon-jianhao"></i></span>
                <b>{{payNum}}</b>
                <span @click="setAddPayNum" :class="{disabled : payNum >= salesVolume}"><i class="iconfont icon-jiahao1"></i></span>
            </p>
        </div>
    </div>

    <div class="buy_btn" :class="{'buy_btn_disabled':disabled}" @click="handleClick">
        确定
    </div>

    <div class="close">
        <i class="iconfont icon-close" @click="closeGoodsProperty"></i>
    </div>
</div>
</template>

<script>

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
                type: String,
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
        },
        data(){
            return {
                goodsStandardImg:'',
                picRidioList:[],
                disabled:true,
                salesVolume:'',
                salePrice:'',
                skuId:'',
                payNum:1,
                standardType:false,
                SKUResult:{

                }
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
                    this.payNum = this.paynum;
                }
            },
            'salesVolume':{
                handler(curVal,oldVal){
                    this.payNum = this.paynum;
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

        mounted() {
            this.goodsStandardImg = this.goodsImgSrc;
            this.salePrice = this.goodsPrice*1;
            this.salesVolume = -1;
            this.standardType = true;

            this.initSKU();
        },
        created(){
            this.picRidioList = this.picridiolist;
        },
        methods:{
            //点击事件
            canSelect(dom){
                var self = $(dom.currentTarget);
                var thtf = this;
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
                    var maxPrice = Math.max.apply(Math, prices);
                    var minPrice = Math.min.apply(Math, prices);
                    this.salePrice = maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice;
                    this.salesVolume = this.SKUResult[selectedIds.join(';')].count;
                    this.skuId = this.SKUResult[selectedIds.join(';')].productUnitId;
                    this.goodsStandardImg = this.SKUResult[selectedIds.join(';')].puPicUrl;
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
                            if(thtf.SKUResult[testAttrIds.join(';')].count <= 0) {
                                $(this).attr('disabled', 'disabled').removeClass('bh-sku-selected');
                            } else {
                                $(this).removeAttr('disabled');
                            }

                            console.log(testAttrIds)
                        }
                    });
                } else {
                    //设置默认价格
                    this.salesVolume = -1;
                    this.salePrice = this.goodsPrice;
                    //设置属性状态
                    $('.sku').each(function() {
                        thtf.SKUResult[$(this).attr('attr-id')] ? $(this).removeAttr('disabled').show() : $(this).attr('disabled', 'disabled').removeClass('bh-sku-selected').show();
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
                    this.SKUResult[key].count += sku.realStockNum;
                    this.SKUResult[key].prices.push(sku.salePrice);
                    this.SKUResult[key].puPicUrl = '';
                    this.SKUResult[key].name = '';
                    this.SKUResult[key].isVendible = '';
                    this.SKUResult[key].productUnitId = '';
                } else {
                    this.SKUResult[key] = {
                        count : sku.realStockNum,
                        prices : [sku.salePrice],
                        puPicUrl : '',
                        name : '',
                        isVendible : '',
                        productUnitId : ''
                    };
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
                        prices : [sku.salePrice],
                        puPicUrl : sku.puPicUrl,
                        name : sku.name,
                        isVendible : sku.isVendible,
                        productUnitId : sku.productUnitId
                    };
                }
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

                if(this.payNum<this.salesVolume){
                    this.payNum++;
                }else{
                    return;
                }
            },
            setReductPayNum(){

                if(this.payNum>1){
                    this.payNum--;
                }else{
                    return;
                }
            },
            handleClick(){
                if(this.disabled){
                    return;
                }
                if(this.goodsType==1){
                    this.$emit('setSkuID',[this.skuId,this.payNum,this.picRidioList]);
                }else if(this.goodsType==2){
                    this.$emit('setSkuID',[this.skuId,this.payNum,this.picRidioList]);
                    this.$emit('saveCartItem');
                }else{
                    this.$emit('setSkuID',[this.skuId,this.payNum]);
                    this.$emit('buy');
                }
            },

		}
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    #standard{
        position:relative;
        overflow: hidden;
        width:100%;
        .close{
            position:absolute;
            top:0;
            right:px(30px);
            i{
                color:#000;
                font-size:px(40px);
            }
        }
    }
    .standard{
        padding:px(20px) px(24px) px(100px) px(24px);
        overflow: auto;
        height:px(800px);
        img{
            display:inline-block;
            width:px(200px);
            height:px(200px);
             float:left;
             margin-right:px(20px);
        }

        .standard_title p{
            float:left;
            margin-top:px(56px);
            span{
                display:block;
                line-height:px(36px);
                font-size:px(26px);
            }
            b{
                line-height:px(50px);
                display:block;
                color:#ff8546;
                font-size:px(36px);
            }
        }
    }

    .standardList{
        padding:px(28px) 0;
        border-bottom:px(1px) solid #d4d4d4;
        h5{
            font-size:px(36px);
            color:#000;
        }
        .bh-sku-selected{
            color:#fff;
            background:#ff8546;
        }
    }

    .button{
        display:inline-block;
        border-radius: 3px;
        padding:0 px(32px);
        line-height:px(60px);
        font-size:px(28px);
        margin:0 px(10px);
        background:#F4f4f4;
        color:#323232;
    }
    .button:disabled{
        opacity:.6;
    }
    .num_btn{
        padding:px(28px) 0;
        border-bottom:px(1px) solid #d4d4d4;
        h5{
            font-size:px(36px);
            color:#000;
        }
        span{
            display:inline-block;
            text-align:center;
            width:px(80px);
            padding:0 px(20px);
            background:#F4f4f4;
            border-radius: 3px;
            line-height:px(60px);
            i{
                display:block;
                font-size:px(24px);
                color:#969696;
            }
        }
        b{
            display: inline-block;
            width:px(40px);
            font-size:px(28px);
            line-height:px(40px);
            text-align:center;
        }
        .disabled{
            opacity:0.6;
        }
    }
    .buy_btn{
        position:fixed;
        bottom:0;
        width:100%;
        line-height:px(100px);
        background:#ff8546;
        text-align:center;
        color:#fff;
        font-size:px(32px);

    }
    .buy_btn_disabled{
            opacity:0.6;
    }
</style>