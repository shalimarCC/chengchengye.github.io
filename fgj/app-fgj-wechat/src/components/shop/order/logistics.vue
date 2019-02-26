<template>
    <div id="logistics" v-if="logisticsShow">
        <div class="cell" @click="logisticesClick" v-if="logisticsData.length>1">
            <span class="cell_title">包裹{{index+1}}</span>
            <b>其他包裹<i class="iconfont icon-more"></i></b>
        </div>

        <div class="logisticsType" v-if="logisticsCheckData.deliveryStatus != 1">
            <h5>物流状态:
                        <span v-if="logisticsCheckData.deliveryStatus == 2">已发货</span>
                        <span v-else-if="logisticsCheckData.deliveryStatus == 3">已签收</span>
            </h5>
            <p>承运公司：{{logisticsCheckData.deliveryCompanyName}}</p>
            <p>运单编号：{{logisticsCheckData.waybillNum}}</p>
        </div>
        <div class="logisticsType1" v-else>
            <h5>订单正在分拣中，请耐心等候</h5>
        </div>
        <div class="order_goods clear" v-for="goods in logisticsCheckData.goodsList">
            <div class="goods_left">
                <img v-lazy="goods.puImg+'?imageMogr2/size-limit/100k!'">
            </div>
            <div class="goods_right">
                <div class="title">
                    <h4>{{goods.puName}}</h4><b>×{{goods.num}}</b>
                </div>
                <div class="goods_price">
                    <p>
                        <span>&yen;{{goods.price.toFixed(2)}}</span>
                    </p>
                </div>
            </div>
        </div>

        <div class="logistics_message">
            <ul v-if="logisticsCheckData.deliveryType != 1 && stepsList.length != 0">
                <li v-for="item in stepsList">
                    <i></i>
                    <p>{{item.remark}}</p>
                    <p>{{item.acceptTime}}</p>
                </li>
            </ul>
            <ul v-else>
                <li>
                    <i></i>
                    <p>尚未查到物流信息</p>
                </li>
            </ul>
        </div>

        <mt-popup
        v-model="popupVisible1" class="mint-popup-4" position="bottom">
            <div id="logisticsTable">
                <table>
                    <tr v-for="(item,key) in logisticsData">
                        <td :class="{'logistics_check':popIndex==key}" @click="popIndex=key">包裹{{key+1}}</td>
                    </tr>
                </table>
            </div>
            <div class="close_rate">
                <i class="iconfont icon-close" @click="popupVisible1=false"></i>
            </div>
            <div class="property_pop" @click="popupVisibleLogistics">
                确定
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import {packageBySoId,openDeliveryTrace} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    export default{

        data(){
            return {
                index:0,
                popIndex:0,
                logisticsData:[],
                logisticsCheckData:{},
                stepsList:[],
                logisticsShow:false,
                popupVisible1:false,
            }
        },
		components: {

        },
        watch:{
            index: {
                handler(curVal,oldVal){
                    this.logisticsCheckData = this.logisticsData[this.index];
                },
            }
        },
        created(){
            this.packageBySoId();
        },
        methods:{
            async packageBySoId() {
                try {
                    const res = await packageBySoId({orderCode:this.$route.params.id});
                    if (res.data.code == 0) {
                        this.logisticsData = res.data.data.packageList;
                        if(res.data.data.packageList.length != 0){

                            this.logisticsCheckData = res.data.data.packageList[this.index];
                            if(this.logisticsData[this.index].waybillNum!=null||this.logisticsData[this.index].shipCompanyCode!=null){
                                this.openDeliveryTrace();
                            }

                        }
                        this.logisticsShow = true;
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },

            async openDeliveryTrace() {
                try {
                    const res = await openDeliveryTrace({waybillNum:this.logisticsData[this.index].waybillNum,shipCompanyCode:this.logisticsData[this.index].shipCompanyCode});

                    Indicator.close();
                    if (res.data.code == 0) {
                        this.stepsList = res.data.data;
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },

            //选择包裹
            popupVisibleLogistics(){
                this.index = this.popIndex;
                this.logisticsCheckData = this.logisticsData[this.index];

                this.popupVisible1=false;
                Indicator.open();
                this.openDeliveryTrace();
            },

            ///打开弹框
            logisticesClick () {
                this.popupVisible1 = true;
                this.popIndex = this.index;
            }
        }
    }
</script>

<style lang="scss" scoped>

@import "../../../style/component/order/logistics.scss";

</style>
