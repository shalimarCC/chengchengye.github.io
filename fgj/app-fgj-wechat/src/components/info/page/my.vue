<template>
    <div id="my" :style="'height:'+height+'px'">
        <div class="head">
            <div class="btn">
                <b class="set" @click="setUserInfo"></b>
                <b class="msg" @click="seeMsg"><span class="circle" v-if="isMsg"></span></b>
            </div>

            <div class="info">
                <div class="head_img">
                    <img v-if="userInfo.headPicUrl!=null" :src="userInfo.headPicUrl" />
                    <img v-else src="../../../../static/assets/img/my/head_error.png" />
                </div>

                <div class="user_info">
                    <p class="username" @click="userinfoClick">
                        <span>{{userInfo.name}}</span><b></b>
                    </p>
                    <p class="companyname">{{userInfo.companyName}}</p>
                  <div class="vip">
                    <div class="membership" v-show="memberShip1||memberShip2">
                      <img v-show="memberShip1" class="membershipLogo" src="../../../../static/assets/img/my/VIP@2x.png" />
                      <img v-show="memberShip2" class="membershipLogo" src="../../../../static/assets/img/my/companyVIP@2x.png" />
                    </div>
                    <div class="authority">
                      <span class="authorityLogo" v-for="item in authorityNames">{{item}}</span>
                    </div>
                  </div>
                </div>
            </div>
        </div>

        <div class="asset" v-if="balanceShow">
            <div class="cell cell_border">
                <span class="cell_title"><b></b>资产</span>
            </div>
            <div class="asste_tab">
                <ul>
                    <li>
                        <router-link :to="'/assets/fubiAssets/'+userAsset.fb.accountId">
                            <h6>{{userAsset.fb.balance.toFixed(2)}}</h6>
                            <p>积分余额</p>
                        </router-link>
                    </li>

                    <li>
                        <router-link :to="'/assets/scoreAssets/'+userAsset.pp.accountId">
                            <h6>{{userAsset.pp.balance.toFixed(2)}}</h6>
                            <p>点赞积分</p>
                        </router-link>
                    </li>

                    <li>
                        <router-link :to="'/assets/moneyAssets/'+userAsset.cp.accountId">
                            <h6>{{userAsset.cp.balance.toFixed(2)}}</h6>
                            <p>现金支出</p>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>

        <div class="cell_list">
            <div class="order cell_border">
                <router-link to="/shop/order"  class="cell">
                    <span class="cell_title"><b></b>我的订单</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div>
            <!--<div class="insurance cell_border">-->
              <!--<router-link to="/insuranceOrder"  class="cell">-->
                <!--<span class="cell_title"><b></b>保险订单</span>-->
                <!--<i class="iconfont icon-more"></i>-->
              <!--</router-link>-->
            <!--</div>-->
            <div class="bodyCheck cell_border">
              <router-link to="/bodyCheck"  class="cell">
                <span class="cell_title"><b></b>我的体检</span>
                <i class="iconfont icon-more"></i>
              </router-link>
            </div>
            <div class="ticket cell_border" style="border-bottom: 10px solid #f5f5f5">
                <router-link to="/coupon"  class="cell">
                    <span class="cell_title"><b></b>我的优惠券</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div>
            <!--<div class="ticket">-->
                <!--<router-link to="/shop/orderInvoice"  class="cell">-->
                    <!--<span class="cell_title"><b></b>我的优惠券</span>-->
                    <!--<i class="iconfont icon-more"></i>-->
                <!--</router-link>-->
            <!--</div>-->
            <div class="site cell_border">
                <router-link to="/shop/site"  class="cell">
                    <span class="cell_title"><b></b>地址管理</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div>

            <div class="idea cell_border">
                <router-link to="/idea"  class="cell">
                    <span class="cell_title"><b></b>意见反馈</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div>
            <div class="service cell_border">
                <div class="cell" @click="service">
                    <span class="cell_title"><b></b>客服中心</span>
                    <span class="serviceTime">服务时间：9:00 - 18:00</span>
                    <i class="iconfont icon-more"></i>
                </div>
            </div>
        </div>
        <tabbar></tabbar>
    </div>


