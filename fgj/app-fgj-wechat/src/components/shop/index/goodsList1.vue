<template>
    <div class="goodsList">
        <ul class="nav">
            <li :class="{active:goodsObj.orderByType == 1}" @click="checkSale">
                <span>销量</span>
            </li>
            <li class="price" :class="{active:goodsObj.orderByType == 2}" @click="checkPrice">
                <span>价格</span>
                <b class="price_top" v-if="goodsObj.orderByType == 2&&goodsObj.sortRegulation==1"></b>
                <b class="price_bottom" v-else-if="goodsObj.orderByType == 2&&goodsObj.sortRegulation==2"></b>
                <b class="price" v-else></b>
            </li>
            <li class="list" :class="{active:goodsObj.orderByType == 2}" @click="checkList">
                <b class="list_check" v-if="listType"></b>
                <b class="list_check_out" v-else-if="!listType"></b>
            </li>
            <li class="screen" @click="checkScreen" :class="{active:goodsObj.fubiPay == 1||goodsObj.saleWay == 7}">
                <span>筛选</span>
                <b class="screen_check" v-if="goodsObj.fubiPay == 1||goodsObj.saleWay == 7"></b>
                <b class="screen_check_out" v-else></b>
            </li>
        </ul>

        <div class="goods" ref="goods_list" :style="'height:'+listHeight+'px;'" v-if="goodsType || goodsList.length > 0">
            <ul
            class="list1"
            v-if="listType"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="goodsloading"
            infinite-scroll-distance="10">
                <li v-for="goods in goodsList" class="page-loadmore-listitem clear">

                    <div class="goods_box" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId)">
                        <div class="goods_left">
                            <img v-lazy="goods.pictureUrl+'?imageMogr2/size-limit/500k!'">
                            <div class="logo logo1" v-show="goods.saleWay==4"></div>
                            <div class="logo logo2" v-show="goods.saleWay==6"></div>
                        </div>
                        <div class="goods_right">
                            <h6><span class="operateByown" v-if="goods.isOwnMerchant">自营</span>{{goods.name}}</h6>
                            <p>{{goods.salePrice.toFixed(2)}} <span class="fubi">积分</span></p>
                            <del>&yen;{{goods.marketPrice.toFixed(2)}}</del>
                            <span v-if="(goods.stockNum<=goods.stockWarning)&&(goods.stockNum>0)" class="shortStock">库存紧张</span>
                            <span v-if="!goods.stockNum||goods.stockNum <= 0" class="shortStock">售完</span>
                        </div>
                    </div>
                </li>
            </ul>

            <ul
            class="list2"
            v-else
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="goodsloading"
            infinite-scroll-distance="10">
                <li v-for="goods in goodsList" class="page-loadmore-listitem clear">

                    <div class="goods_box" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId)">
                        <img v-lazy="goods.pictureUrl+'?imageMogr2/size-limit/500k!'">
                        <div class="logo logo1" v-show="goods.saleWay==4"></div>
                        <div class="logo logo2" v-show="goods.saleWay==6"></div>
                        <h6><span class="operateByown" v-if="goods.isOwnMerchant">自营</span>{{goods.name}}</h6>
                        <p>{{goods.salePrice.toFixed(2)}} <span class="fubi">积分</span></p>
                        <del>&yen;{{goods.marketPrice.toFixed(2)}}</del>
                        <span v-if="(goods.stockNum<=goods.stockWarning)&&(goods.stockNum>0)" class="shortStock">库存紧张</span>
                        <span v-if="!goods.stockNum||goods.stockNum <= 0" class="shortStock">售完</span>
                    </div>
                </li>
            </ul>
        </div>

        <div class="error" v-else>
            <img src="../../../../static/assets/img/goodsList_error.png" alt="">
            <p>暂时没有商品</p>
        </div>

        <mt-popup
        v-model="popupVisible"
        pop-transition="popup-fade">
            <div class="pop"  @click="checkFubipay" :class="{active:goodsObj.fubiPay == 1}">
                <i :class="{'icon-round':this.goodsObj.fubiPay==0,'icon-roundcheckfill':this.goodsObj.fubiPay==1}" class="iconfont"></i>
                <span>低于积分余额</span>
            </div>
            <div class="pop"  @click="checkPresale" :class="{active:goodsObj.saleWay == 7}">
              <i :class="{'icon-round':goodsObj.saleWay==0,'icon-roundcheckfill':goodsObj.saleWay==7}" class="iconfont"></i>
              <span>预售</span>
            </div>
            <div class="pop"  @click="checkBuytype" :class="{active:goodsObj.buyType == 2}">
              <i :class="{'icon-round':goodsObj.buyType==0,'icon-roundcheckfill':goodsObj.buyType==2}" class="iconfont"></i>
              <span>现金购买商品</span>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { findByCategoryTreeNodeIdOrSUC } from '../../../api/getData';
    export default{
        data(){
            return {
                goodsObj:{
                    standardUnitCombinationId:'',
                    categoryTreeNodeId:'',
                    fubiPay:0,
                    orderByType:0,
                    sortRegulation:0,
                    type:1,
                    pageNo:1,
                    pageSize:10,
                    saleWay:0,
                    buyType:0
                },
                goodsList:[],
                goodsloading:false,
                listType:true,
                popupVisible:false,
                listHeight:0,
                goodsType:true,
                categoryId:0,
                standardUnitCombinationId:''
            }
        },
        watch:{
        },
        created(){
            this.goodsObj.type = this.$route.params.type;
            this.goodsObj.storeId = '1';
            if(this.goodsObj.type == 1){
                this.goodsObj.categoryTreeNodeId = this.$route.params.id;
            }else if(this.goodsObj.type == 2){
                this.goodsObj.standardUnitCombinationId = this.$route.params.id;
            }

        },
        mounted() {
            this.listHeight = document.documentElement.clientHeight - this.$refs.goods_list.getBoundingClientRect().top;
            //this.findByCategoryTreeNodeIdOrSUC();
        },
        methods:{
            loadMore(){
                if(this.goodsObj.standardUnitCombinationId==''&&this.goodsObj.categoryId==''){
                    return;
                }
                this.findByCategoryTreeNodeIdOrSUC();
                Indicator.open();
            },
            async findByCategoryTreeNodeIdOrSUC() {
                try {
                    const obj = new Object();
                    $.each(this.goodsObj, function (key, info) {
                        if (info !== "") {
                            obj[key] = info;
                        }
                    })
                    const res = await findByCategoryTreeNodeIdOrSUC(obj);
                    if (res.data.code == 0) {
                        this.goodsType = true;
                        Indicator.close();
                        if(res.data.data.list.length == 0){
                            this.goodsType = false;
                            this.goodsloading = true;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                        }else{
                            this.goodsObj.pageNo++;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                        }
                    } else {
                        this.goodsType = false;
                        Indicator.close();
                    }
                } catch (err) {
                    Toast('网络错误');
                }
            },
            goodsSkip(id,type){
                if(type==1){
                  this.$router.push('/card/'+id);
                }else if(type==2){
                  this.$router.push('/shop/goods/0/'+id);
                }else if(type==3){
                  this.$router.push('/shop/goods2/0/'+id);
                }else if(type==4){
                  this.$router.push('/moreCredit/'+id);
                }else if(type==6){
                  this.$router.push('/card/'+id);
                }else if(type==7){
                  this.$router.push('/shop/goods/0/'+id);
                }else if(type==8){
                  this.$router.push('/shop/goods2/0/'+id);
                }else if(type==9){
                  this.$router.push('/moreCredit/'+id);
                }


            },
            //销量排序
            checkSale(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.orderByType = this.goodsObj.orderByType==1 ? 0:1;
                this.findByCategoryTreeNodeIdOrSUC();
            },
            //价格排序
            checkPrice(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.orderByType = this.goodsObj.orderByType==2&&this.goodsObj.sortRegulation==2 ? 0:2;
                if(this.goodsObj.sortRegulation==0){
                    this.goodsObj.sortRegulation=1
                }else if(this.goodsObj.sortRegulation==1){
                    this.goodsObj.sortRegulation=2
                }else if(this.goodsObj.sortRegulation==2){
                    this.goodsObj.sortRegulation=0
                }
                this.findByCategoryTreeNodeIdOrSUC();
            },
            //切换显示方式
            checkList(){
                this.listType = !this.listType;
            },
            checkScreen(){
                this.popupVisible = true;
            },
            checkFubipay(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.fubiPay = this.goodsObj.fubiPay==1 ? 0:1;
                this.popupVisible = false;
                this.findByCategoryTreeNodeIdOrSUC();
            },
            checkPresale(){
              this.goodsList = [];
              this.goodsObj.pageNo = 1;
              this.goodsObj.saleWay = this.goodsObj.saleWay==7 ? 0:7;
              this.popupVisible = false;
              this.findByCategoryTreeNodeIdOrSUC();
            },
            //筛选现金购买方式
            checkBuytype(){
              this.goodsList = [];
              this.goodsObj.pageNo = 1;
              this.goodsObj.buyType = this.goodsObj.buyType==2 ? 0:2;
              this.popupVisible = false;
              this.findByCategoryTreeNodeIdOrSUC();
            },

		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/index/goodsList.scss";
$baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    .mint-popup{
        left:77%;
        top:20%;
        border-radius: 8px;
        .pop{
            display: flex;
            display: -webkit-flex; /* Safari */
            align-items:center;
            width:px(220px);
            height:px(100px);
            border-bottom: 1px solid #f4f4f4;
            span{
                font-size:px(24px);
                color:#323232;
            }
            i{
                margin:0 px(8px);
            }
        }
        .pop:last-child{
           border-bottom: none;
        }
        .active{
            span{
                color:#ff8546;
            }
            i{
                color:#ff8546;
            }
        }
    }
</style>
