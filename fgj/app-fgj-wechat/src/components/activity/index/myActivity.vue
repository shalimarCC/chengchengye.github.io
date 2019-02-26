<template>
    <div class="index">
        <div class="tab">
            <div class="tab_btn" :class="{active:active==0}" @click="tabClikc(0)">
                <span>活动中</span>
            </div>
            <b></b>
            <div class="tab_btn" :class="{active:active==1}" @click="tabClikc(1)">
                <span>已结束</span>
            </div>
        </div>
        <div class="page-loadmore-wrapper"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
        <ul>
            <li class="clear" v-for="item in activityList">

                <div class="pe_main" @click="preActivityDetail(item.id)">
                    <div class="pe_left">
                        <img v-lazy="item.coverUrl+'?imageMogr2/size-limit/100k!'">
                    </div>
                    <div class="pe_right">
                        <div class="pe_title">
                            <h4>{{item.activityName}}</h4>
                        </div>
                        <div>
                            <div class="pe_location">
                                <b class="location"></b>
                                <span>{{item.location}}</span>
                            </div>
                            <div class="pe_time">
                                <b class="time"></b>
                                <span>{{item.startTime}}-{{item.endTime}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        </div>
    </div>
</template>

<script>
    import {myActivityPage,preActivityDetail} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    var myScroll=null;
    export default{

        data(){
            return {
                active:0,
                pageNo:1,
                activityList:[],
                loading:false,
            }
        },

		components: {

		},
        mounted() {
            this.findMyActivityPage();
        },

        methods:{
            async findMyActivityPage() {
                try {
                    Indicator.open();
                    const res = await myActivityPage({pageNo:this.pageNo,type:this.active});
                    if (res.data.code == 0) {
                        Indicator.close();
                        if(res.data.data.actList.list.length == 0){
                            this.loading = true;
                        }else{
                            this.pageNo++;
                            var thtf = this;
                            $.each(res.data.data.actList.list,function(key,info){
                                thtf.activityList.push(info);
                            })
                        }
                    } else {
                        this.cartType = false;
                        Indicator.close();
                    }
                } catch (err) {
                     Toast('网络错误');
                     this.cartType = false;
                     Indicator.close();
                }
            },
            loadMore(){

            },

            tabClikc(active){
                this.active = active;
                this.pageNo = 1;
                this.activityList = [];

                this.findMyActivityPage();
            },
            //进入活动详情之前判断活动有效性
            async preActivityDetail(id) {
                try {
                    Indicator.open();
                    const res = await preActivityDetail({id:id});
                    if (res.data.code == 0) {
                        Indicator.close();
                        this.$router.push('/detailActivity/'+id);
                    } else if(res.data.code == 132) {
                        Indicator.close();
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                     this.cartType = false;
                     Indicator.close();
                }
            },
		}
    }
</script>

<style lang="scss" scoped>

@import "../../../style/activity/index.scss";
</style>