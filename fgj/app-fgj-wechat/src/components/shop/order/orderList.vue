<template>
    <div id="order_list">
        <ul
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <li v-for="order in orderData">
                    <router-link :to="'/shop/orderDatails/'+order.orderCode">
                        <div class="order_head">
                            <p>订单编号：{{order.orderCode}}</p>
                            <span v-if="order.orderStatus==0">待付款</span>
                            <span v-else-if="order.orderStatus==1">已付款</span>
                            <span v-else-if="order.orderStatus==2">已发货</span>
                            <span v-else-if="order.orderStatus==4">已完成</span>
                            <span v-else-if="order.orderStatus==10">已取消</span>
                        </div>

                        <div class="order_goods clear" v-for="goods in order.goodsList">
                            <div class="goods_left">
                                <img v-lazy="goods.puImg+'?imageMogr2/size-limit/100k!'">
                            </div>
                            <div class="goods_right">
                                <div class="title">
                                    <h4><span class="operateByown" v-if="goods.isOwnMerchant">自营</span>{{goods.puName}}</h4><b>×{{goods.num}}</b>
                                </div>
                                <div class="goods_price" v-if="order.couponType!=1">
                                    <p>
                                        <span>&yen;{{goods.price.toFixed(2)}}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <div class="allGoods" v-if="order.couponType!=1">
                        <b>共{{order.goodsAccount}}件商品</b>
                        <span>合计:&yen{{order.orderAmount.toFixed(2)}}</span>
                    </div>
                    <div class="allGoods" v-if="order.couponType==1">
                      <span>兑换券购买</span>
                    </div>

                    <div class="orderBtn">
                        <div v-if="order.operateStatus == 0">
                            <mt-button size="small" plain @click.native="unfreezeSoFubi(order.orderCode)" class="parm_btn">取消订单</mt-button>
                            <mt-button size="small" plain type="danger" @click.native="createOrder(order.orderCode,0)" class="danger_btn">其它支付</mt-button>
                            <mt-button size="small" plain type="danger" @click.native="createOrder(order.orderCode,1)" class="danger_btn">积分支付</mt-button>
                        </div>

                        <div v-if="order.operateStatus == 1">
                            <mt-button size="small" plain @click.native="unfreezeSoFubi(order.orderCode)" class="parm_btn">取消订单</mt-button>
                        </div>

                        <div v-if="order.operateStatus == 2">
                            <mt-button size="small" plain v-if="!order.unitExist" @click.native="logistics(order.orderCode)" class="parm_btn">查看物流</mt-button>
                            <mt-button size="small" plain type="danger" @click.native="affirmOrderBySoId(order.orderCode)" class="parm_btn">确认收货</mt-button>
                        </div>

                        <div v-if="order.operateStatus == 3">
                            <mt-button size="small" plain @click.native="deleteBySoId(order.orderCode)" class="parm_btn">删除订单</mt-button>
                            <mt-button size="small" plain v-if="!order.unitExist" @click.native="logistics(order.orderCode)" class="parm_btn">查看物流</mt-button>
                        </div>

                        <div v-if="order.operateStatus == 4">
                            <mt-button size="small" plain @click.native="deleteBySoId(order.orderCode)" class="parm_btn">删除订单</mt-button>
                        </div>

                        <div v-if="order.operateStatus == 6">
                            <mt-button size="small" plain @click.native="deleteBySoId(order.orderCode)" class="parm_btn">删除订单</mt-button>
                            <mt-button size="small" plain @click.native="checkCoupon(order.exchangeCouponType)" class="parm_btn checkCoupon">查看优惠券</mt-button>
                        </div>
                      <div v-if="order.operateStatus == 7">
                        <mt-button size="small" plain @click.native="unfreezeSoFubi(order.orderCode)" class="parm_btn">取消订单</mt-button>
                        <mt-button size="small" plain type="danger" @click.native="createOrder(order.orderCode,0)" class="danger_btn">其它支付</mt-button>
                      </div>
                    </div>
            </li>
        </ul>
    </div>

</template>

