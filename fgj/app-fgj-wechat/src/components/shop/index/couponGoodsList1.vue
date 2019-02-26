<template>
    <div class="goodsList">


        <div class="effectTimeRange" v-if="effectTimeRange && effectTimeRange!=''" v-show="timeShow">
            <span>优惠券有效期为:{{effectTimeRange}}</span><i @click="closeTime()"></i>
        </div>

        <div class="goods" ref="goods_list" :style="'height:'+listHeight+'px;'" v-if="goodsType || goodsList.length > 0">
            <ul
            class="list2"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="goodsloading"
            infinite-scroll-distance="30">
                <li v-for="goods in goodsList" class="page-loadmore-listitem clear">
                    <div class="goods_box" >
                        <img v-lazy="goods.pictureUrl+'?imageMogr2/size-limit/500k!'">
                        <div class="noProduct" v-if="goods.status!=3">
                          <span>商品已下架</span>
                        </div>
                        <div class="noProduct" v-if="!goods.stockNum||goods.stockNum <= 0">
                          <span>库存不足</span>
                        </div>
                        <div class="logo logo1" v-show="goods.saleWay==4"></div>
                        <div class="logo logo2" v-show="goods.saleWay==6"></div>
                        <h6><span class="operateByown" v-if="goods.isOwnMerchant">自营</span>{{goods.name}}</h6>
                        <p :class="[(goods.status!=3)||(!goods.stockNum||goods.stockNum <= 0)?'disabled':'btn']" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId,goods.status,goods.stockNum)">立即兑换</p>
                    </div>
                </li>
            </ul>
        </div>
      <div class="error" v-if="goodsList.length==0">
        <img src="../../../../static/assets/img/error/goods.png" alt="">
        <p>商品正在上架中</p>
      </div>
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
                    couponUnitId:''
                },
                goodsList:[],
                goodsloading:false,
                listType:true,
                popupVisible:false,
                listHeight:0,
                goodsType:true,
                categoryId:0,
                standardUnitCombinationId:'',
                moreGoods: 0,
                storeId:'',
                effectTimeRange:'',
                timeShow: true,
                couponId:''
            }
        },
        watch:{
        },
        created(){
            console.log(this.$route.params.couponId)
            console.log(this.$store.state.couponId)
            this.effectTimeRange = this.$store.state.Cookie.mutations.fetch('effectTimeRange');
            this.storeId = this.$store.state.Cookie.mutations.fetch('storeId');
            this.goodsObj.type = this.$route.params.type;
            this.goodsObj.couponUnitId = this.$route.params.couponId;
            if(this.goodsObj.type == 1){
                this.goodsObj.categoryTreeNodeId = this.$route.params.id;
            }else if(this.goodsObj.type == 2){
                this.goodsObj.standardUnitCombinationId = this.$route.params.id;
            }
            if(this.storeId){this.goodsObj.storeId = this.storeId;}
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
                this.goodsloading = true;
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
                            this.moreGoods = 0;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                        }else{
                            this.goodsObj.pageNo++;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                            this.moreGoods = 1;
                        }
                        if(this.moreGoods == 1){
                            this.goodsloading = false;
                        }
                    } else {
                        this.goodsType = false;
                        Indicator.close();
                    }
                } catch (err) {
                    Toast('网络错误');
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
            goodsSkip(id,type,status,stockNum){
                if((status!=3)||(!stockNum||stockNum <= 0)){
                  return
                }
                if(type==1){
                    this.$router.push('/card/'+id);
                }else if(type==2){
                    this.$router.push('/shop/goods/1/'+id);
                }else if(type==3){
                    this.$router.push('/shop/goods2/1/'+id);
                }else if(type==4){
                    this.$router.push('/moreCredit/'+id);
                }else if(type==6){
                    this.$router.push('/card/'+id);
                }else if(type==7){
                    this.$router.push('/shop/goods/1/'+id);
                }else if(type==8){
                    this.$router.push('/shop/goods2/1/'+id);
                }else if(type==9){
                    this.$router.push('/moreCredit/'+id);
                }
            },

            closeTime(){
                this.timeShow=false;
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
        .active{
            span{
                color:#ff8546;
            }
            i{
                color:#ff8546;
            }
        }
    }

    .effectTimeRange{
        height: px(70px);
        width: px(750px);
        background: #fdeed4;
        span{
            margin-left: px(24px);
            line-height: px(70px);
            font-size: px(26px);
            color: #ff8546;
            vertical-align: top;
        }
        i {
            float: right;
            margin-right: px(24px);
            margin-top: px(14px);
            width: px(42px);
            height: px(42px);
            background: url(../../../../static/assets/img/close@2x.png);
            background-size: 100%;
        }
    }
    .noProduct{
      width:100%;
      height: px(60px);
      background: rgba(0,0,0,0.3);
      color: #fff;
      z-index: 999;
      position: absolute;
      top: px(285px);
      font-size: px(26px);
      text-align: center;
      line-height: px(60px);
    }

</style>
