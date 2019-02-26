<template>
    <div id="score">
        <div class="head_fb" v-if="fbShow">
            <p>点赞福豆余额</p>
            <h3>{{accountData.balance.toFixed(2)}}</h3>

        </div>

        <div class="asset">
            <div class="asste_tab">
                <ul>
                    <li :class="{'active':this.accountObj.mode==2}" @click="checkMode(2)">
                        <p>全部</p>
                    </li>
                    <li :class="{'active':this.accountObj.mode==0}" @click="checkMode(0)">
                        <p>收入</p>
                    </li>

                    <li :class="{'active':this.accountObj.mode==1}" @click="checkMode(1)">
                        <p>支出</p>
                    </li>
                </ul>
            </div>

            <div class="page-loadmore-wrapper assList">
                <ul
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="10">
                    <li v-for="(item,key) in accountList">
                        <div class="ass_l">
                            <h6 v-if="item.type==4||item.type==6">{{item.remark+ '-' +item.orderCode}}</h6>
                            <h6 v-else>{{item.remark}}</h6>
                            <p>{{setTime(item.createTime)}}</p>
                        </div>
                        <div class="ass_r" v-if="item.sum<0">{{item.sum}}</div>
                        <div class="ass_r" v-else-if="item.sum>0">+{{item.sum.toFixed(2)}}</div>
                    </li>
                </ul>
                <div v-if="loading&&accountList.length>0" class="tip">没有更多</div>
                <div class="noBi" v-if="accountList.length==0">
                    <img src="../../../../static/assets/img/error/dou.png">
                    <p>无点赞福豆记录</p>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import {accountFlowPage} from '../../../api/getData';
    export default{

        data(){
            return {
                accountObj:{
                    accountId:'',
                    mode:2,
                    pageNo:1,
                    pageSize:20,
                },
                accountData:{

                },
                accountList:[],
                fbShow:false,
                loading:false,
                listHeight:0
            }
        },
		mounted() {

        },
        created(){
            this.accountObj.accountId = this.$route.params.accountId;
        },
        methods:{
            loadMore(){
                this.accountFlowPage();
                Indicator.open();
            },

            checkMode(mode){
                this.accountObj.mode = mode;
                this.accountObj.pageNo = 1;
                this.accountFlowPage(2);
                this.accountList = [];
            },
            async accountFlowPage(mode) {
                try {

                    const res = await accountFlowPage(this.accountObj);

                    if (res.data.code == 0) {
                        this.accountData = res.data.data;
                        this.fbShow = true;

                        Indicator.close();
                        if(res.data.data.detailPage.list.length == 0){
                            this.loading = true;
                            this.accountList = this.accountList.concat(res.data.data.detailPage.list);
                        }else{
                            this.accountObj.pageNo++;
                            this.accountList = this.accountList.concat(res.data.data.detailPage.list);
                        }
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            //时间戳转换
            setTime(time) {
                const t = new Date(time);
                let y = t.getFullYear();
                let m = t.getMonth() + 1;
                let d = t.getDate();
                let h = t.getHours();
                let f = t.getMinutes();
                let s = t.getSeconds();
                if (m < 10) {
                    m = '0' + m
                }
                if (d < 10) {
                    d = '0' + d
                }
                if (h < 10) {
                    h = '0' + h
                }
                if (f < 10) {
                    f = '0' + f
                }
                if (s < 10) {
                    s = '0' + s
                }
                return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
            },
		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/info/assets.scss";

</style>