<script>
    import {orderDetail,cashPayCancel,unfreezeSoFubi,deleteBySoId,affirmOrderBySoId,findAwaitQueueByOrderCode,standardOrderQueryAtPayInvoke,standardPayCancle} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { payUrl } from '../../../config/env'
    export default{
        props:{
            orderData: {
                type: Array,
                default: function () {
                    return []
                }
            },
            loading: {
                type: Boolean,
                default: function () {
                    return ''
                }
            },
            navCheck: {
                type: Number,
                default: function () {
                    return ''
                }
            },
        },
        data(){
            return {
                orderCode:'',
                objData:''
            }
        },
        watch:{

        },
        created(){
        },
        methods:{

            loadMore(){
                this.$emit('findOrderByUserAndStatus');
            },
            //取消订单
            unfreezeSoFubi(id){
                MessageBox.confirm('确定要取消订单吗?').then(action => {
                    this.orderDetail(id);
                    this.cacelOrderAjax(id)
                },() => {

                });
            },
            checkCoupon(type){
                this.$store.state.Cookie.mutations.save(type,'navCheck');
                this.$router.push('/coupon')
            },
            async orderDetail(id) {
                try {
                    const res = await orderDetail({orderCode:id});
                        if (res.data.code == 0) {
                            this.objData = res.data.data;
                        }else {
                            Toast(res.data.error);
                        }
                } catch (err) {
                    Toast('网络错误');
                }
            },
            async cacelOrderAjax(id) {
                try {
                    const res = await unfreezeSoFubi({orderCode:id});
                    if (res.data.code == 0) {
                        if(this.objData.orderInfo.orderPayStatus==1 && this.objData.orderInfo.couponType!=1){
                            MessageBox.alert('已支付积分与现金将原路返还到您的账户，现金预计3个工作日内到账，请您注意查收。','').then(action => {
                                this.$emit('navClick',this.navCheck);
                            });
                        } else {
                            MessageBox('', '订单已取消').then(action => {
                                this.$emit('navClick',this.navCheck);
                            });
                        }
                        // MessageBox.alert('已支付积分与现金将原路返还到您的账户，现金预计3个工作日内到账，请您注意查收。','').then(action => {
                        //     this.$emit('navClick',this.navCheck);
                        // });

                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },

            //删除订单
            deleteBySoId(id){
                MessageBox.confirm('确定要删除订单吗?').then(action => {
                    this.deleteBySoIdAjax(id)
                },() => {

                });
            },
            async deleteBySoIdAjax(id) {
                try {
                    const res = await deleteBySoId({orderCode:id});
                    if (res.data.code == 0) {
                        Toast("删除订单成功");
                        this.$emit('navClick',this.navCheck);
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
              //确认收货
            affirmOrderBySoId(id){
                MessageBox.confirm('确定执行此操作?').then(action => {
                    this.affirmOrderBySoIdAjax(id)
                },() => {

                });
            },
            async affirmOrderBySoIdAjax(id) {
                try {
                    const res = await affirmOrderBySoId({orderCode:id});
                    if (res.data.code == 0) {
                        Toast("确认收货成功");
                        this.$emit('navClick',this.navCheck);
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            async cashPayCancel(id,type) {
              try {
                const res = await cashPayCancel({orderCode:id});
                if (res.data.code == 0) {
                  this.createOrder(id,type);
                } else {
                  Toast(res.data.error);
                }
              } catch (err) {
                Toast('网络错误');
              }
            },
            //去支付
            async createOrder(orderCode,type) {
                try {
                    this.orderCode = orderCode;
                    const res = await standardOrderQueryAtPayInvoke({orderCode:orderCode});
                    if (res.data.code == 0) {
                      let obj = new Object();
                      obj.needPayCash = res.data.data.needPayCash;
                      obj.orderAmount = res.data.data.orderAmount;
                      obj.fubiBalance = res.data.data.fubiBalance;
                      obj.goodsAccount = res.data.data.goodsAccount;

                      this.$store.dispatch("setOrderInfo",obj);
                        if(type == 0){
                          this.$store.state.Cookie.mutations.save(1,'orderType');
                            this.$router.push("/shop/pay/"+orderCode)
                        }else if(type == 1){
                          this.$store.state.Cookie.mutations.save(res.data.data.fubiBalance,'fubiPay');
                            if(res.data.data.fubiBalance>0){
                                this.orderCode = orderCode;
                                this.$emit('openPopop');
                            }else{
                              Toast('无可用积分，请选择其他支付方式');
                              this.$store.state.Cookie.mutations.save(1,'orderType');
                              this.$router.push("/shop/pay/"+orderCode)
                            }
                        }

                    }else if(res.data.code == 180){
                        MessageBox({
                            title: '',
                            message: '订单正在处理中，是否继续等待？',
                            showCancelButton: true,
                            confirmButtonText: '取消支付',
                            cancelButtonText: '继续等待',
                        }).then(action => {
                            if(action=='cancel'){
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            }else{
                                this.standardPayCancle(0);
                            }
                        });
                    }else if(res.data.code == 181){
                        MessageBox('', '订单已经支付成功').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                        });
                    }else if(res.data.code == 182){
                        MessageBox('', '订单已取消').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                        });
                    }else if(res.data.code == 183){
                        MessageBox('', '订单已退款').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                        });
                    }else if(res.data.code == 184){
                        MessageBox('', '支付超时，订单已取消').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                        });
                    }else if(res.data.code == 502){
                      MessageBox({
                        title: '',
                        message: res.data.error,
                        showCancelButton: true,
                        confirmButtonText: '取消',
                        cancelButtonText: '解锁',
                      }).then(action => {
                        if(action=='cancel'){
                          this.standardPayCancle(1,type);
                        }else{
                          this.$router.push('/shop/orderDatails/'+this.orderCode);
                        }
                      });
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }


            },
            //放弃支付
            async standardPayCancle(type,payType) {
                try {
                    const res = await standardPayCancle({orderCode:this.orderCode,cancelType:type});
                    if (res.data.code == 0) {
                      this.createOrder(this.orderCode,payType);
                    }else if(res.data.code == 501){
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                        window.location.reload()
                      });
                    } else {
                      MessageBox('', res.data.error).then(action => {
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
                        window.location.reload()
                      });
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            //查看物流
            logistics(id) {
                this.$router.push("/shop/logistics/"+id)
            },

        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/order/orderList.scss";
</style>
