<template>
    <div class="index page-loadmore-wrapper">
        <div class="card_input">
            <div class="card_input_box">
                <input type="number" placeholder="请输入手机号码" oninput="if(value.length>11)value=value.slice(0,11)" v-model="checkInfo.phoneNumber" />
            </div>
        </div>
        <div class="card_list">
            <h3>请选择购买的商品</h3>
            <ul>
                <li v-for="info in puAttNames" @click="checkCard(info)" :class="{'active' : checkInfo.productUnitId==info.productUnitId,'no_check' : info.realStockNum <= 0||info.status == 4}">
                    <h5>{{info.attValue}}</h5>
                    <p>售价：{{info.salePrice}}积分</p>
                </li>
            </ul>
            <p style="margin-bottom: 10px;line-height: 20px" >
              <span class="saleBycash" v-if="goodsData.buyType==2">仅支持现金购买</span>
            </p>
          <!--<div @click="putGoodsLimit" class="cell" v-if="goodsData.limitRule!=''&&goodsData.limitRule!=null">-->
          <div @click="putGoodsLimit" class="cell">
            <p>
              <span>促销</span>
              <span class="specifica_font"><b>限购</b>{{goodsData.limitRule}}</span>
            </p>
            <i class="iconfont icon-more"></i>
          </div>
        </div>

       <!-- <div class="card_num">
            <h3>选择数量</h3>
            <div>
                <span @click="setReductPayNum" :class="{disabled : payNum <= 1}"><i class="iconfont icon-jianhao"></i></span>
                <b>{{payNum}}</b>
                <span @click="setAddPayNum" :class="{disabled : checkInfo.productUnitId == ''}"><i class="iconfont icon-jiahao1"></i></span>
            </div>
        </div> -->

        <div class="card_bottom">
            <div class="pay_btn" @click="buy" :class="{disabled : this.goodsData.status != 3}">立即购买</div>
            <div class="prompt">
                <h5>温馨提示</h5>
                <p>月末月初为充值高峰，话费到账可能会延迟或失败。</p>
            </div>
        </div>
      <mt-popup
        v-model="popupVisibleLimit"
        position="bottom" class="mint-popup-4">
        <div class="popupBox">
          <div id="propertyLimit">
            <h4>促销</h4>
            <ul>
              <li v-for="item in limitRuleList">
                <b>限购</b>
                <p>{{item}}</p>
              </li>
            </ul>
          </div>
          <div class="close">
            <i class="iconfont icon-close" @click="closeGoodsLimit"></i>
          </div>
        </div>

      </mt-popup>
    </div>
</template>

<script>

    var myScroll=null;
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { findMerchantProdetails ,skuByMerchantProductId,startLimitRuleByStandardUnitId} from '../../../api/getData';
    export default{

        data(){
            return {
                payNum:1,
                goodsData:{},
                puList:{},
                puAttNames:[],
                checkInfo:{
                    realStockNum:1,
                    productUnitId:'',
                    phoneNumber:''
                },
              popupVisibleLimit:false,
              limitRuleList:''
            }
        },

		components: {

		},
        created() {
            this.findMerchantProdetails();
            this.skuByMerchantProductId();
        },
        methods:{
            //获取商品详情
            async findMerchantProdetails() {
                try {
                    Indicator.open();
                    const res = await findMerchantProdetails({standardUnitId:this.$route.params.id});
                    if (res.data.code == 0) {
                        Indicator.close();
                        this.goodsData = res.data.data;
                        this.$store.dispatch("setCardTitle",res.data.data.standardUnitName);
                    } else {
                        Indicator.close();
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                     this.cartType = false;
                     Indicator.close();
                }
            },
          //查看商品比价信息
          putGoodsLimit(){
            this.popupVisibleLimit = true;
          },

          //关闭商品比价信息
          closeGoodsLimit(){
            this.popupVisibleLimit = false;
          },
          //获取比价信息
          async startLimitRuleByStandardUnitId() {
            try {
              const res = await startLimitRuleByStandardUnitId({standardUnitId:this.$route.params.id,storeId:'1'});

              if (res.data.code == 0) {
                this.limitRuleList = res.data.data.limitRuleList;
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
                    const res = await skuByMerchantProductId({standardUnitId:this.$route.params.id});

                    if (res.data.code == 0) {
                        this.puList = res.data.data.pu;
                        this.puAttNames = res.data.data.puAttNames[0].attValue;
                        var thtf = this;
                        $.each(this.puAttNames,function(key,info){
                            info.isVendible = thtf.puList[info.attValueId].isVendible;
                            info.productUnitId = thtf.puList[info.attValueId].productUnitId;
                            info.realStockNum = thtf.puList[info.attValueId].realStockNum;
                            info.salePrice = thtf.puList[info.attValueId].salePrice;
                        })
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },
            //增减数量
            setAddPayNum(){

                if(this.payNum<this.checkInfo.realStockNum){
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

            checkCard(obj){
                if(obj.realStockNum > 0 && obj.status == 3){
                    this.checkInfo.productUnitId = obj.productUnitId;
                }else{
                    return;
                }
            },

            //立即购买
            buy(){
                if(this.goodsData.status == 3){
                    if(this.checkInfo.productUnitId==""){
                        Toast('请选择面值');
                    }else if(!/(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.checkInfo.phoneNumber)){
                        Toast('请输入正确的手机号码');
                    }else{
                        var obj = new Object;
                        obj.puId = this.checkInfo.productUnitId;
                        obj.num = this.payNum;
                        obj.phone = this.checkInfo.phoneNumber;
                        obj.type = 0;
                        this.$store.dispatch("setSkuObj",obj);
                        this.$router.push({path: '/shop/orderConfim'});
                    }
                }else{
                   return;
               }
            }

		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/card/card.scss";
</style>
