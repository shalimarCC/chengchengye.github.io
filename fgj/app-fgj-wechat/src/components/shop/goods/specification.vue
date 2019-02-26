<template>
<div v-if="standardType" id="standard">
    <div class="standard">
        <div class='clear standard_title'>
            <img v-if="goodsStandardImg!=null" :src="goodsStandardImg+'?imageMogr2/size-limit/100k!'">
            <img v-else src="../../../../static/assets/img/goods_error.png">
            <p>
                <b v-if="buyType==0">{{salePrice.toFixed(2)}} <i class="fubi">积分</i></b>
                <span v-if="salesVolume==-1">请选择规格数量</span>
                <span v-else>库存{{salesVolume}}件</span>
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
        <div class="num_btn">
            <h5>数量</h5>
            <p>
                <span @click="setReductPayNum" :class="{disabled : payNum <= 1}"><i class="iconfont icon-jianhao"></i></span>
                <b>{{payNum}}</b>
                <span @click="setAddPayNum"><i class="iconfont icon-jiahao1"></i></span>
            </p>
        </div>
    </div>

    <div class="buy_btn_box">
        <div class="buy_btn" v-if="goodsType==2 || goodsType==3" v-show="buyType==0":class="{'buy_btn_disabled':disabled}" @click="handleClick">
            确定
        </div>
        <div class="buy_btn" v-if="goodsType==2 || goodsType==3" v-show="buyType==1" @click="handleClick">
          立即兑换
        </div>
    </div>

    <div id="goods_bottom" v-if="goodsType==1" v-show="buyType==0">
        <!--<div id="noGoods" v-if="goodsStatus!=3"><span>商品已经下架了</span></div>-->
        <div id="pay" :class="{'buy_btn_disabled':goodsStatus !=3}" @click="buy">立即购买</div>
        <div id="join_shopcat" :class="{'buy_btn_disabled':goodsStatus !=3}"  @click="joinShopcat">加入购物车</div>
    </div>
    <div id="goods_bottom" v-if="goodsType==1" v-show="buyType==1">
        <!--<div id="noGoods" v-if="goodsStatus!=3"><span>商品已经下架了</span></div>-->
        <div id="pay" :class="{'buy_btn_disabled':goodsStatus !=3}" @click="buy" style="width:100%;background:#ff5400;">立即兑换</div>
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
    import {
      orderConfirm,
      saveCartItem,
      findCartItemSumByUserId,
      queryCouponIsEffected
    } from '../../../api/getData';
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
                type: Number,
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
                type: Number,
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
                skuId:'',
                payNum:1,
                standardType:false,
                SKUResult:{
                },
                couponUnitId:''
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
              this.$store.dispatch("setInvoiceForm",-1);
                if(this.disabled){
                    return;
                }
                if(this.buyType==0){
                    if(this.goodsType==1){
                      this.$emit('setSkuID',[this.skuId,this.payNum,this.picRidio]);
                    }else if(this.goodsType==2){
                      this.joinShopcat();
                    }else{
                      this.buy();
                    }
                } else if(this.buyType==1){
                    this.buy();
                }
            },
            //加入购物车
            joinShopcat(){
                this.$store.state.Cookie.mutations.save(this.$route.params.buyType,'buyType');
                if(this.goodsStatus == 3){
                    if(this.skuId!="" && this.payNum!=""){
                        this.saveCartItem();
                    }else{
                        Toast('请选择商品规格');
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
                        this.findCartItemSumByUserId();
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
                    this.closeGoodsProperty();
                } catch (err) {
                     Toast('网络错误');

                }
            },
            async findCartItemSumByUserId() {
                try {
                    const res = await findCartItemSumByUserId();

                    if (res.data.code == 0) {
                        this.$store.dispatch("setShopCartNum",res.data.data);
                    } else {

                    }

                } catch (err) {

                }
            },
            //校验兑换券有效性
            async queryCouponIsEffected() {
              try {
                const res = await queryCouponIsEffected({couponUnitId:this.$store.state.Cookie.mutations.fetch('typeID'),puId:this.skuId,suId:this.$route.params.goodsId,storeId:1,type:3});
                if (res.data.code == 0) {
                  this.orderConfirm()
                } else if(res.data.code ==190||res.data.code ==191||res.data.code ==131){
                  MessageBox('提示', res.data.error).then(action => {
                    window.location.reload()
                  });
                }else{
                  MessageBox('提示', res.data.error).then(action => {
                    window.location.reload()
                  });
                }
              } catch (err) {
                Toast(err)
              }
            },
            //立即购买
            buy(){
                this.$store.state.Cookie.mutations.save(0,'isElecGoods');
                this.$store.state.Cookie.mutations.save(1,'orderType');
                this.$store.state.Cookie.mutations.save(this.$route.params.goodsId,'goodsId');
                this.$store.state.Cookie.mutations.save(this.$route.params.buyType,'buyType');
                if(this.goodsStatus == 3){
                    if(this.skuId!="" && this.payNum!=""){
                        var obj = new Object;
                        obj.puId = this.skuId;
                        obj.num = this.payNum;
                        obj.type = 0;
                        obj.storeId = 1;
                        this.$store.dispatch("setSiteId",0);
                        this.$store.dispatch("setInvoiceId",0);
                        this.$store.dispatch("setInvoiceType",'');
                        if(this.$store.state.Cookie.mutations.fetch('buyType')==1){
                          obj.couponType = 1;
                          obj.couponUnitId = this.$store.state.Cookie.mutations.fetch('typeID');
                          this.$store.dispatch("setSkuObj",obj);
                          this.queryCouponIsEffected(this.$store.state.Cookie.mutations.fetch('typeID'));
                        }else{
                          this.$store.dispatch("setSkuObj",obj);
                          this.orderConfirm()
                        }
                    }else{
                        Toast('请选择商品规格');
                    }
                }else{
                    return;
                }

            },
            async orderConfirm() {
                try {
                    var obj = JSON.parse(JSON.stringify(this.$store.state.skuObj));
                    if(this.isDetailStore!=0){
                        obj.addrId = this.$store.state.siteId;
                    }
                    const res = await orderConfirm(obj);
                    if (res.data.code == 0) {
                        Indicator.close();
                        if(this.buyType==0){
                          // this.$store.state.Cookie.mutations.save('','type');
                          this.$router.push({path: '/shop/orderConfim'});
                        }else if(this.buyType==1){
                          // this.$store.state.Cookie.mutations.save('','type');
                          this.$router.push({path: '/shop/orderConfim2'});
                        }
                    }else if(res.data.code==190||res.data.code==191||res.data.code==192){
                      MessageBox('', res.data.error).then(action => {
                        window.location.reload()
                      });
                    }else{
                      Indicator.close();
                      MessageBox('提示', res.data.error).then(action => {
                        window.location.reload()
                      });
                    }
                    this.loading=false;
                } catch (err) {
                    Indicator.close();
                    Toast('网络错误');
                }
            },

		}
    }
</script>

<style lang="scss" scoped>
    @import "../../../style/component/goods/specification.scss";

</style>