</template>

<script>
    import tabbar from '../../home/newCms/tabbar';
    import { Toast ,MessageBox } from 'mint-ui';
    import {
      userByUserId,
      userAssets,
      findUserInfoSumByUserId,
      findMembershipByUser,
      insurance3rdLogin
    } from '../../../api/getData';
    export default{

        data(){
            return {
                userInfo:{},
                userAsset:{},
                balanceShow:false,
                isMsg:false,
                memberShip1:false,
                memberShip2:false,
                authorityNames:'',
                memberShipIds:'',
                height:'',
                showIframe:false,
                linkUrl:''
            }
        },
		    components: {
            'tabbar':tabbar
        },
        created(){

            this.height = document.documentElement.clientHeight -55;
            this.userByUserId();
            this.userAssets();
            //查询当前用户未读消息数量
            this.findUserInfoSumByUserId();
            this.findMembershipByUser();
            this.$store.state.Cookie.mutations.save(0,'navCheck');
        },
        methods:{
            async userByUserId() {
                try {
                    const res = await userByUserId({weiXinOpenId:this.$store.state.Cookie.mutations.fetch('openId')});
                    if (res.data.code == 0) {
                        this.userInfo = res.data.data;
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            userinfoClick(){
                this.$router.push('/userinfo');
            },
            //查询当前用户未读消息数量
            async findUserInfoSumByUserId() {
                try {
                    const res = await findUserInfoSumByUserId();

                    if (res.data.code == 0) {
                        if(res.data.data){
                            this.isMsg = true;
                        }
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            async findMembershipByUser() {
                try {
                    const res = await findMembershipByUser();

                    if (res.data.code == 0) {
                      this.memberShipIds = res.data.data.membershipId;
                      this.authorityNames = res.data.data.authority;
                      for (var i=0;i<this.memberShipIds.length;i++) {
                        if (this.memberShipIds[i]==1) {
                          this.memberShip1 = true;
                        }
                        if (this.memberShipIds[i]==2) {
                          this.memberShip2 = true;
                        }
                      }
                    } else {
                      Toast(res.data.data);
                    }

                } catch (err) {
                  Toast(err);
                }
            },
            async userAssets() {
              try {
                const res = await userAssets();

                if (res.data.code == 0) {
                  this.userAsset = res.data.data;
                  this.balanceShow = true;
                } else {
                  Toast(res.data.data);
                }

              } catch (err) {
                Toast(err);
              }
            },
            service(){
                MessageBox('客服电话', '400-1111-360').then(action => {

                });
            },

            setUserInfo(){
                this.$router.push('/set');
            },
            seeMsg(){
                this.$router.push('/msg')
            },
            async insurance3rdLogin(){
              try{
                const res = await insurance3rdLogin({type:2});
                if (res.data.code == 0) {
                  this.showIframe = true;
                  this.linkUrl = res.data.data.url;
                } else {
                  Toast(res.data.data);
                }

              }catch (err) {

              }
            }
		}
    }
</script>

<style lang="scss" scoped>
$baseWidth:750px;
@function px($val) {
    @return $val/$baseWidth*10+rem;
}
#my{
    background-color:#f4f4f4;
    overflow-y: auto;
    position: relative;
}
.head{
    width:100%;
    padding-top:px(22px);
    height:px(298px);
    background-image:url(../../../../static/assets/img/my/bg.png);
    .btn{
        /*height:px(88px);*/
        padding:0 px(24px);
        margin-bottom:px(30px);
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: flex-end;
        align-items:center;
        b{

            width:px(48px);
            height:px(48px);
            background-size:100%;
        }
        .set{
            background-image:url(../../../../static/assets/img/my/set.png);
        }
        .msg{
            position: relative;
            background-image:url(../../../../static/assets/img/my/msg.png);
            .circle{
                display: block;
                width: px(18px);
                height: px(18px);
                background: red;
                border-radius: 50%;
                position: absolute;
                top: px(-2px);
                right: px(0px);
                z-index: 10000;
            }
        }
    }
}

.info{
    padding:0 px(24px);
    display: -webkit-flex; /* Safari */
    display: flex;
    .membershipLogo{
      width:px(50px);
      height:px(50px);
      margin-top:px(10px);
      margin-left:0px;
      border-radius: 0px;
    }
    img{
        width:px(120px);
        height:px(120px);
        border-radius:50%;

    }
    .user_info{
        margin-left:px(22px);
        /*margin-top:px(10px);*/
        p{
            color:#fff;
            span{
                margin-right:px(34px);
            }
            b{
                display:inline-block;
                width:px(32px);
                height:px(32px);
                background-image:url(../../../../static/assets/img/my/edit.png);
                background-size:100%;
            }
        }
        .username{
            font-size:px(32px);
            line-height:px(48px);
        }
        .companyname{
            font-size:px(28px);
            line-height:px(48px);
        }
    }
}

.cell_list{
    margin-top:px(20px);
  .service{
    border-bottom: none;
  }
}

.cell_border{
    border-bottom:1px solid #f4f4f4;
}

.cell{
    background-color:#fff;
    height: px(88px);
    padding:0 px(24px);
    display: -ms-flexbox;
    display: flex;
    justify-content:space-between;
    align-items:center;
    span{
        display: inline-flex;
        align-items:center;
        font-size:px(32px);
        color:#323232;
    }
    b{
        width:px(44px);
        height:px(44px);
        background-size:100%;
        margin-right:px(40px);
    }
    i{
        margin-left:px(10px);
        color:#d4d4d4;;
    }
  .serviceTime{
    margin-left:px(60px);
    color: #969696
  }
}

.asset{
    background-color:#fff;
    b{
        background-image:url(../../../../static/assets/img/my/asset.png);
    }
    ul{

        padding:px(16px) 0;
        display: -ms-flexbox;
        display: flex;
        justify-content:space-between;
        align-items:center;
        height:px(88px);
        li{
            flex:auto;
            height:100%;
            text-align:center;
            border-right:1px solid #f4f4f4;
            h6{
                font-size:px(28px);
                color:#ff8546;
                line-height:px(44px);
            }
            p{
                font-size:px(28px);
                color:#323232;
                line-height:px(44px);
            }
        }
        li:nth-child(3){
            border:none;
        }
    }
}
.order{
    b{
        background-image:url(../../../../static/assets/img/my/order.png);
    }
}
.idea{
    b{
        background-image:url(../../../../static/assets/img/my/idea.png);
    }
}
.service{
    b{
        background-image:url(../../../../static/assets/img/my/service.png);
    }
}
.site{
    b{
        background-image:url(../../../../static/assets/img/my/site.png);
    }
}
.ticket{
    b{
        background-image:url(../../../../static/assets/img/my/ticket.png);
    }
}
.bodyCheck{
    b{
        background-image:url(../../../../static/assets/img/my/bodyCheck.png);
    }
}
.insurance{
    b{
        background-image:url(../../../../static/assets/img/my/insurance.png);
    }
}
.membership {
  height:px(40px);
  margin-top:px(-20px);
}

.authority {
  width:px(570px);
  height:px(40px);
  margin-top:px(20px);
  margin-left:px(-10px);
  font-size:px(22px);
  color:#fff;
  display: flex;
  flex-wrap: wrap;
  span{
    margin-top: px(10px);
    margin-left:px(10px);
    background:rgba(0,0,0,0.3);
    border-radius: px(6px);
    display: flex;
    align-items: center;
    padding-left: px(12px);
    padding-right: px(12px);
    padding-top: 2px;
    height: px(35px);
  }

}

</style>
